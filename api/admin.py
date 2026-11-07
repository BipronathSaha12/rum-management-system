from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Appointment, Bill, Doctor

User = get_user_model()


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = (
        "email",
        "full_name",
        "phone_number",
        "role",
        "is_staff",
        "is_active",
    )
    list_filter = ("role", "is_staff", "is_active")
    search_fields = ("email", "full_name", "phone_number")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal info",
            {"fields": ("full_name", "phone_number", "address", "role")},
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "full_name",
                    "phone_number",
                    "role",
                    "password",
                ),
            },
        ),
    )


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ("name", "department", "specialization", "visiting_fee", "user")
    list_filter = ("department",)
    search_fields = ("name", "department", "specialization")
    ordering = ("name",)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "patient",
        "doctor",
        "appointment_date",
        "appointment_time",
        "status",
    )
    list_filter = ("status", "appointment_date")
    search_fields = ("patient__full_name", "patient__email", "doctor__name")
    ordering = ("-appointment_date", "-appointment_time")


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "appointment",
        "patient",
        "doctor",
        "consultation_fee",
        "discount",
        "total_amount",
    )
    search_fields = (
        "patient__full_name",
        "doctor__name",
        "appointment__id",
    )
    ordering = ("-id",)
