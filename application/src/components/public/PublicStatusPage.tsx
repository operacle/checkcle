
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { usePublicStatusPageData } from './hooks/usePublicStatusPageData';
import { StatusPageHeader } from './StatusPageHeader';
import { CurrentStatusSection } from './CurrentStatusSection';
import { ComponentsStatusSection } from './ComponentsStatusSection';
import { OverallUptimeSection } from './OverallUptimeSection';
import { PublicStatusPageFooter } from './PublicStatusPageFooter';

export const PublicStatusPage = () => {
  const { slug } = useParams<{ slug: string }>();
  console.log('PublicStatusPage - slug from params:', slug);
  
  const { page, components, services, uptimeData, loading, error } = usePublicStatusPageData(slug);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // The usePublicStatusPageData hook handles data refetching
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (page) {
      const root = document.documentElement;
      
      // Remove any existing theme classes
      root.classList.remove('dark', 'light');
      
      // Apply the selected theme
      if (page.theme === 'dark') {
        root.classList.add('dark');
      } else if (page.theme === 'light') {
        root.classList.add('light');
      }
      // For 'default' theme, don't add any class (uses system preference)
    }
    
    // Cleanup on unmount
    return () => {
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
    };
  }, [page?.theme]);

  console.log('PublicStatusPage state:', { loading, error, page: !!page, components: components.length, services: services.length });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">Loading Status Page</p>
            <p className="text-sm text-muted-foreground">Fetching real-time system status...</p>
            <p className="text-xs text-muted-foreground">Slug: {slug || 'No slug provided'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Status Page Not Found</h1>
            <p className="text-muted-foreground">
              {error || 'The requested status page could not be found or is not publicly accessible.'}
            </p>
            <p className="text-xs text-muted-foreground">Slug: {slug || 'No slug provided'}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <StatusPageHeader page={page} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
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
      </main>

      {/* Custom CSS */}
      {page.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: page.custom_css }} />
      )}
    </div>
  );
};