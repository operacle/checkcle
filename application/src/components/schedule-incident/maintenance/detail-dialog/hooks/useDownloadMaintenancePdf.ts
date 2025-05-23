
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { MaintenanceItem, generateMaintenancePDF } from '@/services/maintenance';

export const useDownloadMaintenancePdf = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleDownloadPDF = async (maintenance: MaintenanceItem) => {
    try {
      // Show loading toast
      toast({
        title: t('generating'),
        description: t('preparingPdf'),
      });
      
      // Generate and download the PDF
      const filename = await generateMaintenancePDF(maintenance);
      
      // Show success toast after successful generation
      toast({
        title: t('success'),
        description: t('pdfDownloaded'),
      });
      
      return filename;
    } catch (error) {
      console.error("Error generating PDF:", error);
      
      // Provide more detailed error message if available
      const errorMessage = error instanceof Error 
        ? error.message 
        : t('pdfGenerationFailed');
      
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw error;
    }
  };
  
  return { handleDownloadPDF };
};
