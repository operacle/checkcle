
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePublicStatusPageData } from './hooks/usePublicStatusPageData';
import { StatusPageHeader } from './StatusPageHeader';
import { CurrentStatusSection } from './CurrentStatusSection';
import { ComponentsStatusSection } from './ComponentsStatusSection';
import { OverallUptimeSection } from './OverallUptimeSection';
import { PublicStatusPageFooter } from './PublicStatusPageFooter';

export const PublicStatusPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { page, components, services, uptimeData, loading, error } = usePublicStatusPageData(slug);

  // Apply theme to document
  useEffect(() => {
    if (page) {
      const root = document.documentElement;
      if (page.theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
    
    // Cleanup on unmount
    return () => {
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
    };
  }, [page?.theme]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading status page...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The requested status page could not be found.'}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <StatusPageHeader page={page} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Status */}
        <CurrentStatusSection page={page} components={components} services={services} />

        {/* Components Status */}
        <ComponentsStatusSection 
          components={components} 
          services={services} 
          uptimeData={uptimeData} 
        />

        {/* Overall Uptime History */}
        <OverallUptimeSection uptimeData={uptimeData} />

        {/* Footer */}
        <PublicStatusPageFooter page={page} />
      </div>

      {/* Custom CSS */}
      {page.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: page.custom_css }} />
      )}
    </div>
  );
};