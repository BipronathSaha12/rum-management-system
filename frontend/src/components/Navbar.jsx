import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import rumLogo from '../public/RUM_logo.png';
import {
  Menu,
  X,
  Plus,
  Calendar,
  FileText,
  User,
  HeartPulse,
  PhoneCall,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export default function Navbar({ onOpenPortal, onOpenBooking }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Find a Doctor", href: "#doctors" },
    { name: "Departments", href: "#departments" },
    { name: "Health Packages", href: "#packages" },
    { name: "Online Reports", href: "#reports" },
    { name: "Emergency Care", href: "#emergency" },
    { name: "Contact & Location", href: "#contact" },
  ];

  // Prevent background scrolling and enable Escape key to close when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const mobileDrawer = (
    <div
      className={`fixed inset-0 z-50 xl:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
        }`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Full-Screen Darkened Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Solid Opaque White Slide-Out Drawer (Portal mounted directly to body to prevent stacking context or background text bleeding) */}
      <div
        className={`fixed top-0 right-0 z-50 w-full max-w-xs sm:max-w-sm h-screen h-[100dvh] bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <img
                src={rumLogo}
                alt="RUM Hospital Official Logo"
                className="w-10 h-10 rounded-xl object-contain shadow-xs bg-white border border-slate-100 shrink-0"
              />
              <div>
                <span className="font-extrabold text-navy-900 tracking-tight text-base whitespace-nowrap">RUM HOSPITAL</span>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider -mt-0.5 whitespace-nowrap">Tertiary Care</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              title="Close navigation menu"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Close navigation menu</span>
            </button>
          </div>

          {/* Emergency Pill inside Mobile Drawer */}
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-700 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-extrabold uppercase text-red-700 tracking-wider">24/7 Emergency</p>
                <p className="text-sm font-extrabold text-navy-900">Hotline: {HOSPITAL_INFO.hotline}</p>
              </div>
            </div>
            <a
              href={`tel:${HOSPITAL_INFO.hotline}`}
              aria-label={`Call 24/7 emergency hotline ${HOSPITAL_INFO.hotline}`}
              className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors shrink-0"
            >
              Call
            </a>
          </div>

          {/* Nav Links - High contrast crisp cards on solid white background */}
          <div className="mt-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 px-1 mb-2">
              Hospital Navigation
            </p>
            <nav aria-label="Mobile Drawer Navigation" className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="flex items-center justify-between px-3.5 py-3 text-sm font-bold text-navy-900 rounded-xl bg-slate-50/90 hover:bg-brand-50 hover:text-brand-700 border border-slate-100 hover:border-brand-200 transition-all group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-6 border-t border-slate-100 space-y-3 mt-6">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPortal();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <User className="w-4 h-4 text-brand-600" aria-hidden="true" />
            <span>Patient Portal Login</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking(null);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold shadow-md shadow-brand-700/30 transition-colors"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Book Doctor Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 2xl:gap-6">

          {/* Brand Logo - Fixed No-Shrink Container to Prevent Collisions */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <img
              src={rumLogo}
              alt="RUM Hospital Official Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain shadow-md shadow-slate-200 group-hover:scale-105 transition-transform bg-white border border-slate-100 shrink-0"
            />
            <div className="shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xl 2xl:text-2xl font-extrabold tracking-tight text-navy-900 whitespace-nowrap">
                  RUM
                </span>
                <span className="text-xl 2xl:text-2xl font-bold tracking-tight text-brand-600 whitespace-nowrap">
                  HOSPITAL
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 -mt-1 whitespace-nowrap hidden sm:block">
                Tertiary Care & Medical Center
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links (shrink-0 prevents flexbox from ever shrinking nav or overflowing links) */}
          <nav aria-label="Primary Navigation" className="hidden xl:flex items-center gap-1 2xl:gap-2.5 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors py-1.5 px-2 2xl:px-2.5 rounded-lg whitespace-nowrap shrink-0"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions (shrink-0 with explicit left margin guarantees Patient Portal NEVER touches Contact & Location) */}
          <div className="hidden sm:flex items-center gap-2 2xl:gap-3 shrink-0 ml-auto xl:ml-4 2xl:ml-8">
            <button
              onClick={onOpenPortal}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 2xl:px-3.5 2xl:py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-subtle whitespace-nowrap shrink-0"
            >
              <User className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Patient Portal</span>
            </button>

            <button
              onClick={() => onOpenBooking(null)}
              className="flex items-center gap-1.5 2xl:gap-2 text-xs font-bold px-3.5 py-2 2xl:px-4 2xl:py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white shadow-md shadow-brand-600/25 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Book Appointment</span>
            </button>
          </div>

              {/* Mobile & Tablet Navigation Controls (Visible below xl / 1280px) */}
              <div className="flex xl:hidden items-center gap-2 shrink-0">
                <button
                  onClick={() => onOpenBooking(null)}
                  className="bg-brand-700 hover:bg-brand-800 text-white p-2 rounded-lg text-xs font-bold flex items-center justify-center shadow-sm transition-colors sm:hidden"
                  title="Book Doctor Appointment"
                  aria-label="Book Doctor Appointment"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">Book Doctor Appointment</span>
                </button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                  aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  title={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
                  <span className="sr-only">{mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Render Mobile Drawer directly into document.body to break out of containing blocks & guarantee 100% opaque full-viewport coverage */}
          {typeof document !== 'undefined' ? createPortal(mobileDrawer, document.body) : mobileDrawer}
        </div>
        );
}
