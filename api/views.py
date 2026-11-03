from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Appointment, Bill, Doctor
from .permissions import (
    AppointmentViewSetPermission,
    BillViewSetPermission,
    DoctorViewSetPermission,
)
from .serializers import (
    AppointmentSerializer,
    BillSerializer,
    CustomTokenObtainPairSerializer,
    DoctorSerializer,
    ForgotPasswordSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserProfileSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """POST /api/register/
    Self-service registration for new Patients.
    """

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Patient registered successfully in RUM Hospital.",
                "user": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "role": user.role,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """POST /api/login/
    Authenticates with email and password, returning JWT access & refresh tokens.
    """

    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]


class TokenRefreshViewCustom(TokenRefreshView):
    """POST /api/token/refresh/
    Exchanges a valid refresh token for a fresh access token.
    """

    permission_classes = [permissions.AllowAny]


class ForgotPasswordView(APIView):
    """POST /api/forgot-password/
    Accepts email, generates uid and token, logs to console, and returns them in JSON.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uid, token = serializer.generate_token()
        email = serializer.validated_data["email"]

        # Log clearly to console for Postman / local terminal testing
        print("\n" + "=" * 60)
        print("  [RUM HOSPITAL] PASSWORD RESET INSTRUCTIONS")
        print(f"  Target User Email : {email}")
        print(f"  UID               : {uid}")
        print(f"  Reset Token       : {token}")
        print(
            f"  Reset Endpoint    : POST /api/reset-password/ with {{'uid': '{uid}', 'token': '{token}', 'new_password': '...'}}"
        )
        print("=" * 60 + "\n")

        return Response(
            {
                "message": "Password reset token generated successfully.",
                "email": email,
                "uid": uid,
                "token": token,
                "instructions": "Use uid, token, and new_password on POST /api/reset-password/.",
            },
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    """POST /api/reset-password/
    Accepts uid, token, and new_password to reset the user's password.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "message": "Password has been reset successfully. You can now login with your new password."
            },
            status=status.HTTP_200_OK,
        )


class ProfileView(generics.RetrieveUpdateAPIView):
    """GET, PUT, PATCH /api/profile/
    Allows the authenticated user to view and update their personal profile.
    """

    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class DoctorViewSet(viewsets.ModelViewSet):
    """ViewSet for managing doctors in RUM Hospital.
    - Everyone can view (GET) list and detail.
    - Only Admin can create (POST), update (PUT/PATCH), or delete (DELETE).
    - Supports filtering by department, search by name/department/specialization,
      and ordering by visiting_fee.
    """

    queryset = Doctor.objects.all().order_by("name")
    serializer_class = DoctorSerializer
    permission_class_map = None
    permission_classes = [DoctorViewSetPermission]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["department"]
    search_fields = ["name", "department", "specialization"]
    ordering_fields = ["visiting_fee", "name"]


class AppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for booking and managing hospital appointments.
    - Scoped by user role:
      - Admin: Sees all appointments.
      - Doctor: Sees only appointments assigned to their doctor profile.
      - Patient: Sees only appointments booked by themselves.
    - Auto-assigns patient to request.user when created by a Patient.
    - Filters: ?status=Completed, ?doctor=2
    - Searches: ?search=John (matches patient full_name or doctor name)
    - Ordering: ?ordering=appointment_date, ?ordering=-appointment_date
    """

    serializer_class = AppointmentSerializer
    permission_classes = [AppointmentViewSetPermission]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["status", "doctor"]
    search_fields = ["patient__full_name", "doctor__name"]
    ordering_fields = ["appointment_date", "appointment_time"]
    ordering = ["appointment_date", "appointment_time"]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Appointment.objects.none()

        if user.role == "Admin" or user.is_staff:
            return (
                Appointment.objects.all()
                .select_related("patient", "doctor")
                .order_by("appointment_date")
            )
        if user.role == "Doctor":
            return (
                Appointment.objects.filter(doctor__user=user)
                .select_related("patient", "doctor")
                .order_by("appointment_date")
            )
        if user.role == "Patient":
            return (
                Appointment.objects.filter(patient=user)
                .select_related("patient", "doctor")
                .order_by("appointment_date")
            )
        return Appointment.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role == "Patient":
            serializer.save(patient=self.request.user)
        else:
            # If Admin didn't specify patient, fallback to request.user
            if "patient" not in serializer.validated_data:
                serializer.save(patient=self.request.user)
            else:
                serializer.save()


class BillViewSet(viewsets.ModelViewSet):
    """ViewSet for consultation billing in RUM Hospital.
    - Scoped by user role:
      - Admin: Full CRUD on all bills.
      - Doctor: Views bills for own patient appointments.
      - Patient: Views bills for own appointments.
    """

    serializer_class = BillSerializer
    permission_classes = [BillViewSetPermission]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["appointment", "doctor", "patient"]
    search_fields = ["patient__full_name", "doctor__name"]
    ordering_fields = ["total_amount", "consultation_fee"]
    ordering = ["-id"]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Bill.objects.none()

        if user.role == "Admin" or user.is_staff:
            return (
                Bill.objects.all()
                .select_related("patient", "doctor", "appointment")
                .order_by("-id")
            )
        if user.role == "Doctor":
            return (
                Bill.objects.filter(doctor__user=user)
                .select_related("patient", "doctor", "appointment")
                .order_by("-id")
            )
        if user.role == "Patient":
            return (
                Bill.objects.filter(patient=user)
                .select_related("patient", "doctor", "appointment")
                .order_by("-id")
            )
        return Bill.objects.none()


class DashboardSummaryView(APIView):
    """GET /api/dashboard/
    Returns key hospital metrics for RUM Hospital:
    - total_patients
    - total_doctors
    - total_appointments
    - pending_appointments
    - completed_appointments
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = {
            "hospital_name": "RUM Hospital",
            "total_patients": User.objects.filter(role="Patient").count(),
            "total_doctors": Doctor.objects.count(),
            "total_appointments": Appointment.objects.count(),
            "pending_appointments": Appointment.objects.filter(
                status="Pending"
            ).count(),
            "completed_appointments": Appointment.objects.filter(
                status="Completed"
            ).count(),
        }
        return Response(data, status=status.HTTP_200_OK)
