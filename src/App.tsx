
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PondokLayout from "@/components/layouts/PondokLayout";
import YayasanLayout from "@/components/layouts/YayasanLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Auth
import Login from "@/pages/auth/Login";

// Pondok Pages
import PondokDashboard from "@/pages/pondok/PondokDashboard";
import PondokSync from "@/pages/pondok/PondokSync";
import PondokRAB from "@/pages/pondok/PondokRAB";
import PondokLPJ from "@/pages/pondok/PondokLPJ";
import PondokSettings from "@/pages/pondok/PondokSettings";
import PondokCreate from "@/pages/pondok/PondokCreate";

// Yayasan Pages
import YayasanDashboard from "@/pages/yayasan/YayasanDashboard";
import YayasanPondok from "@/pages/yayasan/YayasanPondok";
import YayasanRAB from "@/pages/yayasan/YayasanRAB";
import YayasanLPJ from "@/pages/yayasan/YayasanLPJ";
import YayasanPeriods from "@/pages/yayasan/YayasanPeriods";
import YayasanReports from "@/pages/yayasan/YayasanReports";
import YayasanSettings from "@/pages/yayasan/YayasanSettings";

// Detail Pages
import PondokDetail from "@/pages/yayasan/PondokDetail";
import RabDetail from "@/pages/yayasan/RabDetail";
import LpjDetail from "@/pages/yayasan/LpjDetail";

// Shared
import NotFound from "./pages/NotFound";
import { SessionProvider } from "./context/SessionContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionProvider>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Pondok Admin Routes - Protected for Admin Pondok role */}
            <Route element={<ProtectedRoute requiredRole="Admin Pondok" />}>
              <Route path="/pondok" element={<PondokLayout />}>
                <Route path="dashboard" element={<PondokDashboard />} />
                <Route path="rab" element={<PondokRAB />} />
                <Route path="lpj" element={<PondokLPJ />} />
                <Route path="settings" element={<PondokSettings />} />
                <Route path="create" element={<PondokCreate />} />
              </Route>
            </Route>
            
            {/* Pondok Sync (outside of layout but still protected) */}
            <Route element={<ProtectedRoute requiredRole="Admin Pondok" />}>
              <Route path="/pondok/sync" element={<PondokSync />} />
            </Route>
            
            {/* Yayasan Admin Routes - Protected for Admin Yayasan role */}
            <Route element={<ProtectedRoute requiredRole="Admin Yayasan" />}>
              <Route path="/yayasan" element={<YayasanLayout />}>
                <Route path="dashboard" element={<YayasanDashboard />} />
                <Route path="pondok" element={<YayasanPondok />} />
                <Route path="pondok/:pondokId" element={<PondokDetail />} />
                <Route path="rab" element={<YayasanRAB />} />
                <Route path="rab/:rabId" element={<RabDetail />} />
                <Route path="lpj" element={<YayasanLPJ />} />
                <Route path="lpj/:lpjId" element={<LpjDetail />} />
                <Route path="periods" element={<YayasanPeriods />} />
                <Route path="reports" element={<YayasanReports />} />
                <Route path="settings" element={<YayasanSettings />} />
              </Route>
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
