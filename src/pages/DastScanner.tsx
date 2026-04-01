import { useState } from "react";
import { Radar, Play, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface ScanResult {
  id: string;
  vulnerability: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  url: string;
  payload: string;
  status: "vulnerable" | "safe" | "pending";
  description: string;
}

const scanTemplates: Omit<ScanResult, "id" | "status">[] = [
  { vulnerability: "SQL Injection", category: "A03:Injection", severity: "critical", url: "/api/users?id=", payload: "1 OR 1=1 --", description: "Classic SQLi bypasses authentication by injecting tautology into WHERE clause" },
  { vulnerability: "Reflected XSS", category: "A03:Injection", severity: "high", url: "/search?q=", payload: "<script>alert('xss')</script>", description: "User input reflected in page without sanitization enables script execution" },
  { vulnerability: "Stored XSS", category: "A03:Injection", severity: "critical", url: "/api/comments", payload: "<img onerror=alert(1) src=x>", description: "Malicious script stored in database and executed for all viewers" },
  { vulnerability: "CSRF Token Missing", category: "A01:Broken Access Control", severity: "medium", url: "/api/transfer", payload: "POST without CSRF token", description: "State-changing request accepted without anti-CSRF token validation" },
  { vulnerability: "IDOR", category: "A01:Broken Access Control", severity: "high", url: "/api/users/99/profile", payload: "Access as user 42", description: "Direct object reference allows accessing other users' data by changing ID" },
  { vulnerability: "File Upload - PHP Shell", category: "A04:Insecure Design", severity: "critical", url: "/upload", payload: "shell.php.jpg (double extension)", description: "Server accepts disguised PHP file allowing remote code execution" },
  { vulnerability: "Directory Traversal", category: "A01:Broken Access Control", severity: "high", url: "/api/files?path=", payload: "../../../etc/passwd", description: "Path traversal reads sensitive files outside intended directory" },
  { vulnerability: "Security Misconfiguration", category: "A05:Misconfig", severity: "medium", url: "/api/debug", payload: "GET /debug/vars", description: "Debug endpoint exposes internal application variables and environment" },
  { vulnerability: "Broken Authentication", category: "A07:Auth Fail", severity: "high", url: "/login", payload: "admin/admin (default creds)", description: "Default credentials not changed, allowing unauthorized admin access" },
  { vulnerability: "Server-Side Request Forgery", category: "A10:SSRF", severity: "high", url: "/api/fetch?url=", payload: "http://169.254.169.254/metadata", description: "SSRF allows accessing cloud metadata endpoint from server context" },
];

const DastScanner = () => {
  const [targetUrl, setTargetUrl] = useState("https://vulnerable-app.example.com");
  const [results, setResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);

  const runScan = () => {
    setIsScanning(true);
    setResults([]);
    setProgress(0);
    setSelectedResult(null);

    scanTemplates.forEach((template, i) => {
      setTimeout(() => {
        const result: ScanResult = {
          ...template,
          id: Date.now().toString() + i,
          status: Math.random() > 0.25 ? "vulnerable" : "safe",
        };
        setResults((prev) => [...prev, result]);
        setProgress(((i + 1) / scanTemplates.length) * 100);
        if (i === scanTemplates.length - 1) setIsScanning(false);
      }, (i + 1) * 800);
    });
  };

  const vulnCount = results.filter((r) => r.status === "vulnerable").length;
  const safeCount = results.filter((r) => r.status === "safe").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">DAST Scanner</h1>
        <p className="text-muted-foreground text-sm">OWASP Top 10 simulation — SQLi, XSS, CSRF, IDOR, file upload, misconfig</p>
      </div>

      {/* Scan Config */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-3">Scan Configuration</h3>
        <div className="flex gap-2">
          <input
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="flex-1 bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button onClick={runScan} disabled={isScanning} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-mono text-sm hover:opacity-90 disabled:opacity-50">
            <Play className="h-4 w-4" /> {isScanning ? "Scanning..." : "Run DAST Scan"}
          </button>
        </div>
        {isScanning && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Scanning in progress...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-heading font-bold text-foreground">{results.length}</p>
            <p className="text-xs text-muted-foreground">Tests Run</p>
          </div>
          <div className="rounded-lg border border-destructive/50 bg-card p-4 text-center">
            <p className="text-2xl font-heading font-bold text-destructive">{vulnCount}</p>
            <p className="text-xs text-muted-foreground">Vulnerable</p>
          </div>
          <div className="rounded-lg border border-primary/50 bg-card p-4 text-center">
            <p className="text-2xl font-heading font-bold text-primary">{safeCount}</p>
            <p className="text-xs text-muted-foreground">Safe</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Results Table */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-3">Scan Results</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {results.map((r) => (
              <button key={r.id} onClick={() => setSelectedResult(r)} className={`w-full text-left p-3 rounded-md border transition-colors ${selectedResult?.id === r.id ? "border-primary bg-accent/50" : "border-border/50 bg-muted/20 hover:bg-muted/40"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {r.status === "vulnerable" ? <XCircle className="h-4 w-4 text-destructive" /> : r.status === "safe" ? <CheckCircle className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm font-mono text-foreground">{r.vulnerability}</span>
                  </div>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${r.severity === "critical" ? "bg-destructive/20 text-destructive" : r.severity === "high" ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>{r.severity}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{r.category}</p>
              </button>
            ))}
            {results.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">Run a scan to see results</p>}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-3">Finding Details</h3>
          {selectedResult ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {selectedResult.status === "vulnerable" ? <XCircle className="h-5 w-5 text-destructive" /> : <CheckCircle className="h-5 w-5 text-primary" />}
                <span className="text-lg font-heading font-bold text-foreground">{selectedResult.vulnerability}</span>
              </div>
              <div className="space-y-3">
                <div><p className="text-xs text-muted-foreground font-mono mb-1">CATEGORY</p><p className="text-sm text-foreground">{selectedResult.category}</p></div>
                <div><p className="text-xs text-muted-foreground font-mono mb-1">TARGET URL</p><p className="text-sm text-foreground font-mono">{selectedResult.url}</p></div>
                <div><p className="text-xs text-muted-foreground font-mono mb-1">PAYLOAD</p><pre className="text-sm text-accent-foreground bg-muted/50 p-2 rounded font-mono overflow-x-auto">{selectedResult.payload}</pre></div>
                <div><p className="text-xs text-muted-foreground font-mono mb-1">DESCRIPTION</p><p className="text-sm text-card-foreground">{selectedResult.description}</p></div>
                <div><p className="text-xs text-muted-foreground font-mono mb-1">STATUS</p><span className={`text-sm font-mono px-3 py-1 rounded-full ${selectedResult.status === "vulnerable" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"}`}>{selectedResult.status.toUpperCase()}</span></div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-16">Select a finding to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DastScanner;
