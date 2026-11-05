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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EMISSION_FACTORS } from '../../data/emissionFactors';

export default function WhatIfSimulator() {
  const { currentUser, showToast, triggerConfetti } = useApp();

  // Habit toggles / sliders
  const [commuteSwitch, setCommuteSwitch] = useState('bus'); // 'none', 'bus', 'cycle'
  const [acReductionHours, setAcReductionHours] = useState(2); // hours to cut
  const [plantMealDays, setPlantMealDays] = useState(2); // days per week switching to plant-based
  const [reusableBottle, setReusableBottle] = useState(true); // avoid 4 bottles/week
  const [paperlessStudy, setPaperlessStudy] = useState(true); // avoid 20 pages/week

  // Calculate savings
  // 1. Commute switch (assuming 14 km roundtrip, 5 days/wk)
  let commuteSavingKg = 0;
  const weeklyKm = 14 * 5;
  if (commuteSwitch === 'bus') {
    // from petrol bike (0.098) to college bus (0.038)
    commuteSavingKg = (weeklyKm * 4.2 * (0.098 - 0.038));
  } else if (commuteSwitch === 'cycle') {
    // from petrol bike (0.098) to cycle (0)
    commuteSavingKg = (weeklyKm * 4.2 * 0.098);
  }

  // 2. AC reduction savings
  const acSavingKg = acReductionHours * 30 * EMISSION_FACTORS.ac_kwh_per_hour * EMISSION_FACTORS.electricity_per_kwh;

  // 3. Plant meal savings (saving ~1.35 kg CO2 per day switched)
  const mealSavingKg = plantMealDays * 4.2 * 1.35;

  // 4. Reusable bottle savings (avoid ~4 PET bottles/week)
  const bottleSavingKg = reusableBottle ? 4 * 4.2 * EMISSION_FACTORS.plastic_bottle_kg : 0;

  // 5. Paperless study
  const paperSavingKg = paperlessStudy ? 20 * 4.2 * 0.025 : 0;

  const totalMonthlySavingsKg = Math.round((commuteSavingKg + acSavingKg + mealSavingKg + bottleSavingKg + paperSavingKg) * 10) / 10;
  const baselineMonthly = 162.0;
  const simulatedMonthly = Math.max(30, Math.round((baselineMonthly - totalMonthlySavingsKg) * 10) / 10);
  const percentReduction = Math.round((totalMonthlySavingsKg / baselineMonthly) * 100);
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
            Standard campus student average based on solo commute and normal energy use.
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
              <input
                type="checkbox"
                checked={reusableBottle}
                onChange={(e) => setReusableBottle(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>100% digital notes & zero paper prints</span>
              </div>
              <input
                type="checkbox"
                checked={paperlessStudy}
                onChange={(e) => setPaperlessStudy(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
              />
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

