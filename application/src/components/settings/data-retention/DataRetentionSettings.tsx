
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Database, Trash2, AlertTriangle, Globe, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { authService } from "@/services/authService";
import { dataRetentionService } from "@/services/dataRetentionService";

interface RetentionSettings {
  uptimeRetentionDays: number;
  serverRetentionDays: number;
}

const DataRetentionSettings = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [settings, setSettings] = useState<RetentionSettings>({
    uptimeRetentionDays: 30,
    serverRetentionDays: 30
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUptimeShrinking, setIsUptimeShrinking] = useState(false);
  const [isServerShrinking, setIsServerShrinking] = useState(false);
  const [isFullShrinking, setIsFullShrinking] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<string | null>(null);

  // Check if user is super admin
  const currentUser = authService.getCurrentUser();
  const isSuperAdmin = currentUser?.role === "superadmin";

  useEffect(() => {
    if (isSuperAdmin) {
      loadSettings();
    }
  }, [isSuperAdmin]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const result = await dataRetentionService.getRetentionSettings();
      if (result) {
        setSettings({
          uptimeRetentionDays: result.uptimeRetentionDays || 30,
          serverRetentionDays: result.serverRetentionDays || 30
        });
        setLastCleanup(result.lastCleanup);
      }
    } catch (error) {
      console.error("Error loading retention settings:", error);
      toast({
        title: "Error",
        description: "Failed to load retention settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await dataRetentionService.updateRetentionSettings(settings);
      toast({
        title: "Settings saved",
        description: "Data retention settings have been updated",
      });
    } catch (error) {
      console.error("Error saving retention settings:", error);
      toast({
        title: "Error",
        description: "Failed to save retention settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUptimeShrink = async () => {
    try {
      setIsUptimeShrinking(true);
      const result = await dataRetentionService.manualUptimeCleanup();
      
      toast({
        title: "Uptime cleanup completed",
        description: `Deleted ${result.deletedRecords} old uptime records`,
      });
      
      // Reload settings to get updated last cleanup time
      await loadSettings();
    } catch (error) {
      console.error("Error during uptime cleanup:", error);
      toast({
        title: "Error",
        description: "Failed to perform uptime data cleanup",
        variant: "destructive",
      });
    } finally {
      setIsUptimeShrinking(false);
    }
  };

  const handleServerShrink = async () => {
    try {
      setIsServerShrinking(true);
      const result = await dataRetentionService.manualServerCleanup();
      
      toast({
        title: "Server cleanup completed",
        description: `Deleted ${result.deletedRecords} old server records`,
      });
      
      // Reload settings to get updated last cleanup time
      await loadSettings();
    } catch (error) {
      console.error("Error during server cleanup:", error);
      toast({
        title: "Error",
        description: "Failed to perform server data cleanup",
        variant: "destructive",
      });
    } finally {
      setIsServerShrinking(false);
    }
  };

  const handleFullShrink = async () => {
    try {
      setIsFullShrinking(true);
      const result = await dataRetentionService.manualCleanup();
      
      toast({
        title: "Database cleanup completed",
        description: `Deleted ${result.deletedRecords} old records`,
      });
      
      // Reload settings to get updated last cleanup time
      await loadSettings();
    } catch (error) {
      console.error("Error during manual cleanup:", error);
      toast({
        title: "Error",
        description: "Failed to perform database cleanup",
        variant: "destructive",
      });
    } finally {
      setIsFullShrinking(false);
    }
  };

  // Show permission notice for admin users
  if (!isSuperAdmin) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {t("dataRetention", "settings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                <span className="font-medium">Permission Notice:</span> As an admin user, you do not have access to data retention settings. These settings can only be accessed and modified by Super Admins.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading retention settings...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Retention Settings
          </CardTitle>
          <CardDescription>
            Configure how long monitoring data is kept in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="uptimeRetention">Uptime Monitoring Retention (days)</Label>
              <Input
                id="uptimeRetention"
                type="number"
                min="1"
                max="365"
                value={settings.uptimeRetentionDays}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  uptimeRetentionDays: parseInt(e.target.value) || 30
                }))}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Service uptime and incident data older than this will be automatically deleted
              </p>
            </div>

            <div>
              <Label htmlFor="serverRetention">Server Monitoring Retention (days)</Label>
              <Input
                id="serverRetention"
                type="number"
                min="1"
                max="365"
                value={settings.serverRetentionDays}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  serverRetentionDays: parseInt(e.target.value) || 30
                }))}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Server metrics and process data older than this will be automatically deleted
              </p>
            </div>
          </div>

          {lastCleanup && (
            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                Last automatic cleanup: {new Date(lastCleanup).toLocaleString()}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleUptimeShrink}
              disabled={isUptimeShrinking}
              className="flex items-center gap-2"
            >
              {isUptimeShrinking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              Shrink Uptime Data
            </Button>
            
            <Button
              variant="outline"
              onClick={handleServerShrink}
              disabled={isServerShrinking}
              className="flex items-center gap-2"
            >
              {isServerShrinking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Server className="h-4 w-4" />
              )}
              Shrink Server Data
            </Button>
            
            <Button
              variant="outline"
              onClick={handleFullShrink}
              disabled={isFullShrinking}
              className="flex items-center gap-2"
            >
              {isFullShrinking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Full Database Shrink
            </Button>
          </div>
          
          <div className="flex justify-end w-full">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DataRetentionSettings;