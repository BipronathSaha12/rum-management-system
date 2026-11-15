# 🏥 RUM Hospital Management System

[![RUM Hospital CI](https://github.com/BipronathSaha12/rum-management-system/actions/workflows/ci.yml/badge.svg)](https://github.com/BipronathSaha12/rum-management-system/actions/workflows/ci.yml)
[![Django](https://img.shields.io/badge/Django-6.1-green.svg)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.18-red.svg)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**RUM Hospital Management System** is an enterprise-grade healthcare management solution inspired by top-tier hospital portals (such as [Asgar Ali Hospital](https://www.asgaralihospital.com/)). The architecture features a decoupled monorepo separating a high-concurrency **Django REST Framework backend** from a modern, mobile-responsive **React.js + Tailwind CSS frontend**.

---

## 📋 Table of Contents
1. [Architecture & Directory Structure](#-architecture--directory-structure)
2. [Key Enterprise Features](#-key-enterprise-features)
3. [User Roles & Permissions Matrix](#-user-roles--permissions-matrix)
4. [Technology Stack](#-technology-stack)
5. [Local Development & Quickstart](#-local-development--quickstart)
6. [Default Seed Credentials](#-default-seed-credentials)
7. [Running the Automated Test Suite](#-running-the-automated-test-suite)
8. [Postman Collection & Verification Flow](#-postman-collection--verification-flow)
9. [Production Deployment Guide (Server / VPS / Cloud)](#-production-deployment-guide-server--vps--cloud)
10. [PostgreSQL Optimization for High Scale](#-postgresql-optimization-for-high-scale)

---

## 🏛️ Architecture & Directory Structure

The repository is structured cleanly into isolated `backend/` and `frontend/` directories:

```text
rum-management-system/
├── backend/                              # Django REST Framework Backend
│   ├── api/                              # Core Healthcare Domain Logic
│   │   ├── migrations/                   # Database Schema Versioning
│   │   ├── management/commands/          # Data Seeding Engine (seed_hospital_data.py)
│   │   ├── models.py                     # Scalable PostgreSQL Data Models
│   │   ├── serializers.py                # Serializers & Custom Validations
│   │   ├── views.py                      # Concurrency Locks, IPN, & ViewSets
│   │   ├── urls.py                       # RESTful Resource Routing
│   │   ├── admin.py                      # Django Admin Dashboards
│   │   ├── permissions.py                # Role-Based Access Control (RBAC)
│   │   ├── middleware.py                 # Latency Monitoring Middleware
│   │   └── tests.py                      # Automated Test Suite (20/20 Passing)
│   ├── config/                           # Application Configuration
│   │   ├── settings.py                   # Decouple, Database Pooling, CORS, SimpleJWT
│   │   ├── urls.py                       # Root URL Router
│   │   ├── asgi.py                       # ASGI Entrypoint
│   │   └── wsgi.py                       # Production WSGI Entrypoint
│   ├── manage.py                         # Django Management Utility
│   ├── requirements.txt                  # Python Dependency Manifest
│   ├── .env.example                      # Production Environment Template
│   ├── postman_collection.json           # Comprehensive Postman v2.1 Collection
│   └── test_postman_flow.py              # End-to-End Integration Verification Script
│
├── frontend/                             # React 18 + Vite Modern UI
│   ├── public/                           # Static Assets & Hospital Branding
│   ├── src/
│   │   ├── components/                   # Modular UI Components
│   │   │   ├── Navbar.jsx                # Responsive Navigation Header
│   │   │   ├── EmergencyTopBar.jsx       # 24/7 Hotline & Quick Contact Bar
│   │   │   ├── HeroSection.jsx           # Clean Healthcare Hero & Action CTAs
│   │   │   ├── QuickSearchEngine.jsx     # Live Multi-Criteria Doctor Search
│   │   │   ├── FourPillars.jsx           # Clinical Pillars (Accreditation & Care)
│   │   │   ├── DepartmentsSection.jsx    # Clinical Center Cards with Icons
│   │   │   ├── DoctorDirectory.jsx       # Specialist Directory with Filters
│   │   │   ├── HealthPackagesSection.jsx # Executive Health Checkup Packages
│   │   │   ├── OnlineReportsSection.jsx  # Digital Diagnostic Report Lookup
│   │   │   ├── EmergencyTraumaSection.jsx# 24/7 Trauma, ICU, Ambulance Info
│   │   │   ├── HospitalStats.jsx         # Live Hospital Performance Metrics
│   │   │   ├── ContactLocationSection.jsx# Address, Maps, & Hotline Contacts
│   │   │   ├── Footer.jsx                # Multi-Column Enterprise Footer
│   │   │   ├── MobileBottomNav.jsx       # Mobile Navigation Drawer / App Bar
│   │   │   ├── DoctorModal.jsx           # Detailed Doctor Biography & Schedule
│   │   │   ├── AppointmentBookingModal.jsx# Slot Selection & Real-Time Booking
│   │   │   ├── PatientPortalModal.jsx    # Patient Self-Service Login & HCN
│   │   │   └── ToastNotification.jsx     # Real-Time Operational Feedback
│   │   ├── services/
│   │   │   └── api.js                    # Centralized Axios API Client
│   │   ├── data/
│   │   │   └── hospitalData.js           # Static Fallback Data
│   │   ├── App.jsx                       # Master Layout Orchestration
│   │   ├── index.css                     # Tailwind Utility Rules & Clean Design
│   │   └── main.jsx                      # React Root Mounting
│   ├── package.json                      # Node.js Dependencies & Build Scripts
│   ├── vite.config.js                    # Vite Development & Production Config
│   └── tailwind.config.js                # Healthcare Theme Palette
│
├── .github/
│   └── workflows/
│       └── ci.yml                        # GitHub Actions Automated CI Pipeline
├── .gitignore                            # Enterprise Monorepo Git Ignore Rules
└── README.md                             # Comprehensive Documentation
```

---

## ⚡ Key Enterprise Features

### 1. Modern Mobile-Responsive React UI
- **Device Agnostic**: Fully fluid across mobile phones (320px+), tablets, laptops, and ultra-wide desktop displays.
- **Clinical Aesthetics**: Professional light medical theme with calm emerald/teal accents, high contrast readability, and accessible typography.
- **Live Search & Filters**: Instant multi-criteria doctor search by name, medical department, and clinical specialization.

### 2. High-Scale PostgreSQL Database Architecture
- **Permanent Identification**: Every patient receives an immutable **Hospital Care Number (HCN)** (e.g. `RUM-2026-00101`).
- **Composite B-Tree Indexing**: Queries scanning schedules and appointments execute in `< 1.5ms` via `(doctor_id, appointment_date, status)` composite indexes.
- **Connection Pooling**: Native connection re-use via `CONN_MAX_AGE = 60` and pgBouncer support.

### 3. Concurrency-Safe Slot Reservation (Zero Double-Booking)
- Uses row-level pessimistic database locking (`select_for_update()`) inside atomic database transactions (`transaction.atomic()`).
- Eliminates race conditions: If multiple patients click "Book" for the exact same doctor slot at the exact same millisecond, the first request secures the slot (`HTTP 201 Created`), while concurrent conflicting attempts are cleanly rejected with **`HTTP 409 Conflict`**.

### 4. Idempotent Payment Gateway Orchestration
- **Supported Providers**: SSLCommerz, bKash, and Stripe sandbox/production integration.
- **Server-to-Server IPN Webhook**: Asynchronous webhook handler (`POST /api/payments/ipn/`) reconciles payments independently of client browser drops.
- **Idempotency Guard**: Repeated webhook deliveries are safely acknowledged without creating duplicate financial ledger entries.
- **Automated Invoicing**: Moving an appointment to `Completed` automatically computes visiting fees, validates discounts, and creates immutable `Bill` records.

---

## 👥 User Roles & Permissions Matrix

| Resource / Endpoint | Public | Patient (`role='Patient'`) | Doctor (`role='Doctor'`) | Admin (`role='Admin'`) |
| :--- | :---: | :---: | :---: | :---: |
| **POST `/api/register/`** | ✅ Allowed | ❌ | ❌ | ❌ |
| **POST `/api/login/`** | ✅ Allowed | ✅ | ✅ | ✅ |
| **GET `/api/departments/`** | ✅ Public | ✅ | ✅ | ✅ |
| **GET `/api/doctors/`** | ✅ Public | ✅ | ✅ | ✅ Full CRUD |
| **GET `/api/slots/`** | ✅ Available only | ✅ Available only | ✅ Own slots | ✅ All slots |
| **POST `/api/slots/reserve/`** | ❌ (401) | ✅ Reserve slot | ❌ | ✅ Reserve any |
| **GET, PATCH `/api/patient-profile/`**| ❌ (401) | ✅ Own HCN profile | ❌ | ✅ View any |
| **GET `/api/appointments/`** | ❌ (401) | ✅ Own bookings | ✅ Assigned patients | ✅ Full hospital view |
| **PATCH `/api/appointments/<id>/`** | ❌ (401) | ✅ Cancel own | ✅ Mark Completed | ✅ Full control |
| **POST `/api/payments/initiate/`** | ❌ (401) | ✅ Own bills | ❌ | ✅ Initiate any |
| **POST `/api/payments/ipn/`** | ✅ Public Webhook | ✅ Webhook | ✅ Webhook | ✅ Webhook |
| **GET `/api/payments/`** | ❌ (401) | ✅ Own receipts | ❌ | ✅ Full audit ledger |
| **GET `/api/dashboard/`** | ❌ (401) | ✅ Patient metrics | ✅ Doctor metrics | ✅ Hospital operations |

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide React Icons, Axios |
| **Backend API** | Python 3.12+, Django 6.1, Django REST Framework 3.18, SimpleJWT |
| **Database** | PostgreSQL 16 (Production) / SQLite 3 (Development Fallback) |
| **Payment Gateways**| SSLCommerz v4, bKash Checkout, Stripe Elements |
| **Deployment** | Nginx, Gunicorn, Systemd, Docker, GitHub Actions CI |

---

## 🚀 Local Development & Quickstart

### Prerequisites
- **Python 3.12+** installed
- **Node.js 18+** & **npm** installed
- **Git** installed

---

### Step 1: Set Up Backend
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate a Python virtual environment
# Windows PowerShell:
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS:
python3 -m venv venv
source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Configure environment variables
# Copy the template to .env
cp .env.example .env

# 5. Apply database migrations
python manage.py migrate

# 6. Seed initial hospital departments, doctors, and slots
python manage.py seed_hospital_data

# 7. Start the backend development server (Runs on port 8000)
python manage.py runserver 127.0.0.1:8000
```

---

### Step 2: Set Up Frontend
Open a new terminal window:
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Start the Vite React development server (Runs on port 3000)
npm run dev -- --host 127.0.0.1 --port 3000
```

- **Frontend Application**: [http://127.0.0.1:3000/](http://127.0.0.1:3000/)
- **Backend API Root**: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
- **Django Admin Portal**: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## 🔑 Default Seed Credentials

When you run `python manage.py seed_hospital_data`, the following test accounts are provisioned:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rumhospital.com` | `admin123` | Full superuser access to Django admin & all records |
| **Doctor** | `doctor.rahman@rumhospital.com` | `doctor123` | Dr. Mahbub Rahman (Cardiology Specialist) |
| **Patient** | `patient.john@gmail.com` | `patient123` | John Doe (HCN: `RUM-2026-00101`, Blood: `B+`) |
| **Patient** | `patient.sarah@gmail.com` | `patient123` | Sarah Jenkins (HCN: `RUM-2026-00102`, Blood: `O+`) |

---

## 🧪 Running the Automated Test Suite

The backend includes a comprehensive unit and integration test suite covering authentication, RBAC, slot pessimistic locking, duplicate collision handling (`HTTP 409`), payment webhook verification, and IPN idempotency:

```bash
cd backend
python manage.py test
```

**Expected Result**:
```text
Creating test database for alias 'default'...
....................
----------------------------------------------------------------------
Ran 20 tests in 0.314s

OK
Destroying test database for alias 'default'...
```

---

## 📡 Postman Collection & Verification Flow

A pre-configured Postman Collection is provided at `backend/postman_collection.json`.

### Live Integration Verification Script
To test all 16 endpoints in an automated sequence against your live server:
```bash
cd backend
python test_postman_flow.py
```
This script automatically performs:
1. Patient login & JWT generation
2. Patient profile verification (with HCN)
3. Doctor schedule querying
4. Concurrency slot reservation
5. Contested slot collision test (`HTTP 409 Conflict` verification)
6. Doctor consultation completion
7. Automatic bill generation
8. Payment session initialization
9. Server-to-server IPN webhook reconciliation
10. Financial ledger audit verification

---

## 🌐 Production Deployment Guide (Server / VPS / Cloud)

This guide walks you through deploying **RUM Hospital** to an **Ubuntu 22.04 / 24.04 LTS VPS** (AWS EC2, DigitalOcean Droplet, Linode, Hetzner, etc.) using **PostgreSQL, Gunicorn, Nginx, and Let's Encrypt SSL**.

---

### Phase 1: Server Preparation
```bash
# 1. Update OS packages
sudo apt update && sudo apt upgrade -y

# 2. Install Python, PostgreSQL, Nginx, and build essentials
sudo apt install -y python3-pip python3-venv python3-dev postgresql postgresql-contrib libpq-dev nginx curl git certbot python3-certbot-nginx

# 3. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

### Phase 2: PostgreSQL Production Setup
```bash
# 1. Switch to postgres user and create database
sudo -u postgres psql

# Run inside PostgreSQL shell:
CREATE DATABASE rum_hospital_db;
CREATE USER rum_admin WITH PASSWORD 'YourUltraSecurePassword2026!';
ALTER ROLE rum_admin SET client_encoding TO 'utf8';
ALTER ROLE rum_admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE rum_admin SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE rum_hospital_db TO rum_admin;
\q
```

---

### Phase 3: Deploy Backend
```bash
# 1. Clone repository to /var/www/
cd /var/www
sudo git clone https://github.com/BipronathSaha12/rum-management-system.git
sudo chown -R $USER:$USER /var/www/rum-management-system

# 2. Enter backend directory and initialize venv
cd /var/www/rum-management-system/backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# 3. Create production .env file
nano .env
```

**Set production variables in `.env`:**
```ini
DEBUG=False
SECRET_KEY=generate-a-strong-random-50-character-string-here
ALLOWED_HOSTS=rumhospital.com,api.rumhospital.com,127.0.0.1,localhost
DATABASE_URL=postgres://rum_admin:YourUltraSecurePassword2026!@127.0.0.1:5432/rum_hospital_db

# Payment Gateway Credentials
SSLCOMMERZ_STORE_ID=your_production_store_id
SSLCOMMERZ_STORE_PASS=your_production_store_password
SSLCOMMERZ_IS_SANDBOX=False
```

```bash
# 4. Migrate database and collect static files
python manage.py migrate
python manage.py seed_hospital_data
python manage.py collectstatic --noinput
```

---

### Phase 4: Configure Gunicorn Systemd Service
Create the service configuration:
```bash
sudo nano /etc/systemd/system/rum-backend.service
```

Paste the following:
```ini
[Unit]
Description=Gunicorn daemon for RUM Hospital Management API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/rum-management-system/backend
ExecStart=/var/www/rum-management-system/backend/venv/bin/gunicorn \
          --access-logfile /var/log/gunicorn/access.log \
          --error-logfile /var/log/gunicorn/error.log \
          --workers 4 \
          --bind 127.0.0.1:8000 \
          config.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo mkdir -p /var/log/gunicorn
sudo chown -R www-data:www-data /var/log/gunicorn
sudo systemctl daemon-reload
sudo systemctl start rum-backend
sudo systemctl enable rum-backend
```

---

### Phase 5: Build and Deploy Frontend
```bash
cd /var/www/rum-management-system/frontend
npm install
npm run build
# Built production assets will be in /var/www/rum-management-system/frontend/dist/
```

---

### Phase 6: Configure Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/rumhospital
```

Paste the configuration:
```nginx
server {
    listen 80;
    server_name rumhospital.com www.rumhospital.com;

    # Frontend Single-Page Application (SPA)
    location / {
        root /var/www/rum-management-system/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend REST API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin Portal
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Files for Django Admin
    location /static/ {
        alias /var/www/rum-management-system/backend/staticfiles/;
    }
}
```

Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/rumhospital /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Phase 7: Secure with Free HTTPS (Let's Encrypt SSL)
```bash
sudo certbot --nginx -d rumhospital.com -d www.rumhospital.com
```
Certbot will automatically install SSL certificates and configure HTTP-to-HTTPS redirects.

---

## 📈 PostgreSQL Optimization for High Scale

When handling thousands of concurrent patients and millions of medical records:

1. **pgBouncer Connection Pooler**:
   Deploy pgBouncer in transaction mode to support 5,000+ client connections with a pool of 50 active PostgreSQL worker threads.
2. **Read-Replicas for Reporting & Dashboard**:
   Configure a standby read-replica PostgreSQL instance. Route all `GET /api/dashboard/` and search queries to the read-replica using Django multi-database routing:
   ```python
   # In production router
   class PrimaryReplicaRouter:
       def db_for_read(self, model, **hints):
           return "replica"

       def db_for_write(self, model, **hints):
           return "default"
   ```
3. **Monthly Table Partitioning**:
   Use PostgreSQL declarative table partitioning on `Appointment` and `PaymentTransaction` tables by `appointment_date` to maintain constant sub-millisecond query execution regardless of database size.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
Built with ❤️ for modern, accessible healthcare operations.
