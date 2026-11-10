# 🏥 RUM Hospital Modern React Frontend

Welcome to the **RUM Hospital Web Application & Digital Patient Portal**, built with **React 18**, **Vite**, **Tailwind CSS**, and **Lucide React**.

This frontend is designed as a **clinical-grade, mobile-responsive, light-themed hospital portal** modeled after top-tier tertiary corporate hospitals (such as **Asgar Ali Hospital**).

---

## 📱 Mobile-First & Ultra-Responsive Design

The entire user interface is engineered with a **fluid mobile-first grid system** that adapts across every device profile:
- 📱 **Mobile Screens (320px – 640px)**: Single-column stacked cards, full-width touch targets (minimum 44x44px), slide-out navigation drawer with smooth backdrop, and a **sticky mobile bottom navigation bar** with 1-tap access to Home, Doctors, Book Appointment, Diagnostic Reports, and 24/7 Hotline 10602.
- 💻 **Tablets & Laptops (768px – 1024px)**: Dual-column responsive layouts, floating quick emergency hotlines, and collapsible filter sidebars.
- 🖥️ **Desktop & Ultrawide (1280px+)**: Multi-column specialty matrices, doctor profile cards with instant slot pickers, and interactive hospital campus navigation.

---

## 🎨 Clinical Light-Theme Design System

- **Primary Medical Blue (`#0284c7`, `#0369a1`)**: Symbolizes healthcare authority, sterile precision, and trust.
- **Deep Clinical Navy (`#0f172a`, `#020617`)**: High-contrast typography for medical readability.
- **Emergency Crimson (`#dc2626`, `#b91c1c`)**: Rapid identification of 24/7 emergency hotlines, ambulance services, and trauma units.
- **Clinical Emerald (`#059669`)**: Status indicators for available doctor slots, verified pathology reports, and confirmed bookings.
- **Canvas (`#ffffff`, `#f8fafc`)**: Crisp, sterile, shadow-elevated surfaces.

---

## 🧱 Component Architecture

```
frontend/src/
├── components/
│   ├── EmergencyTopBar.jsx       # 24/7 Hotline 10602, ambulance & hospital hours
│   ├── Navbar.jsx                # Sticky header, desktop links & mobile drawer menu
│   ├── HeroSection.jsx           # High-impact banner with trust badges & CTAs
│   ├── FourPillars.jsx           # 4 rapid action cards (Doctors, Reports, Packages, Emergency)
│   ├── QuickSearchEngine.jsx     # Live multi-parameter consultant filter bar
│   ├── HospitalStats.jsx         # Milestone metrics ticker (Patients, Doctors, ICU Beds)
│   ├── DepartmentsSection.jsx    # 8 clinical centers of excellence with specialist counts
│   ├── DoctorDirectory.jsx       # Doctor catalog with real-time search & sorting
│   ├── DoctorModal.jsx           # Consultant profile modal with bio & chamber room info
│   ├── AppointmentBookingModal.jsx# 3-step appointment scheduling with digital slip
│   ├── OnlineReportsSection.jsx  # Asgar Ali replica online diagnostic report lookup
│   ├── HealthPackagesSection.jsx # Comprehensive preventive health checkup bundles
│   ├── EmergencyTraumaSection.jsx# 24/7 critical care, CCU, NICU & trauma response
│   ├── PatientPortalModal.jsx    # Patient login, registration & account overview
│   ├── ContactLocationSection.jsx# Campus directions, GPS, OPD hours & PABX
│   ├── Footer.jsx                # Institutional footer with accreditation & sitemap
│   ├── MobileBottomNav.jsx       # Sticky 5-button mobile navigation bar
│   └── ToastNotification.jsx     # Action feedback toast notification
├── data/
│   └── hospitalData.js           # Comprehensive clinical master data & demo reports
├── services/
│   └── api.js                    # REST API client connecting to Django backend
├── App.jsx                       # Root view layout & modal orchestration
├── main.jsx                      # Vite entrypoint
└── index.css                     # Tailwind directives & print styles
```

---

## 🚀 Running Locally

```bash
# 1. Enter frontend directory
cd hospital_management_api/frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```
