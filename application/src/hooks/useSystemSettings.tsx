
import { useQuery } from '@tanstack/react-query';
import { settingsService } from "@/services/settingsService";

export function useSystemSettings() {
  const { 
    data: settings,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: settingsService.getGeneralSettings,
  });

  return {
    settings,
    isLoading,
    error,
    refetch,
    systemName: settings?.system_name || 'ReamStack',
  };
}
