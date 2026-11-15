import uuid
from django.contrib.auth import get_user_model
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import (
    Appointment,
    Bill,
    Department,
    Doctor,
    DoctorSlot,
    PatientProfile,
    PaymentTransaction,
)
from .permissions import (
    AppointmentViewSetPermission,
    BillViewSetPermission,
    DoctorViewSetPermission,
)
from .serializers import (
    AppointmentSerializer,
    BillSerializer,
    CustomTokenObtainPairSerializer,
    DepartmentSerializer,
    DoctorSerializer,
    DoctorSlotSerializer,
    ForgotPasswordSerializer,
    PatientProfileSerializer,
    PaymentTransactionSerializer,
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
        hcn = getattr(user.patient_profile, "hcn_number", "")
        return Response(
            {
                "message": "Patient registered successfully in RUM Hospital.",
                "user": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "role": user.role,
                    "hcn_number": hcn,
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


class PatientProfileView(generics.RetrieveUpdateAPIView):
    """GET, PUT, PATCH /api/patient-profile/
    Healthcare profile including HCN number, blood group, and emergency contacts.
    """

    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = PatientProfile.objects.get_or_create(
            user=self.request.user,
            defaults={"hcn_number": f"RUM-2026-{self.request.user.id:05d}"},
        )
        return profile


class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/departments/
    Public listing of clinical centers and medical departments in RUM Hospital.
    """

    queryset = Department.objects.filter(is_active=True).order_by("name")
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "code", "description"]


class DoctorViewSet(viewsets.ModelViewSet):
    """ViewSet for managing doctors in RUM Hospital.
    - Everyone can view (GET) list and detail.
    - Only Admin can create (POST), update (PUT/PATCH), or delete (DELETE).
    """

    queryset = Doctor.objects.all().order_by("name")
    serializer_class = DoctorSerializer
    permission_classes = [DoctorViewSetPermission]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["department", "department_ref"]
    search_fields = ["name", "department", "specialization", "qualifications"]
    ordering_fields = ["visiting_fee", "name", "experience_years"]


class DoctorSlotViewSet(viewsets.ModelViewSet):
    """ViewSet for consultation time slots.
    Filters: ?doctor=1&date=2026-12-25&is_booked=false
    """

    queryset = DoctorSlot.objects.all().order_by("date", "start_time")
    serializer_class = DoctorSlotSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["doctor", "date", "is_booked"]
    ordering_fields = ["date", "start_time"]


class ReserveSlotWithLockView(APIView):
    """POST /api/slots/reserve/
    Pessimistic locking reservation ensuring ZERO double-booking race conditions.
    Payload: { "slot_id": 5, "symptoms": "Chest pain" }
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        slot_id = request.data.get("slot_id")
        symptoms = request.data.get("symptoms", "")

        if not slot_id:
            return Response(
                {"detail": "slot_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                # SELECT FOR UPDATE: Locks this specific database row until commit
                slot = DoctorSlot.objects.select_for_update().get(id=slot_id)

                if slot.is_booked:
                    return Response(
                        {
                            "detail": "This slot was just booked by another patient. Please select another slot."
                        },
                        status=status.HTTP_409_CONFLICT,
                    )

                slot.is_booked = True
                slot.booked_by = request.user
                slot.save()

                appointment = Appointment.objects.create(
                    patient=request.user,
                    doctor=slot.doctor,
                    slot=slot,
                    appointment_date=slot.date,
                    appointment_time=slot.start_time,
                    status="Confirmed",
                    symptoms=symptoms,
                )

                return Response(
                    {
                        "message": "Appointment slot confirmed successfully without conflict.",
                        "appointment_id": appointment.id,
                        "doctor": slot.doctor.name,
                        "date": str(slot.date),
                        "time": str(slot.start_time),
                        "room_number": slot.doctor.room_number,
                    },
                    status=status.HTTP_201_CREATED,
                )

        except DoctorSlot.DoesNotExist:
            return Response(
                {"detail": "Slot not found."}, status=status.HTTP_404_NOT_FOUND
            )


class AppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for booking and managing hospital appointments."""

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
                .select_related("patient", "doctor", "slot")
                .order_by("appointment_date")
            )
        if user.role == "Doctor":
            return (
                Appointment.objects.filter(doctor__user=user)
                .select_related("patient", "doctor", "slot")
                .order_by("appointment_date")
            )
        if user.role == "Patient":
            return (
                Appointment.objects.filter(patient=user)
                .select_related("patient", "doctor", "slot")
                .order_by("appointment_date")
            )
        return Appointment.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role == "Patient":
            serializer.save(patient=self.request.user)
        else:
            if "patient" not in serializer.validated_data:
                serializer.save(patient=self.request.user)
            else:
                serializer.save()


class BillViewSet(viewsets.ModelViewSet):
    """ViewSet for consultation billing in RUM Hospital."""

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


class InitiatePaymentView(APIView):
    """POST /api/payments/initiate/
    Creates a pending transaction and returns the payment gateway redirect URL.
    Payload: { "bill_id": 1, "gateway": "SSLCOMMERZ" }
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        bill_id = request.data.get("bill_id")
        gateway = request.data.get("gateway", "SSLCOMMERZ")

        try:
            bill = Bill.objects.get(id=bill_id)
        except Bill.DoesNotExist:
            return Response(
                {"detail": "Bill not found."}, status=status.HTTP_404_NOT_FOUND
            )

        txn_id = f"RUM-TXN-{uuid.uuid4().hex[:10].upper()}"

        txn = PaymentTransaction.objects.create(
            transaction_id=txn_id,
            bill=bill,
            patient=request.user,
            gateway=gateway,
            amount=bill.total_amount,
            currency="BDT",
            status="INITIATED",
        )

        gateway_payment_url = f"https://sandbox.sslcommerz.com/gwprocess/v4/simulator.php?tran_id={txn_id}&amt={bill.total_amount}"

        return Response(
            {
                "message": "Payment session initiated successfully.",
                "transaction_id": txn_id,
                "bill_id": bill.id,
                "amount": str(bill.total_amount),
                "currency": "BDT",
                "payment_url": gateway_payment_url,
            },
            status=status.HTTP_200_OK,
        )


class PaymentIPNWebhookView(APIView):
    """POST /api/payments/ipn/
    Server-to-Server Webhook callback called by payment gateway upon completion.
    Payload: { "tran_id": "RUM-TXN-...", "val_id": "VALIDATION_ID", "status": "VALID" }
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        txn_id = data.get("tran_id")
        val_id = data.get("val_id")
        gw_status = data.get("status")

        if not txn_id or not val_id:
            return Response(
                {"detail": "Malformed webhook payload"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            txn = PaymentTransaction.objects.get(transaction_id=txn_id)
        except PaymentTransaction.DoesNotExist:
            return Response(
                {"detail": "Transaction not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if txn.status == "SUCCESS":
            return Response(
                {"detail": "Transaction already processed successfully."},
                status=status.HTTP_200_OK,
            )

        if gw_status == "VALID":
            with transaction.atomic():
                txn.status = "SUCCESS"
                txn.gateway_val_id = val_id
                txn.gateway_response = data
                txn.save()

                bill = txn.bill
                bill.appointment.status = "Confirmed"
                bill.appointment.save()

            return Response(
                {
                    "message": "Payment verified and reconciled successfully.",
                    "transaction_id": txn.transaction_id,
                    "status": "SUCCESS",
                },
                status=status.HTTP_200_OK,
            )
        else:
            txn.status = "FAILED"
            txn.gateway_response = data
            txn.save()
            return Response(
                {"detail": "Payment verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class PaymentTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/payments/
    Scoped list of payment transactions.
    """

    serializer_class = PaymentTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "Admin" or user.is_staff:
            return PaymentTransaction.objects.all().order_by("-id")
        return PaymentTransaction.objects.filter(patient=user).order_by("-id")


class DashboardSummaryView(APIView):
    """GET /api/dashboard/
    Returns key hospital metrics for RUM Hospital.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = {
            "hospital_name": "RUM Hospital",
            "total_patients": User.objects.filter(role="Patient").count(),
            "total_doctors": Doctor.objects.count(),
            "total_departments": Department.objects.count(),
            "total_slots": DoctorSlot.objects.count(),
            "available_slots": DoctorSlot.objects.filter(is_booked=False).count(),
            "total_appointments": Appointment.objects.count(),
            "pending_appointments": Appointment.objects.filter(
                status="Pending"
            ).count(),
            "completed_appointments": Appointment.objects.filter(
                status="Completed"
            ).count(),
            "total_payments_settled": PaymentTransaction.objects.filter(
                status="SUCCESS"
            ).count(),
        }
        return Response(data, status=status.HTTP_200_OK)
