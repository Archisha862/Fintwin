import React from "react";

export default function WellnessScoreRing({ score, size = 180, strokeWidth = 12, trend }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 75) return "#10B981";
    if (s >= 50) return "#F59E0B";
    return "#EF4444";
  };

  const getLabel = (s) => {
    if (s >= 85) return "Excellent";
    if (s >= 75) return "Good";
    if (s >= 60) return "Fair";
    if (s >= 40) return "Needs Work";
    return "Critical";
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring transition-all duration-1000"
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-[#0F1729]">{score}</span>
        <span className="text-xs font-medium text-gray-400 mt-0.5">{getLabel(score)}</span>
        {trend !== undefined && (
          <span className={`text-xs font-medium mt-1 ${trend >= 0 ? "text-emerald-500" : "text-red-500"}`}>
            {trend >= 0 ? "+" : ""}{trend} pts
          </span>
        )}
      </div>
    </div>
  );
}