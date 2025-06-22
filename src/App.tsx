
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const AddTrade = lazy(() => import("./pages/AddTrade"));
const TradeLog = lazy(() => import("./pages/TradeLog"));
const MobileTradeLog = lazy(() => import("./pages/MobileTradeLog"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Performance = lazy(() => import("./pages/Performance"));
const Reports = lazy(() => import("./pages/Reports"));
const EnhancedReports = lazy(() => import("./pages/EnhancedReports"));
const InstitutionalDashboard = lazy(() => import("./pages/InstitutionalDashboard"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          }>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/add-trade" element={
                <ProtectedRoute>
                  <AddTrade />
                </ProtectedRoute>
              } />
              <Route path="/trades" element={
                <ProtectedRoute>
                  {isMobile ? <MobileTradeLog /> : <TradeLog />}
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/performance" element={
                <ProtectedRoute>
                  <Performance />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/enhanced-reports" element={
                <ProtectedRoute>
                  <EnhancedReports />
                </ProtectedRoute>
              } />
              <Route path="/institutional" element={
                <ProtectedRoute>
                  <InstitutionalDashboard />
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
