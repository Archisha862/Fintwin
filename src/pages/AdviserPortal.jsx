import React, { useState } from "react";
import { Users, TrendingUp, TrendingDown, AlertTriangle, Clock, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdviserClientDetail from "@/components/adviser/AdviserClientDetail";

const MOCK_CLIENTS = [
  {
    id: 1, name: "Tan Wei Ming", aum: 2450000, wellnessScore: 78, scoreDelta: 3,
    pendingActions: 2, behavioralFlags: 0, lastInteraction: "2026-03-08",
    accounts: 6, topIssue: "Idle cash S$34K", riskLevel: "moderate",
  },
  {
    id: 2, name: "Rachel Lim", aum: 5120000, wellnessScore: 85, scoreDelta: -2,
    pendingActions: 1, behavioralFlags: 0, lastInteraction: "2026-03-05",
    accounts: 8, topIssue: "Fee optimization available", riskLevel: "low",
  },
  {
    id: 3, name: "David Ng", aum: 1870000, wellnessScore: 52, scoreDelta: -8,
    pendingActions: 5, behavioralFlags: 2, lastInteraction: "2026-02-20",
    accounts: 4, topIssue: "Panic selling detected", riskLevel: "high",
  },
  {
    id: 4, name: "Sarah Chen", aum: 3200000, wellnessScore: 71, scoreDelta: 1,
    pendingActions: 3, behavioralFlags: 1, lastInteraction: "2026-03-09",
    accounts: 7, topIssue: "Concentration risk: 28% in single stock", riskLevel: "moderate",
  },
  {
    id: 5, name: "James Koh", aum: 8900000, wellnessScore: 91, scoreDelta: 5,
    pendingActions: 0, behavioralFlags: 0, lastInteraction: "2026-03-10",
    accounts: 12, topIssue: "None — excellent health", riskLevel: "low",
  },
  {
    id: 6, name: "Michelle Teo", aum: 1200000, wellnessScore: 44, scoreDelta: -12,
    pendingActions: 6, behavioralFlags: 3, lastInteraction: "2026-02-15",
    accounts: 3, topIssue: "Illiquidity creep warning", riskLevel: "critical",
  },
];

export default function AdviserPortal() {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [sortBy, setSortBy] = useState("score");

  const filtered = MOCK_CLIENTS
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "score") return a.wellnessScore - b.wellnessScore;
      if (sortBy === "aum") return b.aum - a.aum;
      if (sortBy === "delta") return a.scoreDelta - b.scoreDelta;
      return 0;
    });

  const totalAum = MOCK_CLIENTS.reduce((sum, c) => sum + c.aum, 0);
  const avgScore = Math.round(MOCK_CLIENTS.reduce((sum, c) => sum + c.wellnessScore, 0) / MOCK_CLIENTS.length);
  const flaggedClients = MOCK_CLIENTS.filter((c) => c.behavioralFlags > 0).length;

  if (selectedClient) {
    return <AdviserClientDetail client={selectedClient} onBack={() => setSelectedClient(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-500" />
          <h1 className="text-xl font-bold text-[#0F1729]">Adviser Portal</h1>
        </div>
        <p className="text-sm text-gray-400 mt-1">Client overview and proactive engagement</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="wealth-card p-4">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total AUM</p>
          <p className="text-xl font-bold text-[#0F1729] mt-1">S${(totalAum / 1000000).toFixed(1)}M</p>
        </div>
        <div className="wealth-card p-4">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Avg. Wellness</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{avgScore}</p>
        </div>
        <div className="wealth-card p-4">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Flagged Clients</p>
          <p className="text-xl font-bold text-red-500 mt-1">{flaggedClients}</p>
        </div>
        <div className="wealth-card p-4">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Active Clients</p>
          <p className="text-xl font-bold text-[#0F1729] mt-1">{MOCK_CLIENTS.length}</p>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-1">
          {[
            { val: "score", label: "Score ↓" },
            { val: "aum", label: "AUM" },
            { val: "delta", label: "Δ Score" },
          ].map((s) => (
            <Button
              key={s.val}
              variant={sortBy === s.val ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(s.val)}
              className={`text-xs h-8 ${sortBy === s.val ? "bg-[#0F1729]" : ""}`}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Client Table */}
      <div className="wealth-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Client</th>
                <th className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">AUM</th>
                <th className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Score</th>
                <th className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">30d Δ</th>
                <th className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Pending</th>
                <th className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Top Issue</th>
                <th className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                        {client.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{client.name}</p>
                        <p className="text-[10px] text-gray-400">{client.accounts} accounts</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-800">
                      S${(client.aum / 1000000).toFixed(1)}M
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-sm font-bold ${
                      client.wellnessScore >= 75 ? "text-emerald-600" :
                      client.wellnessScore >= 50 ? "text-amber-600" :
                      "text-red-600"
                    }`}>
                      {client.wellnessScore}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-xs font-semibold inline-flex items-center gap-0.5 ${
                      client.scoreDelta >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}>
                      {client.scoreDelta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {client.scoreDelta >= 0 ? "+" : ""}{client.scoreDelta}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {client.pendingActions > 0 ? (
                      <Badge variant="secondary" className="bg-amber-50 text-amber-700 text-[10px]">
                        {client.pendingActions}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-gray-500">{client.topIssue}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant="secondary" className={`text-[10px] ${
                      client.riskLevel === "critical" ? "bg-red-100 text-red-700" :
                      client.riskLevel === "high" ? "bg-amber-100 text-amber-700" :
                      client.riskLevel === "moderate" ? "bg-blue-100 text-blue-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>
                      {client.riskLevel}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}