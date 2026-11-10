import React, { Component } from 'react';
import { useApp } from './context/AppContext';
import LandingPage from './components/landing/LandingPage';
import AuthView from './components/auth/AuthView';
import Sidebar from './components/layout/Sidebar';
import TopNavbar from './components/layout/TopNavbar';
import DashboardView from './components/dashboard/DashboardView';
import OnboardingWizard from './components/wizard/OnboardingWizard';
import WhatIfSimulator from './components/simulator/WhatIfSimulator';
import GreenActionPlanner from './components/challenges/GreenActionPlanner';
import DepartmentLeaderboard from './components/leaderboard/DepartmentLeaderboard';
import CollegeEventCalculator from './components/eventCalc/CollegeEventCalculator';
import ReportsHistory from './components/reports/ReportsHistory';
import { CheckCircle2, Sparkles, AlertTriangle, RotateCcw, Bug } from 'lucide-react';

// Transparent Error Boundary that surfaces the exact error and stack trace instead of hiding it
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Green Campus Error Boundary Caught Error:', error);
    console.error('Component Stack Info:', errorInfo?.componentStack);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-3xl mx-auto my-8 text-left bg-white border-2 border-rose-200 rounded-3xl p-8 shadow-md space-y-4">
          <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Component Rendering Error Detected
              </h2>
              <p className="text-xs text-rose-600 font-semibold font-mono">
                {this.state.error?.name || 'Error'}: {this.state.error?.message || 'Unknown runtime error'}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            The error details below have been preserved and surfaced for diagnostics. Your saved carbon calculations and student points in localStorage remain intact.
          </p>

          {/* Unhidden Technical Error Diagnostics */}
          <details open className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto space-y-2">
            <summary className="cursor-pointer text-slate-400 font-bold hover:text-white select-none">
              Technical Stack Trace & Diagnostics
            </summary>
            <div className="pt-2 text-rose-300 whitespace-pre-wrap">
              {this.state.error?.stack || this.state.error?.toString()}
            </div>
            {this.state.errorInfo?.componentStack && (
              <div className="pt-2 text-slate-400 border-t border-slate-800 whitespace-pre-wrap">
                <div className="text-slate-300 font-bold">Component Hierarchy:</div>
                {this.state.errorInfo.componentStack}
              </div>
            )}
          </details>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition active:scale-95 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload View</span>
            </button>
            <button
              onClick={() => {
                const text = `${this.state.error?.stack}\n${this.state.errorInfo?.componentStack || ''}`;
                navigator.clipboard?.writeText(text);
              }}
              className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Copy Stack to Clipboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { currentView, toast } = useApp();

  // Standalone Views
  if (currentView === 'landing') {
    return (
      <ErrorBoundary>
        <LandingPage />
      </ErrorBoundary>
    );
  }

  if (currentView === 'auth') {
    return (
      <ErrorBoundary>
        <AuthView />
      </ErrorBoundary>
    );
  }

  // Workspace Shell with Fixed Sidebar + Scrollable Right Workspace
  return (
    <div className="h-screen bg-[#fafbfc] flex flex-col md:flex-row relative overflow-hidden">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-slate-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 text-xs max-w-md">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium text-slate-200">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Persistent Left Sidebar - Locked/Fixed */}
      <Sidebar />

      {/* Main Workspace Scroll Area - Only the right side scrolls */}
      <div className="flex-1 flex flex-col h-full md:h-screen overflow-y-auto">
        <TopNavbar />

        <main className="flex-1">
          <ErrorBoundary>
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'wizard' && <OnboardingWizard />}
            {currentView === 'simulator' && <WhatIfSimulator />}
            {currentView === 'challenges' && <GreenActionPlanner />}
            {currentView === 'leaderboard' && <DepartmentLeaderboard />}
            {currentView === 'events' && <CollegeEventCalculator />}
            {currentView === 'reports' && <ReportsHistory />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
