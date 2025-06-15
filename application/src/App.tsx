import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import ServiceDetail from '@/pages/ServiceDetail';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import OperationalPage from '@/pages/OperationalPage';
import ScheduleIncident from '@/pages/ScheduleIncident';
import SslDomain from '@/pages/SslDomain';
import PublicStatusPage from '@/pages/PublicStatusPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <SidebarProvider>
            <ErrorBoundary>
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/services/:id" element={<ServiceDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/operational-page" element={<OperationalPage />} />
                  <Route path="/schedule-incident" element={<ScheduleIncident />} />
                  <Route path="/ssl-domain" element={<SslDomain />} />
                  <Route path="/status/:slug" element={<PublicStatusPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
              <Toaster />
            </ErrorBoundary>
          </SidebarProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;