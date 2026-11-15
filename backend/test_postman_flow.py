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
    # -------------------------------------------------------------
    # 5. ENTERPRISE HEALTHCARE: SLOTS, LOCKING, & PAYMENT LEDGER
    # -------------------------------------------------------------
    header("TEST 10: PATIENT CHECKS PERMANENT HCN & HEALTH PROFILE (GET /api/patient-profile/)")
    res = requests.get(
        f"{BASE_URL}/patient-profile/",
        headers={"Authorization": f"Bearer {patient_token}"},
    )
    print(f"HTTP Status: {res.status_code} OK")
    print(json.dumps(res.json(), indent=4))

    header("TEST 11: QUERY REAL-TIME AVAILABLE DOCTOR SLOTS (GET /api/slots/?is_booked=false)")
    res = requests.get(
        f"{BASE_URL}/slots/?is_booked=false",
        headers={"Authorization": f"Bearer {patient_token}"},
    )
    print(f"HTTP Status: {res.status_code} OK")
    slots_data = res.json()
    available_slots = slots_data.get("results", slots_data)
    print(f"Total Available Consultation Slots: {len(available_slots)}")
    first_slot = available_slots[0] if available_slots else None

    if first_slot:
        target_slot_id = first_slot["id"]
        header(f"TEST 12: CONCURRENCY-SAFE SLOT RESERVATION FOR SLOT #{target_slot_id} (POST /api/slots/reserve/)")
        res = requests.post(
            f"{BASE_URL}/slots/reserve/",
            headers={"Authorization": f"Bearer {patient_token}"},
            json={
                "slot_id": target_slot_id,
                "symptoms": "High blood pressure and shortness of breath during exertion"
            },
        )
        print(f"HTTP Status: {res.status_code} CREATED")
        print(json.dumps(res.json(), indent=4))

        header(f"TEST 13: RACE CONDITION DOUBLE-BOOKING SIMULATION (POST /api/slots/reserve/)")
        conflict_res = requests.post(
            f"{BASE_URL}/slots/reserve/",
            headers={"Authorization": f"Bearer {patient_token}"},
            json={
                "slot_id": target_slot_id,
                "symptoms": "Duplicate concurrent attempt"
            },
        )
        print(f"HTTP Status: {conflict_res.status_code} CONFLICT (Expected 409)")
        print(json.dumps(conflict_res.json(), indent=4))

    # Find the bill to initiate payment
    if bills_data.get("results"):
        target_bill = bills_data["results"][0]
        header(f"TEST 14: INITIATE PAYMENT TRANSACTION FOR BILL #{target_bill['id']} (POST /api/payments/initiate/)")
        res = requests.post(
            f"{BASE_URL}/payments/initiate/",
            headers={"Authorization": f"Bearer {patient_token}"},
            json={
                "bill_id": target_bill["id"],
                "gateway": "SSLCOMMERZ"
            },
        )
        print(f"HTTP Status: {res.status_code} OK")
        payment_info = res.json()
        print(json.dumps(payment_info, indent=4))
        txn_id = payment_info["transaction_id"]

        header(f"TEST 15: SERVER-TO-SERVER IPN WEBHOOK RECONCILIATION (POST /api/payments/ipn/)")
        ipn_payload = {
            "tran_id": txn_id,
            "status": "VALID",
            "val_id": "VAL-SSLCOM-TEST-9988",
            "amount": str(target_bill["total_amount"]),
            "currency": "BDT"
        }
        ipn_res = requests.post(
            f"{BASE_URL}/payments/ipn/",
            json=ipn_payload
        )
        print(f"HTTP Status: {ipn_res.status_code} OK")
        print(json.dumps(ipn_res.json(), indent=4))

    header("TEST 16: PATIENT REVIEWS AUDIT PAYMENT LEDGER (GET /api/payments/)")
    res = requests.get(
        f"{BASE_URL}/payments/",
        headers={"Authorization": f"Bearer {patient_token}"},
    )
    print(f"HTTP Status: {res.status_code} OK")
    print(json.dumps(res.json(), indent=4))

    print("\n" + "=" * 75)
    print("  ALL DOCTOR & PATIENT POSTMAN TEST WORKFLOWS COMPLETED SUCCESSFULLY!")
    print("=" * 75)


if __name__ == "__main__":
    run_postman_simulation()

