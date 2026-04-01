import { useState } from "react";
import { ShieldCheck, CheckCircle, XCircle, Copy, Lock, Globe, KeyRound, Timer, Code } from "lucide-react";
import { toast } from "sonner";

interface CheckItem {
  id: string;
  label: string;
  description: string;
  status: "pass" | "fail" | "warning" | "unchecked";
  fix?: string;
}

const inputValidationChecks: CheckItem[] = [
  { id: "iv1", label: "Server-side input validation", description: "All user inputs validated on the server", status: "fail", fix: "Implement Zod/Joi schemas on all API endpoints" },
  { id: "iv2", label: "SQL parameterized queries", description: "All database queries use parameterized statements", status: "fail", fix: "Replace string concatenation with prepared statements" },
  { id: "iv3", label: "XSS output encoding", description: "All output properly encoded based on context", status: "warning", fix: "Use DOMPurify for HTML contexts, encodeURIComponent for URLs" },
  { id: "iv4", label: "File upload validation", description: "File type, size, and content validated", status: "fail", fix: "Check MIME type, enforce size limits, scan for malware" },
  { id: "iv5", label: "JSON schema validation", description: "API request bodies validated against schemas", status: "pass" },
];

const headerChecks: CheckItem[] = [
  { id: "h1", label: "Content-Security-Policy", description: "CSP header configured to prevent XSS", status: "fail", fix: "Add: Content-Security-Policy: default-src 'self'; script-src 'self'" },
  { id: "h2", label: "Strict-Transport-Security", description: "HSTS header forces HTTPS", status: "pass" },
  { id: "h3", label: "X-Frame-Options", description: "Prevents clickjacking attacks", status: "fail", fix: "Add: X-Frame-Options: DENY" },
  { id: "h4", label: "X-Content-Type-Options", description: "Prevents MIME type sniffing", status: "pass" },
  { id: "h5", label: "X-XSS-Protection", description: "Browser XSS filter enabled", status: "warning", fix: "Add: X-XSS-Protection: 1; mode=block (deprecated but still useful)" },
  { id: "h6", label: "Referrer-Policy", description: "Controls referrer information", status: "fail", fix: "Add: Referrer-Policy: strict-origin-when-cross-origin" },
];

const authChecks: CheckItem[] = [
  { id: "a1", label: "Password hashing (bcrypt/argon2)", description: "Passwords stored with strong hashing", status: "pass" },
  { id: "a2", label: "Account lockout", description: "Lock after 5 failed attempts", status: "fail", fix: "Implement progressive lockout: 5min → 15min → 1hr" },
  { id: "a3", label: "Multi-factor authentication", description: "MFA available for all users", status: "fail", fix: "Implement TOTP-based MFA using speakeasy or otpauth" },
  { id: "a4", label: "JWT token rotation", description: "Tokens rotated on each use", status: "warning", fix: "Implement refresh token rotation with short-lived access tokens" },
];

const sessionChecks: CheckItem[] = [
  { id: "s1", label: "HttpOnly cookies", description: "Session cookies not accessible via JS", status: "fail", fix: "Set HttpOnly flag on all session cookies" },
  { id: "s2", label: "SameSite attribute", description: "CSRF protection via SameSite cookies", status: "fail", fix: "Set SameSite=Strict or SameSite=Lax on cookies" },
  { id: "s3", label: "Secure flag", description: "Cookies only sent over HTTPS", status: "pass" },
  { id: "s4", label: "Session timeout", description: "Sessions expire after inactivity", status: "warning", fix: "Set idle timeout to 30min, absolute timeout to 8hrs" },
];

const rateLimitChecks: CheckItem[] = [
  { id: "r1", label: "Login endpoint rate limit", description: "Limit login attempts per IP", status: "fail", fix: "Max 5 attempts per minute per IP using Redis" },
  { id: "r2", label: "API rate limiting", description: "General API rate limits", status: "warning", fix: "Implement token bucket: 100 req/min per user" },
  { id: "r3", label: "Bot detection", description: "CAPTCHA or bot challenge", status: "fail", fix: "Add reCAPTCHA v3 on login and registration" },
];

