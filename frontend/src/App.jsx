import React, { useState } from 'react';
import EmergencyTopBar from './components/EmergencyTopBar';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FourPillars from './components/FourPillars';
import HospitalStats from './components/HospitalStats';
import DepartmentsSection from './components/DepartmentsSection';
import DoctorDirectory from './components/DoctorDirectory';
import OnlineReportsSection from './components/OnlineReportsSection';
import HealthPackagesSection from './components/HealthPackagesSection';
import EmergencyTraumaSection from './components/EmergencyTraumaSection';
import ContactLocationSection from './components/ContactLocationSection';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import DoctorModal from './components/DoctorModal';
import AppointmentBookingModal from './components/AppointmentBookingModal';
import PatientPortalModal from './components/PatientPortalModal';
import ToastNotification from './components/ToastNotification';

export default function App() {
  // Modal states
  const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState(null);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  // Filter communication
  const [selectedDeptForFilter, setSelectedDeptForFilter] = useState("all");

  // Global toast notifications
  const [toastMessage, setToastMessage] = useState("");

  const handleOpenBooking = (doctor = null) => {
    setBookingDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  const handleBookPackage = (pkg) => {
    // Open booking modal and notify
    setIsBookingModalOpen(true);
    setToastMessage(`Booking initiated for ${pkg.title}. Choose your preferred date.`);
  };

  const handleSelectDepartment = (deptName) => {
    setSelectedDeptForFilter(deptName);
    const docSection = document.getElementById('doctors');
    if (docSection) {
      docSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-brand-100 selection:text-brand-900 pb-16 sm:pb-0">
      
      {/* 1. Top 24/7 Emergency & Ambulance Bar */}
      <EmergencyTopBar />

      {/* 2. Main Sticky Navigation with Mobile Drawer */}
      <Navbar
        onOpenPortal={() => setIsPortalModalOpen(true)}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 3. Hero Banner with Clinical Value Proposition */}
        <HeroSection
          onOpenBooking={handleOpenBooking}
          onSearchClick={() => {
            const el = document.getElementById('doctors');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* 4. Four Rapid Access Pillars (Find Doctor, Reports, Packages, Emergency) */}
        <FourPillars />

        {/* 5. Clinical Departments & Specialty Centers */}
        <DepartmentsSection onSelectDepartment={handleSelectDepartment} />

        {/* 6. Comprehensive Doctor Directory with Real-Time Multi-Filter */}
        <DoctorDirectory
          initialDepartment={selectedDeptForFilter}
          onSelectDoctorForBooking={(doc) => handleOpenBooking(doc)}
          onViewDoctorProfile={(doc) => setSelectedDoctorForProfile(doc)}
        />

        {/* 7. Online Diagnostic Reports Portal (HCN + Invoice PIN Engine) */}
        <OnlineReportsSection />

        {/* 8. Hospital Milestone Statistics & Quality Metrics */}
        <HospitalStats />

        {/* 9. Health Check-up Packages Section */}
        <HealthPackagesSection onBookPackage={handleBookPackage} />

        {/* 10. 24/7 Emergency & Critical Trauma Care Center */}
        <EmergencyTraumaSection />

        {/* 11. Campus Location, Directions & Contact Information */}
        <ContactLocationSection />
      </main>

      {/* 12. Institutional Institutional Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenPortal={() => setIsPortalModalOpen(true)}
      />

      {/* 13. Mobile Bottom Navigation (Sticky for Mobile screens) */}
      <MobileBottomNav
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenPortal={() => setIsPortalModalOpen(true)}
      />

      {/* Modals & Popups */}
      {selectedDoctorForProfile && (
        <DoctorModal
          doctor={selectedDoctorForProfile}
          onClose={() => setSelectedDoctorForProfile(null)}
          onBookAppointment={(doc) => handleOpenBooking(doc)}
        />
      )}

      {isBookingModalOpen && (
        <AppointmentBookingModal
          selectedDoctor={bookingDoctor}
          onClose={() => {
            setIsBookingModalOpen(false);
            setBookingDoctor(null);
          }}
          onSuccess={(msg) => setToastMessage(msg)}
        />
      )}

      {isPortalModalOpen && (
        <PatientPortalModal
          onClose={() => setIsPortalModalOpen(false)}
          onNotification={(msg) => setToastMessage(msg)}
        />
      )}

      {/* Global Toast Banner */}
      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />

    </div>
  );
}
