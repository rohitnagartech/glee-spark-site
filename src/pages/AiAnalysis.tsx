import { useState } from "react";
import { Brain, Send, Sparkles, Shield, Bug, FileText, Zap } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickActions = [
  { label: "Analyze OWASP Top 10 risks", icon: Shield, prompt: "Analyze my application for OWASP Top 10 risks based on the scan results. What are the most critical findings and recommended remediations?" },
  { label: "Generate threat report", icon: FileText, prompt: "Generate a comprehensive threat intelligence report for my web application based on the vulnerabilities found." },
  { label: "Suggest mitigations", icon: Bug, prompt: "What are the top priority mitigations I should implement to reduce my attack surface? Provide specific code examples." },
  { label: "Security architecture review", icon: Zap, prompt: "Review my application's security architecture and identify potential weaknesses in the authentication flow, session management, and data protection." },
];

const simulateAIResponse = (userMessage: string): string => {
  if (userMessage.toLowerCase().includes("owasp")) {
    return `## OWASP Top 10 Risk Analysis

Based on the scan results, here are the critical findings:

### 🔴 Critical Findings
1. **A03:2021 - Injection (SQLi)**
   - Found in: \`/api/users?id=\` endpoint
   - CVSS: 9.8 (Critical)
   - User input directly concatenated into SQL queries
   - **Fix**: Use parameterized queries with prepared statements

2. **A03:2021 - Injection (XSS)**
   - Found in: \`/search\` endpoint (Reflected XSS)
   - CVSS: 7.5 (High)
   - Input reflected without encoding
   - **Fix**: Implement context-aware output encoding

### 🟠 High Risk Findings
3. **A01:2021 - Broken Access Control**
   - IDOR vulnerability on \`/api/users/:id\`
   - Missing authorization checks on resource access
   - **Fix**: Implement object-level authorization

4. **A07:2021 - Identification & Authentication Failures**
   - Default credentials on admin panel
   - No account lockout mechanism
   - **Fix**: Enforce strong passwords + MFA

### 📊 Risk Summary
| Severity | Count | Priority |
|----------|-------|----------|
| Critical | 3     | Immediate |
| High     | 5     | This Sprint |
| Medium   | 8     | Next Sprint |
| Low      | 4     | Backlog |

**Overall Risk Score: 72/100 (High Risk)**

Recommend immediate remediation of injection vulnerabilities and access control issues.`;
  }

  if (userMessage.toLowerCase().includes("threat") || userMessage.toLowerCase().includes("report")) {
    return `## Threat Intelligence Report

### Executive Summary
Your application shows **significant security gaps** particularly in input validation and access control. The attack surface includes 47 public endpoints, 8 of which lack authentication.

### Active Threats Detected
- **Credential Stuffing**: 342 blocked attempts from Russian IPs in the last 24h
- **SQL Injection Probes**: Automated scanning detected from 3 unique source IPs
- **XSS Payload Testing**: Multiple script injection attempts on search functionality

### Attack Vector Analysis
1. **Primary Vector**: Web application layer (Layer 7)
2. **Secondary Vector**: Authentication bypass attempts
3. **Tertiary Vector**: Dependency exploitation (CVE-2021-23337 in lodash)

### Threat Actor Profile
- **Sophistication**: Medium (automated tools + manual exploitation)
- **Motivation**: Data theft (customer PII targeting)
- **Origin**: Eastern Europe (based on IP geolocation)

### Recommended Actions
1. 🔴 Patch SQL injection in \`/api/users\` — **Immediate**
2. 🔴 Deploy WAF rules for known attack patterns — **24 hours**
3. 🟠 Implement rate limiting on all endpoints — **48 hours**
4. 🟡 Update vulnerable dependencies — **1 week**
5. 🟢 Enable comprehensive audit logging — **2 weeks**`;
  }

  if (userMessage.toLowerCase().includes("mitigat")) {
    return `## Priority Mitigations

### 1. 🔴 Input Validation (Immediate)
\`\`\`javascript
// Before (vulnerable)
const query = "SELECT * FROM users WHERE id = " + req.query.id;

// After (secure)
const query = "SELECT * FROM users WHERE id = $1";
const result = await db.query(query, [req.query.id]);
\`\`\`

### 2. 🔴 Secure Headers (Immediate)
\`\`\`javascript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
\`\`\`

### 3. 🟠 Rate Limiting (48h)
\`\`\`javascript
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts'
});
app.use('/login', loginLimiter);
\`\`\`

### 4. 🟠 Session Hardening
\`\`\`javascript
app.use(session({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000
  }
}));
\`\`\`

### Impact Assessment
Implementing these 4 mitigations would reduce your risk score from **72 to approximately 35** (Medium Risk).`;
  }

  return `## Security Analysis

Based on your query, here are my recommendations:

### Key Observations
- Your application has **59 total vulnerabilities** identified across all modules
- **8 critical findings** require immediate attention
- The authentication flow has multiple weaknesses including missing token rotation and no MFA

### Architecture Concerns
1. **Session Management**: JWT tokens stored in localStorage (vulnerable to XSS)
2. **API Security**: 8 endpoints lack proper authentication
3. **Data Protection**: No encryption at rest for sensitive PII fields
4. **Logging**: Insufficient audit trail for admin actions

### Recommended Next Steps
1. Conduct a focused penetration test on the authentication system
2. Implement a Web Application Firewall (WAF) with custom rules
3. Set up automated dependency scanning in your CI/CD pipeline
4. Schedule a security architecture review with your team

Would you like me to dive deeper into any specific area?`;
};

const AiAnalysis = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const response = simulateAIResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-3rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-heading font-bold text-foreground">AI Threat Analysis</h1>
        <p className="text-muted-foreground text-sm">AI-powered threat intelligence with quick-action buttons</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {quickActions.map((action) => (
          <button key={action.label} onClick={() => sendMessage(action.prompt)} disabled={isLoading} className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card text-left hover:border-primary/50 hover:border-glow transition-all disabled:opacity-50">
            <action.icon className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-xs font-mono text-card-foreground">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto rounded-lg border border-border bg-card p-4 space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Brain className="h-12 w-12 text-primary mb-4 opacity-50" />
            <p className="text-muted-foreground font-mono">Ask about your security posture or use quick actions above</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg p-4 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 border border-border text-card-foreground"}`}>
              {msg.role === "assistant" ? (
                <div className="prose-sm">
                  {msg.content.split("\n").map((line, j) => {
                    if (line.startsWith("## ")) return <h2 key={j} className="text-lg font-heading font-bold text-foreground mt-2 mb-1">{line.replace("## ", "")}</h2>;
                    if (line.startsWith("### ")) return <h3 key={j} className="text-sm font-heading font-bold text-accent-foreground mt-2 mb-1">{line.replace("### ", "")}</h3>;
                    if (line.startsWith("```")) return null;
                    if (line.startsWith("| ")) return <p key={j} className="text-xs font-mono text-muted-foreground">{line}</p>;
                    if (line.startsWith("- ") || line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.") || line.startsWith("5.")) return <p key={j} className="text-sm ml-2">{line}</p>;
                    if (line.trim() === "") return <br key={j} />;
                    return <p key={j} className="text-sm">{line}</p>;
                  })}
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse-glow" />
              <span className="text-sm text-muted-foreground">Analyzing threat intelligence...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask about security threats, vulnerabilities, or mitigations..."
          className="flex-1 bg-muted border border-border rounded-md px-4 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={isLoading}
        />
        <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-mono text-sm hover:opacity-90 disabled:opacity-50">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AiAnalysis;
