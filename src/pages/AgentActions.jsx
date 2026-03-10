import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Filter } from "lucide-react";
import ActionCard from "@/components/dashboard/ActionCard";

export default function AgentActions() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const queryClient = useQueryClient();

  const { data: actions, isLoading } = useQuery({
    queryKey: ["all-agent-actions"],
    queryFn: () => base44.entities.AgentAction.list("-created_date", 50),
    initialData: [],
  });

  const filtered = statusFilter === "all"
    ? actions
    : actions.filter((a) => a.status === statusFilter);

  const handleApprove = async (action) => {
    await base44.entities.AgentAction.update(action.id, { status: "approved" });
    queryClient.invalidateQueries({ queryKey: ["all-agent-actions"] });
  };

  const handleDismiss = async (action) => {
    await base44.entities.AgentAction.update(action.id, { status: "dismissed" });
    queryClient.invalidateQueries({ queryKey: ["all-agent-actions"] });
  };

  const counts = actions.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h1 className="text-xl font-bold text-[#0F1729]">Agent Recommendations</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Your AI wealth agent has prepared {counts.pending || 0} actions awaiting your approval
          </p>
        </div>
      </div>

      {/* Filters */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="pending" className="text-xs">
            Pending ({counts.pending || 0})
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-xs">
            Approved ({counts.approved || 0})
          </TabsTrigger>
          <TabsTrigger value="dismissed" className="text-xs">
            Dismissed ({counts.dismissed || 0})
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs">
            All ({actions.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Actions List */}
      {filtered.length === 0 ? (
        <div className="wealth-card p-12 text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">
            {statusFilter === "pending"
              ? "All caught up! No pending actions."
              : `No ${statusFilter} actions.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((action) => (
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
  );
}