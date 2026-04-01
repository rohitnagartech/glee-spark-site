import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppProvider } from "@/context/AppContext";

import Dashboard from "@/pages/Dashboard";
import Recon from "@/pages/Recon";
import DastScanner from "@/pages/DastScanner";
import SastAnalyzer from "@/pages/SastAnalyzer";
import RiskClassifier from "@/pages/RiskClassifier";
import ThreatModeling from "@/pages/ThreatModeling";
import AttackSurface from "@/pages/AttackSurface";
import SiemLogs from "@/pages/SiemLogs";
import Alerts from "@/pages/Alerts";
import MitigationCenter from "@/pages/MitigationCenter";
import AiAnalysis from "@/pages/AiAnalysis";
import RiskReport from "@/pages/RiskReport";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <header className="h-12 flex items-center border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
                  <SidebarTrigger className="ml-2" />
                </header>
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/recon" element={<Recon />} />
                    <Route path="/dast" element={<DastScanner />} />
                    <Route path="/sast" element={<SastAnalyzer />} />
                    <Route path="/risk-classifier" element={<RiskClassifier />} />
                    <Route path="/threat-modeling" element={<ThreatModeling />} />
                    <Route path="/attack-surface" element={<AttackSurface />} />
                    <Route path="/siem" element={<SiemLogs />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/mitigation" element={<MitigationCenter />} />
                    <Route path="/ai-analysis" element={<AiAnalysis />} />
                    <Route path="/report" element={<RiskReport />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
