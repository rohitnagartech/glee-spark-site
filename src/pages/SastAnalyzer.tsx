import { useState } from "react";
import { Code, Play, AlertTriangle, CheckCircle, Package } from "lucide-react";

interface Finding {
  line: number;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  fix: string;
}

interface DepVuln {
  package: string;
  version: string;
  severity: "critical" | "high" | "medium";
  cve: string;
  description: string;
  fixedIn: string;
}

const sampleCode = `const express = require('express');
const app = express();
const mysql = require('mysql');

// Hardcoded credentials
const DB_PASSWORD = "admin123!";
const API_KEY = "sk-proj-abc123secret456";

app.get('/users', (req, res) => {
  const userId = req.query.id;
  // SQL Injection vulnerability
  const query = "SELECT * FROM users WHERE id = " + userId;
  db.query(query, (err, result) => {
    res.send(result);
  });
});

app.get('/search', (req, res) => {
  const term = req.query.q;
  // XSS vulnerability
  res.send('<h1>Results for: ' + term + '</h1>');
});

app.post('/run', (req, res) => {
  const cmd = req.body.command;
  // Command injection
  const exec = require('child_process').exec;
  exec('ping ' + cmd, (err, stdout) => {
    res.send(stdout);
  });
});

app.listen(3000);`;

