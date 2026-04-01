import {
  LayoutDashboard, Search, Radar, Code, BarChart3, Target,
  Network, FileText, Bell, ShieldCheck, Brain, ClipboardList, PanelLeft,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Shield } from "lucide-react";

const modules = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Recon & Discovery", url: "/recon", icon: Search },
  { title: "DAST Scanner", url: "/dast", icon: Radar },
  { title: "SAST Analyzer", url: "/sast", icon: Code },
  { title: "Risk Classifier", url: "/risk-classifier", icon: BarChart3 },
  { title: "Threat Modeling", url: "/threat-modeling", icon: Target },
  { title: "Attack Surface", url: "/attack-surface", icon: Network },
  { title: "SIEM Logs", url: "/siem", icon: FileText },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Mitigation Center", url: "/mitigation", icon: ShieldCheck },
  { title: "AI Analysis", url: "/ai-analysis", icon: Brain },
  { title: "Risk Report", url: "/report", icon: ClipboardList },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { unreadCount } = useAppContext();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 text-primary font-heading font-bold">
          <Shield className="h-6 w-6 flex-shrink-0" />
          {!collapsed && <span className="text-glow text-lg">WebRisk</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel className="text-muted-foreground font-mono text-xs">
            {!collapsed && "MODULES"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-accent/50 relative"
                      activeClassName="bg-accent text-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                      {item.title === "Alerts" && unreadCount > 0 && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {!collapsed && (
          <p className="text-xs text-muted-foreground font-mono">v1.0 — Risk Detection</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
