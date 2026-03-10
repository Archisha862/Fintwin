import React from "react";
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, FileText, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WellnessScoreRing from "@/components/dashboard/WellnessScoreRing";
import DimensionBar from "@/components/dashboard/DimensionBar";
import { PieChart, Droplets, Shield, Brain, Banknote } from "lucide-react";

export default function AdviserClientDetail({ client, onBack }) {
  // Simulated dimension scores
  const dimensions = [
    { label: "Diversification", score: Math.max(20, client.wellnessScore - 10 + Math.floor(Math.random() * 20)), weight: 20, icon: PieChart },
    { label: "Liquidity", score: Math.max(20, client.wellnessScore - 5 + Math.floor(Math.random() * 15)), weight: 25, icon: Droplets },
    { label: "Debt Management", score: Math.max(30, client.wellnessScore + Math.floor(Math.random() * 10)), weight: 20, icon: Banknote },
    { label: "Income Resilience", score: Math.max(15, client.wellnessScore - 15 + Math.floor(Math.random() * 20)), weight: 15, icon: Shield },
    { label: "Behavioral Resilience", score: Math.max(20, client.wellnessScore - 8 + Math.floor(Math.random() * 15)), weight: 20, icon: Brain },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all clients
      </button>

      {/* Client Header */}
      <div className="wealth-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xl font-bold text-gray-600">
              {client.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F1729]">{client.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500">AUM: S${(client.aum / 1000000).toFixed(1)}M</span>
                <Badge variant="secondary" className={`text-[10px] ${
                  client.riskLevel === "critical" ? "bg-red-100 text-red-700" :
                  client.riskLevel === "high" ? "bg-amber-100 text-amber-700" :
                  client.riskLevel === "moderate" ? "bg-blue-100 text-blue-700" :
                  "bg-emerald-100 text-emerald-700"
                }`}>
                  {client.riskLevel} risk
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Phone className="w-3.5 h-3.5 mr-1.5" /> Call
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Mail className="w-3.5 h-3.5 mr-1.5" /> Email
            </Button>
            <Button size="sm" className="bg-[#0F1729] hover:bg-[#1A2440] text-white text-xs h-8">
              <FileText className="w-3.5 h-3.5 mr-1.5" /> Generate Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score */}
        <div className="wealth-card p-6 flex flex-col items-center">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4 self-start">Wellness Score</p>
          <WellnessScoreRing score={client.wellnessScore} size={150} trend={client.scoreDelta} />
          <div className="w-full mt-4 pt-4 border-t border-gray-100 space-y-0">
            {dimensions.map((d) => (
              <DimensionBar key={d.label} {...d} />
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="wealth-card p-4">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Pending Actions</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{client.pendingActions}</p>
            </div>
            <div className="wealth-card p-4">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Behavioral Flags</p>
              <p className="text-2xl font-bold text-red-500 mt-1">{client.behavioralFlags}</p>
            </div>
            <div className="wealth-card p-4">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Connected Accounts</p>
              <p className="text-2xl font-bold text-[#0F1729] mt-1">{client.accounts}</p>
            </div>
            <div className="wealth-card p-4">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Last Interaction</p>
              <p className="text-2xl font-bold text-[#0F1729] mt-1">{client.lastInteraction}</p>
            </div>
          </div>

          {/* Top Issue */}
          {client.topIssue !== "None — excellent health" && (
            <div className="wealth-card border-l-4 border-amber-300 p-5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top Issue</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{client.topIssue}</p>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Triggers */}
          <div className="wealth-card p-5">
            <h3 className="text-sm font-semibold text-[#0F1729] mb-3">Proactive Engagement Triggers</h3>
            <div className="space-y-2">
              {client.scoreDelta <= -5 && (
                <div className="flex items-center gap-2 text-xs p-2 bg-red-50 rounded-lg text-red-700">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Score declined {Math.abs(client.scoreDelta)} pts in 30 days — recommend outreach
                </div>
              )}
              {client.behavioralFlags > 0 && (
                <div className="flex items-center gap-2 text-xs p-2 bg-amber-50 rounded-lg text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {client.behavioralFlags} behavioral circuit breaker(s) triggered
                </div>
              )}
              {client.pendingActions > 3 && (
                <div className="flex items-center gap-2 text-xs p-2 bg-blue-50 rounded-lg text-blue-700">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {client.pendingActions} actions unreviewed — gentle nudge recommended
                </div>
              )}
              {client.scoreDelta > 0 && client.behavioralFlags === 0 && client.pendingActions <= 3 && (
                <div className="flex items-center gap-2 text-xs p-2 bg-emerald-50 rounded-lg text-emerald-700">
                  <TrendingUp className="w-3.5 h-3.5" />
                  No urgent triggers — client is in good shape
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}