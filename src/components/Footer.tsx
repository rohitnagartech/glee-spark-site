import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-primary font-heading font-bold">
          <Shield className="h-5 w-5" />
          <span>WebRisk Detection</span>
        </div>
        <p className="text-sm text-muted-foreground font-mono">
          Risk Detection in Web Applications — Security Assessment Project
        </p>
      </div>
    </footer>
  );
};

export default Footer;
