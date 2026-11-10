import React, { useState } from 'react';
import {
  FileBarChart2,
  Plus,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Layers,
  Leaf,
  Calendar,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ReportsHistory() {
  const {
    auditHistory,
    eventAudits,
    currentUser,
    setCurrentView,
    resetAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState('audits'); // 'audits' or 'events'
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  // Filter audits
  const filteredAudits = auditHistory.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule =
      moduleFilter === 'All' ||
      (moduleFilter === 'Eco Champion' && a.rating === 'Eco Champion') ||
      (moduleFilter === 'Average' && a.rating === 'Average');
    return matchesSearch && matchesModule;
  });

  // Filter events
  const filteredEvents = eventAudits.filter((e) => {
    return (
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizerDept.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeTab === 'audits') {
      csvContent += 'id,title,date,department,monthly_kg_co2,annual_kg_co2,rating,points_earned\n';
      auditHistory.forEach((a) => {
        csvContent += `${a.id},"${a.title}",${a.date},${a.department},${a.totalMonthlyKg},${a.annualEstimatedKg},${a.rating},${a.pointsEarned}\n`;
      });
    } else {
      csvContent += 'id,event_name,date,department,attendees,total_kg_co2,per_attendee_kg,grade,trees_to_offset\n';
      eventAudits.forEach((e) => {
        csvContent += `${e.id},"${e.name}",${e.date},${e.organizerDept},${e.attendees},${e.totalKgCO2e},${e.perAttendeeKg},${e.grade},${e.treesToOffset}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `green_campus_${activeTab}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-left">
      {/* Header — Faithful to Screen 16 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            THE COMPLETE PICTURE
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-0.5">
            Reports & history.
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audits, daily logs, and department outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setCurrentView('wizard')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New audit</span>
          </button>
        </div>
      </div>

      {/* 3 Top Metric Cards — Faithful to Screen 16 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-semibold tracking-tight text-slate-500">
              Audits completed
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-4xl font-extrabold tracking-tight text-slate-950 font-mono">
              0{auditHistory.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Verified campus records
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-semibold tracking-tight text-slate-500">
              Verified CO₂ offset
            </span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-4xl font-extrabold tracking-tight text-slate-950 font-mono">
              {currentUser.co2SavedTotalKg || 46.2} <span className="text-base text-slate-400 font-sans">kg</span>
            </div>
            <div className="text-xs text-emerald-700 mt-1 font-semibold">
              Avoided emissions
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-semibold tracking-tight text-slate-500">
              Eco points earned
            </span>
            <FileBarChart2 className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-4xl font-extrabold tracking-tight text-slate-950 font-mono">
              {currentUser.ecoPoints || 485}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Level {currentUser.plantStage || 3} Plant
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar & Controls — Faithful to Screen 16 */}
      <div className="space-y-4">
        <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-bold text-slate-400 pb-2">
          <button
            onClick={() => setActiveTab('audits')}
            className={`transition pb-2 -mb-2.5 flex items-center gap-2 ${
              activeTab === 'audits'
                ? 'text-slate-950 border-b-2 border-slate-900'
                : 'hover:text-slate-700'
            }`}
          >
            <span>Audits</span>
            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 text-[10px] flex items-center justify-center font-bold">
              {auditHistory.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`transition pb-2 -mb-2.5 flex items-center gap-2 ${
              activeTab === 'events'
                ? 'text-slate-950 border-b-2 border-slate-900'
                : 'hover:text-slate-700'
            }`}
          >
            <span>College events</span>
            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 text-[10px] flex items-center justify-center font-bold">
              {eventAudits.length}
            </span>
          </button>
        </div>

        {/* Search bar and Module dropdown — Faithful to Screen 16 */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900 bg-white"
            />
          </div>

          {activeTab === 'audits' && (
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full sm:w-48 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="All">All modules</option>
              <option value="Eco Champion">Eco Champion</option>
              <option value="Average">Average Footprint</option>
            </select>
          )}
        </div>
      </div>

      {/* Main Table or Empty State — Faithful to Screen 16 ("No campaigns yet.") */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        {activeTab === 'audits' && (
          <div>
            {filteredAudits.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <FileBarChart2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  No audits found.
                </h3>
                <p className="text-xs text-slate-400">
                  Confirmed audits will appear here after calculation.
                </p>
                <button
                  onClick={() => setCurrentView('wizard')}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-950 underline mt-2"
                >
                  Create an audit →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3">Audit Details</th>
                      <th className="pb-3">Department & Batch</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Monthly Footprint</th>
                      <th className="pb-3" title="Annualized 12-Month Equivalent Projection">Annual (12-mo Proj.)</th>
                      <th className="pb-3">Rating</th>
                      <th className="pb-3 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAudits.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 font-bold text-slate-900">
                          {item.title}
                        </td>
                        <td className="py-4 text-slate-500">
                          {item.department} · {item.year} · {item.section}
                        </td>
                        <td className="py-4 text-slate-500 font-mono">{item.date}</td>
                        <td className="py-4 font-bold text-slate-900 font-mono">
                          {item.totalMonthlyKg} kg CO₂e
                        </td>
                        <td className="py-4 text-slate-500 font-mono">
                          {item.annualEstimatedKg} kg
                        </td>
                        <td className="py-4">
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
                        <td className="py-4 text-right font-bold text-emerald-700">
                          +{item.pointsEarned} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            {filteredEvents.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  No college events audited yet.
                </h3>
                <p className="text-xs text-slate-400">
                  Audit fests and conferences with the Event Calculator.
                </p>
                <button
                  onClick={() => setCurrentView('events')}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-950 underline mt-2"
                >
                  Audit an event now →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3">Event Name</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Attendance</th>
                      <th className="pb-3">Duration</th>
                      <th className="pb-3">Total CO₂e</th>
                      <th className="pb-3">Per Attendee</th>
                      <th className="pb-3">Grade</th>
                      <th className="pb-3 text-right">Offset Trees</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 font-bold text-slate-900">
                          {evt.name}
                        </td>
                        <td className="py-4 text-slate-500 font-semibold">{evt.organizerDept}</td>
                        <td className="py-4 text-slate-500 font-mono">{evt.attendees} students</td>
                        <td className="py-4 text-slate-500 font-mono">{evt.durationHours} hrs</td>
                        <td className="py-4 font-bold text-slate-900 font-mono">
                          {evt.totalKgCO2e.toLocaleString()} kg
                        </td>
                        <td className="py-4 text-slate-600 font-mono">
                          {evt.perAttendeeKg} kg
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            Grade {evt.grade}
                          </span>
                        </td>
                        <td className="py-4 text-right font-bold text-emerald-700">
                          {evt.treesToOffset} trees
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Danger / Reset Zone */}
      <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
        <span>Storage: LocalStorage (Offline persistence)</span>
        <button
          onClick={resetAllData}
          className="text-slate-400 hover:text-rose-600 transition flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset demo data</span>
        </button>
      </div>
    </div>
  );
}

