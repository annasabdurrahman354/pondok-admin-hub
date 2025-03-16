
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import PondokLayout from "@/components/layouts/PondokLayout";
import YayasanLayout from "@/components/layouts/YayasanLayout";

// Auth
import Login from "@/pages/auth/Login";

// Pondok Pages
import PondokDashboard from "@/pages/pondok/PondokDashboard";
import PondokSync from "@/pages/pondok/PondokSync";

// Yayasan Pages
import YayasanDashboard from "@/pages/yayasan/YayasanDashboard";

// Shared
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Pondok Admin Routes */}
            <Route path="/pondok" element={<PondokLayout />}>
              <Route path="dashboard" element={<PondokDashboard />} />
              <Route path="rab" element={<div>RAB Management Page (Coming Soon)</div>} />
              <Route path="lpj" element={<div>LPJ Management Page (Coming Soon)</div>} />
              <Route path="settings" element={<div>Pondok Settings Page (Coming Soon)</div>} />
              <Route path="create" element={<div>Create New Document Page (Coming Soon)</div>} />
            </Route>
            
            {/* Pondok Sync (outside of layout) */}
            <Route path="/pondok/sync" element={<PondokSync />} />
            
            {/* Yayasan Admin Routes */}
            <Route path="/yayasan" element={<YayasanLayout />}>
              <Route path="dashboard" element={<YayasanDashboard />} />
              <Route path="pondok" element={<div>Pondok Management Page (Coming Soon)</div>} />
              <Route path="rab" element={<div>RAB Review Page (Coming Soon)</div>} />
              <Route path="lpj" element={<div>LPJ Review Page (Coming Soon)</div>} />
              <Route path="periods" element={<div>Submission Periods Page (Coming Soon)</div>} />
              <Route path="reports" element={<div>Reports Page (Coming Soon)</div>} />
              <Route path="settings" element={<div>Yayasan Settings Page (Coming Soon)</div>} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
