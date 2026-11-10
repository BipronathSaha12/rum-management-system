import React from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  Calendar,
  Award,
  BookOpen,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export default function DoctorModal({ doctor, onClose, onBookAppointment }) {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-clinical-green" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Consultant Profile
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Header Profile Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border-4 border-brand-50 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span>{doctor.rating}</span>
                <span className="text-slate-500 font-normal">({doctor.reviewsCount} Patient Reviews)</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
                {doctor.name}
              </h2>
              
              <p className="text-sm font-semibold text-brand-600">
                {doctor.designation}
              </p>

              <p className="text-xs text-slate-600 font-medium">
                {doctor.qualifications}
              </p>

              <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {doctor.experience}
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {doctor.department}
                </span>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Professional Summary</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {doctor.bio}
            </p>
          </div>

          {/* Clinical Schedule & Room Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-brand-50/60 border border-brand-100 space-y-1">
              <div className="flex items-center gap-1.5 text-brand-700 font-bold">
                <MapPin className="w-4 h-4" />
                <span>Consultation Chamber</span>
              </div>
              <p className="text-navy-900 font-semibold">{doctor.room_number}</p>
              <p className="text-slate-500 text-[11px]">RUM Hospital OPD Wing</p>
            </div>

            <div className="p-3.5 rounded-xl bg-brand-50/60 border border-brand-100 space-y-1">
              <div className="flex items-center gap-1.5 text-brand-700 font-bold">
                <Clock className="w-4 h-4" />
                <span>Consultation Hours</span>
              </div>
              <p className="text-navy-900 font-semibold">{doctor.visiting_hours}</p>
              <p className="text-slate-500 text-[11px]">Token issued upon booking confirmation</p>
            </div>
          </div>

          {/* Consultation Fee Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Official OPD Visiting Fee
              </p>
              <p className="text-xl font-extrabold text-navy-900">
                ৳{doctor.visiting_fee.toLocaleString()}
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <p className="font-semibold text-emerald-600">✓ No Advance Payment Required</p>
              <p>Pay at hospital cash counter</p>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={`tel:${HOSPITAL_INFO.hotline}`}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
            <span>Serial by Phone: {HOSPITAL_INFO.hotline}</span>
          </a>

          <button
            onClick={() => {
              onClose();
              onBookAppointment(doctor);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Select Date & Book Slot</span>
          </button>
        </div>

      </div>
    </div>
  );
}
