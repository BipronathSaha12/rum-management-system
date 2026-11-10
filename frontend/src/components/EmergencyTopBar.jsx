import React from 'react';
import { Phone, Ambulance, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export default function EmergencyTopBar() {
  return (
    <div className="bg-navy-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Emergency & Ambulance Hotlines */}
        <div className="flex items-center flex-wrap justify-center sm:justify-start gap-4">
          <a
            href={`tel:${HOSPITAL_INFO.hotline}`}
            className="flex items-center gap-1.5 bg-clinical-emergency hover:bg-red-700 text-white font-bold px-2.5 py-0.5 rounded-full transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            <span>24/7 Hotline: {HOSPITAL_INFO.hotline}</span>
          </a>

          <a
            href={`tel:${HOSPITAL_INFO.ambulance}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Ambulance className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden xs:inline">Ambulance:</span>
            <span className="font-semibold">{HOSPITAL_INFO.ambulance}</span>
          </a>
        </div>

        {/* Right: Hospital Hours, Location & Quality Badge */}
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>OPD: 8:00 AM - 10:00 PM</span>
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span className="truncate max-w-[200px] lg:max-w-none">RUM Square, Dhaka-1204</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ISO 9001:2015 & Tertiary Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
