import React from 'react';
import {
  Home,
  UserSearch,
  CalendarPlus,
  FileText,
  PhoneCall
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export default function MobileBottomNav({ onOpenBooking, onOpenPortal }) {
  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg sm:hidden">
      <div className="grid grid-cols-5 gap-1 text-center">
        
        {/* Home */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center text-slate-500 hover:text-brand-600 active:scale-95 transition-all"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        {/* Doctors */}
        <button
          onClick={() => handleScrollTo('doctors')}
          className="flex flex-col items-center justify-center text-slate-500 hover:text-brand-600 active:scale-95 transition-all"
        >
          <UserSearch className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Doctors</span>
        </button>

        {/* Book Appointment (Hero button) */}
        <button
          onClick={() => onOpenBooking(null)}
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/40 active:scale-95 transition-all">
            <CalendarPlus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold text-brand-700 mt-0.5">Book</span>
        </button>

        {/* Reports */}
        <button
          onClick={() => handleScrollTo('reports')}
          className="flex flex-col items-center justify-center text-slate-500 hover:text-brand-600 active:scale-95 transition-all"
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Reports</span>
        </button>

        {/* Emergency Hotline */}
        <a
          href={`tel:${HOSPITAL_INFO.hotline}`}
          className="flex flex-col items-center justify-center text-clinical-emergency active:scale-95 transition-all"
        >
          <PhoneCall className="w-5 h-5 mb-0.5 animate-pulse" />
          <span className="text-[10px] font-black">10602</span>
        </a>

      </div>
    </nav>
  );
}
