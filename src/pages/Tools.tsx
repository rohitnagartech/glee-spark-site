import SectionHeader from "@/components/SectionHeader";
import { Monitor, Server, Globe, Radar, Search, Database, FileCode, Package, Cpu, HardDrive, MemoryStick } from "lucide-react";

const toolCategories = [
  {
    title: "Virtualization",
    icon: Monitor,
    items: ["Oracle VirtualBox", "VMware", "Docker"],
  },
  {
    title: "Operating Systems",
    icon: Server,
    items: ["Kali Linux", "Ubuntu", "Windows"],
  },
  {
    title: "Test Web Apps",
    icon: Globe,
    items: ["DVWA", "OWASP Juice Shop", "WebGoat", "bWAPP"],
  },
  {
    title: "DAST Tools",
    icon: Radar,
    items: ["OWASP ZAP", "Burp Suite Community/Pro"],
  },
  {
    title: "Recon & Scanners",
    icon: Search,
    items: ["Nmap", "Nikto"],
  },
  {
    title: "Exploit Validation (Lab)",
    icon: Database,
    items: ["SQLMap (controlled)", "Custom payloads"],
  },
  {
    title: "SAST Tools",
    icon: FileCode,
    items: ["Semgrep", "SonarQube"],
  },
  {
    title: "Dependency Scanning",
    icon: Package,
    items: ["OWASP Dependency-Check", "Snyk (trial)"],
  },
];

const infraRequirements = [
  { icon: Cpu, label: "Intel i5 / Ryzen 5 or higher" },
  { icon: MemoryStick, label: "8+ GB RAM (16 GB recommended)" },
  { icon: HardDrive, label: "SSD storage" },
  { icon: Monitor, label: "Virtualization enabled" },
];

const Tools = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <SectionHeader
          tag="Tools & Infrastructure"
          title="Security Toolkit"
          description="Essential tools and infrastructure prerequisites for web application security testing."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {toolCategories.map((cat) => (
            <div key={cat.title} className="rounded-lg border border-border bg-card p-5 hover:border-primary/50 hover:border-glow transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <cat.icon className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground text-sm">{cat.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {cat.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="text-primary font-mono text-xs">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8">Infrastructure Prerequisites</h2>
          <div className="grid grid-cols-2 gap-4">
            {infraRequirements.map((req) => (
              <div key={req.label} className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                <req.icon className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-card-foreground">{req.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
