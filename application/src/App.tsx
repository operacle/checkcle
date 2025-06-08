
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { authService } from './services/authService';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ServiceDetail from './pages/ServiceDetail';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SslDomain from './pages/SslDomain';
import ScheduleIncident from './pages/ScheduleIncident';
import OperationalPage from './pages/OperationalPage';
import PublicStatusPage from './pages/PublicStatusPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <SidebarProvider>
              <Router>
                <div className="min-h-screen bg-background text-foreground">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
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
                    <Route path="/status/:pageSlug" element={<PublicStatusPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </div>
              </Router>
            </SidebarProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;