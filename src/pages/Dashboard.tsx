import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { Shield, AlertTriangle, Bug, CheckCircle, TrendingUp, Activity, Globe, Clock } from "lucide-react";

const owaspData = [
  { name: "A01:Broken Access", count: 14, color: "hsl(0,72%,50%)" },
  { name: "A02:Crypto Fail", count: 8, color: "hsl(25,80%,50%)" },
  { name: "A03:Injection", count: 22, color: "hsl(0,72%,50%)" },
  { name: "A04:Insecure Design", count: 5, color: "hsl(45,80%,50%)" },
  { name: "A05:Misconfig", count: 18, color: "hsl(25,80%,50%)" },
  { name: "A06:Vuln Components", count: 12, color: "hsl(25,80%,50%)" },
  { name: "A07:Auth Fail", count: 9, color: "hsl(45,80%,50%)" },
  { name: "A08:Data Integrity", count: 6, color: "hsl(45,80%,50%)" },
  { name: "A09:Logging Fail", count: 11, color: "hsl(25,80%,50%)" },
  { name: "A10:SSRF", count: 3, color: "hsl(142,50%,50%)" },
];

const severityData = [
  { name: "Critical", value: 8, color: "hsl(0,72%,50%)" },
  { name: "High", value: 15, color: "hsl(25,80%,50%)" },
  { name: "Medium", value: 24, color: "hsl(45,80%,50%)" },
  { name: "Low", value: 12, color: "hsl(142,50%,50%)" },
];

const attackTrend = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  attacks: Math.floor(Math.random() * 50) + 10,
  blocked: Math.floor(Math.random() * 30) + 5,
}));

const threatFeed = [
  { time: "09:15:32", type: "SQLi", source: "185.220.101.42", target: "/api/users", severity: "critical" },
  { time: "09:14:58", type: "XSS", source: "103.75.190.11", target: "/search", severity: "high" },
  { time: "09:14:12", type: "BruteForce", source: "45.33.32.156", target: "/login", severity: "high" },
  { time: "09:13:45", type: "DirTraversal", source: "198.51.100.23", target: "/files/../etc", severity: "critical" },
  { time: "09:12:30", type: "CSRF", source: "203.0.113.50", target: "/api/transfer", severity: "medium" },
  { time: "09:11:15", type: "IDOR", source: "192.0.2.100", target: "/api/users/99", severity: "high" },
  { time: "09:10:02", type: "FileUpload", source: "198.18.0.15", target: "/upload", severity: "medium" },
  { time: "09:09:48", type: "CmdInject", source: "100.24.58.33", target: "/api/ping", severity: "critical" },
];

const MetricCard = ({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: string; trend?: string; color: string }) => (
  <div className="rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors">
    <div className="flex items-center justify-between mb-3">
      <Icon className={`h-5 w-5 ${color}`} />
      {trend && <span className="text-xs font-mono text-primary flex items-center gap-1"><TrendingUp className="h-3 w-3" />{trend}</span>}
    </div>
    <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const Dashboard = () => {
  const [liveAttacks, setLiveAttacks] = useState(attackTrend);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAttacks((prev) => {
        const updated = [...prev];
        const idx = Math.floor(Math.random() * updated.length);
        updated[idx] = { ...updated[idx], attacks: updated[idx].attacks + Math.floor(Math.random() * 5) };
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Security Dashboard</h1>
        <p className="text-muted-foreground text-sm">Real-time threat monitoring and risk overview</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Bug} label="Total Vulnerabilities" value="59" trend="+12%" color="text-destructive" />
        <MetricCard icon={AlertTriangle} label="Critical Findings" value="8" trend="+3" color="text-destructive" />
        <MetricCard icon={Shield} label="Mitigated" value="34" color="text-primary" />
        <MetricCard icon={CheckCircle} label="Risk Score" value="72/100" color="text-accent-foreground" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">OWASP Top 10 Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={owaspData} layout="vertical" margin={{ left: 100 }}>
              <XAxis type="number" stroke="hsl(220,10%,55%)" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="hsl(220,10%,55%)" fontSize={10} width={95} />
              <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(142,30%,18%)", borderRadius: 8, color: "hsl(150,30%,85%)" }} />
              <Bar dataKey="count" fill="hsl(142,72%,45%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">Severity Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={severityData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                {severityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(142,30%,18%)", borderRadius: 8, color: "hsl(150,30%,85%)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attack Trend */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-foreground">24h Attack Trend</h3>
          <span className="flex items-center gap-1 text-xs text-primary font-mono animate-pulse-glow"><Activity className="h-3 w-3" /> LIVE</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={liveAttacks}>
            <XAxis dataKey="hour" stroke="hsl(220,10%,55%)" fontSize={10} />
            <YAxis stroke="hsl(220,10%,55%)" fontSize={10} />
            <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(142,30%,18%)", borderRadius: 8, color: "hsl(150,30%,85%)" }} />
            <Area type="monotone" dataKey="attacks" stroke="hsl(0,72%,50%)" fill="hsl(0,72%,50%,0.2)" />
            <Area type="monotone" dataKey="blocked" stroke="hsl(142,72%,45%)" fill="hsl(142,72%,45%,0.2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Live Threat Feed */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-foreground">Live Threat Feed</h3>
          <span className="flex items-center gap-1 text-xs text-primary font-mono"><Globe className="h-3 w-3" /> {threatFeed.length} events</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-mono text-xs">
                <th className="text-left py-2 px-3">Time</th>
                <th className="text-left py-2 px-3">Type</th>
                <th className="text-left py-2 px-3">Source IP</th>
                <th className="text-left py-2 px-3">Target</th>
                <th className="text-left py-2 px-3">Severity</th>
              </tr>
            </thead>
            <tbody>
              {threatFeed.map((t, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-2 px-3 font-mono text-xs text-muted-foreground"><Clock className="h-3 w-3 inline mr-1" />{t.time}</td>
                  <td className="py-2 px-3 font-mono text-accent-foreground">{t.type}</td>
                  <td className="py-2 px-3 font-mono text-foreground">{t.source}</td>
                  <td className="py-2 px-3 font-mono text-muted-foreground">{t.target}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                      t.severity === "critical" ? "bg-destructive/20 text-destructive" :
                      t.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>{t.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
