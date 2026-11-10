import React, { useState } from 'react';
import {
  CalendarCheck,
  Users,
  Clock,
  Sparkles,
  TreePine,
  Download,
  CheckCircle2,
  AlertCircle,
  Zap,
  Car,
  Salad,
  Layers,
  FileCheck,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateEventFootprint } from '../../data/emissionFactors';
import { DEPARTMENTS } from '../../data/initialData';

export default function CollegeEventCalculator() {
  const { currentUser, addEventAudit } = useApp();

  // Event inputs
  const [eventName, setEventName] = useState('TechNova Campus Hackathon 2026');
  const [organizerDept, setOrganizerDept] = useState(currentUser.department || 'CSE');
  const [attendees, setAttendees] = useState(300);
  const [durationHours, setDurationHours] = useState(24);
  const [venueType, setVenueType] = useState('auditorium');
  const [commutePercentBus, setCommutePercentBus] = useState(50);
  const [commutePercentTwoWheeler, setCommutePercentTwoWheeler] = useState(30);
  const [commutePercentCar, setCommutePercentCar] = useState(10);
  const [avgDistanceKm, setAvgDistanceKm] = useState(16);
  const [providesFood, setProvidesFood] = useState(true);
  const [mealsCount, setMealsCount] = useState(300);
  const [vegRatioPercent, setVegRatioPercent] = useState(80);
  const [cutleryType, setCutleryType] = useState('reusable'); // 'reusable' or 'single_use_plastic'
  const [flexBannersCount, setFlexBannersCount] = useState(4);
  const [printedBrochures, setPrintedBrochures] = useState(50);

  // Computed results
  const result = calculateEventFootprint({
    attendees,
    durationHours,
    venueType,
    commutePercentBus,
    commutePercentTwoWheeler,
    commutePercentCar,
    avgDistanceKm,
    providesFood,
    mealsCount,
    vegRatioPercent,
    cutleryType,
    flexBannersCount,
    printedBrochures,
  });

  const [savedEvent, setSavedEvent] = useState(null);

  const handleSaveEvent = () => {
    const record = {
      name: eventName,
      organizerDept,
      attendees,
      durationHours,
      totalKgCO2e: result.totalKgCO2e,
      perAttendeeKg: result.perAttendeeKg,
      grade: result.grade,
      treesToOffset: result.treesToOffset,
      venueType,
    };
    addEventAudit(record);
    setSavedEvent(record);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            CAMPUS FESTIVALS & CONFERENCES
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-0.5">
            College Event Carbon Calculator.
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Estimate, reduce, and verify the carbon emissions of campus fests, hackathons, and symposiums.
          </p>
        </div>

        {savedEvent && (
          <button
            onClick={handlePrintCertificate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Eco Certificate</span>
          </button>
        )}
      </div>

      {/* Results Banner Scoreboard */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
              Projected Event Footprint
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${result.gradeBadge}`}>
              Grade {result.grade}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black tracking-tight text-white">
              {result.totalKgCO2e.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              kg CO₂e ({result.totalMetricTons} Metric Tons)
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-300">
            <span>Per Attendee: <strong className="text-white">{result.perAttendeeKg} kg CO₂e</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <TreePine className="w-3.5 h-3.5" />
              <span>Offset requires <strong>{result.treesToOffset} mature trees growing for 1 year</strong></span>
            </span>
          </div>
          {result.effectiveCommuteSplit?.wasNormalized && (
            <div className="mt-2 px-3 py-1.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-[11px] text-amber-200">
              ⚠ Commute mode percentages exceeded 100% and were automatically scaled to sum to 100%.
            </div>
          )}
        </div>

        {/* Category Breakdown Chips */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Travel</div>
            <div className="text-base font-bold text-white mt-0.5">{result.breakdown.travel} kg</div>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Energy</div>
            <div className="text-base font-bold text-white mt-0.5">{result.breakdown.energy} kg</div>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Catering</div>
            <div className="text-base font-bold text-white mt-0.5">{result.breakdown.food} kg</div>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Materials</div>
            <div className="text-base font-bold text-white mt-0.5">{result.breakdown.materials} kg</div>
          </div>
        </div>
      </div>

      {/* Input Parameters Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Event Specifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Organizing Department
            </label>
            <select
              value={organizerDept}
              onChange={(e) => setOrganizerDept(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Expected Attendance
            </label>
            <input
              type="number"
              min="10"
              max="10000"
              value={attendees}
              onChange={(e) => setAttendees(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Duration (Hours): <span className="font-mono font-bold text-slate-900">{durationHours} hrs</span>
            </label>
            <input
              type="range"
              min="2"
              max="72"
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full accent-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Venue Type
            </label>
            <select
              value={venueType}
              onChange={(e) => setVenueType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900"
            >
              <option value="auditorium">Auditorium (AC & Full Audio/Visual)</option>
              <option value="seminar_hall">Seminar Hall (Classroom AC)</option>
              <option value="outdoor">Open Grounds / Amphitheater</option>
              <option value="auditorium_large">Mega Convention Hall</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Catering Cutlery
            </label>
            <select
              value={cutleryType}
              onChange={(e) => setCutleryType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900"
            >
              <option value="reusable">Reusable Steel / Biodegradable Plates</option>
              <option value="single_use_plastic">Single-Use Plastic Cutlery & Bottles</option>
            </select>
          </div>
        </div>

        {/* Travel and Food Ratios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Attendee Commute by Bus / Shuttle: <span className="font-mono font-bold text-emerald-700">{commutePercentBus}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="90"
              value={commutePercentBus}
              onChange={(e) => setCommutePercentBus(Number(e.target.value))}
              className="w-full accent-slate-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Higher shuttle adoption reduces overall event footprint.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Vegetarian / Plant-Based Menu Ratio: <span className="font-mono font-bold text-emerald-700">{vegRatioPercent}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={vegRatioPercent}
              onChange={(e) => setVegRatioPercent(Number(e.target.value))}
              className="w-full accent-slate-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Serving plant-based refreshments lowers catering emissions up to 60%.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Auditing this event awards <strong>+100 Eco Points</strong> to {organizerDept} Department.
          </div>

          <button
            onClick={handleSaveEvent}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 transition active:scale-95 shadow-sm"
          >
            <FileCheck className="w-4 h-4" />
            <span>Save to Campus Records</span>
          </button>
        </div>
      </div>
    </div>
  );
}

