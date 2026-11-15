from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import (
    Appointment,
    Bill,
    Department,
    Doctor,
    DoctorSlot,
    PatientProfile,
    PaymentTransaction,
    User,
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "email",
        "full_name",
        "phone_number",
        "role",
        "is_staff",
        "is_superuser",
    )
    list_filter = ("role", "is_staff", "is_superuser")
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
                    "password1",
                    "password2",
                ),
            },
        ),
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "icon_name", "is_active")
    search_fields = ("name", "code")
    list_filter = ("is_active",)


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "department",
        "specialization",
        "room_number",
        "visiting_hours",
        "visiting_fee",
        "user",
    )
    list_filter = ("department", "department_ref")
    search_fields = ("name", "department", "specialization", "room_number")


@admin.register(DoctorSlot)
class DoctorSlotAdmin(admin.ModelAdmin):
    list_display = (
        "doctor",
        "date",
        "start_time",
        "end_time",
        "is_booked",
        "booked_by",
    )
    list_filter = ("date", "is_booked", "doctor")
    search_fields = ("doctor__name", "booked_by__full_name", "booked_by__email")


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
    list_filter = ("status", "appointment_date", "doctor")
    search_fields = ("patient__full_name", "doctor__name")


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "patient",
        "doctor",
        "appointment",
        "consultation_fee",
        "discount",
        "total_amount",
    )
    list_filter = ("doctor",)
    search_fields = ("patient__full_name", "doctor__name")


@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = (
        "hcn_number",
        "user",
        "blood_group",
        "gender",
        "emergency_contact_phone",
    )
    search_fields = ("hcn_number", "user__full_name", "user__email")
    list_filter = ("blood_group", "gender")


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "transaction_id",
        "patient",
        "bill",
        "amount",
        "currency",
        "gateway",
        "status",
        "created_at",
    )
    list_filter = ("status", "gateway", "created_at")
    search_fields = ("transaction_id", "patient__full_name", "patient__email")
    readonly_fields = ("transaction_id", "created_at", "updated_at")
