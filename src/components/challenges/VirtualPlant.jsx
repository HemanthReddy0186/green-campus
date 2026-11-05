import React from 'react';
import { Sprout, Sun, Droplets, Sparkles, Award } from 'lucide-react';

export default function VirtualPlant({ ecoPoints = 485, stage = 3 }) {
  // Stages configuration
  const stages = [
    {
      level: 1,
      name: 'Sprout',
      minPts: 0,
      nextPts: 150,
      desc: 'A tiny green shoot emerging from fertile soil.',
      height: 40,
    },
    {
      level: 2,
      name: 'Two-Leaf Sapling',
      minPts: 150,
      nextPts: 350,
      desc: 'Growing tender leaves absorbing campus sunlight.',
      height: 70,
    },
    {
      level: 3,
      name: 'Bushy Foliage',
      minPts: 350,
      nextPts: 650,
      desc: 'Vibrant green shrub flourishing with your daily actions.',
      height: 100,
    },
    {
      level: 4,
      name: 'Blossoming Shrub',
      minPts: 650,
      nextPts: 1000,
      desc: 'Flowering eco-plant that brightens the whole department.',
      height: 130,
    },
    {
      level: 5,
      name: 'Campus Eco Tree',
      minPts: 1000,
      nextPts: 2000,
      desc: 'A mature canopy providing oxygen, shade, and carbon offset.',
      height: 160,
    },
  ];

  const currentStageInfo = stages[Math.min(stage - 1, 4)] || stages[2];
  const nextStageInfo = stages[Math.min(stage, 4)] || stages[4];

  // Calculate percentage to next stage
  const range = currentStageInfo.nextPts - currentStageInfo.minPts;
  const progress = Math.min(
    100,
    Math.max(10, Math.round(((ecoPoints - currentStageInfo.minPts) / range) * 100))
  );

  return (
    <div className="bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 border border-emerald-100 rounded-3xl p-6 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
      {/* Subtle background ambient rays */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-100/50 rounded-full blur-2xl pointer-events-none"></div>

      <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-4 relative z-10">
        <span className="flex items-center gap-1.5 font-bold text-emerald-800">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>Stage {currentStageInfo.level}: {currentStageInfo.name}</span>
        </span>
        <span className="flex items-center gap-1 text-[11px] font-semibold bg-white px-2.5 py-1 rounded-full border border-slate-200">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>{ecoPoints} Total Pts</span>
        </span>
      </div>

      {/* Interactive Plant Illustration Graphic (SVG Canvas) */}
      <div className="relative w-48 h-48 my-2 flex items-end justify-center">
        {/* Glow circle */}
        <div className="absolute inset-0 bg-emerald-100/40 rounded-full blur-xl scale-75"></div>

        {/* SVG Drawing based on Stage */}
        <svg
          viewBox="0 0 200 200"
          className="w-44 h-44 transition-all duration-700 ease-out z-10 filter drop-shadow-sm"
        >
          {/* Soil Bed / Planter Pot */}
          <ellipse cx="100" cy="180" rx="65" ry="14" fill="#a16207" opacity="0.3" />
          <path
            d="M50 145 L62 185 Q100 192 138 185 L150 145 Z"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="3"
          />
          <path
            d="M45 142 Q100 148 155 142 L150 149 Q100 156 50 149 Z"
            fill="#1e293b"
          />
          <ellipse cx="100" cy="148" rx="46" ry="7" fill="#78350f" />

          {/* Plant Growth Rendering Based on Level */}
          {stage === 1 && (
            <g className="animate-pulse">
              {/* Little Sprout */}
              <path
                d="M100 146 Q100 120 100 115"
                stroke="#15803d"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M100 115 Q85 105 92 95 Q105 105 100 115 Z"
                fill="#22c55e"
              />
              <path
                d="M100 118 Q115 108 108 98 Q98 108 100 118 Z"
                fill="#16a34a"
              />
            </g>
          )}

          {stage === 2 && (
            <g>
              {/* Young Sapling */}
              <path
                d="M100 146 Q101 110 100 85"
                stroke="#15803d"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M100 115 Q75 105 78 85 Q95 95 100 110 Z"
                fill="#22c55e"
              />
              <path
                d="M100 100 Q125 90 122 70 Q105 80 100 95 Z"
                fill="#16a34a"
              />
              <path
                d="M100 85 Q92 65 100 55 Q108 65 100 85 Z"
                fill="#4ade80"
              />
            </g>
          )}

          {stage === 3 && (
            <g>
              {/* Bushy Foliage Shrub */}
              <path
                d="M100 146 Q98 105 100 70"
                stroke="#78350f"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="85" cy="88" r="24" fill="#15803d" opacity="0.9" />
              <circle cx="115" cy="85" r="26" fill="#16a34a" opacity="0.9" />
              <circle cx="100" cy="65" r="28" fill="#22c55e" />
              <circle cx="78" cy="105" r="18" fill="#166534" />
              <circle cx="122" cy="102" r="18" fill="#15803d" />
              <circle cx="100" cy="52" r="16" fill="#4ade80" />
            </g>
          )}

          {stage === 4 && (
            <g>
              {/* Blooming Shrub with flowers */}
              <path
                d="M100 146 Q97 100 100 60"
                stroke="#78350f"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="82" cy="80" r="28" fill="#15803d" />
              <circle cx="118" cy="78" r="30" fill="#16a34a" />
              <circle cx="100" cy="55" r="32" fill="#22c55e" />
              <circle cx="70" cy="100" r="20" fill="#166534" />
              <circle cx="130" cy="98" r="20" fill="#15803d" />
              {/* Flowers */}
              <circle cx="72" cy="70" r="7" fill="#fbbf24" />
              <circle cx="125" cy="65" r="7" fill="#f43f5e" />
              <circle cx="100" cy="40" r="8" fill="#f59e0b" />
            </g>
          )}

          {stage >= 5 && (
            <g>
              {/* Magnificent Campus Tree */}
              <path
                d="M95 146 L97 70 Q100 50 100 45"
                stroke="#582900"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M100 85 Q125 70 135 60"
                stroke="#582900"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M98 95 Q75 80 65 70"
                stroke="#582900"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Canopy */}
              <circle cx="65" cy="65" r="32" fill="#166534" opacity="0.95" />
              <circle cx="135" cy="55" r="35" fill="#15803d" opacity="0.95" />
              <circle cx="100" cy="38" r="42" fill="#22c55e" />
              <circle cx="100" cy="25" r="28" fill="#4ade80" />
              {/* Glow stars */}
              <circle cx="70" cy="35" r="3" fill="#fef08a" />
              <circle cx="130" cy="28" r="3" fill="#fef08a" />
            </g>
          )}
        </svg>

        {/* Small floating badge */}
        <div className="absolute bottom-1 right-2 bg-white/95 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-bold text-emerald-800 shadow-xs flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Stage {stage}/5</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-2 max-w-xs font-normal">
        {currentStageInfo.desc}
      </p>

      {/* Progress bar to next stage */}
      <div className="w-full mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1.5">
          <span>Progress to {nextStageInfo.name}</span>
          <span className="font-mono text-slate-700">
            {ecoPoints} / {currentStageInfo.nextPts} pts
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
          ></div>
        </div>
      </div>
    </div>
  );
}

