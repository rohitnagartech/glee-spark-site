import { useState } from "react";
import { Search, Globe, Lock, KeyRound, FormInput, AlertTriangle, CheckCircle, Plus, Trash2 } from "lucide-react";

interface Endpoint {
  id: string;
  url: string;
  method: string;
  authRequired: boolean;
  parameters: string[];
  riskLevel: "low" | "medium" | "high";
  inputFields: string[];
}

const initialEndpoints: Endpoint[] = [
  { id: "1", url: "/api/users", method: "GET", authRequired: true, parameters: ["id", "page", "limit"], riskLevel: "medium", inputFields: ["query params"] },
  { id: "2", url: "/api/users/:id", method: "PUT", authRequired: true, parameters: ["name", "email", "role"], riskLevel: "high", inputFields: ["JSON body"] },
  { id: "3", url: "/login", method: "POST", authRequired: false, parameters: ["username", "password"], riskLevel: "high", inputFields: ["form fields"] },
  { id: "4", url: "/search", method: "GET", authRequired: false, parameters: ["q", "category"], riskLevel: "high", inputFields: ["query params"] },
  { id: "5", url: "/api/files/upload", method: "POST", authRequired: true, parameters: ["file", "description"], riskLevel: "high", inputFields: ["multipart form"] },
  { id: "6", url: "/api/orders", method: "GET", authRequired: true, parameters: ["user_id", "status"], riskLevel: "medium", inputFields: ["query params"] },
  { id: "7", url: "/api/admin/config", method: "GET", authRequired: true, parameters: [], riskLevel: "high", inputFields: [] },
  { id: "8", url: "/health", method: "GET", authRequired: false, parameters: [], riskLevel: "low", inputFields: [] },
];

const riskIndicators = [
  { label: "Unvalidated Input", count: 4, icon: FormInput },
  { label: "Weak Authentication", count: 2, icon: Lock },
  { label: "Exposed Admin Panels", count: 1, icon: AlertTriangle },
  { label: "Missing Rate Limiting", count: 3, icon: Globe },
];

const authFlows = [
  { flow: "Login → JWT Token → Cookie Storage", risk: "Session fixation possible — no token rotation on login", severity: "high" as const },
  { flow: "Password Reset → Email Link → Token Validation", risk: "Token does not expire — valid indefinitely", severity: "critical" as const },
  { flow: "OAuth2 → Google → Callback → Session", risk: "State parameter not validated — CSRF risk", severity: "medium" as const },
  { flow: "API Key → Header → Backend Validation", risk: "API key transmitted without TLS enforcement", severity: "medium" as const },
];

