from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AppointmentViewSet,
    BillViewSet,
    DashboardSummaryView,
    DoctorViewSet,
    ForgotPasswordView,
    LoginView,
    ProfileView,
    RegisterView,
    ResetPasswordView,
    TokenRefreshViewCustom,
)

router = DefaultRouter()
router.register(r"doctors", DoctorViewSet, basename="doctor")
router.register(r"appointments", AppointmentViewSet, basename="appointment")
router.register(r"bills", BillViewSet, basename="bill")

urlpatterns = [
    # Authentication & JWT Endpoints
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshViewCustom.as_view(), name="token-refresh"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    # Profile Endpoint
    path("profile/", ProfileView.as_view(), name="profile"),
    # Dashboard Analytics Endpoint
    path("dashboard/", DashboardSummaryView.as_view(), name="dashboard"),
    # Router ViewSets (doctors, appointments, bills)
    path("", include(router.urls)),
]

