from datetime import date, timedelta
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Appointment, Bill, Doctor

User = get_user_model()


class HospitalAPITests(APITestCase):
    def setUp(self):
        # 1. Admin user
        self.admin = User.objects.create_superuser(
            email="admin@rumhospital.com",
            password="AdminPassword123!",
            full_name="Admin Director",
            phone_number="01700000001",
            role="Admin",
        )

        # 2. Doctor user & profile
        self.doctor_user = User.objects.create_user(
            email="dr.rahman@rumhospital.com",
            password="DoctorPassword123!",
            full_name="Dr. Mahbub Rahman",
            phone_number="01700000002",
            role="Doctor",
        )
        self.doctor = Doctor.objects.create(
            user=self.doctor_user,
            name="Dr. Mahbub Rahman",
            department="Cardiology",
            specialization="Heart Specialist",
            visiting_fee=1500.00,
        )

        # Second doctor for filtering/ordering tests
        self.doctor2 = Doctor.objects.create(
            name="Dr. Ayesha Siddiqua",
            department="Neurology",
            specialization="Brain Specialist",
            visiting_fee=1200.00,
        )

        # 3. Patient user
        self.patient = User.objects.create_user(
            email="patient1@example.com",
            password="PatientPassword123!",
            full_name="John Doe",
            phone_number="01700000003",
            role="Patient",
            address="Dhaka, Bangladesh",
        )

    # -------------------------------------------------------------
    # SECTION 1: AUTHENTICATION & VALIDATION TESTS
    # -------------------------------------------------------------
    def test_patient_registration_success(self):
        url = reverse("register")
        data = {
            "full_name": "Sarah Connor",
            "email": "sarah@example.com",
            "phone_number": "01700000004",
            "address": "Banani, Dhaka",
            "password": "SecretPassword123!",
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="sarah@example.com").exists())
        user = User.objects.get(email="sarah@example.com")
        self.assertEqual(user.role, "Patient")

    def test_registration_unique_email_validation(self):
        url = reverse("register")
        data = {
            "full_name": "Duplicate User",
            "email": "patient1@example.com",  # Already exists
            "phone_number": "01799999999",
            "password": "Password123!",
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", str(res.data).lower())

    def test_registration_unique_phone_validation(self):
        url = reverse("register")
        data = {
            "full_name": "Duplicate Phone",
            "email": "newunique@example.com",
            "phone_number": "01700000003",  # Already exists
            "password": "Password123!",
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("phone_number", str(res.data).lower())

    def test_jwt_login_success(self):
        url = reverse("login")
        res = self.client.post(
            url, {"email": "patient1@example.com", "password": "PatientPassword123!"}
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)
        self.assertIn("user", res.data)

    def test_forgot_and_reset_password_flow(self):
        forgot_url = reverse("forgot-password")
        res = self.client.post(forgot_url, {"email": "patient1@example.com"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("uid", res.data)
        self.assertIn("token", res.data)

        reset_url = reverse("reset-password")
        reset_res = self.client.post(
            reset_url,
            {
                "uid": res.data["uid"],
                "token": res.data["token"],
                "new_password": "NewSecretPassword999!",
            },
        )
        self.assertEqual(reset_res.status_code, status.HTTP_200_OK)

        # Confirm login with new password
        login_res = self.client.post(
            reverse("login"),
            {"email": "patient1@example.com", "password": "NewSecretPassword999!"},
        )
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)

    # -------------------------------------------------------------
    # SECTION 2: PROFILE MANAGEMENT
    # -------------------------------------------------------------
    def test_profile_retrieve_and_update(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("profile")

        get_res = self.client.get(url)
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)
        self.assertEqual(get_res.data["full_name"], "John Doe")

        patch_res = self.client.patch(url, {"address": "Gulshan 2, Dhaka"})
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data["address"], "Gulshan 2, Dhaka")

    # -------------------------------------------------------------
    # SECTION 3: DOCTOR MANAGEMENT & VALIDATIONS
    # -------------------------------------------------------------
    def test_doctor_list_is_public(self):
        url = reverse("doctor-list")
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data["results"]), 2)

    def test_doctor_creation_admin_only(self):
        url = reverse("doctor-list")
        doctor_data = {
            "name": "Dr. Kamrul Hasan",
            "department": "Orthopedics",
            "specialization": "Bone & Joint",
            "visiting_fee": 1000.00,
        }

        # Patient cannot create doctor
        self.client.force_authenticate(user=self.patient)
        p_res = self.client.post(url, doctor_data)
        self.assertEqual(p_res.status_code, status.HTTP_403_FORBIDDEN)

        # Admin can create doctor
        self.client.force_authenticate(user=self.admin)
        a_res = self.client.post(url, doctor_data)
        self.assertEqual(a_res.status_code, status.HTTP_201_CREATED)

    def test_negative_visiting_fee_validation(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse("doctor-list")
        bad_data = {
            "name": "Dr. Invalid Fee",
            "department": "General",
            "specialization": "MBBS",
            "visiting_fee": -500.00,
        }
        res = self.client.post(url, bad_data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("visiting_fee", str(res.data).lower())

    def test_doctor_filtering_searching_ordering(self):
        # Filtering by department
        url = reverse("doctor-list") + "?department=Cardiology"
        res = self.client.get(url)
        self.assertEqual(len(res.data["results"]), 1)
        self.assertEqual(res.data["results"][0]["name"], "Dr. Mahbub Rahman")

        # Searching
        search_url = reverse("doctor-list") + "?search=Ayesha"
        s_res = self.client.get(search_url)
        self.assertEqual(len(s_res.data["results"]), 1)

        # Ordering by visiting_fee descending
        order_url = reverse("doctor-list") + "?ordering=-visiting_fee"
        o_res = self.client.get(order_url)
        first_fee = float(o_res.data["results"][0]["visiting_fee"])
        second_fee = float(o_res.data["results"][1]["visiting_fee"])
        self.assertGreater(first_fee, second_fee)

    # -------------------------------------------------------------
    # SECTION 4: APPOINTMENTS & AUTOMATIC BILLING
    # -------------------------------------------------------------
    def test_appointment_booking_and_past_date_validation(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("appointment-list")

        # Past date must fail
        past_date = (date.today() - timedelta(days=2)).isoformat()
        bad_res = self.client.post(
            url,
            {
                "doctor": self.doctor.id,
                "appointment_date": past_date,
                "appointment_time": "10:30:00",
            },
        )
        self.assertEqual(bad_res.status_code, status.HTTP_400_BAD_REQUEST)

        # Future date succeeds
        future_date = (date.today() + timedelta(days=5)).isoformat()
        good_res = self.client.post(
            url,
            {
                "doctor": self.doctor.id,
                "appointment_date": future_date,
                "appointment_time": "10:30:00",
            },
        )
        self.assertEqual(good_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(good_res.data["patient"], self.patient.id)

    def test_role_scoped_appointment_visibility(self):
        future_date = (date.today() + timedelta(days=3)).isoformat()
        apt = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=future_date,
            appointment_time="11:00:00",
            status="Pending",
        )

        # Create 2nd patient
        other_patient = User.objects.create_user(
            email="other@example.com",
            password="Password123!",
            full_name="Other Patient",
            phone_number="01788888888",
            role="Patient",
        )

        url = reverse("appointment-list")

        # Patient 1 sees their appointment
        self.client.force_authenticate(user=self.patient)
        res1 = self.client.get(url)
        self.assertEqual(len(res1.data["results"]), 1)

        # Patient 2 sees zero appointments
        self.client.force_authenticate(user=other_patient)
        res2 = self.client.get(url)
        self.assertEqual(len(res2.data["results"]), 0)

        # Doctor Rahman sees this appointment because he is assigned
        self.client.force_authenticate(user=self.doctor_user)
        res_doc = self.client.get(url)
        self.assertEqual(len(res_doc.data["results"]), 1)

        # Admin sees it too
        self.client.force_authenticate(user=self.admin)
        res_adm = self.client.get(url)
        self.assertEqual(len(res_adm.data["results"]), 1)

    def test_auto_billing_on_appointment_completion(self):
        future_date = (date.today() + timedelta(days=4)).isoformat()
        apt = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=future_date,
            appointment_time="14:00:00",
            status="Pending",
        )
        self.assertFalse(Bill.objects.filter(appointment=apt).exists())

        # Update appointment status to Completed
        self.client.force_authenticate(user=self.admin)
        update_url = reverse("appointment-detail", kwargs={"pk": apt.id})
        res = self.client.patch(update_url, {"status": "Completed"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Check Bill was automatically created!
        self.assertTrue(Bill.objects.filter(appointment=apt).exists())
        bill = Bill.objects.get(appointment=apt)
        self.assertEqual(bill.consultation_fee, self.doctor.visiting_fee)
        self.assertEqual(bill.discount, 0)
        self.assertEqual(bill.total_amount, self.doctor.visiting_fee)

    def test_bill_discount_validation(self):
        future_date = (date.today() + timedelta(days=4)).isoformat()
        apt = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=future_date,
            appointment_time="15:00:00",
            status="Confirmed",
        )
        self.client.force_authenticate(user=self.admin)
        url = reverse("bill-list")

        # Discount > Consultation fee must fail
        bad_bill = {
            "patient": self.patient.id,
            "doctor": self.doctor.id,
            "appointment": apt.id,
            "consultation_fee": 1000.00,
            "discount": 1200.00,  # Invalid
        }
        res = self.client.post(url, bad_bill)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("discount", str(res.data).lower())

    # -------------------------------------------------------------
    # SECTION 5: DASHBOARD SUMMARY
    # -------------------------------------------------------------
    def test_dashboard_summary(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse("dashboard")
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("hospital_name", res.data)
        self.assertEqual(res.data["hospital_name"], "RUM Hospital")
        self.assertIn("total_patients", res.data)
        self.assertIn("total_doctors", res.data)
        self.assertIn("total_appointments", res.data)
        self.assertIn("pending_appointments", res.data)
        self.assertIn("completed_appointments", res.data)
