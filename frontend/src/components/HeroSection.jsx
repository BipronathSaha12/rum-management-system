import React from 'react';
import {
  Calendar,
  Search,
  FileText,
  ShieldCheck,
  Award,
  Users,
  Activity,
  ArrowRight
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export default function HeroSection({ onOpenBooking, onSearchClick }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-100/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-brand-200/80 shadow-subtle text-xs font-semibold text-brand-800">
              <span className="w-2 h-2 rounded-full bg-clinical-green animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>Tertiary Level Medical Excellence & Patient Safety</span>
            </div>

            {/* Primary Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-navy-900 tracking-tight leading-tight">
              Compassionate Care,{' '}
              <span className="bg-gradient-to-r from-brand-600 to-teal-600 bg-clip-text text-transparent">
                World-Class
              </span>{' '}
              Medical Expertise.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Welcome to <span className="font-semibold text-navy-900">RUM Hospital</span>. We bring together Bangladesh's foremost medical consultants, state-of-the-art diagnostic imaging, and 24/7 dedicated critical care units.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={() => onOpenBooking(null)}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#reports"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-brand-700 font-bold text-sm border border-slate-300 shadow-subtle transition-all"
              >
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Online Diagnostic Reports</span>
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-200/80 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-navy-900">120+</p>
                <p className="text-xs text-slate-500 font-medium">Renowned Doctors</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-navy-900">24/7</p>
                <p className="text-xs text-slate-500 font-medium">ICU & Emergency</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-navy-900">99.4%</p>
                <p className="text-xs text-slate-500 font-medium">Patient Satisfaction</p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Trust Card / Doctor Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Doctor Visual Card */}
              <div className="rounded-3xl overflow-hidden bg-white shadow-2xl border border-slate-200/80 p-3 sm:p-4">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-16/11 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
                    alt="Senior Consultant at RUM Hospital"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                  
                  {/* Floating Doctor Tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                      Department of Cardiology
                    </p>
                    <p className="text-base sm:text-lg font-bold">Dr. Mahbub Rahman</p>
                    <p className="text-xs text-slate-200">MBBS, FCPS, MD, MRCP (UK), FACC</p>
                  </div>
                </div>

                {/* Floating Quick Feature Strip */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Available Today</p>
                      <p className="text-[11px] text-slate-500">OPD Room 304 (5 PM - 9 PM)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenBooking(1)}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs transition-colors"
                  >
                    Select Slot
                  </button>
                </div>
              </div>

              {/* Floating Live Emergency Badge */}
              <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-white p-3 rounded-2xl shadow-xl border border-slate-200/90 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-clinical-emergency flex items-center justify-center font-black animate-bounce">
                  🚨
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Emergency Desk</p>
                  <p className="text-sm font-extrabold text-navy-900">Hotline 10602</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
