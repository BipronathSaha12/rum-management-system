import React, { useState } from 'react';
import {
  PackagePlus,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { HEALTH_PACKAGES } from '../data/hospitalData';

export default function HealthPackagesSection({ onBookPackage }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Full Body", "Heart Care", "Endocrinology", "Women's Health"];

  const filteredPackages = HEALTH_PACKAGES.filter(
    (pkg) => selectedCategory === "all" || pkg.category === selectedCategory
  );

  return (
    <section id="packages" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
            Preventive Wellness & Health Screening
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Comprehensive Health Check-Up Packages
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Early diagnosis saves lives. Choose from our expertly designed clinical bundles covering blood profiling, vital imaging, and specialist consultations.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "All Health Packages" : cat}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl border bg-white p-6 shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative group ${
                pkg.popular
                  ? "border-brand-500 ring-2 ring-brand-500/10"
                  : "border-slate-200"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-teal-600 text-white text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Recommended</span>
                </div>
              )}

              <div>
                {/* Category & Turnaround */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-700">
                    {pkg.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{pkg.turnaround}</span>
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                  {pkg.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 leading-snug">
                  {pkg.tagline}
                </p>

                {/* Price Display */}
                <div className="p-3.5 bg-brand-50/60 rounded-2xl border border-brand-100/80 mb-5">
                  <span className="text-[11px] text-slate-400 line-through block">
                    Regular: ৳{pkg.originalPrice.toLocaleString()}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-navy-900">
                      ৳{pkg.discountedPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Save ৳{(pkg.originalPrice - pkg.discountedPrice).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                    Includes {pkg.includedCount}
                  </span>
                </div>

                {/* Included Tests List */}
                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Key Tests & Investigations:
                  </p>
                  <ul className="space-y-1.5">
                    {pkg.tests.slice(0, 5).map((test, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{test}</span>
                      </li>
                    ))}
                  </ul>
                  {pkg.tests.length > 5 && (
                    <p className="text-[11px] text-brand-600 font-semibold pt-1">
                      + {pkg.tests.length - 5} more diagnostic investigations
                    </p>
                  )}
                </div>
              </div>

              {/* Book Package CTA */}
              <button
                onClick={() => onBookPackage(pkg)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/25 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Package</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
