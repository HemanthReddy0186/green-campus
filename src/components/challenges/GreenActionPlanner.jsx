import React, { useState } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  Circle,
  Sparkles,
  Bike,
  Droplets,
  PowerOff,
  Salad,
  FileText,
  Wind,
  TreePine,
  BatteryCharging,
  Sprout,
  Zap,
  Recycle,
  Lock,
  Check,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import VirtualPlant from './VirtualPlant';

export default function GreenActionPlanner() {
  const {
    currentUser,
    allChallenges,
    completedChallengeIds,
    completeChallenge,
    allBadges,
    unlockedBadges,
  } = useApp();

  const [activeTab, setActiveTab] = useState('challenges'); // 'challenges' or 'badges'
  const [categoryFilter, setCategoryFilter] = useState('All');

  const getChallengeIcon = (iconName) => {
    switch (iconName) {
      case 'Bike':
        return <Bike className="w-4 h-4 text-emerald-600" />;
      case 'Droplets':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'PowerOff':
        return <PowerOff className="w-4 h-4 text-amber-500" />;
      case 'Salad':
        return <Salad className="w-4 h-4 text-emerald-600" />;
      case 'FileText':
        return <FileText className="w-4 h-4 text-slate-600" />;
      case 'Wind':
        return <Wind className="w-4 h-4 text-teal-600" />;
      case 'TreePine':
        return <TreePine className="w-4 h-4 text-emerald-700" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-4 h-4 text-purple-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'Sprout':
        return <Sprout className="w-6 h-6 text-emerald-600" />;
      case 'Bike':
        return <Bike className="w-6 h-6 text-teal-600" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-600" />;
      case 'Recycle':
        return <Recycle className="w-6 h-6 text-blue-600" />;
      case 'Salad':
        return <Salad className="w-6 h-6 text-emerald-600" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-purple-600" />;
      default:
        return <Award className="w-6 h-6 text-slate-600" />;
    }
  };

  const categories = ['All', 'Travel', 'Electricity', 'Food', 'Waste', 'Campus'];

  const filteredChallenges = allChallenges.filter((ch) => {
    if (categoryFilter === 'All') return true;
    return ch.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            ACTION PLANNER & GAMIFICATION
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-0.5">
            Green Challenges & Plant.
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete daily actions, collect Eco Points, grow your virtual tree, and unlock badges.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'challenges'
                ? 'bg-white text-slate-950 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Daily Challenges ({completedChallengeIds.length}/{allChallenges.length})
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'badges'
                ? 'bg-white text-slate-950 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Badges Showcase ({unlockedBadges.length}/{allBadges.length})
          </button>
        </div>
      </div>

      {/* Main Grid: Left side Plant & Points, Right side Challenges or Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Virtual Plant & Eco Scoreboard */}
        <div className="space-y-6">
          <VirtualPlant
            ecoPoints={currentUser.ecoPoints || 485}
            stage={currentUser.plantStage || 3}
          />

          {/* Quick Metrics Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Student Sustainability Impact
            </h3>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[10px] text-slate-400 font-bold uppercase">
                  CO₂ Saved
                </div>
                <div className="text-lg font-black text-emerald-700 mt-0.5">
                  {currentUser.co2SavedTotalKg || 46.2} kg
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[10px] text-slate-400 font-bold uppercase">
                  Tasks Done
                </div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {completedChallengeIds.length} tasks
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed">
              Points earned are directly credited to <strong>{currentUser.department}</strong> on the campus leaderboard.
            </div>
          </div>
        </div>

        {/* Right Column: Challenges List or Badges Grid */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'challenges' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        categoryFilter === cat
                          ? 'bg-slate-950 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-medium text-slate-400">
                  {filteredChallenges.length} actions available
                </span>
              </div>

              {/* Challenges list */}
              <div className="space-y-3">
                {filteredChallenges.map((ch) => {
                  const isDone = completedChallengeIds.includes(ch.id);

                  return (
                    <div
                      key={ch.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                        isDone
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100'
                          }`}
                        >
                          {getChallengeIcon(ch.icon)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              className={`text-sm font-bold ${
                                isDone ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'
                              }`}
                            >
                              {ch.title}
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {ch.category}
                            </span>
                            <span className="text-[10px] text-slate-400 capitalize">
                              • {ch.frequency}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {ch.description}
                          </p>

                          <div className="flex items-center gap-3 mt-2 text-[11px] font-medium text-slate-400">
                            <span className="text-emerald-700 font-bold">
                              +{ch.points} Eco Points
                            </span>
                            <span>•</span>
                            <span>Saves ~{ch.co2SavedKg} kg CO₂e</span>
                          </div>
                        </div>
                      </div>

                      {/* Action button */}
                      <div>
                        {isDone ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Done</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => completeChallenge(ch.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition active:scale-95 shadow-2xs shrink-0"
                          >
                            <span>Log action</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Campus Sustainability Badges
                </h2>
                <p className="text-xs text-slate-400">
                  Earn points by completing audits and challenges to unlock verified badges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allBadges.map((badge) => {
                  const isUnlocked = (currentUser.ecoPoints || 0) >= badge.thresholdPoints;
                  const progressPct = Math.min(
                    100,
                    Math.round(((currentUser.ecoPoints || 0) / badge.thresholdPoints) * 100)
                  );

                  return (
                    <div
                      key={badge.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isUnlocked
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-slate-200 bg-slate-50/50 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            isUnlocked
                              ? 'bg-emerald-100 text-emerald-700 shadow-xs'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {getBadgeIcon(badge.icon)}
                        </div>

                        {isUnlocked ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Unlocked ✓
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <Lock className="w-3 h-3" />
                            <span>{badge.thresholdPoints} pts</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {badge.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                          <span>{isUnlocked ? 'Completed' : 'Requirement'}</span>
                          <span>{currentUser.ecoPoints || 0} / {badge.thresholdPoints} pts</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${progressPct}%` }}
                            className={`h-full rounded-full ${
                              isUnlocked ? 'bg-emerald-600' : 'bg-slate-400'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

