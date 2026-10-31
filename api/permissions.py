from rest_framework import permissions


class IsAdminUserRole(permissions.BasePermission):
    """Allows access only to Admin users (or is_staff / superuser)."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == "Admin" or request.user.is_staff)
        )


class IsDoctorUserRole(permissions.BasePermission):
    """Allows access to Doctor users."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "Doctor"
        )


class IsPatientUserRole(permissions.BasePermission):
    """Allows access to Patient users."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "Patient"
        )


class DoctorViewSetPermission(permissions.BasePermission):
    """Everyone can view (GET) doctors.
    Only Admin can create, update, or delete doctors.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == "Admin" or request.user.is_staff)
        )


class AppointmentViewSetPermission(permissions.BasePermission):
    """Permission rules for AppointmentViewSet:
    - User must be authenticated.
    - Admin: Full access.
    - Patient: Can create, view, update, and cancel their own appointments.
    - Doctor: Can view (SAFE_METHODS) only appointments assigned to them (and update status).
    """

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        # Only Patient and Admin can book appointments via POST
        if request.method == "POST":
            return request.user.role in ["Patient", "Admin"] or request.user.is_staff
        return True

    def has_object_permission(self, request, view, obj):
        if request.user.role == "Admin" or request.user.is_staff:
            return True
        if request.user.role == "Patient":
            return obj.patient == request.user
        if request.user.role == "Doctor":
            # Doctor can view assigned appointments and patch status (e.g., mark Completed)
            is_assigned = obj.doctor.user == request.user
            if request.method in permissions.SAFE_METHODS or request.method in [
                "PATCH",
                "PUT",
            ]:
                return is_assigned
            return False
        return False


class BillViewSetPermission(permissions.BasePermission):
    """Permission rules for BillViewSet:
    - Admin: Full CRUD access.
    - Patient: Can view only their own bills.
    - Doctor: Can view bills for their own consultations.
    """

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        # Only Admin can manually create or modify bills directly
        return request.user.role == "Admin" or request.user.is_staff

    def has_object_permission(self, request, view, obj):
        if request.user.role == "Admin" or request.user.is_staff:
            return True
        if request.user.role == "Patient":
            return obj.patient == request.user
        if request.user.role == "Doctor":
            return obj.doctor.user == request.user
        return False

