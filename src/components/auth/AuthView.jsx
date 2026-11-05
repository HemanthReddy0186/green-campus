import React, { useState } from 'react';
import {
  Leaf,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEPARTMENTS, ACADEMIC_YEARS, SECTIONS } from '../../data/initialData';

export default function AuthView() {
  const { setCurrentView, loginUser } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('alex.rivera@campus.edu');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('Alex Rivera');
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSection, setSelectedSection] = useState('F');

  // Quick demo accounts
  const demoAccounts = [
    { name: 'Alex Rivera', email: 'alex.rivera@campus.edu', dept: 'CSE', year: '3', sec: 'F' },
    { name: 'Priya Sharma', email: 'priya.sharma@campus.edu', dept: 'CSE-AI', year: '2', sec: 'B' },
    { name: 'Marcus Chen', email: 'marcus.chen@campus.edu', dept: 'ECE', year: '4', sec: 'A' },
  ];

  const handleSelectDemo = (acc) => {
    setName(acc.name);
    setEmail(acc.email);
    setSelectedDept(acc.dept);
    setSelectedYear(acc.year);
    setSelectedSection(acc.sec);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({
      name: name.trim() || 'Alex Rivera',
      email: email.trim() || 'student@campus.edu',
      department: selectedDept,
      year: selectedYear,
      section: selectedSection,
      avatarInitials: (name || 'Alex Rivera').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Column — Landscape / Brand Split — Faithful to Screen 03 & 04 */}
      <div className="w-full md:w-1/2 bg-slate-900 text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle background image gradient mimic (mountain/monochrome aesthetic from screenshot) */}
        <div 
          className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')`,
            filter: 'grayscale(100%) contrast(120%)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60"></div>

        {/* Brand header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-400">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight text-base">
              GREEN CAMPUS
            </div>
            <div className="text-[10px] font-bold text-emerald-400/90 tracking-widest uppercase">
              STUDENT SUSTAINABILITY PORTAL
            </div>
          </div>
        </div>

        {/* Left Hero Content — Exact wording inspired by Screen 03 & 04 */}
        <div className="relative z-10 my-12">
          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-4">
            CAMPUS SUSTAINABILITY INITIATIVE
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-8">
            A greener <br />
            campus starts <br />
            with you.
          </h2>

          <div className="space-y-4 max-w-sm text-sm">
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-slate-400 pt-0.5">01</span>
              <div>
                <p className="font-medium text-slate-200">Choose your department</p>
                <p className="text-xs text-slate-400">Join your batch and represent your academic team.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-slate-400 pt-0.5">02</span>
              <div>
                <p className="font-medium text-slate-200">Audit your daily footprint</p>
                <p className="text-xs text-slate-400">Calculate commute, electricity, food, and waste.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-slate-400 pt-0.5">03</span>
              <div>
                <p className="font-medium text-slate-200">Keep it all in view</p>
                <p className="text-xs text-slate-400">Earn Eco Points, grow your virtual tree, and top the leaderboard.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400">
          Student updates · Actionable reduction · Connected campus
        </div>
      </div>

      {/* Right Column — Clean Minimalist Form Area — Faithful to Screen 03 & 04 */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between bg-white">
        {/* Top Back Link */}
        <div>
          <button
            onClick={() => setCurrentView('landing')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </button>
        </div>

        {/* Main Form Container */}
        <div className="max-w-md w-full mx-auto">
          {/* Lock / Security Icon Box */}
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 mb-6">
            <Lock className="w-4 h-4" />
          </div>

          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">
            {isRegister ? 'NEW STUDENT ONBOARDING' : 'STUDENT PORTAL'}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            {isRegister ? 'Create your profile.' : 'Welcome back.'}
          </h1>
          <p className="text-xs text-slate-500 mb-6">
            {isRegister
              ? 'Join the campus sustainability platform and log your footprint.'
              : 'Sign in to access your personal workspace.'}
          </p>

          {/* Quick Demo Student Switcher */}
          {!isRegister && (
            <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
              <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                Quick Demo Accounts (Click to Fill)
              </div>
              <div className="flex flex-wrap gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectDemo(acc)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      email === acc.email
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {acc.name} ({acc.dept})
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900"
                  >
                    {ACADEMIC_YEARS.map((y) => (
                      <option key={y.id} value={y.id}>
                        {y.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900"
                  >
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>
                        Sec {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-between px-6 py-3 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition shadow-sm active:scale-98 mt-2"
            >
              <span>{isRegister ? 'Complete registration' : 'Sign in'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Register / Sign In */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-slate-900 hover:underline"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                New student?{' '}
                <button
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-slate-900 hover:underline"
                >
                  Create account & select department
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Footer note matching Screen 03 */}
        <div className="text-center text-xs text-slate-400 mt-8">
          🔒 Authorized students & campus staff only · Privacy protected
        </div>
      </div>
    </div>
  );
}

