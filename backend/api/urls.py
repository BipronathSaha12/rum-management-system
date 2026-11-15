from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AppointmentViewSet,
    BillViewSet,
    DashboardSummaryView,
    DepartmentViewSet,
    DoctorSlotViewSet,
    DoctorViewSet,
    ForgotPasswordView,
    InitiatePaymentView,
    LoginView,
    PatientProfileView,
    PaymentIPNWebhookView,
    PaymentTransactionViewSet,
    ProfileView,
    RegisterView,
    ReserveSlotWithLockView,
    ResetPasswordView,
    TokenRefreshViewCustom,
)

router = DefaultRouter()
router.register(r"doctors", DoctorViewSet, basename="doctor")
router.register(r"departments", DepartmentViewSet, basename="department")
router.register(r"slots", DoctorSlotViewSet, basename="slot")
router.register(r"appointments", AppointmentViewSet, basename="appointment")
router.register(r"bills", BillViewSet, basename="bill")
router.register(r"payments", PaymentTransactionViewSet, basename="payment")

urlpatterns = [
    # Authentication & JWT Endpoints
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshViewCustom.as_view(), name="token-refresh"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    # Profiles
    path("profile/", ProfileView.as_view(), name="profile"),
    path("patient-profile/", PatientProfileView.as_view(), name="patient-profile"),
    # Dashboard Analytics Endpoint
    path("dashboard/", DashboardSummaryView.as_view(), name="dashboard"),
    # Slot Locking & Concurrency Engine
    path("slots/reserve/", ReserveSlotWithLockView.as_view(), name="reserve-slot"),
    # Payment Gateway Integration
    path("payments/initiate/", InitiatePaymentView.as_view(), name="initiate-payment"),
    path("payments/ipn/", PaymentIPNWebhookView.as_view(), name="payment-ipn"),
    # Router ViewSets
    path("", include(router.urls)),
]
