import { useState } from "react";
import { BarChart3, Calculator, AlertTriangle } from "lucide-react";

const cvssMetrics = {
  attackVector: [
    { label: "Network (N)", value: 0.85 },
    { label: "Adjacent (A)", value: 0.62 },
    { label: "Local (L)", value: 0.55 },
    { label: "Physical (P)", value: 0.2 },
  ],
  attackComplexity: [
    { label: "Low (L)", value: 0.77 },
    { label: "High (H)", value: 0.44 },
  ],
  privilegesRequired: [
    { label: "None (N)", value: 0.85 },
    { label: "Low (L)", value: 0.62 },
    { label: "High (H)", value: 0.27 },
  ],
  userInteraction: [
    { label: "None (N)", value: 0.85 },
    { label: "Required (R)", value: 0.62 },
  ],
  scope: [
    { label: "Unchanged (U)", value: 0 },
    { label: "Changed (C)", value: 1 },
  ],
  confidentiality: [
    { label: "None (N)", value: 0 },
    { label: "Low (L)", value: 0.22 },
    { label: "High (H)", value: 0.56 },
  ],
  integrity: [
    { label: "None (N)", value: 0 },
    { label: "Low (L)", value: 0.22 },
    { label: "High (H)", value: 0.56 },
  ],
  availability: [
    { label: "None (N)", value: 0 },
    { label: "Low (L)", value: 0.22 },
    { label: "High (H)", value: 0.56 },
  ],
};

interface QueueItem { id: string; name: string; severity: string; cvss: number; owasp: string; status: "open" | "in-progress" | "resolved"; }

const initialQueue: QueueItem[] = [
  { id: "1", name: "SQL Injection - /api/users", severity: "Critical", cvss: 9.8, owasp: "A03:Injection", status: "open" },
  { id: "2", name: "Stored XSS - /comments", severity: "Critical", cvss: 9.1, owasp: "A03:Injection", status: "open" },
  { id: "3", name: "IDOR - /api/users/:id", severity: "High", cvss: 7.5, owasp: "A01:Broken Access", status: "in-progress" },
  { id: "4", name: "CSRF - /api/transfer", severity: "Medium", cvss: 5.4, owasp: "A01:Broken Access", status: "open" },
  { id: "5", name: "Hardcoded API Key", severity: "Critical", cvss: 9.0, owasp: "A02:Crypto Failures", status: "open" },
  { id: "6", name: "Missing CSP Header", severity: "Medium", cvss: 4.3, owasp: "A05:Misconfig", status: "resolved" },
  { id: "7", name: "Outdated lodash", severity: "High", cvss: 7.2, owasp: "A06:Vuln Components", status: "in-progress" },
  { id: "8", name: "Debug Endpoint Exposed", severity: "Low", cvss: 3.1, owasp: "A05:Misconfig", status: "open" },
];

