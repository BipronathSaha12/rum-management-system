from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Appointment, Bill, Doctor

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for patient self-registration with password hashing."""

    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ("id", "full_name", "email", "phone_number", "address", "password")

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(
                "A user with this phone number already exists."
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["email"],
            full_name=validated_data["full_name"],
            phone_number=validated_data["phone_number"],
            address=validated_data.get("address", ""),
            role="Patient",
            password=password,
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom SimpleJWT serializer authenticating with email and password."""

    username_field = "email"

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "email": self.user.email,
            "full_name": self.user.full_name,
            "role": self.user.role,
        }
        return data


class ForgotPasswordSerializer(serializers.Serializer):
    """Accepts registered email, generates reset token, and prints to console."""

    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            self.user = User.objects.get(email__iexact=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")
        return value

    def generate_token(self):
        user = self.user
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        return uid, token


class ResetPasswordSerializer(serializers.Serializer):
    """Resets user password using uid, token, and new_password."""

    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=6, write_only=True)

    def validate(self, attrs):
        uid = attrs.get("uid")
        token = attrs.get("token")

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "Invalid user ID in reset link."})

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError(
                {"token": "The reset token is invalid or has expired."}
            )

        attrs["user"] = user
        return attrs

    def save(self):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Read & Update serializer for the currently logged-in user profile."""

    class Meta:
        model = User
        fields = ("id", "full_name", "email", "phone_number", "address", "role")
        read_only_fields = ("id", "role")

    def validate_phone_number(self, value):
        user = self.instance
        if (
            User.objects.exclude(pk=user.pk if user else None)
            .filter(phone_number=value)
            .exists()
        ):
            raise serializers.ValidationError(
                "Another user already has this phone number."
            )
        return value

    def validate_email(self, value):
        user = self.instance
        if (
            User.objects.exclude(pk=user.pk if user else None)
            .filter(email__iexact=value)
            .exists()
        ):
            raise serializers.ValidationError("Another user already has this email.")
        return value.lower()


class DoctorSerializer(serializers.ModelSerializer):
    """Serializer for Doctors in RUM Hospital."""

    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Doctor
        fields = (
            "id",
            "user",
            "user_email",
            "name",
            "department",
            "specialization",
            "visiting_fee",
        )

    def validate_visiting_fee(self, value):
        if value < 0:
            raise serializers.ValidationError("Visiting fee cannot be negative.")
        return value


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for booking and managing appointments."""

    patient = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False
    )
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.name", read_only=True)
    doctor_department = serializers.CharField(
        source="doctor.department", read_only=True
    )

    class Meta:
        model = Appointment
        fields = (
            "id",
            "patient",
            "patient_name",
            "doctor",
            "doctor_name",
            "doctor_department",
            "appointment_date",
            "appointment_time",
            "status",
        )
        read_only_fields = ("id",)

    def validate_appointment_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError(
                "Appointment date cannot be in the past."
            )
        return value

    def validate(self, attrs):
        return super().validate(attrs)


class BillSerializer(serializers.ModelSerializer):
    """Serializer for patient consultation invoices."""

    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.name", read_only=True)

    class Meta:
        model = Bill
        fields = (
            "id",
            "patient",
            "patient_name",
            "doctor",
            "doctor_name",
            "appointment",
            "consultation_fee",
            "discount",
            "total_amount",
        )
        read_only_fields = ("id", "total_amount")

    def validate(self, attrs):
        consultation_fee = attrs.get(
            "consultation_fee",
            self.instance.consultation_fee if self.instance else None,
        )
        discount = attrs.get(
            "discount", self.instance.discount if self.instance else 0
        )

        if consultation_fee is not None and consultation_fee < 0:
            raise serializers.ValidationError(
                {"consultation_fee": "Consultation fee cannot be negative."}
            )

        if discount is not None and discount < 0:
            raise serializers.ValidationError(
                {"discount": "Discount cannot be negative."}
            )

        if (
            consultation_fee is not None
            and discount is not None
            and discount > consultation_fee
        ):
            raise serializers.ValidationError(
                {"discount": "Discount cannot be greater than consultation fee."}
            )

        return attrs
