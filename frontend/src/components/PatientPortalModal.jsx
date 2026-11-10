import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  Phone,
  Calendar,
  LogOut,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function PatientPortalModal({ onClose, onNotification }) {
  const [isLogin, setIsLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState(api.user);

  // Login form state
  const [email, setEmail] = useState("patient.john@gmail.com");
  const [password, setPassword] = useState("patient123");

  // Register form state
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.login(email, password);
      setCurrentUser(data.user);
      if (onNotification) onNotification(`Welcome back, ${data.user.full_name}!`);
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.register({
        full_name: regFullName,
        email: regEmail,
        phone_number: regPhone,
        password: regPassword,
      });

      // Auto login
      const data = await api.login(regEmail, regPassword);
      setCurrentUser(data.user);
      if (onNotification) onNotification("Registration successful! Welcome to RUM Hospital.");
    } catch (err) {
      setError(err.message || "Registration failed. Email or phone may already exist.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    if (onNotification) onNotification("You have been signed out.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">
                {currentUser ? "Patient Account Dashboard" : "RUM Patient Portal"}
              </h3>
              <p className="text-[11px] text-slate-500">Secure Healthcare Records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6">
          {currentUser ? (
            /* Logged-in Profile View */
            <div className="space-y-5">
              <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
                  {currentUser.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-navy-900">
                    {currentUser.full_name}
                  </h4>
                  <p className="text-xs text-brand-700 font-semibold">
                    {currentUser.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold bg-white px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                    Role: {currentUser.role || "Patient"}
                  </span>
                </div>
              </div>

              {/* Patient Quick Links */}
              <div className="space-y-2 text-xs">
                <a
                  href="#doctors"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-semibold text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    <span>Book New Doctor Consultation</span>
                  </span>
                  <span>→</span>
                </a>

                <a
                  href="#reports"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-semibold text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>View Diagnostic Lab Reports</span>
                  </span>
                  <span>→</span>
                </a>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Patient Portal</span>
              </button>
            </div>
          ) : (
            /* Login & Register Toggle */
            <div>
              {/* Tab Switcher */}
              <div className="flex border-b border-slate-200 mb-5">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                  }}
                  className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
                    isLogin
                      ? "border-brand-600 text-brand-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Sign In (Existing Patient)
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                  }}
                  className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
                    !isLogin
                      ? "border-brand-600 text-brand-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Register (New Patient)
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {isLogin ? (
                /* Login Form */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Account Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Sign In to Portal</span>
                    )}
                  </button>

                  <div className="pt-2 text-center text-[11px] text-slate-400">
                    Sample login: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">patient.john@gmail.com</code> / <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">patient123</code>
                  </div>
                </form>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="tanvir@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1712 000000"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Choose Password (min 6 chars)</label>
                    <input
                      type="password"
                      required
                      minLength="6"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Complete Registration</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
