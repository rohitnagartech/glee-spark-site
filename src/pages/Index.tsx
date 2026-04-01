import HeroSection from "@/components/HeroSection";
import SectionHeader from "@/components/SectionHeader";
import ModuleCard from "@/components/ModuleCard";
import { Search, Bug, BarChart3, Target, FileText, ShieldCheck, CheckCircle, BookOpen } from "lucide-react";

const modules = [
  {
    number: 1,
    title: "Web Risk Identification",
    icon: Search,
    description: "Perform structured discovery and identify risk indicators.",
    items: [
      "Application endpoints (pages, parameters, APIs)",
      "Authentication/authorization flows",
      "Session handling & cookies",
      "Unvalidated input & misconfigurations",
      "Exposed admin panels / debug endpoints",
    ],
  },
  {
    number: 2,
    title: "Vulnerability Detection",
    icon: Bug,
    description: "Detect vulnerabilities using DAST, SAST, and dependency scanning.",
    items: [
      "DAST scanning (live application probing)",
      "SAST (code/logic review for flaws)",
      "Dependency scanning (known vulnerable libraries)",
      "PoC reproduction & evidence capture",
    ],
  },
  {
    number: 3,
    title: "Risk Classification",
    icon: BarChart3,
    description: "Classify and prioritize risks using industry frameworks.",
    items: [
      "Severity: Low / Medium / High / Critical",
      "CVSS scoring for severity",
      "OWASP Risk Rating for business context",
      "Prioritize: Auth flaws, injection, sensitive data exposure, RCE",
    ],
  },
  {
    number: 4,
    title: "Attack Surface & Threat Modeling",
    icon: Target,
    description: "Define application threats and identify assets at risk.",
    items: [
      "Data flow diagrams (DFD) & trust boundaries",
      "STRIDE/LINDDUN modeling",
      "Assets: customer PII, tokens, credentials",
      "Entry points: login, upload, APIs",
      "Threat actors: external, insider, bot",
    ],
  },
  {
    number: 5,
    title: "Security Logging & Monitoring",
    icon: FileText,
    description: "Enable and analyze logs to detect suspicious patterns.",
    items: [
      "Web server, application & auth logs",
      "WAF logs (if used)",
      "Injection payloads detection",
      "Credential stuffing & brute force detection",
      "Unusual request rate & geography anomalies",
    ],
  },
  {
    number: 6,
    title: "Mitigation & Secure Hardening",
    icon: ShieldCheck,
    description: "Provide tailored fixes and long-term security improvements.",
    items: [
      "Input validation + output encoding",
      "Secure headers (CSP, HSTS, X-Frame-Options)",
      "Proper access control (RBAC/ABAC)",
      "Session security (SameSite/HttpOnly/Secure)",
      "Rate limiting & bot protection",
      "Security testing integrated into CI/CD",
    ],
  },
];

const prerequisites = [
  "Web fundamentals: HTTP/HTTPS, cookies, sessions, REST APIs",
  "Basic cybersecurity principles (CIA triad)",
  "Familiarity with OWASP Top 10 risks",
  "Web testing methodology (recon → test → validate → report)",
  "Secure coding basics",
  "Basic understanding of risk scoring",
];

const outcomes = [
  "Detect and validate web application vulnerabilities",
  "Perform structured risk assessment and prioritization",
  "Analyze logs and correlate suspicious web activity",
  "Recommend mitigations aligned with secure coding best practices",
  "Deliver reporting and dashboards",
];

const Index = () => {
  return (
    <div>
      <HeroSection />

      {/* Modules Section */}
      <section className="py-24 bg-grid scanline">
        <div className="container">
          <SectionHeader
            tag="Key Modules"
            title="Core Security Modules"
            description="Six comprehensive modules covering the full web application security lifecycle."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <ModuleCard key={mod.number} {...mod} />
            ))}
          </div>
        </div>
      </section>

      {/* Prerequisites & Outcomes */}
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Knowledge Prerequisites</h2>
              </div>
              <ul className="space-y-3">
                {prerequisites.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-card-foreground">
                    <span className="text-primary font-mono mt-1">▸</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Learning Outcomes</h2>
              </div>
              <ul className="space-y-3">
                {outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-card-foreground">
                    <span className="text-primary font-mono mt-1">✓</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
