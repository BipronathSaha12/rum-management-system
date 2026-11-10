import React from 'react';
import {
  Ambulance,
  PhoneCall,
  HeartPulse,
  Activity,
  ShieldAlert,
  Flame,
  Clock,
  ArrowRight
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export default function EmergencyTraumaSection() {
  const emergencyServices = [
    {
      title: "Acute Stroke Fast-Track",
      desc: "Immediate CT angiography and intravenous thrombolysis team on 24/7 alert.",
      icon: Activity,
    },
    {
      title: "24/7 Primary Angioplasty (PPCI)",
      desc: "Emergency cardiac catheterization for acute heart attacks with door-to-balloon under 60 mins.",
      icon: HeartPulse,
    },
    {
      title: "Level-1 Trauma & Orthopedic Surgery",
      desc: "Equipped to handle multi-trauma road accidents, severe burns, and emergency neurosurgery.",
      icon: Flame,
    },
    {
      title: "Critical Care (ICU / CCU / NICU)",
      desc: "65+ high-dependency & intensive care beds backed by centralized hemodynamic monitoring.",
      icon: ShieldAlert,
    },
  ];

  return (
    <section id="emergency" className="py-16 bg-gradient-to-br from-red-50 via-white to-slate-50 border-b border-red-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Emergency Overview */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-xs font-bold text-red-700 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-clinical-emergency animate-ping" />
              <span>24 Hours Critical Care Services</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight leading-tight">
              Rapid Response Trauma & Emergency Care Center
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              When seconds count, <span className="font-semibold text-navy-900">RUM Hospital Emergency Desk</span> provides immediate stabilization, state-of-the-art life support, and seamless transfer to our critical care units.
            </p>

            {/* Emergency Hotline Callout Card */}
            <div className="p-6 rounded-2xl bg-clinical-emergency text-white shadow-xl shadow-red-600/25 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-red-100">
                    Hospital Emergency Helpline
                  </p>
                  <p className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
                    {HOSPITAL_INFO.hotline}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <PhoneCall className="w-8 h-8 animate-bounce" />
                </div>
              </div>

              <div className="pt-3 border-t border-red-500/80 flex items-center justify-between text-xs font-semibold text-red-100">
                <a
                  href={`tel:${HOSPITAL_INFO.hotline}`}
                  className="bg-white text-clinical-emergency font-extrabold px-4 py-2 rounded-xl shadow-xs hover:bg-red-50 transition-colors"
                >
                  Call Hotline 10602 Now
                </a>
                <a
                  href={`tel:${HOSPITAL_INFO.ambulance}`}
                  className="flex items-center gap-1 text-white underline hover:text-red-100"
                >
                  <Ambulance className="w-4 h-4" />
                  <span>Ambulance Direct</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: 4 Specialized Emergency Units Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {emergencyServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-clinical-emergency flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-navy-900">{srv.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed font-normal">
                    {srv.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
