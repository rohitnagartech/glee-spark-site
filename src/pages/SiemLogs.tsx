import { useState } from "react";
import { FileText, Search, Filter, AlertTriangle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "critical";
  source: string;
  message: string;
  ip: string;
  endpoint: string;
}

const generateLogs = (): LogEntry[] => {
  const sources = ["nginx", "app-server", "auth-service", "waf", "db-proxy"];
  const levels: LogEntry["level"][] = ["info", "warning", "error", "critical"];
  const messages = [
    "GET /api/users 200 OK",
    "POST /login 401 Invalid credentials",
    "SQL injection pattern detected in request body",
    "Rate limit exceeded for IP",
    "File upload attempt with .php extension blocked",
    "GET /api/admin/config 403 Forbidden",
    "XSS payload detected in query parameter",
    "Session token expired for user",
    "Directory traversal attempt: ../../../etc/passwd",
    "Brute force: 50 failed login attempts in 5 minutes",
    "GET /debug/vars 200 - exposed endpoint accessed",
    "POST /api/users 201 Created",
    "CORS violation from origin: evil-site.com",
    "SSL certificate renewal successful",
    "Database connection pool exhausted",
  ];
  const ips = ["185.220.101.42", "103.75.190.11", "45.33.32.156", "192.168.1.10", "10.0.0.5", "203.0.113.50", "198.51.100.23"];

  return Array.from({ length: 100 }, (_, i) => ({
    id: String(i),
    timestamp: `2026-04-01T${String(Math.floor(i / 4)).padStart(2, "0")}:${String((i * 15) % 60).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}Z`,
    level: levels[Math.floor(Math.random() * (i % 3 === 0 ? 4 : 2))],
    source: sources[Math.floor(Math.random() * sources.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    ip: ips[Math.floor(Math.random() * ips.length)],
    endpoint: ["/api/users", "/login", "/search", "/upload", "/api/admin/config", "/debug/vars"][Math.floor(Math.random() * 6)],
  }));
};

const allLogs = generateLogs();

const errorRateData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  errors4xx: Math.floor(Math.random() * 30) + 5,
  errors5xx: Math.floor(Math.random() * 10),
}));

const patternData = [
  { pattern: "SQLi Attempts", count: 47 },
  { pattern: "XSS Payloads", count: 32 },
  { pattern: "Brute Force", count: 89 },
  { pattern: "Dir Traversal", count: 15 },
  { pattern: "File Upload", count: 8 },
  { pattern: "SSRF Attempts", count: 5 },
];

const geoData = [
  { country: "Russia", requests: 342, blocked: 298 },
  { country: "China", requests: 256, blocked: 201 },
  { country: "USA", requests: 1250, blocked: 12 },
  { country: "Brazil", requests: 89, blocked: 45 },
  { country: "India", requests: 167, blocked: 23 },
  { country: "Germany", requests: 445, blocked: 8 },
];

const SiemLogs = () => {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const perPage = 20;

  const filtered = allLogs.filter((l) =>
    (levelFilter === "all" || l.level === levelFilter) &&
    (sourceFilter === "all" || l.source === sourceFilter) &&
    (search === "" || l.message.toLowerCase().includes(search.toLowerCase()) || l.ip.includes(search))
  );

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const levelColor = (l: string) => l === "critical" ? "bg-destructive/20 text-destructive" : l === "error" ? "bg-orange-500/20 text-orange-400" : l === "warning" ? "bg-yellow-500/20 text-yellow-400" : "bg-primary/20 text-primary";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">SIEM Logs</h1>
        <p className="text-muted-foreground text-sm">Filterable log table, pattern detection, error rate charts, geo anomalies</p>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-3">Error Rate (24h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={errorRateData}>
              <XAxis dataKey="hour" stroke="hsl(220,10%,55%)" fontSize={10} />
              <YAxis stroke="hsl(220,10%,55%)" fontSize={10} />
              <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(142,30%,18%)", borderRadius: 8, color: "hsl(150,30%,85%)" }} />
              <Line type="monotone" dataKey="errors4xx" stroke="hsl(45,80%,50%)" strokeWidth={2} dot={false} name="4xx" />
              <Line type="monotone" dataKey="errors5xx" stroke="hsl(0,72%,50%)" strokeWidth={2} dot={false} name="5xx" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-3">Attack Pattern Detection</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={patternData}>
              <XAxis dataKey="pattern" stroke="hsl(220,10%,55%)" fontSize={9} />
              <YAxis stroke="hsl(220,10%,55%)" fontSize={10} />
              <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(142,30%,18%)", borderRadius: 8, color: "hsl(150,30%,85%)" }} />
              <Bar dataKey="count" fill="hsl(142,72%,45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geo Anomalies */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-3">Geographic Anomalies</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {geoData.map((g) => (
            <div key={g.country} className="p-3 rounded-md border border-border bg-muted/20 text-center">
              <p className="text-sm font-mono font-bold text-foreground">{g.country}</p>
              <p className="text-xs text-muted-foreground">{g.requests} requests</p>
              <p className="text-xs text-destructive">{g.blocked} blocked</p>
            </div>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search logs..." className="flex-1 bg-muted border border-border rounded-md px-3 py-1.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <select value={levelFilter} onChange={(e) => { setLevelFilter(e.target.value); setPage(0); }} className="bg-muted border border-border rounded-md px-2 py-1.5 text-sm font-mono text-foreground">
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
          <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(0); }} className="bg-muted border border-border rounded-md px-2 py-1.5 text-sm font-mono text-foreground">
            <option value="all">All Sources</option>
            <option value="nginx">nginx</option>
            <option value="app-server">app-server</option>
            <option value="auth-service">auth-service</option>
            <option value="waf">waf</option>
            <option value="db-proxy">db-proxy</option>
          </select>
          <span className="text-xs text-muted-foreground font-mono">{filtered.length} results</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-mono text-xs">
                <th className="text-left py-2 px-3">Timestamp</th>
                <th className="text-left py-2 px-3">Level</th>
                <th className="text-left py-2 px-3">Source</th>
                <th className="text-left py-2 px-3">IP</th>
                <th className="text-left py-2 px-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((l) => (
                <tr key={l.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-1.5 px-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{l.timestamp.replace("T", " ").replace("Z", "")}</td>
                  <td className="py-1.5 px-3"><span className={`text-xs font-mono px-2 py-0.5 rounded-full ${levelColor(l.level)}`}>{l.level}</span></td>
                  <td className="py-1.5 px-3 text-xs font-mono text-foreground">{l.source}</td>
                  <td className="py-1.5 px-3 text-xs font-mono text-muted-foreground">{l.ip}</td>
                  <td className="py-1.5 px-3 text-xs text-card-foreground">{l.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3">
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-3 py-1 text-xs font-mono text-muted-foreground hover:text-foreground disabled:opacity-30">← Prev</button>
          <span className="text-xs font-mono text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="px-3 py-1 text-xs font-mono text-muted-foreground hover:text-foreground disabled:opacity-30">Next →</button>
        </div>
      </div>
    </div>
  );
};

export default SiemLogs;
