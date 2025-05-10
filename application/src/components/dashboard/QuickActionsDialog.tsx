
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuickActionsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const QuickActionsDialog: React.FC<QuickActionsDialogProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] bg-background max-h-[90vh] overflow-y-auto">
        <DialogClose className="absolute right-4 top-4">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('quickActions')}</DialogTitle>
          <DialogDescription>
            {t('quickActionsDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Website Monitoring Card */}
          <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{t('monitorWebsite')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('monitorWebsiteDesc')}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('quickTips')}:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>{t('monitorMultipleEndpoints')}</li>
                <li>{t('trackResponseTimes')}</li>
                <li>{t('setCustomAlerts')}</li>
              </ul>
            </div>
          </div>
          
          {/* Server Monitoring Card */}
          <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{t('monitorServer')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('monitorServerDesc')}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('quickTips')}:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>{t('monitorCPURam')}</li>
                <li>{t('trackNetworkMetrics')}</li>
                <li>{t('viewProcesses')}</li>
              </ul>
            </div>
          </div>
          
          {/* SSL Certificate Card */}
          <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{t('sslCertificate')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('sslCertificateDesc')}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('quickTips')}:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>{t('trackSSLExpiration')}</li>
                <li>{t('getEarlyRenewal')}</li>
                <li>{t('monitorMultipleDomains')}</li>
              </ul>
            </div>
          </div>
          
          {/* Incidents Management Card */}
          <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{t('incidentsManagement')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('incidentsManagementDesc')}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('quickTips')}:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>{t('createTrackIncidents')}</li>
                <li>{t('assignIncidents')}</li>
                <li>{t('monitorResolution')}</li>
              </ul>
            </div>
          </div>
          
          {/* Operational Status Card */}
          <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{t('operationalStatus')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('operationalStatusDesc')}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('quickTips')}:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>{t('createCustomStatus')}</li>
                <li>{t('displayRealTime')}</li>
                <li>{t('shareIncidentUpdates')}</li>
              </ul>
            </div>
          </div>
          
          {/* Reports & Analytics Card */}
          <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{t('reportsAnalytics')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('reportsAnalyticsDesc')}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('quickTips')}:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>{t('generateUptimeReports')}</li>
                <li>{t('analyzePerformance')}</li>
                <li>{t('exportMonitoringData')}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickActionsDialog;