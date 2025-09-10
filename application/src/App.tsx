import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SidebarProvider } from "./contexts/SidebarContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InstanceMonitoring from "./pages/InstanceMonitoring";
import ContainerMonitoring from "./pages/ContainerMonitoring";
import ServiceDetail from "./pages/ServiceDetail";
import SslDomain from "./pages/SslDomain";
import ScheduleIncident from "./pages/ScheduleIncident";
import OperationalPage from "./pages/OperationalPage";
import RegionalMonitoring from "./pages/RegionalMonitoring";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PublicStatusPage from "./pages/PublicStatusPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import ServerDetail from "./pages/ServerDetail";

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <SidebarProvider>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <Routes>
                {/* Public routes */}
                <Route path="/public/:slug" element={<PublicStatusPage />} />

                {/* Protected routes */}
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instance-monitoring"
                  element={
                    <ProtectedRoute>
                      <InstanceMonitoring />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/server-detail/:serverId"
                  element={
                    <ProtectedRoute>
                      <ServerDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/container-monitoring"
                  element={
                    <ProtectedRoute>
                      <ContainerMonitoring />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/container-monitoring/:serverId"
                  element={
                    <ProtectedRoute>
                      <ContainerMonitoring />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/service/:id"
                  element={
                    <ProtectedRoute>
                      <ServiceDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ssl-domain"
                  element={
                    <ProtectedRoute>
                      <SslDomain />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/schedule-incident"
                  element={
                    <ProtectedRoute>
                      <ScheduleIncident />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/operational-page"
                  element={
                    <ProtectedRoute>
                      <OperationalPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/regional-monitoring"
                  element={
                    <ProtectedRoute>
                      <RegionalMonitoring />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </QueryClientProvider>
          </SidebarProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
