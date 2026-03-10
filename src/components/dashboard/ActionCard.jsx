import React from "react";
import { Check, X, ChevronRight, DollarSign, RefreshCw, PiggyBank, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryIcons = {
  idle_cash: DollarSign,
  rebalancing: RefreshCw,
  fee_optimization: PiggyBank,
  dividend: DollarSign,
  liability: AlertTriangle,
  tax_optimization: DollarSign,
  circuit_breaker: AlertTriangle,
};

const categoryColors = {
  idle_cash: "bg-blue-50 text-blue-600",
  rebalancing: "bg-purple-50 text-purple-600",
  fee_optimization: "bg-emerald-50 text-emerald-600",
  dividend: "bg-amber-50 text-amber-600",
  liability: "bg-red-50 text-red-600",
  tax_optimization: "bg-teal-50 text-teal-600",
  circuit_breaker: "bg-red-50 text-red-600",
};

const priorityDots = {
  critical: "bg-red-500",
  high: "bg-amber-500",
  medium: "bg-blue-500",
  low: "bg-gray-400",
};

export default function ActionCard({ action, onApprove, onDismiss, compact }) {
  const Icon = categoryIcons[action.category] || DollarSign;
  const colorClass = categoryColors[action.category] || "bg-gray-50 text-gray-600";

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 group cursor-pointer hover:bg-gray-50/50 px-1 rounded-lg transition-colors">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{action.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {action.estimated_impact_label || (action.estimated_impact ? `+S$${action.estimated_impact.toLocaleString()}/yr` : "")}
          </p>
        </div>
        <div className={`w-1.5 h-1.5 rounded-full ${priorityDots[action.priority]}`} />
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
    );
  }

  return (
    <div className="wealth-card p-5">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-1.5 h-1.5 rounded-full ${priorityDots[action.priority]}`} />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {action.category?.replace(/_/g, " ")}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-[#0F1729]">{action.title}</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{action.description}</p>
          {action.estimated_impact > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50">
              <span className="text-xs font-semibold text-emerald-700">
                +S${action.estimated_impact.toLocaleString()}/yr
              </span>
            </div>
          )}
        </div>
      </div>
      {action.status === "pending" && (
        <div className="flex gap-2 mt-4 ml-14">
          <Button
            size="sm"
            onClick={() => onApprove?.(action)}
            className="bg-[#0F1729] hover:bg-[#1A2440] text-white text-xs h-8 px-4"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" /> Approve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss?.(action)}
            className="text-gray-400 hover:text-gray-600 text-xs h-8"
          >
            <X className="w-3.5 h-3.5 mr-1.5" /> Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}