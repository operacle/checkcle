
import { OperationalPageRecord } from '@/types/operational.types';
import { format } from 'date-fns';
import { Clock, Shield, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublicStatusPageFooterProps {
  page: OperationalPageRecord;
}

export const PublicStatusPageFooter = ({ page }: PublicStatusPageFooterProps) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <footer className="mt-12 pt-8 border-t border-border">
      <div className="space-y-6">
        {/* Status Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-muted/30 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="font-medium text-foreground">Real-time Monitoring</div>
              <div className="text-sm text-muted-foreground">24/7 automated checks</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium text-foreground">Instant Updates</div>
              <div className="text-sm text-muted-foreground">Status changes in real-time</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="font-medium text-foreground">Historical Data</div>
              <div className="text-sm text-muted-foreground">90-day performance history</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm:ss')} UTC</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Monitoring active</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Status
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-muted-foreground p-4 bg-muted/20 rounded-lg">
          <p>
            This status page provides real-time information about our systems and services. 
            Historical data reflects the last 90 days of monitoring. For support inquiries, please contact our team.
          </p>
          {page.custom_domain && (
            <p className="mt-2">
              Powered by automated monitoring • Status page for {page.title}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};