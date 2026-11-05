import React from 'react';
import {
  Leaf,
  ArrowUpRight,
  ArrowRight,
  UploadCloud,
  Sliders,
  Trophy,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  Zap,
  TrendingDown,
  Sprout,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LandingPage() {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 tracking-tight text-base">
              GREEN CAMPUS
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Smart Sustainability
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('leaderboard')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition hidden md:block"
          >
            Leaderboard
          </button>
          <button
            onClick={() => setCurrentView('auth')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-full border border-slate-300 hover:border-slate-400 bg-white transition shadow-2xs"
          >
            Sign in
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm active:scale-95"
          >
            <span>Open dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section — Directly Inspired by Screen 01 */}
      <main className="max-w-6xl mx-auto w-full px-6 pt-12 pb-20 text-center flex-1 flex flex-col items-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold tracking-wider uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>GREEN CAMPUS • SMART CARBON FOOTPRINT & STUDENT SUSTAINABILITY</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 max-w-4xl leading-[1.08] mb-6">
          Small actions. <br className="hidden sm:block" />
          <span className="text-slate-900">Greener tomorrow.</span> <br />
          <span className="text-emerald-700">Measure. Act. Transform.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-500 max-w-2xl font-normal mb-10 leading-relaxed">
          A student-focused platform that helps you understand your carbon footprint,
          make greener choices, complete eco-friendly activities, and lead your department to victory.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setCurrentView('wizard')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition shadow-md active:scale-95 group"
          >
            <span>Start your carbon audit</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 border border-slate-200 transition shadow-2xs"
          >
            <span>Explore full workspace</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Floating UI Reference Mockup — Replicating Screen 01 Hero Display */}
        <div className="w-full relative max-w-5xl mt-4 pt-6">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/40 via-emerald-50/20 to-transparent rounded-3xl -z-10 blur-xl"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left Card: Student Data Ready */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-card text-left transition hover:shadow-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Audit Ready
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Student data, logged.
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Commute · Electricity · Food habits · Waste
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Daily Commute
                  </span>
                  <span className="font-mono font-medium">Bicycle (6 km)</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hostel Electricity
                  </span>
                  <span className="font-mono font-medium">1.2 kWh / day</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dining Plate
                  </span>
                  <span className="font-mono font-medium">Vegetarian</span>
                </div>
              </div>
            </div>

            {/* Center Phone / Device Frame Mockup (Screen 01 Centerpiece) */}
            <div className="relative mx-auto w-full max-w-[290px] bg-white rounded-3xl p-4 shadow-xl border-4 border-slate-800 text-center">
              {/* Phone speaker notch */}
              <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto mb-4"></div>
              
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                GREEN CAMPUS · VIRTUAL ECO PLANT
              </div>

              {/* Plant Visual */}
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3 text-emerald-600 relative">
                <Sprout className="w-10 h-10 animate-bounce" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">
                A little action. <br /> A better connection.
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 mb-4">
                Growing Stage 3: Bushy Sapling
              </p>

              {/* Dynamic waveform / points representation */}
              <div className="flex items-center justify-center gap-1 h-8 mb-4 px-4 bg-slate-50 rounded-xl">
                {[14, 24, 18, 30, 20, 28, 16, 22, 32, 18, 26, 12].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}px` }}
                    className="w-1.5 bg-emerald-500 rounded-full"
                  ></div>
                ))}
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-emerald-50/80 rounded-xl text-xs font-semibold text-emerald-900 border border-emerald-100">
                <span>Earned Today</span>
                <span className="font-bold">+45 Eco Pts</span>
              </div>
            </div>

            {/* Right Card: Department & What-If */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-card text-left transition hover:shadow-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Rank #1 Leaderboard
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Every action counts.
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Shared department points and real verified impact.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Computer Science</span>
                  <span className="font-bold text-emerald-700">15,420 pts</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[88%] rounded-full"></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>312 Students Active</span>
                  <span>2,840 kg CO₂ Saved</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('leaderboard')}
                className="w-full py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg border border-slate-200 transition"
              >
                View full standings ↗
              </button>
            </div>
          </div>
        </div>

        {/* 3 Numbered Feature Highlights — Faithful reproduction of Screen 02 */}
        <section className="w-full max-w-5xl mt-24 text-left">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mb-2">
              A meaningful connection.
            </h2>
            <p className="text-sm text-slate-400">
              Personal footprint or collective impact. Every action starts with the right context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 01 */}
            <div 
              onClick={() => setCurrentView('wizard')}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 hover:shadow-card transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">01</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition">
                  Start with student data
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Select your department, academic year, and section. Log everyday travel, hostel or home electricity, meals, and waste.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 text-[11px] font-medium text-slate-400">
                <span className="bg-slate-50 px-2 py-0.5 rounded">Travel</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded">Electricity</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded">Diet</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded">Waste</span>
              </div>
            </div>

            {/* Card 02 */}
            <div 
              onClick={() => setCurrentView('simulator')}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 hover:shadow-card transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">02</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition">
                  Simulate & take action
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Change one habit with the What-If Simulator. Complete daily micro-challenges, collect Eco Points, and watch your plant sprout into a tree.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 text-[11px] font-medium text-slate-400">
                <span className="bg-slate-50 px-2 py-0.5 rounded">What-If Tool</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded">Eco Points</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded">Badges</span>
              </div>
            </div>

            {/* Card 03 */}
            <div 
              onClick={() => setCurrentView('leaderboard')}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 hover:shadow-card transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">03</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition">
                  Everything in view
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Review department rankings, calculate college event footprints (fests & hackathons), and access verified exportable sustainability reports.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 text-[11px] font-medium text-slate-400">
                <span className="bg-slate-50 px-2 py-0.5 rounded">Leaderboard</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded">Event Audit</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded">CSV Export</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-900">GREEN CAMPUS</span>
            <span>— Smart Carbon Footprint & Student Sustainability Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentView('auth')} className="hover:text-slate-900">Student Portal</button>
            <button onClick={() => setCurrentView('reports')} className="hover:text-slate-900">Reports & History</button>
            <span className="text-slate-400">College Prototype · Private & Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

