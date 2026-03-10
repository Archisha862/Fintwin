import React from "react";
import { Check, X, AlertTriangle, DollarSign, RefreshCw, Clock } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  approved: { icon: Check, color: "text-emerald-500 bg-emerald-50" },
  executed: { icon: Check, color: "text-emerald-500 bg-emerald-50" },
  dismissed: { icon: X, color: "text-gray-400 bg-gray-50" },
  pending: { icon: Clock, color: "text-amber-500 bg-amber-50" },
  expired: { icon: Clock, color: "text-gray-400 bg-gray-50" },
};

export default function ActivityFeed({ actions }) {
  if (!actions || actions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {actions.map((action) => {
        const config = statusConfig[action.status] || statusConfig.pending;
        const Icon = config.icon;
        return (
          <div key={action.id} className="flex items-center gap-3 py-2.5 px-1">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{action.title}</p>
              <p className="text-[10px] text-gray-400">
                {action.updated_date ? format(new Date(action.updated_date), "MMM d, h:mm a") : ""}
              </p>
            </div>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              action.status === "approved" || action.status === "executed" ? "bg-emerald-50 text-emerald-600" :
              action.status === "dismissed" ? "bg-gray-50 text-gray-500" :
              "bg-amber-50 text-amber-600"
            }`}>
              {action.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}