import React from 'react';
import {
  HeartPulse,
  Brain,
  Activity,
  Stethoscope,
  Bone,
  Baby,
  Users,
  Scissors,
  ArrowRight
} from 'lucide-react';
import { DEPARTMENTS } from '../data/hospitalData';

export default function DepartmentsSection({ onSelectDepartment }) {
  const iconMap = {
    HeartPulse: HeartPulse,
    Brain: Brain,
    Activity: Activity,
    Stethoscope: Stethoscope,
    Bone: Bone,
    Baby: Baby,
    Users: Users,
    Scissors: Scissors,
  };

  return (
    <section id="departments" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">
              Centers of Clinical Excellence
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Specialized Medical Departments
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl">
              Equipped with international standard catheterization labs, laminar airflow operation suites, and dedicated intensive care units.
            </p>
          </div>

          <a
            href="#doctors"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>View All Clinical Consultants</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 8 Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DEPARTMENTS.map((dept) => {
            const Icon = iconMap[dept.icon] || Stethoscope;
            return (
              <div
                key={dept.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {dept.code}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {dept.doctorsCount} Specialists
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                    {dept.name}
                  </h3>
                  
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onSelectDepartment(dept.name)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 py-2 rounded-lg bg-brand-50/60 hover:bg-brand-100/70 transition-colors"
                  >
                    <span>View Doctors</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
