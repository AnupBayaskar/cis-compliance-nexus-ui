
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ModernSidebar from "@/components/layout/ModernSidebar";
import ModernNavbar from "@/components/layout/ModernNavbar";
import Home from "./pages/Home";
import Benchmarks from "./pages/Benchmarks";
import Compliance from "./pages/Compliance";
import ComplianceDetails from "./pages/ComplianceDetails";
import TeamManagement from "./pages/TeamManagement";
import Organization from "./pages/Organization";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import SavedConfigurations from "./pages/SavedConfigurations";
import { ConfigurationProvider } from './context/ConfigurationContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
          <Toaster />
          <Sonner />
        <AuthProvider>
          <BrowserRouter>
        <ConfigurationProvider>

          

            <div className="min-h-screen bg-background">
              <ModernNavbar />
              <ModernSidebar />
              <main className="ml-20 pt-16 min-h-screen">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/benchmarks" element={<Benchmarks />} />
                  <Route path="/compliance" element={<Compliance />} />
                  <Route path="/compliance-details" element={<ComplianceDetails />} />
                  <Route path="/team-management" element={<TeamManagement />} />
                  <Route path="/organization" element={<Organization />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/saved-configurations" element={<SavedConfigurations />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </ConfigurationProvider>
          </BrowserRouter>

        </AuthProvider>

      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
