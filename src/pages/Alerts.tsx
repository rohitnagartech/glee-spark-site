import { useState } from "react";
import { Bell, CheckCircle, XCircle, Filter } from "lucide-react";
import { useAppContext, type Alert } from "@/context/AppContext";

const Alerts = () => {
  const { alerts, dismissAlert } = useAppContext();
  const [filter, setFilter] = useState<"all" | "unread" | Alert["type"]>("all");

  const filtered = alerts.filter((a) => {
    if (filter === "all") return true;
    if (filter === "unread") return !a.read;
    return a.type === filter;
  });

  const severityColor = (type: Alert["type"]) =>
    type === "critical" ? "border-destructive/50 bg-destructive/5" :
    type === "high" ? "border-orange-500/50 bg-orange-500/5" :
    type === "medium" ? "border-yellow-500/50 bg-yellow-500/5" :
    "border-primary/50 bg-primary/5";

  const badgeColor = (type: Alert["type"]) =>
    type === "critical" ? "bg-destructive/20 text-destructive" :
    type === "high" ? "bg-orange-500/20 text-orange-400" :
    type === "medium" ? "bg-yellow-500/20 text-yellow-400" :
    "bg-primary/20 text-primary";

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground text-sm">{unreadCount} unread alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-muted border border-border rounded-md px-2 py-1.5 text-sm font-mono text-foreground"
          >
            <option value="all">All ({alerts.length})</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {(["critical", "high", "medium", "low"] as const).map((type) => {
          const count = alerts.filter((a) => a.type === type && !a.read).length;
          return (
            <button key={type} onClick={() => setFilter(type)} className={`rounded-lg border p-3 text-center transition-all ${filter === type ? "border-primary bg-accent" : "border-border bg-card hover:border-primary/30"}`}>
              <p className="text-xl font-heading font-bold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground capitalize">{type}</p>
            </button>
          );
        })}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div key={alert.id} className={`rounded-lg border p-4 transition-all ${alert.read ? "opacity-50 border-border bg-card" : severityColor(alert.type)}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Bell className={`h-5 w-5 mt-0.5 flex-shrink-0 ${alert.type === "critical" ? "text-destructive" : alert.type === "high" ? "text-orange-400" : alert.type === "medium" ? "text-yellow-400" : "text-primary"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${badgeColor(alert.type)}`}>{alert.type}</span>
                    <span className="text-sm font-heading font-bold text-foreground">{alert.title}</span>
                    {!alert.read && <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground font-mono">
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    <span>Source: {alert.source}</span>
                  </div>
                </div>
              </div>
              {!alert.read && (
                <button onClick={() => dismissAlert(alert.id)} className="px-3 py-1 text-xs font-mono rounded-md border border-border bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  Dismiss
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground text-sm text-center py-12">No alerts match the current filter</p>}
      </div>
    </div>
  );
};

export default Alerts;