const RiskClassifier = () => {
  const [av, setAv] = useState(0);
  const [ac, setAc] = useState(0);
  const [pr, setPr] = useState(0);
  const [ui, setUi] = useState(0);
  const [sc, setSc] = useState(0);
  const [ci, setCi] = useState(2);
  const [ii, setIi] = useState(2);
  const [ai, setAi] = useState(1);
  const [queue, setQueue] = useState(initialQueue);

  const calcCvss = () => {
    const avV = cvssMetrics.attackVector[av].value;
    const acV = cvssMetrics.attackComplexity[ac].value;
    const prV = cvssMetrics.privilegesRequired[pr].value;
    const uiV = cvssMetrics.userInteraction[ui].value;
    const cV = cvssMetrics.confidentiality[ci].value;
    const iV = cvssMetrics.integrity[ii].value;
    const aV = cvssMetrics.availability[ai].value;
    const iss = 1 - ((1 - cV) * (1 - iV) * (1 - aV));
    const impact = sc === 1 ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15) : 6.42 * iss;
    if (impact <= 0) return 0;
    const exploitability = 8.22 * avV * acV * prV * uiV;
    const score = sc === 1 ? Math.min(1.08 * (impact + exploitability), 10) : Math.min(impact + exploitability, 10);
    return Math.ceil(score * 10) / 10;
  };

  const score = calcCvss();
  const getSeverity = (s: number) => s >= 9 ? "Critical" : s >= 7 ? "High" : s >= 4 ? "Medium" : s > 0 ? "Low" : "None";
  const getColor = (sev: string) => sev === "Critical" ? "text-destructive" : sev === "High" ? "text-orange-400" : sev === "Medium" ? "text-yellow-400" : "text-primary";

  const updateStatus = (id: string, status: QueueItem["status"]) => {
    setQueue(queue.map((q) => q.id === id ? { ...q, status } : q));
  };

  const Selector = ({ label, options, value, onChange }: { label: string; options: { label: string }[]; value: number; onChange: (v: number) => void }) => (
    <div>
      <p className="text-xs font-mono text-muted-foreground mb-1.5">{label}</p>
      <div className="flex gap-1 flex-wrap">
        {options.map((o, i) => (
          <button key={i} onClick={() => onChange(i)} className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors ${value === i ? "border-primary bg-accent text-accent-foreground" : "border-border bg-muted text-muted-foreground hover:text-foreground"}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Risk Classifier</h1>
        <p className="text-muted-foreground text-sm">CVSS v3.1 calculator, OWASP Risk Rating, prioritized finding queue</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* CVSS Calculator */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-bold text-foreground">CVSS v3.1 Calculator</h3>
          </div>
          <Selector label="Attack Vector (AV)" options={cvssMetrics.attackVector} value={av} onChange={setAv} />
          <Selector label="Attack Complexity (AC)" options={cvssMetrics.attackComplexity} value={ac} onChange={setAc} />
          <Selector label="Privileges Required (PR)" options={cvssMetrics.privilegesRequired} value={pr} onChange={setPr} />
          <Selector label="User Interaction (UI)" options={cvssMetrics.userInteraction} value={ui} onChange={setUi} />
          <Selector label="Scope (S)" options={cvssMetrics.scope} value={sc} onChange={setSc} />
          <Selector label="Confidentiality (C)" options={cvssMetrics.confidentiality} value={ci} onChange={setCi} />
          <Selector label="Integrity (I)" options={cvssMetrics.integrity} value={ii} onChange={setIi} />
          <Selector label="Availability (A)" options={cvssMetrics.availability} value={ai} onChange={setAi} />

          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground font-mono">SCORE</p>
              <p className={`text-4xl font-heading font-bold ${getColor(getSeverity(score))}`}>{score}</p>
            </div>
            <span className={`text-sm font-mono px-3 py-1 rounded-full ${score >= 9 ? "bg-destructive/20 text-destructive" : score >= 7 ? "bg-orange-500/20 text-orange-400" : score >= 4 ? "bg-yellow-500/20 text-yellow-400" : "bg-primary/20 text-primary"}`}>
              {getSeverity(score)}
            </span>
          </div>
        </div>

        {/* Risk Matrix */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">Risk Matrix</h3>
          <div className="grid grid-cols-4 gap-1 text-xs font-mono text-center">
            <div className="text-muted-foreground p-2"></div>
            <div className="text-muted-foreground p-2">Low Impact</div>
            <div className="text-muted-foreground p-2">Med Impact</div>
            <div className="text-muted-foreground p-2">High Impact</div>
            <div className="text-muted-foreground p-2 text-right">High Likelihood</div>
            <div className="p-3 rounded bg-yellow-500/20 text-yellow-400">Medium</div>
            <div className="p-3 rounded bg-orange-500/20 text-orange-400">High</div>
            <div className="p-3 rounded bg-destructive/20 text-destructive">Critical</div>
            <div className="text-muted-foreground p-2 text-right">Med Likelihood</div>
            <div className="p-3 rounded bg-primary/20 text-primary">Low</div>
            <div className="p-3 rounded bg-yellow-500/20 text-yellow-400">Medium</div>
            <div className="p-3 rounded bg-orange-500/20 text-orange-400">High</div>
            <div className="text-muted-foreground p-2 text-right">Low Likelihood</div>
            <div className="p-3 rounded bg-primary/20 text-primary">Info</div>
            <div className="p-3 rounded bg-primary/20 text-primary">Low</div>
            <div className="p-3 rounded bg-yellow-500/20 text-yellow-400">Medium</div>
          </div>
        </div>
      </div>

      {/* Prioritized Queue */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">Prioritized Finding Queue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-mono text-xs">
                <th className="text-left py-2 px-3">Finding</th>
                <th className="text-left py-2 px-3">CVSS</th>
                <th className="text-left py-2 px-3">Severity</th>
                <th className="text-left py-2 px-3">OWASP</th>
                <th className="text-left py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...queue].sort((a, b) => b.cvss - a.cvss).map((q) => (
                <tr key={q.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-2 px-3 font-mono text-foreground text-xs">{q.name}</td>
                  <td className="py-2 px-3"><span className={`font-mono font-bold ${getColor(q.severity)}`}>{q.cvss}</span></td>
                  <td className="py-2 px-3"><span className={`text-xs font-mono px-2 py-0.5 rounded-full ${q.severity === "Critical" ? "bg-destructive/20 text-destructive" : q.severity === "High" ? "bg-orange-500/20 text-orange-400" : q.severity === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-primary/20 text-primary"}`}>{q.severity}</span></td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">{q.owasp}</td>
                  <td className="py-2 px-3">
                    <select
                      value={q.status}
                      onChange={(e) => updateStatus(q.id, e.target.value as QueueItem["status"])}
                      className="bg-muted border border-border rounded px-2 py-1 text-xs font-mono text-foreground"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
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

export default RiskClassifier;
