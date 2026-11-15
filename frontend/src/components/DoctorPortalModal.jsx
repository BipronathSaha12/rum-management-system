import React, { useState, useEffect } from 'react';
import {
  X,
  Stethoscope,
  Lock,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  CreditCard,
  LogOut,
  RefreshCw,
  Building,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function DoctorPortalModal({ onClose, onNotification }) {
  const [currentUser, setCurrentUser] = useState(api.user);
  const [isDoctor, setIsDoctor] = useState(api.user?.role === 'Doctor');

  // Login form state
  const [email, setEmail] = useState('doctor.rahman@rumhospital.com');
  const [password, setPassword] = useState('doctor123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Doctor Dashboard state
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'slots' | 'billing'
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bills, setBills] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [completingId, setCompletingId] = useState(null);

  const fetchDoctorData = async () => {
    setDataLoading(true);
    try {
      const [aptsData, slotsData, billsData] = await Promise.all([
        api.getDoctorAppointments(),
        api.getDoctorSlots(),
        api.getBills()
      ]);
      setAppointments(aptsData || []);
      setSlots(slotsData || []);
      setBills(billsData || []);
    } catch (err) {
      console.error("Failed to load doctor clinical data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isDoctor) {
      fetchDoctorData();
    }
  }, [isDoctor]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(email, password);
      if (data.user.role !== 'Doctor' && data.user.role !== 'Admin') {
        throw new Error("This portal is reserved for registered physicians and clinical consultants.");
      }
      setCurrentUser(data.user);
      setIsDoctor(true);
      if (onNotification) onNotification(`Welcome back, Dr. ${data.user.full_name}!`);
    } catch (err) {
      setError(err.message || 'Invalid credentials or non-physician account.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setIsDoctor(false);
    if (onNotification) onNotification("Physician session signed out.");
  };

  const handleCompleteAppointment = async (aptId) => {
    setCompletingId(aptId);
    try {
      await api.completeAppointment(aptId);
      if (onNotification) {
        onNotification(`Appointment #${aptId} marked Completed. Invoice automatically generated.`);
      }
      // Refresh local list
      await fetchDoctorData();
    } catch (err) {
      setError(err.message || "Failed to update appointment status.");
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-teal-700/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-navy-900">
                  Doctor Clinical Portal
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  Physician Access
                </span>
              </div>
              <p className="text-xs text-slate-500">
                RUM Hospital Tertiary Care & Specialist Consultations
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isDoctor ? (
            /* Doctor Login View */
            <div className="max-w-md mx-auto py-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-navy-900">Physician Authentication</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Access assigned patient appointments, schedule slots, and consultation records.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Doctor Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor.rahman@rumhospital.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Pre-seeded Physician Credentials:</span>
                  <div className="font-mono text-[11px] text-teal-800 mt-0.5">
                    doctor.rahman@rumhospital.com / doctor123
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Sign In to Doctor Portal</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Logged-in Doctor Dashboard */
            <div className="space-y-6">
              {/* Doctor Profile Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-900 to-navy-900 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-200 font-extrabold text-xl">
                    DR
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold">{currentUser?.full_name || 'Dr. Mahbub Rahman'}</h4>
                      <span className="text-[10px] bg-teal-500/30 text-teal-200 font-bold px-2 py-0.5 rounded-full border border-teal-400/20">
                        Senior Consultant
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Cardiology & Vascular Center • Room 304, 3rd Floor • Visiting Fee: ৳1,500
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={fetchDoctorData}
                    disabled={dataLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-semibold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 gap-4">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                    activeTab === 'appointments'
                      ? 'text-teal-700 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Assigned Patients ({appointments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('slots')}
                  className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                    activeTab === 'slots'
                      ? 'text-teal-700 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Consultation Schedule & Slots ({slots.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('billing')}
                  className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                    activeTab === 'billing'
                      ? 'text-teal-700 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Consultation Revenue ({bills.length} Invoices)</span>
                </button>
              </div>

              {/* Tab 1: Assigned Patient Appointments */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-semibold">No assigned appointments found for today.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {appointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-teal-200 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-mono font-bold text-slate-500">
                                Apt #{apt.id}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  apt.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : apt.status === 'Confirmed'
                                    ? 'bg-teal-100 text-teal-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                                {apt.patient_name?.charAt(0) || 'P'}
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-navy-900">{apt.patient_name}</h5>
                                <p className="text-[11px] text-slate-500">
                                  {apt.appointment_date} at {apt.appointment_time}
                                </p>
                              </div>
                            </div>

                            {apt.symptoms && (
                              <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600">
                                <span className="font-semibold text-slate-700">Reported Symptoms: </span>
                                {apt.symptoms}
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              Doctor: {apt.doctor_name}
                            </span>
                            
                            {apt.status !== 'Completed' ? (
                              <button
                                onClick={() => handleCompleteAppointment(apt.id)}
                                disabled={completingId === apt.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                              >
                                {completingId === apt.id ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                                <span>Mark Completed & Bill</span>
                              </button>
                            ) : (
                              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Consultation Complete</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Consultation Schedule & Slots */}
              {activeTab === 'slots' && (
                <div className="space-y-4">
                  <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100 text-xs text-teal-900 flex items-center justify-between">
                    <span>
                      Total configured slots: <strong>{slots.length}</strong> | Available for online booking:{' '}
                      <strong>{slots.filter((s) => !s.is_booked).length}</strong>
                    </span>
                    <span className="text-[11px] text-teal-700 font-semibold">Real-Time Row Locking</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {slots.map((s) => (
                      <div
                        key={s.id}
                        className={`p-3 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                          s.is_booked
                            ? 'bg-slate-50 border-slate-200 text-slate-400'
                            : 'bg-white border-teal-200 text-slate-700 hover:border-teal-400'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-navy-900">{s.start_time} - {s.end_time}</div>
                          <div className="text-[10px] text-slate-500">{s.date}</div>
                        </div>
                        <div className="mt-2">
                          {s.is_booked ? (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              Booked by Patient #{s.booked_by}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Available
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Consultation Invoices & Revenue */}
              {activeTab === 'billing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-teal-50 border border-teal-100">
                      <div className="text-xs text-teal-700 font-semibold">Total Consultations</div>
                      <div className="text-2xl font-extrabold text-teal-900 mt-1">{bills.length}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="text-xs text-emerald-700 font-semibold">Standard Consultation Fee</div>
                      <div className="text-2xl font-extrabold text-emerald-900 mt-1">৳1,500</div>
                    </div>
                    <div className="p-4 rounded-xl bg-navy-50 border border-navy-100">
                      <div className="text-xs text-navy-700 font-semibold">Gross Consultation Billed</div>
                      <div className="text-2xl font-extrabold text-navy-900 mt-1">
                        ৳{(bills.length * 1500).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Bill ID</th>
                          <th className="p-3">Patient Name</th>
                          <th className="p-3">Fee</th>
                          <th className="p-3">Discount</th>
                          <th className="p-3">Total Payable</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bills.map((bill) => (
                          <tr key={bill.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono font-bold">#{bill.id}</td>
                            <td className="p-3 font-semibold text-navy-900">{bill.patient_name}</td>
                            <td className="p-3">৳{bill.consultation_fee}</td>
                            <td className="p-3">৳{bill.discount}</td>
                            <td className="p-3 font-bold text-emerald-700">৳{bill.total_amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
