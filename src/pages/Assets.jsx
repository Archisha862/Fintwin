import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Wallet, TrendingUp, TrendingDown, Globe, Building2, LayoutGrid } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CLASS_COLORS = {
  cash: "#3B82F6",
  equities: "#10B981",
  fixed_income: "#8B5CF6",
  real_estate: "#F59E0B",
  alternatives: "#EC4899",
  crypto: "#F97316",
  cpf: "#06B6D4",
};

const GEO_COLORS = {
  singapore: "#10B981",
  us: "#3B82F6",
  europe: "#8B5CF6",
  asia_ex_sg: "#F59E0B",
  global: "#EC4899",
  other: "#6B7280",
};

export default function Assets() {
  const [view, setView] = useState("class");

  const { data: assets } = useQuery({
    queryKey: ["all-assets"],
    queryFn: () => base44.entities.Asset.list(),
    initialData: [],
  });

  const { data: accounts } = useQuery({
    queryKey: ["all-accounts"],
    queryFn: () => base44.entities.FinancialAccount.list(),
    initialData: [],
  });

  const totalValue = assets.reduce((sum, a) => sum + (a.current_value || 0), 0);
  const totalPnl = assets.reduce((sum, a) => sum + (a.unrealized_pnl || 0), 0);

  // Group by asset class
  const byClass = assets.reduce((acc, a) => {
    const key = a.asset_class || "other";
    if (!acc[key]) acc[key] = { name: key, value: 0, assets: [] };
    acc[key].value += a.current_value || 0;
    acc[key].assets.push(a);
    return acc;
  }, {});
  const classData = Object.values(byClass).sort((a, b) => b.value - a.value);

  // Group by geography
  const byGeo = assets.reduce((acc, a) => {
    const key = a.geography || "other";
    if (!acc[key]) acc[key] = { name: key, value: 0 };
    acc[key].value += a.current_value || 0;
    return acc;
  }, {});
  const geoData = Object.values(byGeo).sort((a, b) => b.value - a.value);

  // Group by institution
  const byInstitution = assets.reduce((acc, a) => {
    const key = a.institution || "Manual";
    if (!acc[key]) acc[key] = { name: key, value: 0 };
    acc[key].value += a.current_value || 0;
    return acc;
  }, {});
  const institutionData = Object.values(byInstitution).sort((a, b) => b.value - a.value);

  const chartData = view === "class" ? classData : view === "geography" ? geoData : institutionData;
  const colors = view === "class" ? CLASS_COLORS : view === "geography" ? GEO_COLORS : null;
  const defaultColors = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899", "#F97316", "#06B6D4", "#6B7280"];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="wealth-card p-5">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total Assets</p>
          <p className="text-2xl font-bold text-[#0F1729] mt-1">
            S${totalValue.toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </p>
        </div>
        <div className="wealth-card p-5">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Unrealized P&L</p>
          <div className={`flex items-center gap-2 mt-1 ${totalPnl >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {totalPnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <p className="text-2xl font-bold">
              {totalPnl >= 0 ? "+" : ""}S${totalPnl.toLocaleString("en-US", { minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        <div className="wealth-card p-5">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Connected Accounts</p>
          <p className="text-2xl font-bold text-[#0F1729] mt-1">{accounts.length}</p>
        </div>
      </div>

      {/* Chart + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 wealth-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#0F1729]">Allocation</h3>
            <Tabs value={view} onValueChange={setView}>
              <TabsList className="h-8">
                <TabsTrigger value="class" className="text-xs h-6 px-2.5">Class</TabsTrigger>
                <TabsTrigger value="geography" className="text-xs h-6 px-2.5">Geo</TabsTrigger>
                <TabsTrigger value="institution" className="text-xs h-6 px-2.5">Institution</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={colors ? (colors[entry.name] || defaultColors[i % defaultColors.length]) : defaultColors[i % defaultColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `S$${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="space-y-2 mt-4">
            {chartData.map((entry, i) => {
              const pct = totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(1) : 0;
              const color = colors ? (colors[entry.name] || defaultColors[i % defaultColors.length]) : defaultColors[i % defaultColors.length];
              return (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-gray-600 capitalize">{entry.name.replace(/_/g, " ")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{pct}%</span>
                    <span className="font-medium text-gray-700">S${entry.value.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asset List */}
        <div className="lg:col-span-3 wealth-card p-6">
          <h3 className="text-sm font-semibold text-[#0F1729] mb-4">All Assets</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {assets.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <Wallet className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                No assets connected yet
              </div>
            ) : (
              assets.sort((a, b) => (b.current_value || 0) - (a.current_value || 0)).map((asset) => (
                <div key={asset.id} className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: (CLASS_COLORS[asset.asset_class] || "#6B7280") + "15" }}
                  >
                    <Wallet className="w-4 h-4" style={{ color: CLASS_COLORS[asset.asset_class] || "#6B7280" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{asset.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400 capitalize">{asset.asset_class?.replace(/_/g, " ")}</span>
                      {asset.institution && (
                        <>
                          <span className="text-gray-200">•</span>
                          <span className="text-[10px] text-gray-400">{asset.institution}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      S${(asset.current_value || 0).toLocaleString()}
                    </p>
                    {asset.unrealized_pnl !== undefined && asset.unrealized_pnl !== 0 && (
                      <p className={`text-xs ${asset.unrealized_pnl >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {asset.unrealized_pnl >= 0 ? "+" : ""}S${asset.unrealized_pnl.toLocaleString()}
                      </p>
                    )}
                  </div>
                  {asset.flags && asset.flags.length > 0 && (
                    <div className="flex gap-1">
                      {asset.flags.map((flag, fi) => (
                        <span key={fi} className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}