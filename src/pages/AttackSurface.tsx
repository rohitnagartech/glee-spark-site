import { useState, useEffect } from "react";
import { Network, Wifi, WifiOff, Globe, Server, Database, Shield, Monitor } from "lucide-react";

interface Node {
  id: string;
  label: string;
  type: "internet" | "firewall" | "server" | "database" | "service";
  x: number;
  y: number;
  status: "online" | "warning" | "offline";
  connections: string[];
  details: string;
}

const networkNodes: Node[] = [
  { id: "internet", label: "Public Internet", type: "internet", x: 50, y: 10, status: "online", connections: ["waf"], details: "External traffic entry point" },
  { id: "waf", label: "WAF / CDN", type: "firewall", x: 50, y: 25, status: "online", connections: ["lb"], details: "Cloudflare WAF - filtering malicious requests" },
  { id: "lb", label: "Load Balancer", type: "server", x: 50, y: 40, status: "online", connections: ["web1", "web2"], details: "Nginx reverse proxy - SSL termination" },
  { id: "web1", label: "Web Server 1", type: "server", x: 25, y: 55, status: "online", connections: ["app"], details: "Node.js v18 - port 3000" },
  { id: "web2", label: "Web Server 2", type: "server", x: 75, y: 55, status: "warning", connections: ["app"], details: "Node.js v18 - high CPU usage" },
  { id: "app", label: "App Server", type: "service", x: 50, y: 70, status: "online", connections: ["db", "cache", "api"], details: "Express.js API - handles business logic" },
  { id: "db", label: "PostgreSQL", type: "database", x: 25, y: 85, status: "online", connections: [], details: "Primary DB - customer data, auth records" },
  { id: "cache", label: "Redis Cache", type: "database", x: 50, y: 85, status: "online", connections: [], details: "Session store, rate limiting counters" },
  { id: "api", label: "External APIs", type: "service", x: 75, y: 85, status: "online", connections: [], details: "Payment gateway, email service, OAuth providers" },
];

const surfaceMetrics = [
  { label: "Open Ports", value: "12", detail: "3 unnecessary ports detected" },
  { label: "Public Endpoints", value: "47", detail: "8 without authentication" },
  { label: "External Integrations", value: "5", detail: "2 using HTTP (not HTTPS)" },
  { label: "Attack Vectors", value: "23", detail: "9 critical, 14 non-critical" },
];

const connectionLog = [
  { time: "09:15:32", src: "185.220.101.42", dst: "Web Server 1", port: 443, status: "blocked", reason: "WAF rule: SQLi pattern" },
  { time: "09:15:28", src: "203.0.113.50", dst: "Load Balancer", port: 443, status: "allowed", reason: "Valid HTTPS request" },
  { time: "09:15:25", src: "103.75.190.11", dst: "Web Server 2", port: 443, status: "blocked", reason: "Rate limit exceeded" },
  { time: "09:15:20", src: "192.168.1.100", dst: "App Server", port: 3000, status: "allowed", reason: "Internal request" },
  { time: "09:15:15", src: "45.33.32.156", dst: "Web Server 1", port: 22, status: "blocked", reason: "SSH brute force attempt" },
  { time: "09:15:10", src: "10.0.0.5", dst: "PostgreSQL", port: 5432, status: "allowed", reason: "App server query" },
];

const getIcon = (type: Node["type"]) => {
  switch (type) {
    case "internet": return Globe;
    case "firewall": return Shield;
    case "server": return Server;
    case "database": return Database;
    case "service": return Monitor;
  }
};

