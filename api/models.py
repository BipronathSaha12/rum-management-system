from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    """Custom user manager where email is the unique identifier for authentication."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set.")
        email = self.normalize_email(email)
        extra_fields.setdefault("username", email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "Admin")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom User model for RUM Hospital Appointment Management System.
    Uses email as the unique login credential.
    """

    ROLE_CHOICES = (
        ("Admin", "Admin"),
        ("Doctor", "Doctor"),
        ("Patient", "Patient"),
    )

    username = models.CharField(max_length=150, unique=False, blank=True, null=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20, unique=True)
    address = models.TextField(blank=True, default="")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="Patient")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "full_name", "phone_number"]

    objects = CustomUserManager()

    def clean(self):
        super().clean()
        if self.is_superuser:
            self.role = "Admin"
        if not self.username:
            self.username = self.email

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = "Admin"
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.email}) - {self.role}"


class Doctor(models.Model):
    """Doctor model representing healthcare providers in RUM Hospital."""

    user = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="doctor_profile",
        help_text="Optional link to a User account with Doctor role for logging in",
    )
    name = models.CharField(max_length=150)
    department = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    visiting_fee = models.DecimalField(max_digits=10, decimal_places=2)

    def clean(self):
        super().clean()
        if self.visiting_fee is not None and self.visiting_fee < 0:
            raise ValidationError({"visiting_fee": "Visiting fee cannot be negative."})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Dr. {self.name} - {self.department} ({self.specialization})"


class Appointment(models.Model):
    """Appointment booking linking a Patient with a Doctor."""

    STATUS_CHOICES = (
        ("Pending", "Pending"),
        ("Confirmed", "Confirmed"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    )

    patient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="appointments"
    )
    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name="appointments"
    )
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="Pending"
    )

    def clean(self):
        super().clean()
        if self.appointment_date and self.appointment_date < timezone.localdate():
            raise ValidationError(
                {"appointment_date": "Appointment date cannot be in the past."}
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

        # Automatic Billing trigger on status Completion
        if self.status == "Completed":
            Bill.objects.get_or_create(
                appointment=self,
                defaults={
                    "patient": self.patient,
                    "doctor": self.doctor,
                    "consultation_fee": self.doctor.visiting_fee,
                    "discount": 0,
                    "total_amount": self.doctor.visiting_fee,
                },
            )

    def __str__(self):
        return (
            f"Appointment #{self.id}: {self.patient.full_name} with Dr. {self.doctor.name} "
            f"on {self.appointment_date} [{self.status}]"
        )


class Bill(models.Model):
    """Invoice generated for an Appointment."""

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bills")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="bills")
    appointment = models.OneToOneField(
        Appointment, on_delete=models.CASCADE, related_name="bill"
    )
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2, editable=False
    )

    def clean(self):
        super().clean()
        errors = {}
        if self.consultation_fee is not None and self.consultation_fee < 0:
            errors["consultation_fee"] = "Consultation fee cannot be negative."
        if self.discount is not None and self.discount < 0:
            errors["discount"] = "Discount cannot be negative."
        if (
            self.consultation_fee is not None
            and self.discount is not None
            and self.discount > self.consultation_fee
        ):
            errors["discount"] = "Discount cannot be greater than consultation fee."
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        # Auto-compute total_amount
        consultation = self.consultation_fee or 0
        disc = self.discount or 0
        self.total_amount = consultation - disc
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Bill #{self.id} for Appointment #{self.appointment_id} - Total: {self.total_amount}"
