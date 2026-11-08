from datetime import date, timedelta
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from api.models import Appointment, Bill, Doctor

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds initial sample data for RUM Hospital REST API"

    def handle(self, *args, **options):
        self.stdout.write("Seeding data for RUM Hospital...")

        # 1. Superuser / Admin
        admin, _ = User.objects.get_or_create(
            email="admin@rumhospital.com",
            defaults={
                "username": "admin@rumhospital.com",
                "full_name": "RUM Hospital Director",
                "phone_number": "+8801700000001",
                "role": "Admin",
                "address": "Hospital HQ, Level 5, Dhaka",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        admin.set_password("admin123")
        admin.save()
        self.stdout.write(self.style.SUCCESS(f"Admin created: {admin.email} (Password: admin123)"))

        # 2. Doctors
        doc1_user, _ = User.objects.get_or_create(
            email="doctor.rahman@rumhospital.com",
            defaults={
                "username": "doctor.rahman@rumhospital.com",
                "full_name": "Dr. Mahbub Rahman",
                "phone_number": "+8801700000002",
                "role": "Doctor",
                "address": "Dhanmondi, Dhaka",
            },
        )
        doc1_user.set_password("doctor123")
        doc1_user.save()

        doc1, _ = Doctor.objects.get_or_create(
            name="Dr. Mahbub Rahman",
            defaults={
                "user": doc1_user,
                "department": "Cardiology",
                "specialization": "Interventional Cardiologist",
                "visiting_fee": 1500.00,
            },
        )

        doc2_user, _ = User.objects.get_or_create(
            email="doctor.ayesha@rumhospital.com",
            defaults={
                "username": "doctor.ayesha@rumhospital.com",
                "full_name": "Dr. Ayesha Siddiqua",
                "phone_number": "+8801700000003",
                "role": "Doctor",
                "address": "Uttara, Dhaka",
            },
        )
        doc2_user.set_password("doctor123")
        doc2_user.save()

        doc2, _ = Doctor.objects.get_or_create(
            name="Dr. Ayesha Siddiqua",
            defaults={
                "user": doc2_user,
                "department": "Neurology",
                "specialization": "Brain & Spine Neurologist",
                "visiting_fee": 1800.00,
            },
        )

        doc3, _ = Doctor.objects.get_or_create(
            name="Dr. Kamrul Hasan",
            defaults={
                "department": "Orthopedics",
                "specialization": "Bone & Joint Trauma Surgeon",
                "visiting_fee": 1200.00,
            },
        )

        doc4, _ = Doctor.objects.get_or_create(
            name="Dr. Nusrat Jahan",
            defaults={
                "department": "Pediatrics",
                "specialization": "Child Health Specialist",
                "visiting_fee": 1000.00,
            },
        )

        self.stdout.write(self.style.SUCCESS("Doctors created."))

        # 3. Patients
        p1, _ = User.objects.get_or_create(
            email="patient.john@gmail.com",
            defaults={
                "username": "patient.john@gmail.com",
                "full_name": "John Doe",
                "phone_number": "+8801711111111",
                "role": "Patient",
                "address": "Gulshan-1, Dhaka",
            },
        )
        p1.set_password("patient123")
        p1.save()

        p2, _ = User.objects.get_or_create(
            email="patient.sarah@gmail.com",
            defaults={
                "username": "patient.sarah@gmail.com",
                "full_name": "Sarah Jenkins",
                "phone_number": "+8801722222222",
                "role": "Patient",
                "address": "Banani, Dhaka",
            },
        )
        p2.set_password("patient123")
        p2.save()

        self.stdout.write(self.style.SUCCESS("Patients created: John Doe & Sarah Jenkins (Password: patient123)"))

        # 4. Appointments
        today = date.today()

        apt1, _ = Appointment.objects.get_or_create(
            patient=p1,
            doctor=doc1,
            appointment_date=today + timedelta(days=2),
            defaults={
                "appointment_time": "10:00:00",
                "status": "Pending",
            },
        )

        apt2, _ = Appointment.objects.get_or_create(
            patient=p2,
            doctor=doc2,
            appointment_date=today + timedelta(days=4),
            defaults={
                "appointment_time": "11:30:00",
                "status": "Confirmed",
            },
        )

        apt3, created = Appointment.objects.get_or_create(
            patient=p1,
            doctor=doc1,
            appointment_date=today + timedelta(days=1),
            defaults={
                "appointment_time": "15:00:00",
                "status": "Completed",
            },
        )

        self.stdout.write(self.style.SUCCESS("Sample appointments and automatic bills created."))
        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))

