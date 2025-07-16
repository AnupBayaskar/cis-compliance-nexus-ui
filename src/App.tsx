
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { MemberPanel } from "@/components/MemberPanel";
import Home from "./pages/Home";
import TeamSpace from "./pages/TeamSpace";
import DeviceSpace from "./pages/DeviceSpace";
import ComplianceSpace from "./pages/ComplianceSpace";
import ValidationSpace from "./pages/ValidationSpace";
import ReportsSpace from "./pages/ReportsSpace";
import Profile from "./pages/Profile";
import OrganizationSpace from "./pages/OrganizationSpace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col ml-20">
              <Navbar />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/team-space" element={<TeamSpace />} />
                  <Route path="/device-space" element={<DeviceSpace />} />
                  <Route path="/compliance-space" element={<ComplianceSpace />} />
                  <Route path="/validation-space" element={<ValidationSpace />} />
                  <Route path="/reports-space" element={<ReportsSpace />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/organization-space" element={<OrganizationSpace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <MemberPanel />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
