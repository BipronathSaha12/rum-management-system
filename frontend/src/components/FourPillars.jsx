import React from 'react';
import {
  UserSearch,
  FileText,
  PackagePlus,
  Ambulance,
  ArrowRight
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export default function FourPillars({ onSelectTab }) {
  const pillars = [
    {
      id: "doctors",
      title: "Find a Doctor",
      subtitle: "Browse 120+ clinical consultants across 35 medical specialties.",
      icon: UserSearch,
      iconBg: "bg-blue-100 text-brand-700",
      borderHover: "hover:border-brand-500",
      cta: "Browse Directory",
      href: "#doctors",
    },
    {
      id: "reports",
      title: "Online Diagnostic Reports",
      subtitle: "Download verified pathology & radiology reports securely with HCN.",
      icon: FileText,
      iconBg: "bg-emerald-100 text-emerald-700",
      borderHover: "hover:border-emerald-500",
      cta: "Get My Report",
      href: "#reports",
    },
    {
      id: "packages",
      title: "Health Check-up Packages",
      subtitle: "Preventive comprehensive wellness screening for you & your family.",
      icon: PackagePlus,
      iconBg: "bg-amber-100 text-amber-700",
      borderHover: "hover:border-amber-500",
      cta: "View Packages",
      href: "#packages",
    },
    {
      id: "emergency",
      title: "24/7 Emergency & Trauma",
      subtitle: `Immediate critical care, CCU, NICU & rapid ambulance: ${HOSPITAL_INFO.hotline}`,
      icon: Ambulance,
      iconBg: "bg-red-100 text-clinical-emergency",
      borderHover: "hover:border-red-500",
      cta: "Emergency Info",
      href: "#emergency",
      emergency: true,
    },
  ];

  return (
    <section className="relative -mt-6 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`group bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between ${item.borderHover}`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-bold text-navy-900 group-hover:text-brand-700 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-normal">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600 group-hover:text-brand-700">
                <span>{item.cta}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
