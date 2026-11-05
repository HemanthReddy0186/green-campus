import React from 'react';
import { Plus, ChevronRight, Sparkles, Sprout } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TopNavbar() {
  const { currentView, setCurrentView, currentUser } = useApp();

  const getBreadcrumb = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'wizard':
        return 'New audit';
      case 'simulator':
        return 'What-If simulator';
      case 'challenges':
        return 'Green challenges & Plant';
      case 'leaderboard':
        return 'Department ranking';
      case 'events':
        return 'College events';
      case 'reports':
        return 'Reports & history';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumbs matching reference */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="hover:text-slate-800 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          Workspace
        </span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-semibold">{getBreadcrumb()}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Quick + New Audit button (as seen in Screen 05 / 16: "+ New campaign") */}
        {currentView !== 'wizard' && (
          <button
            onClick={() => setCurrentView('wizard')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New audit</span>
          </button>
        )}

        {/* Eco points badge */}
        <button
          onClick={() => setCurrentView('challenges')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition"
          title="Eco Points & Plant Growth"
        >
          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
          <span>{currentUser.ecoPoints || 0} pts</span>
        </button>

        {/* Profile Pill matching Screen 05 ("M Administrator mdsohel...") */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
            {currentUser.avatarInitials || currentUser.name?.charAt(0) || 'S'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-400 leading-tight truncate max-w-[140px]">
              {currentUser.department} · {currentUser.year}rd Year
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

