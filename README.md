# 🏥 RUM Hospital Appointment Management System REST API

Welcome to the **RUM Hospital Appointment Management System REST API**, built with **Python 3**, **Django**, and **Django REST Framework (DRF)**.

This system provides a clean, modular, and role-secured healthcare backend handling patient self-registration, JWT-secured authentication, doctor catalog management, appointment scheduling, automatic billing calculations, and hospital operations dashboard metrics.

---

## 📋 Table of Contents
1. [Core Features & Architecture](#core-features--architecture)
2. [User Roles & Permissions Matrix](#user-roles--permissions-matrix)
3. [Required Libraries & Dependency Justification](#required-libraries--dependency-justification)
4. [Step-by-Step Installation & Setup](#step-by-step-installation--setup)
5. [Default Seed Credentials](#default-seed-credentials)
6. [API Endpoint Catalog](#api-endpoint-catalog)
7. [Filtering, Searching, Ordering & Pagination Examples](#filtering-searching-ordering--pagination-examples)
8. [Automatic Billing & Validation Rules](#automatic-billing--validation-rules)
9. [Running Automated Tests](#running-automated-tests)
10. [Postman Import & Testing Guide](#postman-import--testing-guide)

---

## 🏛️ Core Features & Architecture

The project adheres to a single-app architecture (`config` project, `api` core app) to eliminate circular dependencies between models while keeping separation of concerns strictly enforced:

```
hospital_management_api/
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py          # DRF, SimpleJWT, Pagination & Middleware configuration
│   ├── urls.py              # Root router directing traffic to /admin/ and /api/
│   └── wsgi.py
├── api/
│   ├── __init__.py
│   ├── admin.py             # Custom Django Admin registrations
│   ├── apps.py
│   ├── middleware.py        # RequestExecutionTimeMiddleware (latency logger)
│   ├── models.py            # User (AbstractUser), Doctor, Appointment, Bill
│   ├── permissions.py       # Role-Based Access Control (RBAC) classes
│   ├── serializers.py       # DRF serializers & field-level validation rules
│   ├── tests.py             # Complete APITestCase test suite (15/15 passing)
│   ├── urls.py              # Nested DefaultRouter and API endpoints
│   ├── views.py             # ModelViewSets and APIViews
│   └── management/
│       └── commands/
│           └── seed_hospital_data.py # Automated sample data seeder
├── manage.py
├── requirements.txt         # Zero-bloat dependency list
├── .gitignore
├── postman_collection.json  # Postman v2.1 importable collection
└── README.md
```

---

## 👥 User Roles & Permissions Matrix

| Resource / Endpoint | Unauthenticated | Patient (`role='Patient'`) | Doctor (`role='Doctor'`) | Admin (`role='Admin'` / `is_staff`) |
| :--- | :---: | :---: | :---: | :---: |
| **POST `/api/register/`** | ✅ Allowed | ❌ | ❌ | ❌ |
| **POST `/api/login/`** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **POST `/api/forgot-password/`** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **POST `/api/reset-password/`** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **GET, PUT, PATCH `/api/profile/`** | ❌ (401) | ✅ Own profile only | ✅ Own profile only | ✅ Own profile only |
| **GET `/api/doctors/`** | ✅ Public list | ✅ Public list | ✅ Public list | ✅ Full list |
| **POST, PUT, DELETE `/api/doctors/`** | ❌ (401) | ❌ (403 Forbidden) | ❌ (403 Forbidden) | ✅ Full CRUD |
| **GET `/api/appointments/`** | ❌ (401) | ✅ Own appointments only | ✅ Assigned appointments only | ✅ All appointments |
| **POST `/api/appointments/`** | ❌ (401) | ✅ Books for self | ❌ | ✅ Can book for anyone |
| **PATCH `/api/appointments/<id>/`** | ❌ (401) | ✅ Cancel / Update own | ✅ Update status (e.g. Completed) | ✅ Full management |
| **GET `/api/bills/`** | ❌ (401) | ✅ Own bills only | ✅ Bills for own appointments | ✅ Full billing access |
| **POST, PUT, DELETE `/api/bills/`** | ❌ (401) | ❌ (403 Forbidden) | ❌ (403 Forbidden) | ✅ Full CRUD |
| **GET `/api/dashboard/`** | ❌ (401) | ✅ Summary stats | ✅ Summary stats | ✅ Summary stats |

---

## 📦 Required Libraries & Dependency Justification

1. **`django`**: The core web framework providing ORM, database migrations, authentication engine, and SQLite/PostgreSQL drivers.
2. **`djangorestframework`**: Provides standard REST serialization, generic `APIView`s, `ModelViewSet`s, browsable API interface, content negotiation, and error handling.
3. **`djangorestframework-simplejwt`**: Industry-standard JSON Web Token (JWT) provider handling token generation, validation, cryptographic signatures, and token refresh.
4. **`django-filter`**: Declarative query parameter filtering for DRF ViewSets without manual `request.GET.get(...)` boilerplate.

---

## 🚀 Step-by-Step Installation & Setup

### 1. Clone or Enter Project Directory
```powershell
cd "f:\Projects\BS Hospital\hospital_management_api"
```

### 2. Create and Activate Virtual Environment
```powershell
# Windows PowerShell:
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS / Git Bash:
# source venv/bin/activate
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 4. Apply Database Migrations
```powershell
python manage.py makemigrations api
python manage.py migrate
```

### 5. Seed Realistic Sample Data
Run the built-in management command to immediately generate an Admin, Doctors, Patients, Appointments, and Bills:
```powershell
python manage.py seed_hospital_data
```

### 6. Run the Local Development Server
```powershell
python manage.py runserver
```
The server will start at `http://127.0.0.1:8000/`.

---

## 🔑 Default Seed Credentials

| Role | Email | Password | Full Name | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@rumhospital.com` | `admin123` | RUM Hospital Director | Full privileges to Django admin & all APIs |
| **Doctor** | `doctor.rahman@rumhospital.com` | `doctor123` | Dr. Mahbub Rahman | Cardiology Specialist |
| **Doctor** | `doctor.ayesha@rumhospital.com` | `doctor123` | Dr. Ayesha Siddiqua | Neurology Specialist |
| **Patient** | `patient.john@gmail.com` | `patient123` | John Doe | Sample Patient with appointments |
| **Patient** | `patient.sarah@gmail.com` | `patient123` | Sarah Jenkins | Sample Patient with appointments |

---

## 📡 API Endpoint Catalog

All API endpoints are mounted with the `/api/` prefix:

### 1. Authentication Endpoints
- `POST /api/register/` - Register a new Patient (`role='Patient'`).
- `POST /api/login/` - Authenticate using `email` & `password`. Returns JWT `access` & `refresh` tokens with user profile metadata.
- `POST /api/token/refresh/` - Exchange `refresh` token for a fresh `access` token.
- `POST /api/forgot-password/` - Submit `email`. Generates a secure `uid` & `token`, logs instructions in the terminal, and returns them in JSON.
- `POST /api/reset-password/` - Submit `uid`, `token`, and `new_password` to update credentials.

### 2. Profile Management
- `GET /api/profile/` - View profile of the authenticated user.
- `PUT /api/profile/` - Full update of profile.
- `PATCH /api/profile/` - Partial update of profile (e.g. `address`, `full_name`, `phone_number`).

### 3. Doctor Management
- `GET /api/doctors/` - List all doctors (Public access, paginated).
- `POST /api/doctors/` - Create a new doctor (Admin only).
- `GET /api/doctors/<id>/` - Retrieve single doctor detail (Public access).
- `PUT /api/doctors/<id>/` - Update doctor profile (Admin only).
- `PATCH /api/doctors/<id>/` - Partial update of doctor profile (Admin only).
- `DELETE /api/doctors/<id>/` - Remove doctor (Admin only).

### 4. Appointment Management
- `GET /api/appointments/` - List appointments (Scoped: Patient sees own; Doctor sees assigned; Admin sees all).
- `POST /api/appointments/` - Book an appointment (Patient & Admin). Patient is auto-assigned to `request.user`.
- `GET /api/appointments/<id>/` - View single appointment detail.
- `PUT /api/appointments/<id>/` - Update appointment details.
- `PATCH /api/appointments/<id>/` - Update appointment status (`Pending`, `Confirmed`, `Completed`, `Cancelled`).
- `DELETE /api/appointments/<id>/` - Cancel / delete appointment.

### 5. Billing Management
- `GET /api/bills/` - List consultation invoices (Scoped by role).
- `POST /api/bills/` - Manually issue a bill (Admin only).
- `GET /api/bills/<id>/` - View single bill detail.
- `PATCH /api/bills/<id>/` - Adjust discount or consultation fee (Admin only).
- `DELETE /api/bills/<id>/` - Delete a bill (Admin only).

### 6. Hospital Dashboard
- `GET /api/dashboard/` - Returns hospital metrics:
  ```json
  {
    "hospital_name": "RUM Hospital",
    "total_patients": 4,
    "total_doctors": 4,
    "total_appointments": 3,
    "pending_appointments": 1,
    "completed_appointments": 1
  }
  ```

---

## 🔍 Filtering, Searching, Ordering & Pagination Examples

Global pagination is set to `10` records per page. Use the query parameters below to filter, search, sort, and paginate:

### Doctor Endpoints:
- **Filtering by Department:**
  ```http
  GET /api/doctors/?department=Cardiology
  ```
- **Searching by Name / Department / Specialization:**
  ```http
  GET /api/doctors/?search=Rahman
  ```
- **Ordering by Visiting Fee (Ascending):**
  ```http
  GET /api/doctors/?ordering=visiting_fee
  ```
- **Ordering by Visiting Fee (Descending):**
  ```http
  GET /api/doctors/?ordering=-visiting_fee
  ```
- **Pagination:**
  ```http
  GET /api/doctors/?page=2
  ```

### Appointment Endpoints:
- **Filtering by Status:**
  ```http
  GET /api/appointments/?status=Completed
  ```
- **Filtering by Doctor ID:**
  ```http
  GET /api/appointments/?doctor=1
  ```
- **Searching by Patient Full Name or Doctor Name:**
  ```http
  GET /api/appointments/?search=John
  ```
- **Ordering by Appointment Date (Ascending / Descending):**
  ```http
  GET /api/appointments/?ordering=appointment_date
  GET /api/appointments/?ordering=-appointment_date
  ```
- **Pagination:**
  ```http
  GET /api/appointments/?page=3
  ```

---

## ⚙️ Automatic Billing & Validation Rules

### 1. Auto-Billing Trigger
Whenever an `Appointment` status transition occurs to `Completed` (via `PATCH /api/appointments/<id>/` or `save()`), the system automatically executes:
```python
if self.status == "Completed":
    Bill.objects.get_or_create(
        appointment=self,
        defaults={
            "patient": self.patient,
            "doctor": self.doctor,
            "consultation_fee": self.doctor.visiting_fee,
            "discount": 0,
            "total_amount": self.doctor.visiting_fee,
        },
    )
```
The bill is linked 1-to-1 with the appointment and immediately becomes visible under `/api/bills/`.

### 2. Business Validations Enforced
1. **Unique Email:** Duplicate email registration returns `400 Bad Request`.
2. **Unique Phone Number:** Duplicate phone numbers are rejected with `400 Bad Request`.
3. **Non-Negative Visiting Fee:** `visiting_fee < 0` triggers `serializers.ValidationError("Visiting fee cannot be negative.")`.
4. **Appointment Date in Future:** `appointment_date < timezone.localdate()` triggers `serializers.ValidationError("Appointment date cannot be in the past.")`.
5. **Discount Limit:** `discount > consultation_fee` or negative discounts trigger `serializers.ValidationError("Discount cannot be greater than consultation fee.")`.

---

## 🧪 Running Automated Tests

A comprehensive test suite of 15 automated integration tests is provided in `api/tests.py`.

Run the test suite with:
```powershell
python manage.py test
```

### Test Coverage Highlights:
- ✅ Patient self-registration with password hashing
- ✅ Uniqueness constraints on email and phone numbers
- ✅ JWT login token generation and validation
- ✅ Forgot password token generation and password reset flow
- ✅ Profile retrieve and partial update
- ✅ Public access to Doctor catalog
- ✅ Doctor creation restricted to Admin (403 for Patients)
- ✅ Negative visiting fee validation
- ✅ Doctor filtering, searching, and ordering
- ✅ Future appointment scheduling & past date validation
- ✅ Role-based appointment isolation (Doctor, Patient, Admin)
- ✅ Automatic Bill generation upon marking appointment Completed
- ✅ Bill discount validation check
- ✅ Dashboard metrics calculation
- ✅ Middleware execution time logging verification

---

## 📮 Postman Import & Testing Guide

1. Open Postman.
2. Click **Import** in the top left and select `hospital_management_api/postman_collection.json`.
3. The collection **RUM Hospital Appointment Management System API** will appear with 6 organized folders:
   - `1. Authentication APIs`
   - `2. Profile APIs`
   - `3. Doctor APIs`
   - `4. Appointment APIs`
   - `5. Billing APIs`
   - `6. Dashboard API`
4. Run `1.2 Login (Admin / Doctor / Patient)` with the default credentials (`admin@rumhospital.com` / `admin123`). The test script automatically sets `{{access_token}}` into your collection variables!
5. All subsequent requests automatically inherit and send the `Bearer {{access_token}}` header.

---

### Production Scaling Recommendations:
1. **Environment Variables:** Migrate `SECRET_KEY`, `DEBUG`, and database settings to `.env` using `python-decouple` before deploying to staging/production.
2. **PostgreSQL Database:** Replace SQLite with PostgreSQL (`psycopg2-binary`) with connection pooling in production.
3. **CORS Headers:** Configure `django-cors-headers` to restrict frontend origins to verified domains.
4. **Celery for Asynchronous Tasks:** Move password reset emails and notification triggers to background workers backed by Redis.
5. **HTTPS & Secure Cookies:** Turn on `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, and `CSRF_COOKIE_SECURE` when hosting behind Nginx / Cloudflare.

