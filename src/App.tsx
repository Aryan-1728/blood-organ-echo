import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import DonorProfile from "./components/dashboard/DonorProfile";
import NotificationsPage from "./components/dashboard/Notificationspage";
import DonationHistory from "./components/dashboard/DonationHistory";
import { EmergencySOSCard } from "./components/dashboard/EmergencySOSCard";

// React Query client
const queryClient = new QueryClient();

// Dummy SOS request for testing
const dummySOSRequest = {
  id: '1',
  patient_name: 'John Doe',
  patient_age: 30,
  blood_type: 'O+',
  priority: 'critical',
  status: 'active',
  location_name: 'City Hospital',
  contact_phone: '+911234567890',
  created_at: new Date().toISOString(),
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <AuthGuard>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/donor/profile" element={<DonorProfile />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/donor/history" element={<DonationHistory />} />

                    {/* SOS Emergency Route with dummy data */}
                    <Route
                      path="/donor/sos"
                      element={<EmergencySOSCard request={dummySOSRequest} userRole="hospital" />}
                    />

                    {/* Catch-all 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </DashboardLayout>
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
