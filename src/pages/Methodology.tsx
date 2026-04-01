import SectionHeader from "@/components/SectionHeader";
import StepCard from "@/components/StepCard";
import { Settings, Crosshair, Radar, Search, ShieldAlert, FileCheck } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Setting Up the Environment",
    icon: Settings,
    subsections: [
      {
        heading: "Build a web application lab environment:",
        items: [
          "Vulnerable apps (DVWA, Juice Shop, WebGoat, bWAPP)",
          "Test machine (Kali Linux)",
          "Target server (Ubuntu/Windows)",
        ],
      },
      {
        heading: "Setup essential tooling:",
        items: [
          "Burp Suite / OWASP ZAP",
          "Nikto / Nmap",
          "SQLMap (controlled use)",
          "SAST scanners (Semgrep / SonarQube)",
          "Dependency scanners (OWASP Dependency-Check / Snyk trial)",
        ],
      },
      {
        heading: "Enable logging:",
        items: ["Web logs + application logs forwarded to SIEM (Splunk/ELK/Graylog)"],
      },
    ],
  },
  {
    step: 2,
    title: "Simulating Web Risks / Collecting Evidence",
    icon: Crosshair,
    subsections: [
      {
        heading: "Simulate common web attack scenarios:",
        items: [
          "SQL Injection (SQLi)",
          "Cross-Site Scripting (XSS)",
          "Broken Access Control / IDOR",
          "CSRF (where applicable)",
          "File upload vulnerabilities",
          "Command injection (lab-only)",
          "Weak authentication / session fixation",
        ],
      },
      {
        heading: "Ensure:",
        items: [
          "Requests and responses are captured (Burp/ZAP)",
          "Server logs record the activity",
          "SIEM ingests logs for detection/visualization",
        ],
      },
    ],
  },
  {
    step: 3,
    title: "Detecting Risks Using Tools (DAST/SAST + SIEM)",
    icon: Radar,
    subsections: [
      {
        heading: "Run scans:",
        items: [
          "DAST spidering + active scanning (ZAP/Burp)",
          "Server vulnerability scanning (Nikto)",
          "Network scanning (Nmap)",
        ],
      },
      {
        heading: "Detect in SIEM:",
        items: [
          "Injection patterns in HTTP requests",
          "Excessive login failures / brute force",
          "Access to restricted endpoints",
          "Web shell indicators (if simulated)",
          "Suspicious file upload extensions and MIME types",
        ],
      },
    ],
  },
  {
    step: 4,
    title: "Risk Analysis and Root Cause Investigation",
    icon: Search,
    subsections: [
      {
        heading: "Identify:",
        items: [
          "Root cause (coding flaw, misconfiguration, missing control)",
          "Exploitation steps (PoC)",
          "Affected endpoints and parameters",
          "Impact radius (users/data/systems)",
        ],
      },
      {
        heading: "Provide:",
        items: [
          "Evidence (screenshots, logs, request/response)",
          "Reproduction steps",
          "Risk score + justification",
        ],
      },
    ],
  },
  {
    step: 5,
    title: "Response and Mitigation Planning",
    icon: ShieldAlert,
    subsections: [
      {
        heading: "Document containment actions:",
        items: [
          "Block malicious IPs / rate limit",
          "Disable vulnerable features (uploads, debug pages)",
          "Force password resets (if auth compromise)",
        ],
      },
      {
        heading: "Recovery actions:",
        items: [
          "Patch vulnerable code",
          "Update dependencies",
          "Harden server configurations",
        ],
      },
      {
        heading: "Prevent recurrence:",
        items: [
          "Add automated security testing gates in CI/CD",
          "Implement WAF rules for known attack patterns",
        ],
      },
    ],
  },
  {
    step: 6,
    title: "Post-Assessment Reporting",
    icon: FileCheck,
    subsections: [
      {
        heading: "a. Executive Summary",
        items: ["Application scope", "Testing approach", "High-level outcomes (findings by severity)"],
      },
      {
        heading: "b. Findings & Evidence",
        items: [
          "Name and category (OWASP Top 10 mapping)",
          "Severity (CVSS + Business impact)",
          "Affected URLs/endpoints",
          "Evidence (logs/screenshots)",
          "Reproduction steps (PoC)",
        ],
      },
      {
        heading: "c. Remediation & Verification",
        items: ["Fix recommendations", "Secure coding guidance", "Retest results (before vs after)"],
      },
      {
        heading: "d. Future Security Recommendations",
        items: [
          "Secure SDLC adoption",
          "Regular scanning schedule",
          "Monitoring enhancements and alerting rules",
        ],
      },
    ],
  },
];

const Methodology = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container max-w-3xl">
        <SectionHeader
          tag="Step-by-Step"
          title="Assessment Methodology"
          description="A structured 6-step approach from environment setup to final reporting."
        />
        <div className="mt-8">
          {steps.map((s) => (
            <StepCard key={s.step} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Methodology;
