import React, { useState } from 'react';
import {
  Sliders,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Leaf,
  CheckCircle2,
  TreePine,
  RotateCcw,
  Bike,
  Wind,
  Salad,
  Droplets,
  FileText,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EMISSION_FACTORS } from '../../data/emissionFactors';

// Consistent monthly multiplier (30-day basis, same as emissionFactors.js)
const WEEKS_PER_MONTH = 30 / 7;

export default function WhatIfSimulator() {
  const { currentUser, auditHistory, showToast, triggerConfetti } = useApp();

  // ── Habit toggles / sliders ─────────────────────────────────────────────────
  const [commuteSwitch, setCommuteSwitch] = useState('bus'); // 'none', 'bus', 'cycle'
  const [acReductionHours, setAcReductionHours] = useState(2);
  const [plantMealDays, setPlantMealDays] = useState(2);
  const [reusableBottle, setReusableBottle] = useState(true);
  const [paperlessStudy, setPaperlessStudy] = useState(true);

  // ── Derive baseline from the student's latest personal audit ─────────────────
  // Preference order:
  //   1. Latest live audit result (most accurate — the student's own data)
  //   2. Documented campus average fallback (165 kg, same value used in emissionFactors.js)
  const latestAudit = Array.isArray(auditHistory) && auditHistory.length > 0 ? auditHistory[0] : null;
  const baselineMonthly = (latestAudit && Number(latestAudit.totalMonthlyKg) > 0)
    ? Number(latestAudit.totalMonthlyKg)
    : 165.0;

  // ── Derive commute parameters from the latest audit or safe defaults ──────────
  // If the student's audit contains commute details, use them.
  // Otherwise use visible documented defaults so the student understands the assumption.
  const currentCommuteMode     = latestAudit?.commuteMode     || 'petrol_two_wheeler';
  const currentCommuteDistance = Math.max(0, Number(latestAudit?.commuteDistance)    || 0);
  const currentCommuteDays     = Math.max(0, Math.min(7, Number(latestAudit?.commuteDaysPerWeek) || 5));
  const currentCommuteFactor   = EMISSION_FACTORS.travel[currentCommuteMode] ?? 0.098;

  // ── 1. Commute savings ───────────────────────────────────────────────────────
  // Award savings only when:
  //   a) The student has a non-zero commute distance
  //   b) The student is NOT already using a zero-emission mode (walk/cycle)
  //   c) The target mode has a lower emission factor than the current mode
  let commuteSavingKg = 0;
  const currentModeIsZeroEmission = currentCommuteFactor === 0;
  const hasCommute               = currentCommuteDistance > 0;

  if (hasCommute && !currentModeIsZeroEmission) {
    const monthlyKm = currentCommuteDistance * currentCommuteDays * WEEKS_PER_MONTH;
    if (commuteSwitch === 'bus') {
      const targetFactor = EMISSION_FACTORS.travel.college_bus;
      commuteSavingKg = Math.max(0, monthlyKm * (currentCommuteFactor - targetFactor));
    } else if (commuteSwitch === 'cycle') {
      const targetFactor = EMISSION_FACTORS.travel.bicycle; // 0.0
      commuteSavingKg = Math.max(0, monthlyKm * (currentCommuteFactor - targetFactor));
    }
  }
  // No commute savings if distance is zero or student already walks/cycles

  // ── 2. AC reduction savings ──────────────────────────────────────────────────
  const acSavingKg = acReductionHours * 30 * EMISSION_FACTORS.ac_kwh_per_hour * EMISSION_FACTORS.electricity_per_kwh;

  // ── 3. Plant-meal savings (non-veg moderate → vegetarian delta = 1.35 kg/day) ─
  // Uses the same WEEKS_PER_MONTH denominator as the personal calculator.
  const mealSavingKg = plantMealDays * WEEKS_PER_MONTH * 1.35;

  // ── 4. Reusable bottle savings (assume 4 PET bottles/week avoided) ────────────
  const bottleSavingKg = reusableBottle ? 4 * WEEKS_PER_MONTH * EMISSION_FACTORS.plastic_bottle_kg : 0;

  // ── 5. Paperless study savings (avoid 20 printed pages/week × 0.025 kg/page) ──
  const paperSavingKg = paperlessStudy ? 20 * WEEKS_PER_MONTH * 0.025 : 0;

  const totalMonthlySavingsKg = Math.round(
    (commuteSavingKg + acSavingKg + mealSavingKg + bottleSavingKg + paperSavingKg) * 10
  ) / 10;

  // Simulated footprint — cannot go below zero (no negative emissions)
  const simulatedMonthly = Math.max(0, Math.round((baselineMonthly - totalMonthlySavingsKg) * 10) / 10);
  const percentReduction = baselineMonthly > 0
    ? Math.round((totalMonthlySavingsKg / baselineMonthly) * 100)
    : 0;
  const annualTreesEquivalent = Math.round((totalMonthlySavingsKg * 12) / 21 * 10) / 10;

  const handleCommitGoal = () => {
    triggerConfetti();
    showToast(`Committed to your "${percentReduction}% Carbon Reduction Goal"! +30 Eco Points logged.`);
  };

  const handleReset = () => {
    setCommuteSwitch('none');
    setAcReductionHours(0);
    setPlantMealDays(0);
    setReusableBottle(false);
    setPaperlessStudy(false);
  };

  // Determine the commute mode label for display
  const commuteModeLabels = {
    walking: 'Walking', bicycle: 'Bicycle', metro: 'Metro',
    college_bus: 'College Bus', public_bus: 'Public Bus',
    ev_two_wheeler: 'EV Scooter', petrol_two_wheeler: 'Petrol Bike',
    carpool: 'Carpool', petrol_car_solo: 'Solo Car',
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            SCENARIO EXPERIMENTATION
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-0.5">
            What-If Simulator.
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Change everyday campus habits and instantly project your monthly carbon savings.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset simulation</span>
        </button>
      </div>

      {/* Baseline info banner */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Simulation baseline: </span>
          {latestAudit
            ? <>Your latest personal audit (<span className="font-mono font-bold">{baselineMonthly} kg CO₂e/mo</span>){' '}
                — commuting by <span className="font-semibold">{commuteModeLabels[currentCommuteMode] || currentCommuteMode}</span>,{' '}
                {currentCommuteDistance} km/day × {currentCommuteDays} days/week.
              </>
            : <>No personal audit found — using campus average fallback (<span className="font-mono font-bold">165 kg CO₂e/mo</span>).{' '}
                Complete a carbon audit in the onboarding wizard to personalise this simulator.</>
          }
        </div>
      </div>

      {/* Side-by-Side Impact Scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Baseline Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Current Baseline
          </div>
          <div className="my-3">
            <span className="text-4xl font-black text-slate-900 tracking-tight">
              {baselineMonthly}
            </span>
            <span className="text-xs text-slate-400 font-semibold ml-2">kg CO₂e / mo</span>
          </div>
          <div className="text-xs text-slate-500">
            {latestAudit
              ? 'Based on your latest personal carbon audit.'
              : 'Campus student average (no audit on file).'}
          </div>
        </div>

        {/* Projected Future Card */}
        <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-800/20 pointer-events-none"></div>
          <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider relative z-10">
            Simulated Footprint
          </div>
          <div className="my-3 relative z-10">
            <span className="text-4xl font-black text-white tracking-tight">
              {simulatedMonthly}
            </span>
            <span className="text-xs text-emerald-300 font-semibold ml-2">kg CO₂e / mo</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 relative z-10">
            <TrendingDown className="w-4 h-4" />
            <span>{percentReduction}% Reduction Achieved</span>
          </div>
        </div>

        {/* Real Savings Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Monthly CO₂ Saved
          </div>
          <div className="my-3">
            <span className="text-4xl font-black text-emerald-600 tracking-tight">
              -{totalMonthlySavingsKg}
            </span>
            <span className="text-xs text-slate-400 font-semibold ml-2">kg CO₂e</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
            <TreePine className="w-3.5 h-3.5 text-emerald-600" />
            <span>Equivalent to planting <strong>{annualTreesEquivalent} trees</strong> per year!</span>
          </div>
        </div>
      </div>

      {/* Habit Controls Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Simulate Lifestyle Changes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commute Switch */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-emerald-600" />
                <span>Switch Daily Commute Mode</span>
              </span>
              <span className="font-mono text-xs font-bold text-emerald-700">
                -{Math.round(commuteSavingKg)} kg/mo
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => setCommuteSwitch('none')}
                className={`py-2 rounded-lg border transition ${
                  commuteSwitch === 'none'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                No Change
              </button>
              <button
                type="button"
                onClick={() => setCommuteSwitch('bus')}
                className={`py-2 rounded-lg border transition ${
                  commuteSwitch === 'bus'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                College Bus
              </button>
              <button
                type="button"
                onClick={() => setCommuteSwitch('cycle')}
                className={`py-2 rounded-lg border transition ${
                  commuteSwitch === 'cycle'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Bicycle / Walk
              </button>
            </div>
            {/* Contextual note when no commute savings apply */}
            {commuteSwitch !== 'none' && !hasCommute && (
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                Your logged commute distance is 0 km — no commute savings apply for hostel students.
              </p>
            )}
            {commuteSwitch !== 'none' && hasCommute && currentModeIsZeroEmission && (
              <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1.5">
                You already use a zero-emission commute ({commuteModeLabels[currentCommuteMode]}). No further commute savings apply.
              </p>
            )}
            {hasCommute && !currentModeIsZeroEmission && (
              <p className="text-[11px] text-slate-400">
                Based on your {currentCommuteDistance} km/day × {currentCommuteDays} days/week commute by {commuteModeLabels[currentCommuteMode] || currentCommuteMode}.
              </p>
            )}
          </div>

          {/* Reduce AC Usage */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-teal-600" />
                <span>Reduce AC Usage Daily</span>
              </span>
              <span className="font-mono text-xs font-bold text-emerald-700">
                -{Math.round(acSavingKg)} kg/mo
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={acReductionHours}
              onChange={(e) => setAcReductionHours(Number(e.target.value))}
              className="w-full accent-slate-900"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0 hrs (No change)</span>
              <span className="font-bold text-slate-900">Cut {acReductionHours} hours/day</span>
              <span>6 hrs</span>
            </div>
          </div>

          {/* Plant-based meals */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Salad className="w-4 h-4 text-emerald-600" />
                <span>Meatless Meals / Plant Plate</span>
              </span>
              <span className="font-mono text-xs font-bold text-emerald-700">
                -{Math.round(mealSavingKg)} kg/mo
              </span>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 5, 7].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPlantMealDays(d)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                    plantMealDays === d
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {d}d/wk
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Days per week choosing vegetarian or vegan dishes at cafeteria.
            </p>
          </div>

          {/* Reusable Bottle & Digital Study */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-900 mb-2">
              Waste & Single-Use Plastics
            </div>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span>Carry reusable water bottle (0 single-use PET)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-700">
                  -{Math.round(bottleSavingKg * 10) / 10} kg/mo
                </span>
                <input
                  type="checkbox"
                  checked={reusableBottle}
                  onChange={(e) => setReusableBottle(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>100% digital notes & zero paper prints</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-700">
                  -{Math.round(paperSavingKg * 10) / 10} kg/mo
                </span>
                <input
                  type="checkbox"
                  checked={paperlessStudy}
                  onChange={(e) => setPaperlessStudy(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Commitment CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Adopting this scenario will reduce your personal emissions by{' '}
            <strong className="text-slate-900">{totalMonthlySavingsKg} kg CO₂ / mo</strong> and raise{' '}
            <strong className="text-slate-900">{currentUser.department}</strong> on the leaderboard.
          </div>

          <button
            onClick={handleCommitGoal}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 transition active:scale-95 shadow-sm shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Commit to this Goal (+30 Pts)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
