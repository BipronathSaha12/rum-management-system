import React, { useState } from 'react';
import {
  FileText,
  Search,
  KeyRound,
  FileCheck,
  AlertCircle,
  Download,
  Printer,
  X,
  HelpCircle,
  Building,
  User,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { DEMO_DIAGNOSTIC_REPORTS, HOSPITAL_INFO } from '../data/hospitalData';

export default function OnlineReportsSection() {
  const [hcn, setHcn] = useState("");
  const [invoice, setInvoice] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [activeReport, setActiveReport] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");

    if (!hcn.trim() || !invoice.trim()) {
      setError("Please enter both your Hospital Care Number (HCN) and Invoice Number.");
      return;
    }

    // Lookup in diagnostic database
    const found = DEMO_DIAGNOSTIC_REPORTS.find(
      (r) =>
        r.hcn.toLowerCase() === hcn.trim().toLowerCase() &&
        r.invoice.toLowerCase() === invoice.trim().toLowerCase() &&
        (!pin.trim() || r.pin === pin.trim())
    );

    if (found) {
      setActiveReport(found);
    } else {
      setError(
        "No diagnostic record found matching this HCN and Invoice combination. Please verify the numbers printed on your money receipt or click 'Try Demo Sample'."
      );
    }
  };

  const handleFillDemo = (demoIndex) => {
    const demo = DEMO_DIAGNOSTIC_REPORTS[demoIndex] || DEMO_DIAGNOSTIC_REPORTS[0];
    setHcn(demo.hcn);
    setInvoice(demo.invoice);
    setPin(demo.pin);
    setError("");
  };

  return (
    <section id="reports" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            Secure Digital Pathology & Diagnostics
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Download Online Diagnostic Reports
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Access your laboratory, biochemistry, and radiology reports from home using your Hospital Care Number (HCN) and Invoice PIN.
          </p>
        </div>

        {/* Portal Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          
          {/* Card Top Banner */}
          <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-brand-900 text-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-300">
                  RUM Hospital Laboratory Information System (LIS)
                </p>
                <h3 className="text-xl sm:text-2xl font-extrabold mt-1">
                  Patient Report Retrieval Portal
                </h3>
              </div>
              <div className="hidden sm:block p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                <FileCheck className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              All reports are digitally signed and verified by our clinical consultants.
            </p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSearch} className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* HCN Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hospital Care No. (HCN) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RUM-2026-00101"
                  value={hcn}
                  onChange={(e) => setHcn(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Found on top of your bill</span>
              </div>

              {/* Invoice Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Invoice / Bill No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INV-88901"
                  value={invoice}
                  onChange={(e) => setInvoice(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Printed on money receipt</span>
              </div>

              {/* Security PIN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Access PIN (4-Digits)
                </label>
                <input
                  type="password"
                  maxLength="6"
                  placeholder="e.g. 1234"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Optional for demo</span>
              </div>
            </div>

            {/* Quick Demo Pre-fill helper */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
                <span>Test Live Demo Samples:</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo(0)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-brand-500 text-brand-700 font-bold text-[11px] transition-colors"
                >
                  Load Sample 1 (CBC & Lipid)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo(1)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-brand-500 text-brand-700 font-bold text-[11px] transition-colors"
                >
                  Load Sample 2 (Renal Profile)
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search & View Diagnostic Report</span>
            </button>
          </form>

        </div>

        {/* Modal: Interactive Diagnostic Report Viewer */}
        {activeReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
              className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Bar */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">Digital Diagnostic Report</h3>
                    <p className="text-[11px] text-slate-500">Official Report Issued by RUM Hospital Pathology</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveReport(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Medical Report View */}
              <div id="printable-slip" className="p-6 overflow-y-auto space-y-6">
                
                {/* Hospital Institutional Header */}
                <div className="flex items-start justify-between pb-4 border-b-2 border-slate-800">
                  <div>
                    <h2 className="text-xl font-extrabold text-navy-900 tracking-tight">RUM HOSPITAL</h2>
                    <p className="text-[10px] text-slate-500 font-semibold">{HOSPITAL_INFO.address}</p>
                    <p className="text-[10px] text-slate-500">Helpline: {HOSPITAL_INFO.hotline} | {HOSPITAL_INFO.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      STATUS: VERIFIED & READY
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Barcode: *{activeReport.hcn}*</p>
                  </div>
                </div>

                {/* Patient Demographics Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Name</span>
                    <span className="font-bold text-navy-900">{activeReport.patientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">HCN Number</span>
                    <span className="font-mono font-bold text-brand-700">{activeReport.hcn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Age / Gender</span>
                    <span className="font-semibold text-slate-700">{activeReport.age} / {activeReport.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Invoice No</span>
                    <span className="font-mono font-semibold text-slate-700">{activeReport.invoice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Investigation</span>
                    <span className="font-bold text-navy-900 col-span-2">{activeReport.testName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Department</span>
                    <span className="font-semibold text-slate-700">{activeReport.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Sample Collected</span>
                    <span className="text-slate-600">{activeReport.collectionDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Report Finalized</span>
                    <span className="text-slate-600">{activeReport.reportingDate}</span>
                  </div>
                </div>

                {/* Lab Findings Results Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Quantitative Analytical Findings
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="py-2.5 px-3">Test Parameter</th>
                          <th className="py-2.5 px-3 text-center">Observed Value</th>
                          <th className="py-2.5 px-3">Unit</th>
                          <th className="py-2.5 px-3">Biological Reference Range</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeReport.results.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50/80">
                            <td className="py-2 px-3 font-semibold text-slate-800">{r.parameter}</td>
                            <td className="py-2 px-3 text-center font-bold text-navy-900">{r.value}</td>
                            <td className="py-2 px-3 text-slate-500">{r.unit}</td>
                            <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{r.refRange}</td>
                            <td className="py-2 px-3 text-right">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  r.status === "Normal" || r.status === "Optimal"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary & Pathologist Sign-off */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <span className="font-bold text-slate-700 block">Consultant Pathologist Impression:</span>
                  <p className="text-slate-600 italic leading-relaxed">
                    "{activeReport.summaryNote}"
                  </p>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Verified By: <strong>{activeReport.consultant}</strong></span>
                    <span>Electronic Signature Verified ✓</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Official Report</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
