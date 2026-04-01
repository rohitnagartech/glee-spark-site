import { useState } from "react";
import { ClipboardList, Download, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Finding {
  id: string;
  name: string;
  owasp: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  cvss: number;
  url: string;
  status: "open" | "remediated" | "accepted";
  evidence: string;
}

const findings: Finding[] = [
  { id: "F001", name: "SQL Injection", owasp: "A03:Injection", severity: "Critical", cvss: 9.8, url: "/api/users?id=", status: "open", evidence: "Payload: 1 OR 1=1 -- returned all user records" },
  { id: "F002", name: "Stored XSS", owasp: "A03:Injection", severity: "Critical", cvss: 9.1, url: "/api/comments", status: "open", evidence: "Script execution confirmed in browser via img onerror" },
  { id: "F003", name: "Hardcoded API Key", owasp: "A02:Crypto Failures", severity: "Critical", cvss: 9.0, url: "src/config/database.js", status: "remediated", evidence: "AWS_SECRET_KEY found in source code" },
  { id: "F004", name: "IDOR User Profiles", owasp: "A01:Broken Access", severity: "High", cvss: 7.5, url: "/api/users/:id/profile", status: "open", evidence: "User 42 accessed user 99 profile data" },
  { id: "F005", name: "Directory Traversal", owasp: "A01:Broken Access", severity: "High", cvss: 7.5, url: "/api/files?path=", status: "remediated", evidence: "Read /etc/passwd via ../../../ traversal" },
  { id: "F006", name: "Default Admin Credentials", owasp: "A07:Auth Failures", severity: "High", cvss: 7.2, url: "/admin/login", status: "open", evidence: "admin/admin login successful" },
  { id: "F007", name: "Missing CSP Header", owasp: "A05:Misconfig", severity: "Medium", cvss: 5.4, url: "All pages", status: "open", evidence: "CSP header absent from all responses" },
  { id: "F008", name: "CSRF on Transfer", owasp: "A01:Broken Access", severity: "Medium", cvss: 5.4, url: "/api/transfer", status: "accepted", evidence: "State-changing request without CSRF token" },
  { id: "F009", name: "Verbose Error Messages", owasp: "A05:Misconfig", severity: "Low", cvss: 3.7, url: "/api/error", status: "remediated", evidence: "Stack trace exposed in 500 error responses" },
  { id: "F010", name: "Debug Endpoint", owasp: "A05:Misconfig", severity: "Low", cvss: 3.1, url: "/debug/vars", status: "open", evidence: "Internal variables exposed without auth" },
];

const shortTermRecs = [
  "Patch SQL injection vulnerabilities in all database queries",
  "Implement output encoding for all user-controlled content",
  "Remove hardcoded credentials and use secrets manager",
  "Add authorization checks for all resource access",
  "Deploy WAF rules for known attack patterns",
];

const longTermRecs = [
  "Adopt Secure SDLC practices across development teams",
  "Implement automated security testing in CI/CD pipeline",
  "Schedule quarterly penetration testing assessments",
  "Deploy SIEM with custom alerting rules for web attacks",
  "Establish a vulnerability disclosure program (VDP)",
  "Conduct security awareness training for developers",
];

const RiskReport = () => {
  const [findingsList, setFindingsList] = useState(findings);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const updateStatus = (id: string, status: Finding["status"]) => {
    setFindingsList(findingsList.map((f) => f.id === id ? { ...f, status } : f));
  };

  const filtered = statusFilter === "all" ? findingsList : findingsList.filter((f) => f.status === statusFilter);

  const severityData = [
    { name: "Critical", value: findingsList.filter((f) => f.severity === "Critical").length, color: "hsl(0,72%,50%)" },
    { name: "High", value: findingsList.filter((f) => f.severity === "High").length, color: "hsl(25,80%,50%)" },
    { name: "Medium", value: findingsList.filter((f) => f.severity === "Medium").length, color: "hsl(45,80%,50%)" },
    { name: "Low", value: findingsList.filter((f) => f.severity === "Low").length, color: "hsl(142,50%,50%)" },
  ];

  const statusData = [
    { name: "Open", value: findingsList.filter((f) => f.status === "open").length, color: "hsl(0,72%,50%)" },
    { name: "Remediated", value: findingsList.filter((f) => f.status === "remediated").length, color: "hsl(142,72%,45%)" },
    { name: "Accepted", value: findingsList.filter((f) => f.status === "accepted").length, color: "hsl(45,80%,50%)" },
  ];

  const exportReport = () => {
    const report = `
WEB APPLICATION RISK DETECTION REPORT
======================================
Generated: ${new Date().toISOString()}

EXECUTIVE SUMMARY
-----------------
Application Scope: Web Application Security Assessment
Testing Approach: DAST + SAST + Manual Testing
Total Findings: ${findingsList.length}
  Critical: ${findingsList.filter(f => f.severity === "Critical").length}
  High: ${findingsList.filter(f => f.severity === "High").length}
  Medium: ${findingsList.filter(f => f.severity === "Medium").length}
  Low: ${findingsList.filter(f => f.severity === "Low").length}

FINDINGS
--------
${findingsList.map(f => `
[${f.id}] ${f.name}
  OWASP: ${f.owasp}
  Severity: ${f.severity} (CVSS: ${f.cvss})
  URL: ${f.url}
  Status: ${f.status}
  Evidence: ${f.evidence}
`).join("\n")}

SHORT-TERM RECOMMENDATIONS
---------------------------
${shortTermRecs.map((r, i) => `${i + 1}. ${r}`).join("\n")}

LONG-TERM RECOMMENDATIONS
--------------------------
${longTermRecs.map((r, i) => `${i + 1}. ${r}`).join("\n")}
    `;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "risk-detection-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Risk Report</h1>
          <p className="text-muted-foreground text-sm">Executive summary, findings, remediation status, recommendations</p>
        </div>
        <button onClick={exportReport} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-mono text-sm hover:opacity-90">
          <Download className="h-4 w-4" /> Export Report
        </button>
      </div>

      {/* Executive Summary */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">Executive Summary</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted-foreground font-mono mb-1">APPLICATION SCOPE</p>
            <p className="text-sm text-foreground">Full-stack web application security assessment covering authentication, authorization, input handling, and configuration.</p>
            <p className="text-xs text-muted-foreground font-mono mt-3 mb-1">TESTING APPROACH</p>
            <p className="text-sm text-foreground">DAST (OWASP ZAP, Burp Suite) + SAST (Semgrep) + Manual Penetration Testing + Dependency Scanning</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono mb-2">SEVERITY DISTRIBUTION</p>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={10}>
                  {severityData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(142,30%,18%)", borderRadius: 8, color: "hsl(150,30%,85%)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono mb-2">REMEDIATION STATUS</p>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={10}>
                  {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(142,30%,18%)", borderRadius: 8, color: "hsl(150,30%,85%)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Findings Table */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-foreground">Findings ({filtered.length})</h3>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-muted border border-border rounded-md px-2 py-1.5 text-sm font-mono text-foreground">
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="remediated">Remediated</option>
            <option value="accepted">Risk Accepted</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-mono text-xs">
                <th className="text-left py-2 px-3">ID</th>
                <th className="text-left py-2 px-3">Finding</th>
                <th className="text-left py-2 px-3">OWASP</th>
                <th className="text-left py-2 px-3">CVSS</th>
                <th className="text-left py-2 px-3">Severity</th>
                <th className="text-left py-2 px-3">URL</th>
                <th className="text-left py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{f.id}</td>
                  <td className="py-2 px-3 font-mono text-xs text-foreground">{f.name}</td>
                  <td className="py-2 px-3 text-xs text-accent-foreground">{f.owasp}</td>
                  <td className="py-2 px-3 font-mono font-bold text-foreground">{f.cvss}</td>
                  <td className="py-2 px-3"><span className={`text-xs font-mono px-2 py-0.5 rounded-full ${f.severity === "Critical" ? "bg-destructive/20 text-destructive" : f.severity === "High" ? "bg-orange-500/20 text-orange-400" : f.severity === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-primary/20 text-primary"}`}>{f.severity}</span></td>
                  <td className="py-2 px-3 font-mono text-xs text-muted-foreground max-w-[120px] truncate">{f.url}</td>
                  <td className="py-2 px-3">
                    <select value={f.status} onChange={(e) => updateStatus(f.id, e.target.value as Finding["status"])} className="bg-muted border border-border rounded px-2 py-1 text-xs font-mono text-foreground">
                      <option value="open">Open</option>
                      <option value="remediated">Remediated</option>
                      <option value="accepted">Risk Accepted</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-3">Short-Term Recommendations</h3>
          <ul className="space-y-2">
            {shortTermRecs.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                <span className="text-destructive font-mono text-xs mt-0.5">!</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-3">Long-Term Recommendations</h3>
          <ul className="space-y-2">
            {longTermRecs.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                <span className="text-primary font-mono text-xs mt-0.5">→</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiskReport;
