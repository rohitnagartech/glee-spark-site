import { Shield, Search, Bug, FileWarning, Lock, BarChart3 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const technologies = [
  { icon: Search, label: "AppSec Testing" },
  { icon: Bug, label: "DAST/SAST" },
  { icon: FileWarning, label: "Threat Modeling" },
  { icon: Lock, label: "Security Hardening" },
  { icon: BarChart3, label: "Log Analysis" },
  { icon: Shield, label: "DevSecOps" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative container text-center py-32 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-primary font-mono text-sm">
          <Shield className="h-4 w-4" />
          <span>Web Application Security Project</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
          <span className="text-foreground">Risk Detection in</span>
          <br />
          <span className="text-primary text-glow">Web Applications</span>
        </h1>

        <p className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed">
          Identify, detect, analyze, and mitigate security risks by applying SAST/DAST,
          vulnerability scanning, threat modeling, and attack simulation aligned with the OWASP Top 10.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto pt-8">
          {technologies.map((tech) => (
            <div
              key={tech.label}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-card/50 hover:border-primary/50 hover:border-glow transition-all duration-300"
            >
              <tech.icon className="h-6 w-6 text-primary" />
              <span className="text-xs font-mono text-card-foreground">{tech.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
