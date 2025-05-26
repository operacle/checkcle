
import React from "react";
import { SSLCertificate } from "@/types/ssl.types";
import { useLanguage } from "@/contexts/LanguageContext";
import { OverviewCard } from "@/components/schedule-incident/common/OverviewCard";
import { Shield, ShieldAlert, ShieldX } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <OverviewCard
        title={t('validCertificates')}
        value={validCount}
        icon={<Shield className="h-6 w-6 text-white" />}
        color="green"
        className="hover:scale-105 transition-transform duration-200"
      />

      <OverviewCard
        title={t('expiringSoon')}
        value={expiringCount}
        icon={<ShieldAlert className="h-6 w-6 text-white" />}
        color="amber"
        className="hover:scale-105 transition-transform duration-200"
      />

      <OverviewCard
        title={t('expired')}
        value={expiredCount}
        icon={<ShieldX className="h-6 w-6 text-white" />}
        color="red"
        className="hover:scale-105 transition-transform duration-200"
      />
    </div>
  );
};