import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

export default function NetWorthCard({ netWorth, change, changePercent, sparklineData }) {
  const isPositive = change >= 0;

  return (
    <div className="wealth-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Net Worth</p>
          <h3 className="text-3xl font-bold text-[#0F1729] mt-1">
            S${(netWorth || 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </h3>
          <div className={`flex items-center gap-1.5 mt-2 ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span className="text-sm font-semibold">
              {isPositive ? "+" : ""}S${Math.abs(change || 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">
              ({isPositive ? "+" : ""}{changePercent || 0}%)
            </span>
          </div>
        </div>
      </div>
      {sparklineData && (
        <div className="h-16 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "#10B981" : "#EF4444"}
                strokeWidth={2}
                fill="url(#netWorthGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}