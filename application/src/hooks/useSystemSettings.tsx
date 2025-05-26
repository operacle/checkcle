
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { authService } from "@/services/authService";
import { GeneralSettings } from "@/services/settingsService";

interface ApiResponse {
  success: boolean;
  data?: GeneralSettings;
  message?: string;
}

export function useSystemSettings() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  // Check if user is super admin
  const currentUser = authService.getCurrentUser();
  const isSuperAdmin = currentUser?.role === "superadmin";
  
  // Fetch settings from API - only if user is super admin
  const { 
    data: settings,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: async (): Promise<GeneralSettings | null> => {
      try {
        console.log('Fetching settings from API...');
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'getSettings' })
        });
        
        console.log('API response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        console.log('API response data:', result);
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch settings');
        }
        
        return result.data || null;
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: t("errorFetchingSettings", "settings"),
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: isSuperAdmin, // Only run query if user is super admin
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: GeneralSettings): Promise<GeneralSettings> => {
      console.log('Updating settings:', updatedSettings);
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'updateSettings',
          data: updatedSettings
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to update settings');
      }
      
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generalSettings'] });
      toast({
        title: t("settingsUpdated", "settings"),
        description: "",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast({
        title: t("errorSavingSettings", "settings"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  });

  // Test email connection
  const testEmailConnectionMutation = useMutation({
    mutationFn: async (smtpConfig: any): Promise<{success: boolean, message: string}> => {
      console.log('Testing email connection:', smtpConfig);
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'testEmailConnection',
          data: smtpConfig
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        success: result.success,
        message: result.message || ''
      };
    },
    onSuccess: (result) => {
      toast({
        title: result.success ? t("connectionSuccess", "settings") : t("connectionFailed", "settings"),
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    },
    onError: (error) => {
      console.error('Error testing connection:', error);
      toast({
        title: t("connectionFailed", "settings"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  });

  return {
    settings,
    isLoading,
    error,
    refetch,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
    testEmailConnection: testEmailConnectionMutation.mutate,
    isTestingConnection: testEmailConnectionMutation.isPending,
    systemName: settings?.system_name || settings?.meta?.appName || 'ReamStack',
  };
}