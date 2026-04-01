import SectionHeader from "@/components/SectionHeader";
import { Server, FileText, BarChart3, TrendingUp, Target, AlertTriangle, Activity } from "lucide-react";

const deliverables = [
  {
    title: "Configured Environment",
    icon: Server,
    items: [
      "Web app running (screenshots/configs)",
      "Proxy setup (Burp/ZAP)",
      "Logs enabled + forwarded to SIEM",
    ],
  },
  {
    title: "Web Risk Detection Report",
    icon: FileText,
    items: [
      "Detailed findings with CVSS scoring",
      "Proof-of-Concept (PoC) for each vulnerability",
      "Remediation recommendations",
      "Retest outcomes (before vs after)",
    ],
  },
];

const dashboards = [
  { icon: TrendingUp, label: "Attack request trends" },
  { icon: Target, label: "Top targeted endpoints" },
  { icon: AlertTriangle, label: "Alerts for injection/bruteforce" },
  { icon: Activity, label: "Error spike monitoring (4xx/5xx)" },
];

const Deliverables = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container max-w-4xl">
        <SectionHeader
          tag="Final Output"
          title="Project Deliverables"
          description="Comprehensive documentation, reports, and visualization dashboards."
        />

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {deliverables.map((d) => (
            <div key={d.title} className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 hover:border-glow transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <d.icon className="h-6 w-6 text-primary" />
                <h3 className="font-heading font-bold text-foreground">{d.title}</h3>
              </div>
              <ul className="space-y-2">
                {d.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-mono mt-0.5">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6 justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-heading font-bold text-foreground">Visualization Dashboards</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboards.map((d) => (
              <div key={d.label} className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border bg-card text-center hover:border-primary/50 hover:border-glow transition-all duration-300">
                <d.icon className="h-8 w-8 text-primary" />
                <span className="text-sm text-card-foreground font-mono">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deliverables;
