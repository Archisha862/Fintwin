import React from "react";

export default function DimensionBar({ label, score, weight, icon: Icon }) {
  const getColor = (s) => {
    if (s >= 75) return "bg-emerald-500";
    if (s >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const getTextColor = (s) => {
    if (s >= 75) return "text-emerald-600";
    if (s >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">{weight}%</span>
            <span className={`text-sm font-bold ${getTextColor(score)}`}>{score}</span>
          </div>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${getColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}