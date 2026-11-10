import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileCheck2,
  Printer,
  CheckCircle,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { DOCTORS, TIME_SLOTS, HOSPITAL_INFO } from '../data/hospitalData';
import { api } from '../services/api';

export default function AppointmentBookingModal({
  selectedDoctor,
  onClose,
  onSuccess
}) {
  const [doctorId, setDoctorId] = useState(selectedDoctor ? selectedDoctor.id : (DOCTORS[0]?.id || 1));
  const activeDoctor = DOCTORS.find((d) => d.id === Number(doctorId)) || DOCTORS[0];

  // Minimum date is today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [appointmentDate, setAppointmentDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1]); // Default 05:00 PM

  // Patient inputs
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Male");
  const [symptoms, setSymptoms] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!patientName.trim()) {
      setError("Please enter the patient's full name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please provide a valid contact mobile number.");
      return;
    }

    setLoading(true);

    try {
      // Build appointment payload matching DRF backend schema
      const payload = {
        doctor: activeDoctor.id,
        appointment_date: appointmentDate,
        appointment_time: selectedSlot.replace(" PM", ":00").replace(" AM", ":00"),
        status: "Confirmed",
        patient_name: patientName,
        phone_number: phone,
      };

      const result = await api.bookAppointment(payload);

      // Create rich digital confirmation slip
      const confirmation = {
        serialNumber: `RUM-APT-${Math.floor(10000 + Math.random() * 90000)}`,
        tokenNumber: Math.floor(1 + Math.random() * 25),
        doctorName: activeDoctor.name,
        department: activeDoctor.department,
        visitingFee: activeDoctor.visiting_fee,
        roomNumber: activeDoctor.room_number,
        appointmentDate,
        appointmentTime: selectedSlot,
        patientName,
        phone,
        bookingTime: new Date().toLocaleString(),
      };

      setConfirmedBooking(confirmation);
      if (onSuccess) onSuccess("Appointment confirmed successfully!");
    } catch (err) {
      setError(err.message || "Could not complete appointment booking.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">
                {confirmedBooking ? "Appointment Confirmed" : "Book Doctor Appointment"}
              </h3>
              <p className="text-[11px] text-slate-500">RUM Hospital OPD Serial System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {confirmedBooking ? (
            /* Digital Booking Slip View */
            <div id="printable-slip" className="space-y-6">
              <div className="text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-lg font-extrabold text-navy-900">
                  Appointment Booked Successfully!
                </h4>
                <p className="text-xs text-emerald-700 font-medium">
                  Serial confirmation sent via SMS to {confirmedBooking.phone}
                </p>
              </div>

              {/* Digital Slip Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <p className="font-extrabold text-navy-900 text-sm">RUM HOSPITAL</p>
                    <p className="text-[10px] text-slate-500">OPD Consultation Serial Slip</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-brand-600 text-white font-extrabold px-2.5 py-1 rounded-md text-xs">
                      Token #{confirmedBooking.tokenNumber}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Name</span>
                    <span className="font-bold text-navy-900">{confirmedBooking.patientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Serial No</span>
                    <span className="font-mono font-bold text-navy-900">{confirmedBooking.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Specialist</span>
                    <span className="font-bold text-navy-900">{confirmedBooking.doctorName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Department</span>
                    <span className="font-semibold text-slate-800">{confirmedBooking.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Date & Time</span>
                    <span className="font-bold text-brand-700">
                      {confirmedBooking.appointmentDate} at {confirmedBooking.appointmentTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">OPD Room</span>
                    <span className="font-semibold text-slate-800">{confirmedBooking.roomNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Visiting Fee</span>
                    <span className="font-extrabold text-navy-900">৳{confirmedBooking.visitingFee} (Pay at Counter)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Issued At</span>
                    <span className="text-slate-500">{confirmedBooking.bookingTime}</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-200 text-center">
                  Please arrive 15 minutes prior to your allocated slot. For cancellation, call {HOSPITAL_INFO.hotline}.
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Select Doctor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selected Specialist Consultant
                </label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  {DOCTORS.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.department} (৳{doc.visiting_fee})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-600" />
                  <span>{activeDoctor.room_number} • {activeDoctor.visiting_hours}</span>
                </p>
              </div>

              {/* Date & Slot Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Patient Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohammad Rahim"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Mobile Phone & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (For SMS Confirmation) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+880 1712 345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Child">Child / Pediatric</option>
                  </select>
                </div>
              </div>

              {/* Optional Email & Symptoms */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="patient@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Consultation / Symptoms (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Briefly describe chest pain, migraine, follow-up, etc."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              {/* Visiting Fee Notice */}
              <div className="p-3 bg-brand-50/70 rounded-xl border border-brand-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Visiting Fee:</span>
                  <span className="font-extrabold text-navy-900 ml-1.5">
                    ৳{activeDoctor.visiting_fee.toLocaleString()}
                  </span>
                </div>
                <span className="text-emerald-700 font-bold text-[11px]">
                  Pay at OPD counter
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Confirm Doctor Appointment</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
