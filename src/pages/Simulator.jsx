import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { FlaskConical, Plus, Minus, TrendingUp, TrendingDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WellnessScoreRing from "@/components/dashboard/WellnessScoreRing";
import DimensionBar from "@/components/dashboard/DimensionBar";
import { PieChart as PieChartIcon, Droplets, Shield, Brain, Banknote } from "lucide-react";

const SCENARIOS = [
  { id: "rate_rise", label: "Interest Rate +2%", impact: { liquidity: -5, debt_management: -10, diversification: 0, income_resilience: 2, behavioral: 0 } },
  { id: "equity_correction", label: "Equity Market -20%", impact: { liquidity: -3, debt_management: 0, diversification: 5, income_resilience: -8, behavioral: -15 } },
  { id: "crypto_crash", label: "Crypto -50%", impact: { liquidity: 0, debt_management: 0, diversification: 3, income_resilience: -2, behavioral: -10 } },
  { id: "property_purchase", label: "Buy Property (S$1.5M)", impact: { liquidity: -20, debt_management: -15, diversification: -5, income_resilience: -10, behavioral: 0 } },
  { id: "new_child", label: "Having a Child", impact: { liquidity: -8, debt_management: -3, diversification: 0, income_resilience: -12, behavioral: 0 } },
  { id: "inheritance", label: "Receive S$500K Inheritance", impact: { liquidity: 15, debt_management: 10, diversification: -3, income_resilience: 12, behavioral: 5 } },
  { id: "retire", label: "Retire at 55", impact: { liquidity: -10, debt_management: 0, diversification: 0, income_resilience: -25, behavioral: 5 } },
];

export default function Simulator() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [allocationAdjust, setAllocationAdjust] = useState({
    equities: 0, fixed_income: 0, cash: 0, real_estate: 0, crypto: 0,
  });

  const { data: scores } = useQuery({
    queryKey: ["sim-wellness-scores"],
    queryFn: () => base44.entities.WellnessScore.list("-score_date", 1),
    initialData: [],
  });

  const currentScore = scores[0] || {
    overall_score: 72,
    diversification_score: 68,
    liquidity_score: 75,
    debt_management_score: 80,
    income_resilience_score: 60,
    behavioral_resilience_score: 70,
  };

  const scenario = SCENARIOS.find((s) => s.id === selectedScenario);

  const simulated = useMemo(() => {
    const impact = scenario?.impact || {};
    const allocImpact = Object.values(allocationAdjust).reduce((sum, v) => sum + Math.abs(v), 0);
    const diversificationBonus = allocImpact > 0 ? Math.min(allocImpact * 0.3, 8) : 0;

    const dims = {
      diversification: Math.max(0, Math.min(100, currentScore.diversification_score + (impact.diversification || 0) + diversificationBonus)),
      liquidity: Math.max(0, Math.min(100, currentScore.liquidity_score + (impact.liquidity || 0) + (allocationAdjust.cash || 0) * 2)),
      debt_management: Math.max(0, Math.min(100, currentScore.debt_management_score + (impact.debt_management || 0))),
      income_resilience: Math.max(0, Math.min(100, currentScore.income_resilience_score + (impact.income_resilience || 0))),
      behavioral: Math.max(0, Math.min(100, currentScore.behavioral_resilience_score + (impact.behavioral || 0))),
    };

    const overall = Math.round(
      dims.diversification * 0.2 +
      dims.liquidity * 0.25 +
      dims.debt_management * 0.2 +
      dims.income_resilience * 0.15 +
      dims.behavioral * 0.2
    );

    return { overall, ...dims };
  }, [currentScore, scenario, allocationAdjust]);

  const scoreDelta = simulated.overall - currentScore.overall_score;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-emerald-500" />
          <h1 className="text-xl font-bold text-[#0F1729]">Scenario Simulator</h1>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Model hypothetical changes and see projected impact on your Wellness Score
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scenario Selector */}
          <div className="wealth-card p-6">
            <h3 className="text-sm font-semibold text-[#0F1729] mb-4">Life & Market Events</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(selectedScenario === s.id ? null : s.id)}
                  className={`
                    text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all
                    ${selectedScenario === s.id
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Allocation Adjustments */}
          <div className="wealth-card p-6">
            <h3 className="text-sm font-semibold text-[#0F1729] mb-4">Allocation Adjustments</h3>
            <div className="space-y-5">
              {Object.entries(allocationAdjust).map(([key, val]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600 capitalize">{key.replace(/_/g, " ")}</span>
                    <span className={`text-xs font-bold ${val > 0 ? "text-emerald-600" : val < 0 ? "text-red-500" : "text-gray-400"}`}>
                      {val > 0 ? "+" : ""}{val}%
                    </span>
                  </div>
                  <Slider
                    value={[val]}
                    onValueChange={([v]) => setAllocationAdjust((prev) => ({ ...prev, [key]: v }))}
                    min={-20}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs"
              onClick={() => setAllocationAdjust({ equities: 0, fixed_income: 0, cash: 0, real_estate: 0, crypto: 0 })}
            >
              Reset All
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Simulated Score */}
          <div className="wealth-card p-6 text-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Simulated Score</p>
            <WellnessScoreRing score={simulated.overall} size={160} />
            <div className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              scoreDelta >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}>
              {scoreDelta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {scoreDelta >= 0 ? "+" : ""}{scoreDelta} pts from current
            </div>
          </div>

          {/* Dimension Breakdown */}
          <div className="wealth-card p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Dimension Impact</p>
            <DimensionBar label="Diversification" score={Math.round(simulated.diversification)} weight={20} icon={PieChartIcon} />
            <DimensionBar label="Liquidity" score={Math.round(simulated.liquidity)} weight={25} icon={Droplets} />
            <DimensionBar label="Debt Management" score={Math.round(simulated.debt_management)} weight={20} icon={Banknote} />
            <DimensionBar label="Income Resilience" score={Math.round(simulated.income_resilience)} weight={15} icon={Shield} />
            <DimensionBar label="Behavioral" score={Math.round(simulated.behavioral)} weight={20} icon={Brain} />
          </div>
        </div>
      </div>
    </div>
  );
}