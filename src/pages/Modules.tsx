import SectionHeader from "@/components/SectionHeader";
import ModuleCard from "@/components/ModuleCard";
import { Search, Bug, BarChart3, Target, FileText, ShieldCheck } from "lucide-react";

const modules = [
  {
    number: 1,
    title: "Web Risk Identification (Recon + Discovery)",
    icon: Search,
    description: "Perform structured discovery of application endpoints, auth flows, session handling, and input fields.",
    items: [
      "Application endpoints (pages, parameters, APIs)",
      "Authentication/authorization flows",
      "Session handling & cookies",
      "Input fields (forms, headers, JSON payloads)",
      "Unvalidated input",
      "Misconfigurations",
      "Exposed admin panels / debug endpoints",
      "Insecure API endpoints and weak auth",
    ],
  },
  {
    number: 2,
    title: "Vulnerability Detection and Validation",
    icon: Bug,
    description: "Detect vulnerabilities using DAST, SAST, and dependency scanning. Validate findings with PoC reproduction.",
    items: [
      "DAST scanning (live application probing)",
      "SAST (code/logic review for flaws, if code available)",
      "Dependency scanning (known vulnerable libraries)",
      "Proof-of-Concept (PoC) reproduction",
      "Evidence capture (request/response, logs, screenshots)",
    ],
  },
  {
    number: 3,
    title: "Risk Classification and Prioritization",
    icon: BarChart3,
    description: "Classify risks by severity, exploitability, and impact using CVSS and OWASP Risk Rating.",
    items: [
      "Severity (Low/Medium/High/Critical)",
      "Exploitability (easy vs complex)",
      "Impact (data loss, account takeover, RCE)",
      "CVSS for severity scoring",
      "OWASP Risk Rating for business context",
      "Prioritize: Auth flaws, injection risks, sensitive data exposure, RCE",
    ],
  },
  {
    number: 4,
    title: "Attack Surface & Threat Modeling",
    icon: Target,
    description: "Define application threats using data flow diagrams, trust boundaries, and STRIDE/LINDDUN.",
    items: [
      "Data flow diagrams (DFD)",
      "Trust boundaries",
      "STRIDE/LINDDUN (optional)",
      "Assets (customer PII, tokens, credentials)",
      "Entry points (login, upload, APIs)",
      "Threat actors (external attacker, insider, bot)",
    ],
  },
  {
    number: 5,
    title: "Security Logging & Monitoring for Web Risk",
    icon: FileText,
    description: "Enable and analyze logs to detect suspicious patterns and anomalies.",
    items: [
      "Web server logs (Nginx/Apache)",
      "Application logs & Authentication logs",
      "WAF logs (if used)",
      "Injection payloads detection",
      "Excessive 4xx/5xx errors",
      "Credential stuffing behavior",
      "Unusual request rate & geography anomalies",
    ],
  },
  {
    number: 6,
    title: "Mitigation Recommendations & Secure Hardening",
    icon: ShieldCheck,
    description: "Provide tailored fixes for each risk and recommend long-term security improvements.",
    items: [
      "Input validation + output encoding",
      "Secure headers (CSP, HSTS, X-Frame-Options)",
      "Proper access control (RBAC/ABAC)",
      "Session security (SameSite/HttpOnly/Secure cookies)",
      "Rate limiting & bot protection",
      "Security testing integrated into CI/CD",
      "Regular patching & dependency updates",
      "Security baselines and secure coding standards",
    ],
  },
];

const Modules = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <SectionHeader
          tag="Key Modules"
          title="Security Assessment Modules"
          description="Six comprehensive modules covering every phase of web application risk detection."
        />
        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((mod) => (
            <ModuleCard key={mod.number} {...mod} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modules;
