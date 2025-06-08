
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
    if (authService.isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default Index;