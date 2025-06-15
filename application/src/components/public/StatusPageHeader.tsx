
import { OperationalPageRecord } from '@/types/operational.types';
import { Shield, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusPageHeaderProps {
  page: OperationalPageRecord;
}

export const StatusPageHeader = ({ page }: StatusPageHeaderProps) => {
  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {page.logo_url ? (
              <img 
                src={page.logo_url} 
                alt={`${page.title} logo`}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-foreground">{page.title}</h1>
              <p className="text-muted-foreground mt-1">{page.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {page.custom_domain && (
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={`https://${page.custom_domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Visit Site
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            )}
            
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Live Status</span>
              </div>
              <div className="text-xs">
                Auto-updated every 30s
              </div>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Status Page</span>
          <span>•</span>
          <span className="text-foreground font-medium">{page.title}</span>
        </div>
      </div>
    </header>
  );
};