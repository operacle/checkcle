import React from "react";
import { Card } from "@/components/ui/card";
import { SSLCertificate } from "@/types/ssl.types";
import { useLanguage } from "@/contexts/LanguageContext";

interface SSLCertificateStatusCardsProps {
  certificates: SSLCertificate[];
}

export const SSLCertificateStatusCards = ({ certificates }: SSLCertificateStatusCardsProps) => {
  const { t } = useLanguage();
  
  // Count certificates by status
  const validCount = certificates.filter(cert => cert.status === 'valid').length;
  const expiringCount = certificates.filter(cert => cert.status === 'expiring_soon').length;
  const expiredCount = certificates.filter(cert => cert.status === 'expired').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 flex items-center space-x-4">
        <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
          <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
              ✓
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('validCertificates')}</p>
          <p className="text-3xl font-bold">{validCount}</p>
        </div>
      </Card>

      <Card className="p-6 flex items-center space-x-4">
        <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-full">
          <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
              !
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('expiringSoon')}</p>
          <p className="text-3xl font-bold">{expiringCount}</p>
        </div>
      </Card>

      <Card className="p-6 flex items-center space-x-4">
        <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
          <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
              ✗
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('expired')}</p>
          <p className="text-3xl font-bold">{expiredCount}</p>
        </div>
      </Card>
    </div>
  );
};