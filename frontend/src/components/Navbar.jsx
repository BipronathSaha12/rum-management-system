import React, { useState } from 'react';
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

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-navy-900">
                  RUM
                </span>
                <span className="text-2xl font-bold tracking-tight text-brand-600">
                  HOSPITAL
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 -mt-1">
                Tertiary Care & Medical Center
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors py-2"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenPortal}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-subtle"
            >
              <User className="w-4 h-4 text-brand-600" />
              <span>Patient Portal</span>
            </button>

            <button
              onClick={() => onOpenBooking(null)}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white shadow-md shadow-brand-600/25 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenBooking(null)}
              className="bg-brand-600 text-white p-2 rounded-lg text-xs font-bold flex items-center justify-center shadow-sm"
              title="Book Appointment"
            >
              <Calendar className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-Out Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 w-full max-w-xs h-full bg-white shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-navy-900 tracking-tight">RUM HOSPITAL</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Emergency Pill inside Mobile Drawer */}
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-clinical-emergency" />
              <div>
                <p className="text-[10px] font-bold uppercase text-red-600">24/7 Emergency</p>
                <p className="text-sm font-extrabold text-navy-900">Hotline: {HOSPITAL_INFO.hotline}</p>
              </div>
            </div>
            <a
              href={`tel:${HOSPITAL_INFO.hotline}`}
              className="bg-clinical-emergency text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs"
            >
              Call
            </a>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="flex items-center justify-between px-3 py-3 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50 hover:text-brand-600 transition-colors"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPortal();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <User className="w-4 h-4 text-brand-600" />
            <span>Patient Portal Login</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking(null);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-600/30 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Doctor Appointment</span>
          </button>
        </div>
      </div>
    </header>
  );
}
