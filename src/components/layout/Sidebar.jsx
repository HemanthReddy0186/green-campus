import React from 'react';
import {
  LayoutDashboard,
  Plus,
  Sliders,
  Trophy,
  Award,
  CalendarCheck,
  FileBarChart2,
  ExternalLink,
  LogOut,
  Leaf,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { currentView, setCurrentView, currentUser, logoutUser } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wizard', label: 'New audit', icon: Plus, badge: '+' },
    { id: 'simulator', label: 'What-If simulator', icon: Sliders },
    { id: 'challenges', label: 'Green challenges', icon: Trophy, points: currentUser.ecoPoints },
    { id: 'leaderboard', label: 'Department ranking', icon: Award },
    { id: 'events', label: 'College events', icon: CalendarCheck },
    { id: 'reports', label: 'Reports & history', icon: FileBarChart2 },
  ];

  return (
    <aside className="w-full md:w-64 h-auto md:h-screen md:sticky md:top-0 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between select-none md:overflow-y-auto">
      <div>
        {/* Brand / Logo - Inspired by VIIT / Green Campus reference */}
        <div className="p-6 pb-4">
          <div 
            onClick={() => setCurrentView('dashboard')}
            className="cursor-pointer group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-base leading-tight">
                  GREEN CAMPUS
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                DEPARTMENT OF {currentUser?.department || 'CSE'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="px-4 py-3">
          <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Workspace
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-950 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}

                  {item.points !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                      {item.points} pt
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Footer Section - Matches Reference Screen 05 */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-2 px-3 text-xs text-slate-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Saved on this device</span>
        </div>

        <button
          onClick={() => setCurrentView('landing')}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
        >
          <span>Visit homepage</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={logoutUser}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

