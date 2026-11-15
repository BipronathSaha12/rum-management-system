from datetime import date, time, timedelta
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from api.models import (
    Appointment,
    Bill,
    Department,
    Doctor,
    DoctorSlot,
    PatientProfile,
    PaymentTransaction,
)

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds comprehensive production-level sample data for RUM Hospital"

    def handle(self, *args, **options):
        self.stdout.write("🏥 Seeding production clinical data for RUM Hospital...")

        # 1. Medical Departments
        departments_data = [
            ("Cardiology & Vascular Center", "CARD", "Advanced cardiac care, 24/7 angioplasty, CCU", "HeartPulse"),
            ("Neurology & Neurosurgery", "NEUR", "Acute stroke unit, neuro-critical care and brain surgery", "Brain"),
            ("Gastroenterology & Hepatology", "GAST", "Therapeutic endoscopy, colonoscopy, and liver disease", "Stethoscope"),
            ("Orthopedics & Joint Replacement", "ORTH", "Knee/hip arthroplasty, sports trauma, fracture care", "Bone"),
            ("Pediatrics & Neonatology", "PEDI", "Level-III NICU, pediatric intensive care and child wellness", "Baby"),
            ("Obstetrics & Gynecology", "GYNE", "Safe motherhood, high-risk pregnancy and laparoscopy", "Users"),
            ("Nephrology & Hemodialysis", "NEPH", "Renal dialysis, kidney disease and transplant care", "Activity"),
            ("General & Laparoscopic Surgery", "SURG", "Minimally invasive keyhole surgery and trauma operations", "Scissors"),
        ]

        dept_objs = {}
        for name, code, desc, icon in departments_data:
            dept, _ = Department.objects.get_or_create(
                code=code,
                defaults={"name": name, "description": desc, "icon_name": icon, "is_active": True},
            )
            dept_objs[code] = dept
        self.stdout.write(self.style.SUCCESS(f"✓ Seeded {len(dept_objs)} Clinical Departments."))

        # 2. Superuser / Admin
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
        self.stdout.write(self.style.SUCCESS(f"✓ Admin created: {admin.email} (Password: admin123)"))

        # 3. Doctors with full profiles
        doctors_data = [
            {
                "email": "doctor.rahman@rumhospital.com",
                "name": "Dr. Mahbub Rahman",
                "dept_code": "CARD",
                "specialization": "Interventional Cardiology & Electrophysiology",
                "designation": "Senior Consultant & Head of Cardiology",
                "qualifications": "MBBS, FCPS (Cardiology), MD, MRCP (UK), FACC",
                "experience": 18,
                "room": "Room 304, 3rd Floor (Cardiology Wing)",
                "hours": "Sat, Mon, Wed: 5:00 PM - 9:00 PM",
                "fee": 1500.00,
            },
            {
                "email": "doctor.ayesha@rumhospital.com",
                "name": "Dr. Ayesha Siddiqua",
                "dept_code": "NEUR",
                "specialization": "Clinical Neurology & Stroke Management",
                "designation": "Senior Consultant Neurologist",
                "qualifications": "MBBS, MD (Neurology), Fellow Neuro-Intervention (Singapore)",
                "experience": 14,
                "room": "Room 402, 4th Floor (Neuro Center)",
                "hours": "Sun, Tue, Thu: 4:30 PM - 8:30 PM",
                "fee": 1800.00,
            },
            {
                "email": "doctor.tariqul@rumhospital.com",
                "name": "Dr. Tariqul Islam",
                "dept_code": "GAST",
                "specialization": "Therapeutic Endoscopy & Liver Diseases",
                "designation": "Senior Consultant Gastroenterologist",
                "qualifications": "MBBS, FCPS (Medicine), MD (Gastroenterology)",
                "experience": 16,
                "room": "Room 208, 2nd Floor (Endoscopy Wing)",
                "hours": "Sat to Wed: 6:00 PM - 9:30 PM",
                "fee": 1400.00,
            },
            {
                "email": "doctor.farhana@rumhospital.com",
                "name": "Dr. Farhana Chowdhury",
                "dept_code": "GYNE",
                "specialization": "High-Risk Obstetrics & Infertility Care",
                "designation": "Lead Consultant Obstetrician",
                "qualifications": "MBBS, DGO, FCPS (Obs & Gynae)",
                "experience": 15,
                "room": "Room 312, 3rd Floor (Mother & Child Center)",
                "hours": "Sat, Sun, Wed: 3:00 PM - 7:00 PM",
                "fee": 1500.00,
            },
        ]

        doc_objs = []
        for d in doctors_data:
            doc_user, _ = User.objects.get_or_create(
                email=d["email"],
                defaults={
                    "username": d["email"],
                    "full_name": d["name"],
                    "phone_number": f"+88017{len(doc_objs)+10:08d}",
                    "role": "Doctor",
                    "address": "Dhaka Medical Enclave",
                },
            )
            doc_user.set_password("doctor123")
            doc_user.save()

            dept = dept_objs.get(d["dept_code"])
            doctor, _ = Doctor.objects.get_or_create(
                name=d["name"],
                defaults={
                    "user": doc_user,
                    "department": dept.name if dept else "General",
                    "department_ref": dept,
                    "specialization": d["specialization"],
                    "designation": d["designation"],
                    "qualifications": d["qualifications"],
                    "experience_years": d["experience"],
                    "room_number": d["room"],
                    "visiting_hours": d["hours"],
                    "visiting_fee": d["fee"],
                },
            )
            # Update fields if already existed
            doctor.department_ref = dept
            doctor.designation = d["designation"]
            doctor.room_number = d["room"]
            doctor.visiting_hours = d["hours"]
            doctor.save()
            doc_objs.append(doctor)
        self.stdout.write(self.style.SUCCESS(f"✓ Seeded {len(doc_objs)} Specialist Doctors."))

        # 4. Patients with Permanent HCN Profiles
        patient_records = [
            ("patient.john@gmail.com", "John Doe", "+8801811111111", "patient123", "RUM-2026-00101", "B+", "Male"),
            ("patient.sarah@gmail.com", "Sarah Jenkins", "+8801822222222", "patient123", "RUM-2026-00102", "A+", "Female"),
        ]

        patients = []
        for email, full_name, phone, pwd, hcn, bg, gender in patient_records:
            patient, _ = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email,
                    "full_name": full_name,
                    "phone_number": phone,
                    "role": "Patient",
                    "address": "Gulshan, Dhaka",
                },
            )
            patient.set_password(pwd)
            patient.save()

            PatientProfile.objects.update_or_create(
                user=patient,
                defaults={
                    "hcn_number": hcn,
                    "blood_group": bg,
                    "gender": gender,
                    "emergency_contact_phone": "+8801700999888",
                },
            )
            patients.append(patient)
        self.stdout.write(self.style.SUCCESS(f"✓ Seeded {len(patients)} Patients with HCN profiles."))

        # 5. Doctor Appointment Slots (Today and Future)
        slot_times = [
            (time(16, 30), time(17, 0)),
            (time(17, 0), time(17, 30)),
            (time(17, 30), time(18, 0)),
            (time(18, 0), time(18, 30)),
            (time(18, 30), time(19, 0)),
        ]

        today = date.today()
        created_slots = 0
        for doc in doc_objs:
            for day_offset in range(1, 4):
                slot_date = today + timedelta(days=day_offset)
                for st, et in slot_times:
                    _, created = DoctorSlot.objects.get_or_create(
                        doctor=doc,
                        date=slot_date,
                        start_time=st,
                        defaults={"end_time": et, "is_booked": False},
                    )
                    if created:
                        created_slots += 1
        self.stdout.write(self.style.SUCCESS(f"✓ Generated {created_slots} consultation slots."))

        # 6. Sample Completed Appointment, Bill & Payment Transaction
        first_doc = doc_objs[0]
        first_patient = patients[0]
        past_date = today

        apt, _ = Appointment.objects.get_or_create(
            patient=first_patient,
            doctor=first_doc,
            appointment_date=past_date,
            appointment_time=time(17, 0),
            defaults={"status": "Completed", "symptoms": "Follow-up ECG checkup"},
        )

        bill, _ = Bill.objects.get_or_create(
            appointment=apt,
            defaults={
                "patient": first_patient,
                "doctor": first_doc,
                "consultation_fee": first_doc.visiting_fee,
                "discount": 0,
                "total_amount": first_doc.visiting_fee,
            },
        )

        PaymentTransaction.objects.get_or_create(
            transaction_id="RUM-TXN-DEMO001",
            defaults={
                "bill": bill,
                "patient": first_patient,
                "gateway": "SSLCOMMERZ",
                "amount": bill.total_amount,
                "currency": "BDT",
                "status": "SUCCESS",
                "gateway_val_id": "VAL_SSL_9921448",
            },
        )
        self.stdout.write(self.style.SUCCESS("✓ Seeded sample Bill and reconciled PaymentTransaction."))
        self.stdout.write(self.style.SUCCESS("🎉 RUM Hospital production data seed complete!"))
