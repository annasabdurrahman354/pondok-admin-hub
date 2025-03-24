
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
import PondokRABEdit from "@/pages/pondok/PondokRABEdit";
import PondokLPJEdit from "@/pages/pondok/PondokLPJEdit";
import PondokSettings from "@/pages/pondok/PondokSettings";
import PondokCreate from "@/pages/pondok/PondokCreate";
import PondokRABList from "@/pages/pondok/PondokRABList";
import PondokLPJList from "@/pages/pondok/PondokLPJList";
import PondokRABDetail from "@/pages/pondok/PondokRABDetail";
import PondokLPJDetail from "@/pages/pondok/PondokLPJDetail";
import PondokRABCreate from "@/pages/pondok/PondokRABCreate";
import PondokLPJCreate from "@/pages/pondok/PondokLPJCreate";

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
              {/* Pages with bottom navigation */}
              <Route path="/pondok" element={<PondokLayout />}>
                <Route path="dashboard" element={<PondokDashboard />} />
                <Route path="rab-list" element={<PondokRABList />} />
                <Route path="lpj-list" element={<PondokLPJList />} />
                <Route path="settings" element={<PondokSettings />} />
              </Route>
              
              {/* Standalone pages (without bottom navigation) - wrapped with container for padding */}
              <Route path="/pondok/rab/detail/:rabId" element={<div className="container mx-auto px-4 py-6"><PondokRABDetail /></div>} />
              <Route path="/pondok/lpj/detail/:lpjId" element={<div className="container mx-auto px-4 py-6"><PondokLPJDetail /></div>} />
              <Route path="/pondok/rab/create" element={<div className="container mx-auto px-4 py-6"><PondokRABCreate /></div>} />
              <Route path="/pondok/rab/edit/:rabId" element={<div className="container mx-auto px-4 py-6"><PondokRABEdit /></div>} />
              <Route path="/pondok/lpj/create" element={<div className="container mx-auto px-4 py-6"><PondokLPJCreate /></div>} />
              <Route path="/pondok/lpj/edit/:lpjId" element={<div className="container mx-auto px-4 py-6"><PondokLPJEdit /></div>} />
              <Route path="/pondok/sync" element={<div className="container mx-auto px-4"><PondokSync /></div>} />
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
