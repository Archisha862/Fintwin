import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Sparkles, Shield, PieChart, Droplets, Brain, Banknote } from "lucide-react";

import WellnessScoreRing from "@/components/dashboard/WellnessScoreRing";
import NetWorthCard from "@/components/dashboard/NetWorthCard";
import DimensionBar from "@/components/dashboard/DimensionBar";
import ActionCard from "@/components/dashboard/ActionCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

const sparklineData = [
  { value: 1820000 }, { value: 1835000 }, { value: 1810000 }, { value: 1850000 },
  { value: 1870000 }, { value: 1860000 }, { value: 1890000 }, { value: 1905000 },
  { value: 1920000 }, { value: 1895000 }, { value: 1930000 }, { value: 1947000 },
];

export default function Dashboard() {
  const { data: scores } = useQuery({
    queryKey: ["wellness-scores"],
    queryFn: () => base44.entities.WellnessScore.list("-score_date", 1),
    initialData: [],
  });

  const { data: pendingActions } = useQuery({
    queryKey: ["pending-actions"],
    queryFn: () => base44.entities.AgentAction.filter({ status: "pending" }, "-created_date", 5),
    initialData: [],
  });

  const { data: recentActions } = useQuery({
    queryKey: ["recent-actions"],
    queryFn: () => base44.entities.AgentAction.list("-updated_date", 10),
    initialData: [],
  });

  const { data: assets } = useQuery({
    queryKey: ["assets"],
    queryFn: () => base44.entities.Asset.list(),
    initialData: [],
  });

  const latestScore = scores[0];
  const totalNetWorth = latestScore?.total_net_worth || assets.reduce((sum, a) => sum + (a.current_value || 0), 0);

  const handleApprove = async (action) => {
    await base44.entities.AgentAction.update(action.id, { status: "approved" });
  };
  const handleDismiss = async (action) => {
    await base44.entities.AgentAction.update(action.id, { status: "dismissed" });
  };

  const dimensions = [
    { label: "Diversification", score: latestScore?.diversification_score || 0, weight: 20, icon: PieChart },
    { label: "Liquidity", score: latestScore?.liquidity_score || 0, weight: 25, icon: Droplets },
    { label: "Debt Management", score: latestScore?.debt_management_score || 0, weight: 20, icon: Banknote },
    { label: "Income Resilience", score: latestScore?.income_resilience_score || 0, weight: 15, icon: Shield },
    { label: "Behavioral Resilience", score: latestScore?.behavioral_resilience_score || 0, weight: 20, icon: Brain },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wellness Score */}
        <div className="wealth-card p-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 self-start">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Wellness Score</h3>
          </div>
          <WellnessScoreRing score={latestScore?.overall_score || 0} trend={3} />
          <div className="w-full mt-5 pt-4 border-t border-gray-100 space-y-0">
            {dimensions.map((d) => (
              <DimensionBar key={d.label} {...d} />
            ))}
          </div>
        </div>

        {/* Net Worth + Summary */}
        <div className="lg:col-span-2 space-y-6">
          <NetWorthCard
            netWorth={totalNetWorth}
            change={23400}
            changePercent={1.2}
            sparklineData={sparklineData}
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Idle Cash", value: "S$23,000", sub: "Earning 0.05%", color: "text-amber-600" },
              { label: "Pending Actions", value: pendingActions.length, sub: "Awaiting approval", color: "text-blue-600" },
              { label: "Fee Drag", value: "S$2,100/yr", sub: "Optimization available", color: "text-red-500" },
              { label: "Score Trajectory", value: "+5 pts", sub: "12-month forecast", color: "text-emerald-600" },
            ].map((stat) => (
              <div key={stat.label} className="wealth-card p-4">
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Pending Actions Preview */}
          <div className="wealth-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#0F1729]">Agent Recommendations</h3>
              <Link
                to={createPageUrl("AgentActions")}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {pendingActions.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                All caught up! No pending actions.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingActions.slice(0, 3).map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    onApprove={handleApprove}
                    onDismiss={handleDismiss}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="wealth-card p-6">
        <h3 className="text-sm font-semibold text-[#0F1729] mb-3">Recent Activity</h3>
        <ActivityFeed actions={recentActions.filter(a => a.status !== "pending")} />
      </div>
    </div>
  );
}