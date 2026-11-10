import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  UserCheck,
  CheckCircle,
  ArrowUpDown,
  Search,
  Filter,
  Info
} from 'lucide-react';
import { DOCTORS } from '../data/hospitalData';
import QuickSearchEngine from './QuickSearchEngine';

export default function DoctorDirectory({
  onSelectDoctorForBooking,
  onViewDoctorProfile,
  initialDepartment = "all"
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(initialDepartment);
  const [selectedDay, setSelectedDay] = useState("all");
  const [sortBy, setSortBy] = useState("recommended"); // recommended, fee-asc, fee-desc, experience

  // Sync when parent updates initialDepartment
  React.useEffect(() => {
    if (initialDepartment) {
      setSelectedDepartment(initialDepartment);
    }
  }, [initialDepartment]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDepartment("all");
    setSelectedDay("all");
    setSortBy("recommended");
  };

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      // Name & Keyword search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q) ||
        doc.specialization.toLowerCase().includes(q) ||
        doc.qualifications.toLowerCase().includes(q);

      // Department filter
      const matchesDept =
        selectedDepartment === "all" || doc.department === selectedDepartment;

      // Day filter
      const matchesDay =
        selectedDay === "all" || doc.available_days.includes(selectedDay);

      return matchesSearch && matchesDept && matchesDay;
    }).sort((a, b) => {
      if (sortBy === "fee-asc") return a.visiting_fee - b.visiting_fee;
      if (sortBy === "fee-desc") return b.visiting_fee - a.visiting_fee;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default order
    });
  }, [searchQuery, selectedDepartment, selectedDay, sortBy]);

  return (
    <section id="doctors" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">
            Consultant Directory & Appointment Desk
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Consult With Our Specialist Doctors
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Book OPD consultation slots directly online with instant confirmation and digital appointment slips.
          </p>
        </div>

        {/* Embedded Interactive Search Engine */}
        <div className="mb-8">
          <QuickSearchEngine
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            onReset={handleReset}
          />
        </div>

        {/* Results Count & Sorting Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-3 border-b border-slate-100 gap-3">
          <div className="text-xs sm:text-sm text-slate-600 font-medium">
            Showing <span className="font-bold text-navy-900">{filteredDoctors.length}</span> doctors available for consultation
            {selectedDepartment !== "all" && (
              <span className="text-brand-600 ml-1">in {selectedDepartment}</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort By:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="recommended">Recommended Order</option>
              <option value="rating">Highest Rated</option>
              <option value="fee-asc">Visiting Fee: Low to High</option>
              <option value="fee-desc">Visiting Fee: High to Low</option>
            </select>
          </div>
        </div>

        {/* Doctor Cards Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-brand-300"
              >
                <div>
                  {/* Doctor Avatar Header */}
                  <div className="relative p-5 pb-3 flex items-start gap-3.5">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-white shadow-md shadow-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        <span>{doctor.rating}</span>
                        <span className="text-slate-400 font-normal">({doctor.reviewsCount})</span>
                      </div>

                      <h3 className="text-base font-bold text-navy-900 group-hover:text-brand-600 transition-colors truncate">
                        {doctor.name}
                      </h3>

                      <p className="text-xs font-medium text-brand-600 truncate">
                        {doctor.designation}
                      </p>

                      <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                        {doctor.qualifications}
                      </p>
                    </div>
                  </div>

                  {/* Department & Specialty Badge */}
                  <div className="px-5 pb-3">
                    <span className="inline-block text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {doctor.department}
                    </span>
                  </div>

                  {/* Doctor Metadata Details */}
                  <div className="px-5 py-3 border-t border-slate-100 text-xs space-y-2 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doctor.room_number}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doctor.visiting_hours}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">Visiting Fee:</span>
                      <span className="text-sm font-extrabold text-navy-900">
                        ৳{doctor.visiting_fee.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA Actions */}
                <div className="p-4 pt-3 border-t border-slate-100 bg-white grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onViewDoctorProfile(doctor)}
                    className="flex items-center justify-center gap-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => onSelectDoctorForBooking(doctor)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Slot</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-navy-900">No doctors match your search filters</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try clearing your search query or selecting "All Departments".</p>
            <button
              onClick={handleReset}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 underline"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