const cicdPipeline = `# .github/workflows/security.yml
name: Security Pipeline
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: SAST Scan
        uses: returntocorp/semgrep-action@v1
        with:
          config: p/owasp-top-ten

      - name: Dependency Check
        run: |
          npm audit --audit-level=high
          npx snyk test

      - name: Secret Scanning
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --only-verified

      - name: DAST Scan
        run: |
          docker run -t zaproxy/zap-stable \\
            zap-baseline.py -t \${{ env.APP_URL }}

      - name: Upload Results
        uses: actions/upload-artifact@v4
        with:
          name: security-reports
          path: reports/`;

const CheckSection = ({ title, icon: Icon, checks, onToggle }: { title: string; icon: any; checks: CheckItem[]; onToggle: (id: string) => void }) => {
  const passed = checks.filter((c) => c.status === "pass").length;
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="font-heading font-bold text-foreground">{title}</h3>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{passed}/{checks.length} passed</span>
      </div>
      <div className="space-y-2">
        {checks.map((c) => (
          <div key={c.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/30">
            <button onClick={() => onToggle(c.id)} className="mt-0.5 flex-shrink-0">
              {c.status === "pass" ? <CheckCircle className="h-4 w-4 text-primary" /> :
               c.status === "fail" ? <XCircle className="h-4 w-4 text-destructive" /> :
               c.status === "warning" ? <XCircle className="h-4 w-4 text-yellow-400" /> :
               <div className="h-4 w-4 rounded-full border border-muted-foreground" />}
            </button>
            <div className="flex-1">
              <p className={`text-sm font-mono ${c.status === "pass" ? "text-primary" : "text-foreground"}`}>{c.label}</p>
              <p className="text-xs text-muted-foreground">{c.description}</p>
              {c.status === "fail" && c.fix && <p className="text-xs text-accent-foreground mt-1">Fix: {c.fix}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MitigationCenter = () => {
  const [inputVal, setInputVal] = useState(inputValidationChecks);
  const [headers, setHeaders] = useState(headerChecks);
  const [auth, setAuth] = useState(authChecks);
  const [session, setSession] = useState(sessionChecks);
  const [rateLimit, setRateLimit] = useState(rateLimitChecks);

  const toggle = (setter: React.Dispatch<React.SetStateAction<CheckItem[]>>) => (id: string) => {
    setter((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "pass" ? "fail" : "pass" } : c));
  };

  const copyPipeline = () => {
    navigator.clipboard.writeText(cicdPipeline);
    toast.success("CI/CD pipeline copied to clipboard!");
  };

  const allChecks = [...inputVal, ...headers, ...auth, ...session, ...rateLimit];
  const totalPassed = allChecks.filter((c) => c.status === "pass").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Mitigation Center</h1>
          <p className="text-muted-foreground text-sm">Security hardening checklist and CI/CD pipeline</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-heading font-bold text-primary">{totalPassed}/{allChecks.length}</p>
          <p className="text-xs text-muted-foreground">checks passed</p>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-muted rounded-full h-3">
        <div className="bg-primary h-3 rounded-full transition-all duration-500" style={{ width: `${(totalPassed / allChecks.length) * 100}%` }} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <CheckSection title="Input Validation" icon={ShieldCheck} checks={inputVal} onToggle={toggle(setInputVal)} />
        <CheckSection title="Secure Headers" icon={Globe} checks={headers} onToggle={toggle(setHeaders)} />
        <CheckSection title="Auth Hardening" icon={Lock} checks={auth} onToggle={toggle(setAuth)} />
        <CheckSection title="Session Security" icon={KeyRound} checks={session} onToggle={toggle(setSession)} />
        <CheckSection title="Rate Limiting" icon={Timer} checks={rateLimit} onToggle={toggle(setRateLimit)} />

        {/* CI/CD Pipeline */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">CI/CD Security Pipeline</h3>
            </div>
            <button onClick={copyPipeline} className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted">
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
          <pre className="bg-background rounded-md p-3 text-xs text-foreground font-mono overflow-x-auto max-h-80 overflow-y-auto">{cicdPipeline}</pre>
        </div>
      </div>
    </div>
  );
};

export default MitigationCenter;
