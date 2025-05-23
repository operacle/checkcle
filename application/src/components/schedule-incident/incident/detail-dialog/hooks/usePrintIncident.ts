
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const usePrintIncident = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handlePrint = React.useCallback(() => {
    try {
      // Add print-specific stylesheet temporarily
      const style = document.createElement('style');
      style.id = 'print-style';
      style.textContent = `
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          
          .dialog-content, .dialog-content * {
            visibility: visible;
          }
          
          .dialog-content {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            padding: 15mm !important;
            margin: 0 !important;
            background-color: white !important;
            box-shadow: none;
            overflow: visible !important;
            display: block !important;
            transform: none !important;
          }
          
          /* Remove any black backgrounds */
          html, body {
            background-color: white !important;
            color: black !important;
          }
          
          /* Optimize spacing for single page */
          .print-section {
            margin-bottom: 2mm !important;
            page-break-inside: avoid !important;
          }
          
          /* Reduce vertical spacing */
          h4 {
            margin-bottom: 1mm !important;
            margin-top: 1mm !important;
            color: #1e40af !important; /* blue-800 */
            font-weight: bold !important;
          }
          
          .print-compact-text {
            font-size: 9pt !important;
            line-height: 1.2 !important;
          }
          
          .print-compact-spacing > * {
            margin-top: 1mm !important;
            margin-bottom: 1mm !important;
          }
          
          .print-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 1mm !important;
          }
          
          .badge-print {
            background-color: #dbeafe !important; /* blue-100 */
            color: #1e40af !important; /* blue-800 */
            border: 1px solid #93c5fd !important; /* blue-300 */
            padding: 0.5mm 1mm !important;
            margin: 0.5mm !important;
            display: inline-block !important;
            font-size: 8pt !important;
          }
          
          /* More compact spacing */
          .print-compact-margin {
            margin: 1mm 0 !important;
          }
          
          .print-smaller-font {
            font-size: 8pt !important;
          }
          
          .header-print {
            background-color: #1e40af !important; /* blue-800 */
            color: #ffffff !important;
            padding: 2mm 3mm !important;
            margin-bottom: 2mm !important;
          }
          
          /* More compact header */
          .header-print h1 {
            font-size: 12pt !important;
            margin-bottom: 0 !important;
          }
          
          .header-print p {
            font-size: 9pt !important;
            margin-top: 1mm !important;
          }
          
          /* Footer stays at bottom */
          .footer-print {
            font-size: 7pt !important;
            color: #6b7280 !important; /* gray-500 */
            border-top: 1px solid #e5e7eb !important; /* gray-200 */
            position: fixed !important;
            bottom: 10mm !important;
            left: 15mm !important;
            right: 15mm !important;
            padding-top: 2mm !important;
            background-color: white !important;
          }
          
          /* Hide any unnecessary elements */
          .print-hide {
            display: none !important;
          }
          
          /* Optimize description text */
          .print-description {
            max-height: 100px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
        }
      `;
      document.head.appendChild(style);

      // Wait a bit to ensure styles are applied
      setTimeout(() => {
        window.print();
        
        // Remove the style after printing dialog closes
        setTimeout(() => {
          const printStyle = document.getElementById('print-style');
          if (printStyle) {
            printStyle.remove();
          }
        }, 1000);
      }, 100);

      toast({
        title: t('success'),
        description: t('printJobStarted'),
      });
    } catch (error) {
      console.error("Error printing:", error);
      toast({
        title: t('error'),
        description: t('printingFailed'),
        variant: 'destructive',
      });
    }
  }, [t, toast]);
  
  return { handlePrint };
};
