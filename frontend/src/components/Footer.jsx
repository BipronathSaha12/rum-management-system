import React from 'react';
import {
  Plus,
  Phone,
  Mail,
  MapPin,
  Ambulance,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { HOSPITAL_INFO, DEPARTMENTS } from '../data/hospitalData';

export default function Footer({ onOpenBooking, onOpenPortal }) {
  return (
    <footer className="bg-navy-950 text-slate-300 text-xs border-t border-slate-800">
      
      {/* Top Emergency CTA Strip */}
      <div className="bg-gradient-to-r from-red-700 to-clinical-emergency text-white py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Ambulance className="w-6 h-6 animate-pulse" />
            <div>
              <p className="font-extrabold text-sm sm:text-base">
                24 Hours Emergency Trauma & Ambulance Service
              </p>
              <p className="text-xs text-red-100">
                Immediate doctor response & critical care admission: Hotline {HOSPITAL_INFO.hotline}
              </p>
            </div>
          </div>
          <a
            href={`tel:${HOSPITAL_INFO.hotline}`}
            className="bg-white text-clinical-emergency hover:bg-red-50 font-black px-5 py-2 rounded-xl text-xs shadow-md transition-colors"
          >
            Call {HOSPITAL_INFO.hotline}
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">RUM</span>
                <span className="text-xl font-bold text-brand-400 tracking-tight ml-1">HOSPITAL</span>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Tertiary Healthcare Center
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              RUM Hospital is a multi-disciplinary tertiary care corporate hospital dedicated to providing international standard clinical treatments, modern diagnostics, and compassionate patient healing in Bangladesh.
            </p>

            <div className="flex items-center gap-2 pt-2 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified ISO 9001:2015 Healthcare Facility</span>
            </div>
          </div>

          {/* Clinical Departments Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Centers of Excellence
            </h4>
            <ul className="space-y-2 text-slate-400">
              {DEPARTMENTS.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <a href="#doctors" className="hover:text-white transition-colors">
                    {dept.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Patient Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Patient Services
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#doctors" className="hover:text-white transition-colors">
                  Find a Doctor
                </a>
              </li>
              <li>
                <a href="#reports" className="hover:text-white transition-colors">
                  Online Diagnostic Reports
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-white transition-colors">
                  Health Check-Up Packages
                </a>
              </li>
              <li>
                <button onClick={onOpenPortal} className="hover:text-white transition-colors text-left">
                  Patient Portal Login
                </button>
              </li>
              <li>
                <a href="#emergency" className="hover:text-white transition-colors">
                  24/7 Emergency & ICU
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Location & Directions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Hospital Contact Info
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{HOSPITAL_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Hotline: {HOSPITAL_INFO.hotline} | PABX: {HOSPITAL_INFO.telephone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{HOSPITAL_INFO.email}</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenBooking(null)}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors"
              >
                Schedule Appointment Online
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© 2026 RUM Hospital. All Rights Reserved. Built for high-volume hospital operations.</p>
          <p className="flex items-center gap-1">
            <span>Clinical Healthcare Architecture</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>Dedicated to Patient Well-being</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
