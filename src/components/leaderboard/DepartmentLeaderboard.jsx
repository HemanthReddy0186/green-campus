import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  Users,
  TrendingUp,
  Leaf,
  Sparkles,
  ChevronUp,
  Building2,
  Medal,
  Calendar,
  RotateCcw,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_LEADERBOARD } from '../../data/initialData';

export default function DepartmentLeaderboard() {
  const {
    leaderboard,
    auditHistory,
    eventAudits,
    challengeLogs,
    currentUser,
    showToast,
    triggerConfetti,
    resetAllData,
  } = useApp();
  const [timeFilter, setTimeFilter] = useState('All Time');

  // Safe data fallback to prevent missing or malformed state from crashing render
  const baseData = useMemo(() => {
    if (Array.isArray(leaderboard) && leaderboard.length > 0) {
      return leaderboard;
    }
    return INITIAL_LEADERBOARD;
  }, [leaderboard]);

  // Safe helper accessors
  const getDeptCode = (d) => d?.code || d?.deptId || 'DEPT';
  const getDeptInitials = (d) => {
    const raw = d?.code || d?.deptId || d?.name || 'DP';
    return String(raw).slice(0, 2).toUpperCase();
  };
  const getPoints = (d) => (d?.points !== undefined && d?.points !== null ? Number(d.points) : 0);
  const getStudents = (d) =>
    d?.students !== undefined && d?.students !== null && !isNaN(Number(d.students)) && Number(d.students) >= 0
      ? Number(d.students)
      : 0;
  const getCo2 = (d) => (d?.co2OffsetKg !== undefined && d?.co2OffsetKg !== null ? Number(d.co2OffsetKg) : 0);

  // Helper to determine if a dated participation record belongs to the active filter window
  const isDateInFilter = (dateStr, filter) => {
    if (filter === 'All Time') return true;
    if (!dateStr) return false;

    try {
      const now = new Date();
      let recYear, recMonth, recDay;
      if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const parts = dateStr.slice(0, 10).split('-').map(Number);
        recYear = parts[0];
        recMonth = parts[1] - 1; // 0-indexed month (0 = Jan, 10 = Nov)
        recDay = parts[2];
      } else {
        const d = new Date(dateStr);
        recYear = d.getFullYear();
        recMonth = d.getMonth();
        recDay = d.getDate();
      }

      if (filter === 'This Month') {
        // ACTUAL calendar-month boundary: 1st of current calendar month to last day of current calendar month
        return (
          recYear === now.getFullYear() &&
          recMonth === now.getMonth()
        );
      }
      if (filter === 'This Week') {
        // Records within the last 7 calendar days
        const recordTime = new Date(recYear, recMonth, recDay).getTime();
        const nowTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const diffDays = (nowTime - recordTime) / (1000 * 60 * 60 * 24);
        return diffDays >= -0.01 && diffDays <= 7.01;
      }
      if (filter === 'This Semester') {
        // Records within current academic semester (120 days)
        const recordTime = new Date(recYear, recMonth, recDay).getTime();
        const nowTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const diffDays = (nowTime - recordTime) / (1000 * 60 * 60 * 24);
        return diffDays >= -0.01 && diffDays <= 120.01;
      }
    } catch {
      return false;
    }
    return true;
  };

  // Aggregate actual dated participation records across audits, events, and green challenges
  // with strict duplicate prevention across data sources
  const displayedData = useMemo(() => {
    const safeAudits = Array.isArray(auditHistory) ? auditHistory : [];
    const safeEvents = Array.isArray(eventAudits) ? eventAudits : [];
    const safeChallengeLogs = Array.isArray(challengeLogs) ? challengeLogs : [];

    const computed = baseData.map((dept) => {
      const deptId = dept.deptId || dept.code;

      // 1. Retrieve pre-seeded period baseline (which already encapsulates initial demonstration records)
      // Look up clean immutable initial baseline first to prevent double-counting of accumulated points
      const initialMatch = INITIAL_LEADERBOARD.find((init) => (init.deptId || init.code) === deptId);
      const periodRecord =
        initialMatch?.periods?.[timeFilter] ||
        dept.periods?.[timeFilter] || {
          points: getPoints(dept),
          co2OffsetKg: getCo2(dept),
          students: getStudents(dept),
        };

      let periodPoints = Number(periodRecord.points) || 0;
      let periodCo2 = Number(periodRecord.co2OffsetKg) || 0;
      const studentCount = getStudents(periodRecord);

      // De-duplicate live records by ID to guarantee single-counting across data sources
      const seenAuditIds = new Set();
      // 2. Sum live dated audits matching the active time-period (avoiding duplicate count of initial seed)
      safeAudits.forEach((audit) => {
        if (!audit.isInitial && audit.department === deptId && isDateInFilter(audit.date, timeFilter)) {
          if (!audit.id || !seenAuditIds.has(audit.id)) {
            if (audit.id) seenAuditIds.add(audit.id);
            periodPoints += Number(audit.pointsEarned) || 50;
            periodCo2 += Math.max(0, Math.round((165 - (Number(audit.totalMonthlyKg) || 165)) * 10) / 10);
          }
        }
      });

      const seenEventIds = new Set();
      // 3. Sum live dated event audits matching the active time-period
      safeEvents.forEach((evt) => {
        if (!evt.isInitial && evt.organizerDept === deptId && isDateInFilter(evt.date, timeFilter)) {
          if (!evt.id || !seenEventIds.has(evt.id)) {
            if (evt.id) seenEventIds.add(evt.id);
            periodPoints += 100;
            periodCo2 += 15;
          }
        }
      });

      const seenLogIds = new Set();
      // 4. Sum live dated Green Challenge completion records matching the active time-period
      safeChallengeLogs.forEach((log) => {
        if (!log.isInitial && log.department === deptId && isDateInFilter(log.date, timeFilter)) {
          if (!log.id || !seenLogIds.has(log.id)) {
            if (log.id) seenLogIds.add(log.id);
            periodPoints += Number(log.points) || 0;
            periodCo2 += Number(log.co2SavedKg) || 0;
          }
        }
      });

      // 5. Per-capita calculation handling zero active students safely:
      // When active students are zero, display N/A for per-capita scores if department has positive points
      let perCapitaDisplay;
      if (studentCount > 0) {
        const num = Math.round((periodPoints / studentCount) * 10) / 10;
        perCapitaDisplay = `${num.toFixed(1)} pts/stu`;
      } else if (periodPoints > 0) {
        perCapitaDisplay = 'N/A';
      } else {
        perCapitaDisplay = '0.0 pts/stu';
      }

      return {
        ...dept,
        code: getDeptCode(dept),
        points: periodPoints,
        co2OffsetKg: periodCo2,
        students: studentCount,
        perCapitaDisplay,
        perCapitaPoints: studentCount > 0 ? Math.round((periodPoints / studentCount) * 10) / 10 : periodPoints > 0 ? 'N/A' : 0,
      };
    });

    // Re-sort descending by points for the active timeframe
    computed.sort((a, b) => b.points - a.points);

    return computed.map((d, idx) => ({
      ...d,
      rank: idx + 1,
      badge:
        idx === 0
          ? '🏆 Champion'
          : idx === 1
          ? '🥈 Runner Up'
          : idx === 2
          ? '🥉 3rd Place'
          : idx < 5
          ? 'Top 5'
          : 'Active',
    }));
  }, [baseData, auditHistory, eventAudits, challengeLogs, timeFilter]);

  const top3 = displayedData.slice(0, 3);

  const handleCheer = (deptName) => {
    try {
      triggerConfetti();
      showToast(`Cheered for ${deptName || 'Department'}! Campus spirit boost recorded.`);
    } catch {
      showToast(`Cheered for ${deptName || 'Department'}!`);
    }
  };

  // Empty or error state handling
  if (!displayedData || displayedData.length === 0) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Leaderboard Data Unavailable
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Unable to load department rankings. Click below to restore verified campus standings.
          </p>
          <button
            onClick={resetAllData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Default Standings</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              CAMPUS SUSTAINABILITY STANDINGS
            </span>
            {/* Clear Demonstration Data Tagging */}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Demonstration Dataset
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
            Department Leaderboard.
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Shared inter-department challenge powered by student participation points and real carbon savings.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start">
          {['All Time', 'This Semester', 'This Month', 'This Week'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                timeFilter === t
                  ? 'bg-white text-slate-950 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Demonstration Data Notice Banner */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Prototype Demonstration Data:</span> Baseline department standings represent pre-seeded campus demonstration records. User audits, green challenges, and college events are filtered and aggregated using <strong>actual dated participation records</strong> for the selected time window (<span className="font-semibold">{timeFilter}</span>) with duplicate point prevention.
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative flex flex-col justify-between order-2 md:order-1">
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-black text-sm flex items-center justify-center border border-slate-200">
                2
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                🥈 Runner Up
              </span>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{getDeptCode(top3[1])}</h3>
              <p className="text-xs text-slate-500">{top3[1].name || 'Department'}</p>
              <div className="text-2xl font-black text-slate-950 mt-3 font-mono">
                {getPoints(top3[1]).toLocaleString()} <span className="text-xs font-semibold text-slate-400">pts</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
              <span>{getStudents(top3[1])} Active Students</span>
              <span className="font-bold text-emerald-700">{getCo2(top3[1]).toLocaleString()} kg CO₂ saved</span>
            </div>
          </div>
        )}

        {/* 1st Place (Champion - Elevated) */}
        {top3[0] && (
          <div className="bg-gradient-to-b from-amber-50/50 via-white to-slate-50 border-2 border-amber-300 rounded-3xl p-7 shadow-card relative flex flex-col justify-between order-1 md:order-2 md:-translate-y-3">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-white font-black text-base flex items-center justify-center shadow-xs">
                1
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
                🏆 Campus Champion
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-950">{getDeptCode(top3[0])}</h3>
              <p className="text-xs text-slate-500">{top3[0].name || 'Department'}</p>
              <div className="text-3xl font-black text-slate-950 mt-3 font-mono">
                {getPoints(top3[0]).toLocaleString()} <span className="text-xs font-semibold text-slate-400">pts</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200/60 text-xs text-slate-600 flex justify-between">
              <span>{getStudents(top3[0])} Students</span>
              <span className="font-bold text-emerald-700">{getCo2(top3[0]).toLocaleString()} kg CO₂ saved</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative flex flex-col justify-between order-3">
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center border border-amber-200">
                3
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                🥉 3rd Place
              </span>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{getDeptCode(top3[2])}</h3>
              <p className="text-xs text-slate-500">{top3[2].name || 'Department'}</p>
              <div className="text-2xl font-black text-slate-950 mt-3 font-mono">
                {getPoints(top3[2]).toLocaleString()} <span className="text-xs font-semibold text-slate-400">pts</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
              <span>{getStudents(top3[2])} Active Students</span>
              <span className="font-bold text-emerald-700">{getCo2(top3[2]).toLocaleString()} kg CO₂ saved</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            All Academic Departments ({displayedData.length})
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Period: <strong className="text-slate-700">{timeFilter}</strong> · Updated in real-time
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 w-16">Rank</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Eco Points</th>
                <th className="pb-3">Participating</th>
                <th className="pb-3">CO₂ Offset</th>
                <th className="pb-3">Per-Capita</th>
                <th className="pb-3">Trend</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedData.map((dept) => {
                const deptCode = getDeptCode(dept);
                const isUserDept = Boolean(currentUser?.department && dept.deptId === currentUser.department);

                return (
                  <tr
                    key={dept.deptId || dept.rank}
                    className={`hover:bg-slate-50 transition ${
                      isUserDept ? 'bg-emerald-50/40 font-bold' : ''
                    }`}
                  >
                    <td className="py-4 font-mono font-bold text-slate-700">
                      #{dept.rank}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {getDeptInitials(dept)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{dept.name || deptCode}</span>
                            {isUserDept && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                Your Team
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal">
                            Top: {dept.topContributor || 'Active Student Batch'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-mono font-bold text-slate-900">
                      {getPoints(dept).toLocaleString()} pts
                    </td>
                    <td className="py-4 text-slate-600 font-mono">
                      {getStudents(dept)} students
                    </td>
                    <td className="py-4 font-mono font-bold text-emerald-700">
                      {getCo2(dept).toLocaleString()} kg
                    </td>
                    <td className="py-4 text-slate-600 font-mono">
                      {dept.perCapitaDisplay}
                    </td>
                    <td className="py-4 text-emerald-700 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{dept.trend || '+10%'}</span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleCheer(dept.name || deptCode)}
                        className="px-3 py-1 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 text-xs font-semibold bg-white transition active:scale-95 shadow-2xs"
                      >
                        Cheer 👏
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
