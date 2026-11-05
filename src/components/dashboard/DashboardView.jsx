import React from 'react';
import {
  Leaf,
  Plus,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Sliders,
  CalendarCheck,
  FileBarChart2,
  TrendingDown,
  Sparkles,
  Sprout,
  Users,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DashboardView() {
  const {
    currentUser,
    setCurrentView,
    auditHistory,
    leaderboard,
    completedChallengeIds,
    unlockedBadges,
  } = useApp();

  const userDept = leaderboard.find((d) => d.deptId === currentUser.department) || leaderboard[0];
  const latestAudit = auditHistory[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-left">
      {/* Top Banner / Heading — Faithful to Screen 05 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">
            YOUR WORKSPACE, AT A GLANCE
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
            Let's make an impact.
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Every daily choice reduces campus emissions and propels {userDept.name} forward.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('wizard')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New carbon audit</span>
        </button>
      </div>

      {/* Top 3 Stat Cards — Exact structure of Screen 05 with values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1: Estimated Footprint */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-semibold tracking-tight text-slate-500">
              Personal footprint
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-slate-950">
                {latestAudit ? latestAudit.totalMonthlyKg : '142.6'}
              </span>
              <span className="text-xs font-semibold text-slate-400">kg CO₂e / mo</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-700">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>18% below campus average (165 kg)</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Eco Points & Plant Stage */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-semibold tracking-tight text-slate-500">
              Eco points earned
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-slate-950">
                {currentUser.ecoPoints || 485}
              </span>
              <span className="text-xs font-semibold text-slate-400">points</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-teal-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stage {currentUser.plantStage || 3} Plant · {unlockedBadges.length} Badges Unlocked</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Department Standing */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-semibold tracking-tight text-slate-500">
              Department ranking
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-slate-950">
                #{userDept.rank}
              </span>
              <span className="text-xs font-semibold text-slate-400">{userDept.code || userDept.deptId}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-700">
              <span>{userDept.points.toLocaleString()} pts · {userDept.co2OffsetKg} kg CO₂ saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Banner / Setup Stepper — Faithful to Screen 05 ("From student list to ready-to-go") */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Subtle decorative background gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-900/30 to-transparent pointer-events-none"></div>

        <div className="max-w-md relative z-10">
          <div className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase mb-2">
            A FEW STEPS, ALL SET.
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-snug mb-4">
            From daily habits to zero-carbon campus.
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            Log your daily commute, energy use, and recycling habits in a streamlined 7-step wizard.
            Verify your impact and contribute to your department's shared score.
          </p>

          <button
            onClick={() => setCurrentView('wizard')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 transition shadow-sm active:scale-95 group"
          >
            <span>Start personal audit</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Stepper Checklist right side matching Screen 05 */}
        <div className="w-full lg:w-1/2 space-y-3 relative z-10">
          {/* Step 01 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-emerald-400">01</span>
              <div>
                <p className="text-xs font-bold text-white">Select your department</p>
                <p className="text-[11px] text-slate-300">
                  {currentUser.department} · {currentUser.year}rd Year · Section {currentUser.section}
                </p>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          {/* Step 02 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-emerald-400">02</span>
              <div>
                <p className="text-xs font-bold text-white">Log your daily activities</p>
                <p className="text-[11px] text-slate-300">
                  Commute · AC hours · Dining meals · Single-use waste
                </p>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          {/* Step 03 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-emerald-400">03</span>
              <div>
                <p className="text-xs font-bold text-white">Make it yours</p>
                <p className="text-[11px] text-slate-300">
                  What-if simulator · Daily eco challenges · Department rank
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* The 5 Core Features Quick Cards (from Workflow PDF & Diagram) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Explore Core Features
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Five interactive sustainability modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Feature 1 */}
          <div
            onClick={() => setCurrentView('wizard')}
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-card transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Leaf className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                Carbon Calculator
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter everyday travel, electricity, food, and waste details.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Audit now</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 2 */}
          <div
            onClick={() => setCurrentView('simulator')}
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-card transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition">
                What-If Simulator
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Change one habit and compare before vs after emissions.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Simulate</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 3 */}
          <div
            onClick={() => setCurrentView('challenges')}
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-card transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Sprout className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition">
                Green Challenges
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Complete green tasks, collect Eco Points, and grow your plant.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Earn points</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 4 */}
          <div
            onClick={() => setCurrentView('leaderboard')}
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-card transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition">
                Leaderboard
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Track inter-department rankings and cheer on your peers.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Rankings</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 5 */}
          <div
            onClick={() => setCurrentView('events')}
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-card transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition">
                Event Calculator
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Estimate carbon footprints for campus fests and hackathons.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Calculate</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Audits Table — Faithful to Screen 15 / 16 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recent Audits & Calculations
            </h2>
            <p className="text-xs text-slate-400">
              Your personal verified history on this device
            </p>
          </div>

          <button
            onClick={() => setCurrentView('reports')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
          >
            <span>View all reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 font-medium">Audit Record</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Monthly CO₂</th>
                <th className="pb-3 font-medium">Annualized</th>
                <th className="pb-3 font-medium">Rating</th>
                <th className="pb-3 font-medium text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{item.title}</span>
                  </td>
                  <td className="py-3.5 text-slate-500 font-mono">{item.date}</td>
                  <td className="py-3.5 font-semibold text-slate-900 font-mono">
                    {item.totalMonthlyKg} kg
                  </td>
                  <td className="py-3.5 text-slate-500 font-mono">
                    {item.annualEstimatedKg} kg/yr
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                        item.rating === 'Eco Champion'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.rating}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-bold text-emerald-700">
                    +{item.pointsEarned} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

