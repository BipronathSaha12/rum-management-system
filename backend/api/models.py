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


class Department(models.Model):
    """Clinical Departments: Cardiology, Neurology, Nephrology, etc."""

    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)  # e.g. CARD, NEUR
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, default="Stethoscope")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.code})"


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

    # Production extensions
    department_ref = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="doctors",
    )
    designation = models.CharField(
        max_length=150, blank=True, default="Specialist Consultant"
    )
    qualifications = models.CharField(
        max_length=200, blank=True, default="MBBS, FCPS"
    )
    experience_years = models.PositiveIntegerField(default=5)
    room_number = models.CharField(
        max_length=50, blank=True, default="OPD Room 101"
    )
    visiting_hours = models.CharField(
        max_length=100, blank=True, default="5:00 PM - 9:00 PM"
    )

    def clean(self):
        super().clean()
        if self.visiting_fee is not None and self.visiting_fee < 0:
            raise ValidationError({"visiting_fee": "Visiting fee cannot be negative."})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Dr. {self.name} - {self.department} ({self.specialization})"


class DoctorSlot(models.Model):
    """Discrete consultation time slots preventing double-booking race conditions."""

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="slots")
    date = models.DateField(db_index=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)
    booked_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="booked_slots",
    )

    class Meta:
        unique_together = ("doctor", "date", "start_time")
        indexes = [
            models.Index(fields=["doctor", "date", "is_booked"]),
        ]

    def __str__(self):
        status_text = "BOOKED" if self.is_booked else "AVAILABLE"
        return f"Dr. {self.doctor.name} on {self.date} at {self.start_time} [{status_text}]"


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
    slot = models.ForeignKey(
        DoctorSlot,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="appointments",
    )
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="Pending"
    )
    symptoms = models.TextField(blank=True, default="")

    class Meta:
        indexes = [
            models.Index(fields=["doctor", "appointment_date", "status"]),
            models.Index(fields=["patient", "appointment_date"]),
        ]

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
        consultation = self.consultation_fee or 0
        disc = self.discount or 0
        self.total_amount = consultation - disc
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Bill #{self.id} for Appointment #{self.appointment_id} - Total: {self.total_amount}"


class PatientProfile(models.Model):
    """Permanent Hospital Identification Number (HCN) and clinical history."""

    BLOOD_GROUPS = (
        ("A+", "A+"),
        ("A-", "A-"),
        ("B+", "B+"),
        ("B-", "B-"),
        ("O+", "O+"),
        ("O-", "O-"),
        ("AB+", "AB+"),
        ("AB-", "AB-"),
    )
    GENDER_CHOICES = (
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    )

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="patient_profile"
    )
    hcn_number = models.CharField(max_length=25, unique=True, db_index=True)
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUPS, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default="Male")
    emergency_contact_name = models.CharField(max_length=150, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    medical_allergies = models.TextField(blank=True)

    def __str__(self):
        return f"{self.hcn_number} - {self.user.full_name}"


class PaymentTransaction(models.Model):
    """Immutable ledger of payment attempts, gateway references, and audit logs."""

    STATUS_CHOICES = (
        ("INITIATED", "INITIATED"),
        ("PENDING", "PENDING"),
        ("SUCCESS", "SUCCESS"),
        ("FAILED", "FAILED"),
        ("CANCELLED", "CANCELLED"),
    )
    GATEWAY_CHOICES = (
        ("SSLCOMMERZ", "SSLCommerz"),
        ("BKASH", "bKash"),
        ("STRIPE", "Stripe"),
        ("CASH", "Cash Counter"),
    )

    transaction_id = models.CharField(max_length=64, unique=True, db_index=True)
    bill = models.ForeignKey(
        Bill, on_delete=models.CASCADE, related_name="transactions"
    )
    patient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="payments"
    )
    gateway = models.CharField(
        max_length=20, choices=GATEWAY_CHOICES, default="SSLCOMMERZ"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="BDT")
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="INITIATED"
    )

    gateway_val_id = models.CharField(max_length=100, blank=True, null=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_id} | {self.amount} {self.currency} [{self.status}]"
