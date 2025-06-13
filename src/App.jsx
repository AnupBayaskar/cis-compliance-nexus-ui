
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Placeholder routes for future pages */}
          <Route path="/benchmarks" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Benchmarks Page - Coming Soon</h1></div>} />
          <Route path="/compliance" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Compliance Check Page - Coming Soon</h1></div>} />
          <Route path="/profile" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">User Profile Page - Coming Soon</h1></div>} />
          <Route path="/login" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Login Page - Coming Soon</h1></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
