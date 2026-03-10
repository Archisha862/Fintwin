import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, AlertTriangle, TrendingDown, BarChart3, Droplets, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const alertTypeConfig = {
  panic_selling: {
    icon: TrendingDown,
    color: "text-red-600 bg-red-50",
    borderColor: "border-red-200",
    title: "Panic Selling Detection",
  },
  performance_chasing: {
    icon: BarChart3,
    color: "text-amber-600 bg-amber-50",
    borderColor: "border-amber-200",
    title: "Performance Chasing",
  },
  overtrading: {
    icon: BarChart3,
    color: "text-purple-600 bg-purple-50",
    borderColor: "border-purple-200",
    title: "Overtrading Alert",
  },
  illiquidity_creep: {
    icon: Droplets,
    color: "text-blue-600 bg-blue-50",
    borderColor: "border-blue-200",
    title: "Illiquidity Warning",
  },
};

export default function CircuitBreakers() {
  const queryClient = useQueryClient();

  const { data: alerts } = useQuery({
    queryKey: ["circuit-breaker-alerts"],
    queryFn: () => base44.entities.CircuitBreakerAlert.list("-created_date", 20),
    initialData: [],
  });

  const activeAlerts = alerts.filter((a) => a.status === "active");
  const resolvedAlerts = alerts.filter((a) => a.status !== "active");

  const handleAcknowledge = async (alert) => {
    await base44.entities.CircuitBreakerAlert.update(alert.id, { status: "acknowledged" });
    queryClient.invalidateQueries({ queryKey: ["circuit-breaker-alerts"] });
  };

  const handleOverride = async (alert) => {
    await base44.entities.CircuitBreakerAlert.update(alert.id, { status: "overridden" });
    queryClient.invalidateQueries({ queryKey: ["circuit-breaker-alerts"] });
  };

  const handleCoolOff = async (alert) => {
    const coolOffTime = new Date();
    coolOffTime.setHours(coolOffTime.getHours() + 48);
    await base44.entities.CircuitBreakerAlert.update(alert.id, {
      status: "acknowledged",
      cooling_off_until: coolOffTime.toISOString(),
    });
    queryClient.invalidateQueries({ queryKey: ["circuit-breaker-alerts"] });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          <h1 className="text-xl font-bold text-[#0F1729]">Behavioral Circuit Breakers</h1>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Protecting you from emotionally-driven financial decisions
        </p>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Alerts</h3>
          {activeAlerts.map((alert) => {
            const config = alertTypeConfig[alert.alert_type] || alertTypeConfig.panic_selling;
            const Icon = config.icon;
            return (
              <div key={alert.id} className={`wealth-card border-l-4 ${config.borderColor} p-6`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className={`text-[10px] ${
                        alert.severity === "critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {alert.severity}
                      </Badge>
                      <span className="text-xs text-gray-400">{config.title}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#0F1729]">{alert.title}</h4>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{alert.description}</p>

                    {alert.historical_context && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-xs font-medium text-gray-600 mb-1">Your History</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{alert.historical_context}</p>
                      </div>
                    )}

                    {alert.recommendation && (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <p className="text-xs font-medium text-emerald-700 mb-1">Recommendation</p>
                        <p className="text-xs text-emerald-600 leading-relaxed">{alert.recommendation}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => handleCoolOff(alert)}
                        className="bg-[#0F1729] hover:bg-[#1A2440] text-white text-xs h-8 px-4"
                      >
                        <Clock className="w-3.5 h-3.5 mr-1.5" /> 48h Cool-Off
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcknowledge(alert)}
                        className="text-xs h-8"
                      >
                        Acknowledge
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOverride(alert)}
                        className="text-xs h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Override & Proceed
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeAlerts.length === 0 && (
        <div className="wealth-card p-12 text-center">
          <Shield className="w-12 h-12 mx-auto mb-3 text-emerald-200" />
          <h3 className="text-sm font-semibold text-gray-700">No Active Alerts</h3>
          <p className="text-xs text-gray-400 mt-1">Your behavioral patterns look healthy</p>
        </div>
      )}

      {/* Resolved */}
      {resolvedAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">History</h3>
          {resolvedAlerts.map((alert) => {
            const config = alertTypeConfig[alert.alert_type] || alertTypeConfig.panic_selling;
            const Icon = config.icon;
            return (
              <div key={alert.id} className="wealth-card p-4 opacity-60">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{alert.title}</p>
                    <p className="text-xs text-gray-400">{config.title}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{alert.status}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}