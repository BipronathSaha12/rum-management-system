import React from 'react';
import {
  Users,
  Award,
  HeartPulse,
  Scissors,
  Ambulance,
  CheckCircle2
} from 'lucide-react';
import { HOSPITAL_METRICS } from '../data/hospitalData';

export default function HospitalStats() {
  const iconMap = {
    Users: Users,
    Award: Award,
    HeartPulse: HeartPulse,
    Scissors: Scissors,
    Ambulance: Ambulance,
    CheckCircle: CheckCircle2,
  };

  return (
    <section className="py-12 sm:py-16 bg-navy-900 text-white relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-800 border border-slate-700 text-xs font-semibold text-brand-300 mb-3">
            <span>RUM Hospital Impact & Milestones</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Decades of Clinical Excellence & Trusted Care
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Engineered with modern tertiary medical infrastructure to deliver compassionate healing at scale.
          </p>
        </div>

        {/* 6 Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {HOSPITAL_METRICS.map((metric, idx) => {
            const Icon = iconMap[metric.icon] || Award;
            return (
              <div
                key={idx}
                className="bg-navy-800/80 p-4 sm:p-5 rounded-2xl border border-slate-700/80 hover:border-brand-500/50 transition-all text-center flex flex-col items-center justify-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-navy-950 text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-brand-300 transition-colors">
                  {metric.value}
                </p>
                <p className="mt-1 text-[11px] sm:text-xs text-slate-400 font-medium leading-snug">
                  {metric.label}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