const AttackSurface = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [liveConnections, setLiveConnections] = useState(connectionLog);

  useEffect(() => {
    const interval = setInterval(() => {
      const sources = ["185.220.101.42", "103.75.190.11", "45.33.32.156", "192.168.1.50", "10.0.0.5"];
      const dests = ["Web Server 1", "Web Server 2", "Load Balancer", "App Server"];
      setLiveConnections((prev) => [{
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        src: sources[Math.floor(Math.random() * sources.length)],
        dst: dests[Math.floor(Math.random() * dests.length)],
        port: [80, 443, 22, 3000, 5432][Math.floor(Math.random() * 5)],
        status: Math.random() > 0.4 ? "allowed" : "blocked",
        reason: Math.random() > 0.5 ? "Valid request" : "Security rule triggered",
      }, ...prev].slice(0, 20));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Attack Surface Map</h1>
        <p className="text-muted-foreground text-sm">Network topology visualization, connection monitor, surface analysis</p>
      </div>

      {/* Surface Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {surfaceMetrics.map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-heading font-bold text-foreground">{m.value}</p>
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <p className="text-xs text-accent-foreground mt-1">{m.detail}</p>
          </div>
        ))}
      </div>

      {/* Network Topology */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">Network Topology</h3>
          <div className="relative bg-muted/20 rounded-md p-4" style={{ minHeight: 400 }}>
            {/* SVG connections */}
            <svg className="absolute inset-0 w-full h-full" style={{ minHeight: 400 }}>
              {networkNodes.map((node) =>
                node.connections.map((connId) => {
                  const target = networkNodes.find((n) => n.id === connId);
                  if (!target) return null;
                  return (
                    <line key={`${node.id}-${connId}`} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke="hsl(142,30%,25%)" strokeWidth={1.5} strokeDasharray="4,4" />
                  );
                })
              )}
            </svg>
            {/* Nodes */}
            {networkNodes.map((node) => {
              const Icon = getIcon(node.type);
              return (
                <button key={node.id} onClick={() => setSelectedNode(node)} className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${selectedNode?.id === node.id ? "border-primary bg-accent border-glow z-10" : "border-border bg-card hover:border-primary/50"}`} style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                  <div className="relative">
                    <Icon className={`h-5 w-5 ${node.status === "online" ? "text-primary" : node.status === "warning" ? "text-yellow-400" : "text-destructive"}`} />
                    <span className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${node.status === "online" ? "bg-primary" : node.status === "warning" ? "bg-yellow-400" : "bg-destructive"}`} />
                  </div>
                  <span className="text-[10px] font-mono text-foreground whitespace-nowrap">{node.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Node Details */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-3">Node Details</h3>
          {selectedNode ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {(() => { const I = getIcon(selectedNode.type); return <I className="h-6 w-6 text-primary" />; })()}
                <span className="text-lg font-heading font-bold text-foreground">{selectedNode.label}</span>
              </div>
              <div><p className="text-xs text-muted-foreground font-mono">STATUS</p><span className={`text-sm font-mono ${selectedNode.status === "online" ? "text-primary" : selectedNode.status === "warning" ? "text-yellow-400" : "text-destructive"}`}>{selectedNode.status.toUpperCase()}</span></div>
              <div><p className="text-xs text-muted-foreground font-mono">TYPE</p><p className="text-sm text-foreground">{selectedNode.type}</p></div>
              <div><p className="text-xs text-muted-foreground font-mono">DETAILS</p><p className="text-sm text-card-foreground">{selectedNode.details}</p></div>
              <div><p className="text-xs text-muted-foreground font-mono">CONNECTIONS</p><p className="text-sm text-foreground">{selectedNode.connections.length > 0 ? selectedNode.connections.join(", ") : "Terminal node"}</p></div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-12">Click a node to view details</p>
          )}
        </div>
      </div>

      {/* Connection Monitor */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-foreground">Connection Monitor</h3>
          <span className="flex items-center gap-1 text-xs text-primary font-mono animate-pulse-glow"><Wifi className="h-3 w-3" /> LIVE</span>
        </div>
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border text-muted-foreground font-mono text-xs">
                <th className="text-left py-2 px-3">Time</th>
                <th className="text-left py-2 px-3">Source</th>
                <th className="text-left py-2 px-3">Destination</th>
                <th className="text-left py-2 px-3">Port</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Reason</th>
              </tr>
            </thead>
            <tbody>
              {liveConnections.map((c, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-1.5 px-3 font-mono text-xs text-muted-foreground">{c.time}</td>
                  <td className="py-1.5 px-3 font-mono text-xs text-foreground">{c.src}</td>
                  <td className="py-1.5 px-3 font-mono text-xs text-foreground">{c.dst}</td>
                  <td className="py-1.5 px-3 font-mono text-xs text-muted-foreground">{c.port}</td>
                  <td className="py-1.5 px-3">{c.status === "allowed" ? <span className="text-xs text-primary font-mono">ALLOWED</span> : <span className="text-xs text-destructive font-mono">BLOCKED</span>}</td>
                  <td className="py-1.5 px-3 text-xs text-muted-foreground">{c.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttackSurface;