const analyzeCode = (code: string): Finding[] => {
  const findings: Finding[] = [];
  const lines = code.split("\n");
  lines.forEach((line, i) => {
    const ln = i + 1;
    if (/password\s*=\s*["']|api_key\s*=\s*["']|secret\s*=\s*["']/i.test(line))
      findings.push({ line: ln, type: "Hardcoded Secret", severity: "critical", message: `Hardcoded credential detected: ${line.trim().substring(0, 40)}...`, fix: "Use environment variables or a secrets manager" });
    if (/\+\s*(req\.(query|body|params)|userId|term|cmd)/i.test(line) && /query|sql|select|insert|update|delete/i.test(line))
      findings.push({ line: ln, type: "SQL Injection", severity: "critical", message: "User input concatenated directly into SQL query", fix: "Use parameterized queries / prepared statements" });
    if (/res\.send\(.*\+.*(req\.(query|body)|term)/i.test(line))
      findings.push({ line: ln, type: "Cross-Site Scripting (XSS)", severity: "high", message: "User input reflected in response without encoding", fix: "Use template engine with auto-escaping or sanitize output" });
    if (/exec\(.*\+.*(req\.(body|query)|cmd)/i.test(line))
      findings.push({ line: ln, type: "Command Injection", severity: "critical", message: "User input passed to shell command execution", fix: "Use execFile with argument array, never string concatenation" });
    if (/eval\(|Function\(|setTimeout\([^,]*\+/i.test(line))
      findings.push({ line: ln, type: "Code Injection", severity: "critical", message: "Dynamic code evaluation with potential user input", fix: "Avoid eval/Function constructor; use safe alternatives" });
  });
  return findings;
};

const depVulns: DepVuln[] = [
  { package: "lodash", version: "4.17.15", severity: "high", cve: "CVE-2021-23337", description: "Prototype Pollution in lodash", fixedIn: "4.17.21" },
  { package: "express", version: "4.17.1", severity: "medium", cve: "CVE-2024-29041", description: "Open redirect vulnerability in express", fixedIn: "4.19.2" },
  { package: "jsonwebtoken", version: "8.5.1", severity: "critical", cve: "CVE-2022-23529", description: "Insecure key retrieval in jsonwebtoken", fixedIn: "9.0.0" },
  { package: "axios", version: "0.21.1", severity: "high", cve: "CVE-2021-3749", description: "Server-Side Request Forgery in axios", fixedIn: "0.21.2" },
  { package: "minimist", version: "1.2.5", severity: "medium", cve: "CVE-2021-44906", description: "Prototype Pollution in minimist", fixedIn: "1.2.6" },
];

const SastAnalyzer = () => {
  const [code, setCode] = useState(sampleCode);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "deps">("code");

  const analyze = () => {
    setIsAnalyzing(true);
    setFindings([]);
    setTimeout(() => {
      setFindings(analyzeCode(code));
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">SAST Analyzer</h1>
        <p className="text-muted-foreground text-sm">Paste code to detect injection, XSS, command injection, hardcoded secrets + dependency CVE scanner</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        <button onClick={() => setActiveTab("code")} className={`px-4 py-2 text-sm font-mono border-b-2 transition-colors ${activeTab === "code" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          <Code className="h-4 w-4 inline mr-1" /> Code Analysis
        </button>
        <button onClick={() => setActiveTab("deps")} className={`px-4 py-2 text-sm font-mono border-b-2 transition-colors ${activeTab === "deps" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          <Package className="h-4 w-4 inline mr-1" /> Dependency Scanner
        </button>
      </div>

      {activeTab === "code" ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-foreground">Source Code</h3>
              <button onClick={analyze} disabled={isAnalyzing} className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md font-mono text-sm hover:opacity-90 disabled:opacity-50">
                <Play className="h-4 w-4" /> {isAnalyzing ? "Analyzing..." : "Analyze"}
              </button>
            </div>
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[500px] bg-muted border border-border rounded-md p-3 text-sm text-foreground font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-6"
                spellCheck={false}
              />
              {findings.length > 0 && (
                <div className="absolute top-0 right-0 p-2">
                  <span className="text-xs font-mono px-2 py-1 rounded-full bg-destructive/20 text-destructive">{findings.length} issues</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-foreground mb-3">Findings ({findings.length})</h3>
            <div className="space-y-3 max-h-[520px] overflow-y-auto">
              {findings.map((f, i) => (
                <div key={i} className="p-3 rounded-md border border-border bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${f.severity === "critical" ? "text-destructive" : f.severity === "high" ? "text-orange-400" : "text-yellow-400"}`} />
                      <span className="text-sm font-mono font-bold text-foreground">{f.type}</span>
                    </div>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${f.severity === "critical" ? "bg-destructive/20 text-destructive" : f.severity === "high" ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>{f.severity}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Line {f.line}</p>
                  <p className="text-sm text-card-foreground mb-2">{f.message}</p>
                  <div className="flex items-start gap-1 text-xs text-primary">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{f.fix}</span>
                  </div>
                </div>
              ))}
              {findings.length === 0 && !isAnalyzing && <p className="text-muted-foreground text-sm text-center py-8">Click Analyze to scan the code</p>}
              {isAnalyzing && <p className="text-primary text-sm text-center py-8 animate-pulse-glow">Analyzing code patterns...</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">Dependency Vulnerabilities</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-mono text-xs">
                  <th className="text-left py-2 px-3">Package</th>
                  <th className="text-left py-2 px-3">Version</th>
                  <th className="text-left py-2 px-3">CVE</th>
                  <th className="text-left py-2 px-3">Severity</th>
                  <th className="text-left py-2 px-3">Description</th>
                  <th className="text-left py-2 px-3">Fix</th>
                </tr>
              </thead>
              <tbody>
                {depVulns.map((d, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2 px-3 font-mono text-foreground">{d.package}</td>
                    <td className="py-2 px-3 font-mono text-muted-foreground">{d.version}</td>
                    <td className="py-2 px-3 font-mono text-xs text-accent-foreground">{d.cve}</td>
                    <td className="py-2 px-3"><span className={`text-xs font-mono px-2 py-0.5 rounded-full ${d.severity === "critical" ? "bg-destructive/20 text-destructive" : d.severity === "high" ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>{d.severity}</span></td>
                    <td className="py-2 px-3 text-xs text-muted-foreground max-w-[200px]">{d.description}</td>
                    <td className="py-2 px-3 font-mono text-xs text-primary">{d.fixedIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SastAnalyzer;
