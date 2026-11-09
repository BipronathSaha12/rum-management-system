import json
import requests

BASE_URL = "http://127.0.0.1:8000/api"


def header(title):
    print("\n" + "=" * 75)
    print(f"  {title}")
    print("=" * 75)


def run_postman_simulation():
    # -----------------------------------------------------------------
    # 1. PATIENT WORKFLOW (John Doe)
    # -----------------------------------------------------------------
    header("TEST 1: PATIENT LOGIN (POST /api/login/)")
    res = requests.post(
        f"{BASE_URL}/login/",
        json={"email": "patient.john@gmail.com", "password": "patient123"},
    )
    print(f"HTTP Status: {res.status_code} OK")
    patient_data = res.json()
    patient_token = patient_data["access"]
    print("Logged-in Patient Info:")
    print(json.dumps(patient_data.get("user"), indent=4))
    print(f"JWT Access Token: {patient_token[:40]}...")

    header("TEST 2: PATIENT CHECKS PROFILE (GET /api/profile/)")
    res = requests.get(
        f"{BASE_URL}/profile/",
        headers={"Authorization": f"Bearer {patient_token}"},
    )
    print(f"HTTP Status: {res.status_code} OK")
    print(json.dumps(res.json(), indent=4))

    header("TEST 3: PATIENT BOOKS APPOINTMENT WITH DR. RAHMAN (POST /api/appointments/)")
    payload = {
        "doctor": 1,
        "appointment_date": "2026-12-25",
        "appointment_time": "11:30:00",
        "status": "Pending",
    }
    res = requests.post(
        f"{BASE_URL}/appointments/",
        headers={"Authorization": f"Bearer {patient_token}"},
        json=payload,
    )
    print(f"HTTP Status: {res.status_code} CREATED")
    booked_appointment = res.json()
    appointment_id = booked_appointment["id"]
    print(json.dumps(booked_appointment, indent=4))

    header("TEST 4: PATIENT VIEWS ALL OWN APPOINTMENTS (GET /api/appointments/)")
    res = requests.get(
        f"{BASE_URL}/appointments/",
        headers={"Authorization": f"Bearer {patient_token}"},
    )
    data = res.json()
    print(f"HTTP Status: {res.status_code} OK")
    print(f"Total Appointments for Patient John Doe: {data['count']}")
    for apt in data["results"]:
        print(
            f"  • ID #{apt['id']}: Dr. {apt['doctor_name']} ({apt['doctor_department']}) on {apt['appointment_date']} at {apt['appointment_time']} [{apt['status']}]"
        )

    # -----------------------------------------------------------------
    # 2. DOCTOR WORKFLOW (Dr. Mahbub Rahman)
    # -----------------------------------------------------------------
    header("TEST 5: DOCTOR LOGIN (POST /api/login/)")
    res = requests.post(
        f"{BASE_URL}/login/",
        json={"email": "doctor.rahman@rumhospital.com", "password": "doctor123"},
    )
    print(f"HTTP Status: {res.status_code} OK")
    doctor_data = res.json()
    doctor_token = doctor_data["access"]
    print("Logged-in Doctor Info:")
    print(json.dumps(doctor_data.get("user"), indent=4))
    print(f"JWT Access Token: {doctor_token[:40]}...")

    header("TEST 6: DOCTOR VIEWS ASSIGNED APPOINTMENTS (GET /api/appointments/)")
    res = requests.get(
        f"{BASE_URL}/appointments/",
        headers={"Authorization": f"Bearer {doctor_token}"},
    )
    doc_apts = res.json()
    print(f"HTTP Status: {res.status_code} OK")
    print(f"Total Appointments Assigned to Dr. Rahman: {doc_apts['count']}")
    for apt in doc_apts["results"]:
        print(
            f"  • ID #{apt['id']}: Patient: {apt['patient_name']} on {apt['appointment_date']} at {apt['appointment_time']} [{apt['status']}]"
        )

    header(
        f"TEST 7: DOCTOR MARKS APPOINTMENT #{appointment_id} AS 'Completed' (PATCH /api/appointments/{appointment_id}/)"
    )
    res = requests.patch(
        f"{BASE_URL}/appointments/{appointment_id}/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"status": "Completed"},
    )
    print(f"HTTP Status: {res.status_code} OK")
    print(json.dumps(res.json(), indent=4))

    # -----------------------------------------------------------------
    # 3. VERIFY AUTO-BILLING TRIGGERED
    # -----------------------------------------------------------------
    header("TEST 8: VERIFY AUTOMATIC BILLING CREATED (GET /api/bills/)")
    res = requests.get(
        f"{BASE_URL}/bills/",
        headers={"Authorization": f"Bearer {patient_token}"},
    )
    bills_data = res.json()
    print(f"HTTP Status: {res.status_code} OK")
    print(f"Invoices visible to Patient John: {bills_data['count']}")
    for bill in bills_data["results"]:
        print(
            f"  • Bill ID #{bill['id']} for Appointment #{bill['appointment']}:"
        )
        print(f"      Doctor           : Dr. {bill['doctor_name']}")
        print(f"      Consultation Fee : ৳{bill['consultation_fee']}")
        print(f"      Discount         : ৳{bill['discount']}")
        print(f"      Total Payable    : ৳{bill['total_amount']}")

    # -----------------------------------------------------------------
    # 4. DASHBOARD CHECK
    # -----------------------------------------------------------------
    header("TEST 9: HOSPITAL DASHBOARD SUMMARY (GET /api/dashboard/)")
    res = requests.get(
        f"{BASE_URL}/dashboard/",
        headers={"Authorization": f"Bearer {doctor_token}"},
    )
    print(f"HTTP Status: {res.status_code} OK")
    print(json.dumps(res.json(), indent=4))
    print("\n" + "=" * 75)
    print("  ALL DOCTOR & PATIENT POSTMAN TEST WORKFLOWS COMPLETED SUCCESSFULLY!")
    print("=" * 75)


if __name__ == "__main__":
    run_postman_simulation()

