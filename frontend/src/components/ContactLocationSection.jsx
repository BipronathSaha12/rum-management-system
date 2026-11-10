import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Ambulance,
  Compass,
  Building2,
  Share2
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export default function ContactLocationSection() {
  return (
    <section id="contact" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Visit & Contact RUM Hospital
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Location, Helpline & Visiting Hours
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Conveniently situated in central Dhaka with multi-level basement parking and dedicated emergency drive-through ramps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Address Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-900">Hospital Address</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {HOSPITAL_INFO.address}
                </p>
                <span className="text-[11px] text-brand-600 font-semibold block mt-1">
                  Near Central City Interchange • 24/7 Car Parking
                </span>
              </div>
            </div>

            {/* Helpline Numbers Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-900">Telephone & PABX Lines</h4>
                <p className="text-xs text-slate-600 mt-1">
                  General Inquiry: <strong className="text-navy-900">{HOSPITAL_INFO.telephone}</strong>
                </p>
                <p className="text-xs text-slate-600">
                  Doctor Serial Desk: <strong className="text-navy-900">10602</strong> (Ext: 101)
                </p>
                <p className="text-xs text-slate-600">
                  Email Desk: <span className="text-brand-600 font-medium">{HOSPITAL_INFO.email}</span>
                </p>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-900">Hospital Operating Hours</h4>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>OPD Specialist Clinics:</strong> {HOSPITAL_INFO.opdHours}
                </p>
                <p className="text-xs text-clinical-emergency font-bold mt-1">
                  <strong>Emergency & Trauma Center:</strong> {HOSPITAL_INFO.emergencyHours}
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Diagnostic Sample Collection:</strong> 7:00 AM - 11:00 PM Daily
                </p>
              </div>
            </div>

          </div>

          {/* Interactive Visual Map & Directions */}
          <div className="lg:col-span-7 bg-slate-100 rounded-3xl border border-slate-200/90 overflow-hidden shadow-card p-6 flex flex-col justify-between min-h-[380px] relative">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-bold text-slate-700 shadow-xs">
                <Compass className="w-3.5 h-3.5 text-brand-600" />
                <span>Interactive Campus Navigation</span>
              </div>
              <h3 className="text-lg font-bold text-navy-900">
                RUM Hospital Main Medical Complex
              </h3>
              <p className="text-xs text-slate-600">
                A 500-bed modern medical campus comprising Main Ward Tower, Specialist OPD Plaza, Diagnostic Complex, and Cardiac Surgery Center.
              </p>
            </div>

            {/* Campus Layout Badges */}
            <div className="my-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 text-xs">
                <p className="font-bold text-navy-900">Building A</p>
                <p className="text-[11px] text-slate-500">Emergency & Trauma</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 text-xs">
                <p className="font-bold text-navy-900">Building B</p>
                <p className="text-[11px] text-slate-500">Doctor OPD Chambers</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 text-xs">
                <p className="font-bold text-navy-900">Building C</p>
                <p className="text-[11px] text-slate-500">Diagnostics & Radiology</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 text-xs">
                <p className="font-bold text-navy-900">Tower D</p>
                <p className="text-[11px] text-slate-500">IPD Cabins & ICU</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 text-xs">
                <p className="font-bold text-navy-900">Basement 1 & 2</p>
                <p className="text-[11px] text-slate-500">Patient Parking Area</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 text-xs">
                <p className="font-bold text-navy-900">Pharmacy</p>
                <p className="text-[11px] text-slate-500">24/7 Ground Floor</p>
              </div>
            </div>

            {/* Bottom Map Direction Actions */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-600 font-medium">GPS Coordinates: 23.7104° N, 90.4125° E</span>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
              >
                Get Driving Directions
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
