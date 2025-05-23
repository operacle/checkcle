
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { IncidentItem, incidentService } from '@/services/incident';

export const useDownloadIncidentPdf = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleDownloadPDF = async (incident: IncidentItem) => {
    try {
      await incidentService.generateIncidentPDF(incident);
      
      toast({
        title: t('success'),
        description: t('pdfDownloaded'),
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: t('error'),
        description: t('pdfGenerationFailed'),
        variant: 'destructive',
      });
    }
  };
  
  return { handleDownloadPDF };
};