const Recon = () => {
  const [endpoints, setEndpoints] = useState(initialEndpoints);
  const [newUrl, setNewUrl] = useState("");
  const [newMethod, setNewMethod] = useState("GET");
  const [filter, setFilter] = useState("");
  const [scanningUrl, setScanningUrl] = useState("");
  const [scanResults, setScanResults] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const addEndpoint = () => {
    if (!newUrl.trim()) return;
    const ep: Endpoint = {
      id: Date.now().toString(),
      url: newUrl,
      method: newMethod,
      authRequired: false,
      parameters: [],
      riskLevel: "medium",
      inputFields: [],
    };
    setEndpoints([...endpoints, ep]);
    setNewUrl("");
  };

  const removeEndpoint = (id: string) => setEndpoints(endpoints.filter((e) => e.id !== id));

  const runScan = () => {
    if (!scanningUrl.trim()) return;
    setIsScanning(true);
    setScanResults([]);
    const findings = [
      `[INFO] Scanning ${scanningUrl}...`,
      `[FOUND] /api/users — GET (200 OK)`,
      `[FOUND] /api/users/:id — PUT (requires auth)`,
      `[FOUND] /login — POST (login endpoint)`,
      `[FOUND] /search — GET (accepts user input)`,
      `[FOUND] /api/files/upload — POST (file upload)`,
      `[WARNING] /api/admin/config — exposed without rate limiting`,
      `[WARNING] /debug/vars — debug endpoint accessible`,
      `[FOUND] /health — GET (public)`,
      `[COMPLETE] Found 8 endpoints, 2 warnings`,
    ];
    findings.forEach((f, i) => {
      setTimeout(() => {
        setScanResults((prev) => [...prev, f]);
        if (i === findings.length - 1) setIsScanning(false);
      }, (i + 1) * 400);
    });
  };

  const filtered = endpoints.filter((e) => e.url.toLowerCase().includes(filter.toLowerCase()) || e.method.includes(filter.toUpperCase()));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Recon & Discovery</h1>
        <p className="text-muted-foreground text-sm">Endpoint mapper, auth flow analysis, input field cataloging</p>
      </div>

      {/* URL Scanner */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-3">Endpoint Scanner</h3>
        <div className="flex gap-2 mb-4">
          <input
            value={scanningUrl}
            onChange={(e) => setScanningUrl(e.target.value)}
            placeholder="Enter target URL (e.g., https://example.com)"
            className="flex-1 bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button onClick={runScan} disabled={isScanning} className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-mono text-sm hover:opacity-90 disabled:opacity-50">
            {isScanning ? "Scanning..." : "Scan"}
          </button>
        </div>
        {scanResults.length > 0 && (
          <div className="bg-background rounded-md p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
            {scanResults.map((r, i) => (
              <div key={i} className={r.includes("WARNING") ? "text-yellow-400" : r.includes("COMPLETE") ? "text-primary" : "text-muted-foreground"}>
                {r}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {riskIndicators.map((ri) => (
          <div key={ri.label} className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
            <ri.icon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xl font-heading font-bold text-foreground">{ri.count}</p>
              <p className="text-xs text-muted-foreground">{ri.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Endpoint Mapper */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-foreground">Endpoint Map</h3>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter endpoints..."
            className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48"
          />
        </div>
        <div className="flex gap-2 mb-4">
          <select value={newMethod} onChange={(e) => setNewMethod(e.target.value)} className="bg-muted border border-border rounded-md px-2 py-1.5 text-sm font-mono text-foreground">
            <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option>
          </select>
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Add endpoint path..."
            className="flex-1 bg-muted border border-border rounded-md px-3 py-1.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            onKeyDown={(e) => e.key === "Enter" && addEndpoint()}
          />
          <button onClick={addEndpoint} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm"><Plus className="h-4 w-4" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-mono text-xs">
                <th className="text-left py-2 px-3">Method</th>
                <th className="text-left py-2 px-3">Endpoint</th>
                <th className="text-left py-2 px-3">Auth</th>
                <th className="text-left py-2 px-3">Parameters</th>
                <th className="text-left py-2 px-3">Risk</th>
                <th className="text-left py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ep) => (
                <tr key={ep.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-2 px-3"><span className={`font-mono text-xs px-2 py-0.5 rounded ${ep.method === "GET" ? "bg-primary/20 text-primary" : ep.method === "POST" ? "bg-yellow-500/20 text-yellow-400" : ep.method === "PUT" ? "bg-orange-500/20 text-orange-400" : "bg-destructive/20 text-destructive"}`}>{ep.method}</span></td>
                  <td className="py-2 px-3 font-mono text-foreground">{ep.url}</td>
                  <td className="py-2 px-3">{ep.authRequired ? <Lock className="h-4 w-4 text-primary" /> : <span className="text-muted-foreground text-xs">public</span>}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">{ep.parameters.join(", ") || "—"}</td>
                  <td className="py-2 px-3"><span className={`text-xs font-mono px-2 py-0.5 rounded-full ${ep.riskLevel === "high" ? "bg-destructive/20 text-destructive" : ep.riskLevel === "medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-primary/20 text-primary"}`}>{ep.riskLevel}</span></td>
                  <td className="py-2 px-3"><button onClick={() => removeEndpoint(ep.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auth Flow Analysis */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">Authentication Flow Analysis</h3>
        <div className="space-y-3">
          {authFlows.map((af, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-muted/30 border border-border/50">
              <KeyRound className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-mono text-foreground">{af.flow}</p>
                <p className="text-xs text-muted-foreground mt-1">{af.risk}</p>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${af.severity === "critical" ? "bg-destructive/20 text-destructive" : af.severity === "high" ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>{af.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recon;
