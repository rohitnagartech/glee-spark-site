import { useState } from "react";
import { Target, Plus, Trash2, Shield, Users, Key, Globe, Server, Database } from "lucide-react";

interface Threat {
  id: string;
  category: "Spoofing" | "Tampering" | "Repudiation" | "Info Disclosure" | "Denial of Service" | "Elevation of Privilege";
  title: string;
  description: string;
  asset: string;
  actor: string;
  mitigated: boolean;
}

const strideInfo: { cat: Threat["category"]; icon: any; color: string; description: string }[] = [
  { cat: "Spoofing", icon: Users, color: "text-destructive", description: "Pretending to be something or someone else" },
  { cat: "Tampering", icon: Database, color: "text-orange-400", description: "Modifying data or code without authorization" },
  { cat: "Repudiation", icon: Key, color: "text-yellow-400", description: "Denying having performed an action" },
  { cat: "Info Disclosure", icon: Globe, color: "text-secondary", description: "Exposing information to unauthorized parties" },
  { cat: "Denial of Service", icon: Server, color: "text-destructive", description: "Denying or degrading service to users" },
  { cat: "Elevation of Privilege", icon: Shield, color: "text-orange-400", description: "Gaining capabilities without authorization" },
];

const initialThreats: Threat[] = [
  { id: "1", category: "Spoofing", title: "Credential Theft via Phishing", description: "Attacker sends fake login page to steal user credentials", asset: "User credentials", actor: "External attacker", mitigated: false },
  { id: "2", category: "Tampering", title: "SQL Injection Data Modification", description: "Attacker modifies database records via SQLi", asset: "Customer database", actor: "External attacker", mitigated: false },
  { id: "3", category: "Repudiation", title: "Missing Audit Logs", description: "Admin actions not logged, enabling deniability", asset: "System logs", actor: "Insider", mitigated: true },
  { id: "4", category: "Info Disclosure", title: "Debug Endpoint Exposure", description: "/debug/vars leaks internal config and env variables", asset: "API keys, config", actor: "External attacker", mitigated: false },
  { id: "5", category: "Denial of Service", title: "Unprotected Login Endpoint", description: "No rate limiting on /login allows credential stuffing", asset: "Auth service", actor: "Bot", mitigated: false },
  { id: "6", category: "Elevation of Privilege", title: "IDOR on User Profiles", description: "Changing user ID in request grants access to admin data", asset: "Customer PII", actor: "External attacker", mitigated: false },
];

const assets = ["Customer PII", "Auth tokens", "API keys", "User credentials", "Financial data", "System config", "Session cookies"];
const actors = ["External attacker", "Insider", "Bot", "Compromised partner"];
const trustBoundaries = [
  { from: "Public Internet", to: "Load Balancer", risk: "DDoS, injection" },
  { from: "Load Balancer", to: "Web Server", risk: "Header manipulation" },
  { from: "Web Server", to: "App Server", risk: "SSRF, auth bypass" },
  { from: "App Server", to: "Database", risk: "SQLi, data exfiltration" },
  { from: "App Server", to: "External API", risk: "SSRF, credential leak" },
];

const ThreatModeling = () => {
  const [threats, setThreats] = useState(initialThreats);
  const [selectedCat, setSelectedCat] = useState<Threat["category"] | "all">("all");
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState<Threat["category"]>("Spoofing");

  const addThreat = () => {
    if (!newTitle.trim()) return;
    setThreats([...threats, {
      id: Date.now().toString(),
      category: newCat,
      title: newTitle,
      description: "",
      asset: assets[0],
      actor: actors[0],
      mitigated: false,
    }]);
    setNewTitle("");
  };

  const toggleMitigated = (id: string) => setThreats(threats.map((t) => t.id === id ? { ...t, mitigated: !t.mitigated } : t));
  const removeThreat = (id: string) => setThreats(threats.filter((t) => t.id !== id));

  const filtered = selectedCat === "all" ? threats : threats.filter((t) => t.category === selectedCat);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Threat Modeling</h1>
        <p className="text-muted-foreground text-sm">STRIDE analysis, attack surface map, assets, trust boundaries, threat actors</p>
      </div>

      {/* STRIDE Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {strideInfo.map((s) => {
          const count = threats.filter((t) => t.category === s.cat).length;
          const mitigated = threats.filter((t) => t.category === s.cat && t.mitigated).length;
          return (
            <button key={s.cat} onClick={() => setSelectedCat(selectedCat === s.cat ? "all" : s.cat)} className={`rounded-lg border p-4 text-center transition-all ${selectedCat === s.cat ? "border-primary bg-accent/50 border-glow" : "border-border bg-card hover:border-primary/30"}`}>
              <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
              <p className="text-xs font-mono text-foreground font-bold">{s.cat}</p>
              <p className="text-xs text-muted-foreground mt-1">{mitigated}/{count} mitigated</p>
            </button>
          );
        })}
      </div>

      {/* Add Threat */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex gap-2">
          <select value={newCat} onChange={(e) => setNewCat(e.target.value as Threat["category"])} className="bg-muted border border-border rounded-md px-2 py-1.5 text-sm font-mono text-foreground">
            {strideInfo.map((s) => <option key={s.cat} value={s.cat}>{s.cat}</option>)}
          </select>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Add new threat..." className="flex-1 bg-muted border border-border rounded-md px-3 py-1.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" onKeyDown={(e) => e.key === "Enter" && addThreat()} />
          <button onClick={addThreat} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm"><Plus className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Threats List */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">Threats ({filtered.length})</h3>
        <div className="space-y-2">
          {filtered.map((t) => {
            const info = strideInfo.find((s) => s.cat === t.category)!;
            return (
              <div key={t.id} className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${t.mitigated ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"}`}>
                <button onClick={() => toggleMitigated(t.id)} className={`mt-0.5 ${t.mitigated ? "text-primary" : "text-muted-foreground"}`}>
                  {t.mitigated ? <Shield className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${info.color} bg-muted`}>{t.category}</span>
                    <span className={`text-sm font-mono font-bold ${t.mitigated ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</span>
                  </div>
                  {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span>Asset: {t.asset}</span>
                    <span>Actor: {t.actor}</span>
                  </div>
                </div>
                <button onClick={() => removeThreat(t.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Boundaries */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-heading font-bold text-foreground mb-4">Trust Boundaries</h3>
        <div className="space-y-2">
          {trustBoundaries.map((tb, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-muted/20 border border-border/50">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-mono text-primary">{tb.from}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-sm font-mono text-foreground">{tb.to}</span>
              </div>
              <span className="text-xs text-muted-foreground">{tb.risk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assets & Actors */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-3">Protected Assets</h3>
          <div className="flex flex-wrap gap-2">
            {assets.map((a) => (
              <span key={a} className="px-3 py-1.5 rounded-full border border-border bg-muted text-sm text-card-foreground font-mono">{a}</span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-3">Threat Actors</h3>
          <div className="flex flex-wrap gap-2">
            {actors.map((a) => (
              <span key={a} className="px-3 py-1.5 rounded-full border border-border bg-muted text-sm text-card-foreground font-mono">{a}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatModeling;
