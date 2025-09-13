
import React from 'react';
import {useLanguage} from "@/contexts/LanguageContext.tsx";

interface UptimeSummaryProps {
  uptime: number;
  interval: number;
}

export const UptimeSummary = ({ uptime, interval }: UptimeSummaryProps) => {
	const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between text-xs mt-1">
      <span className="text-muted-foreground">
        {Math.round(uptime)}% uptime
      </span>
      <span className="text-xs text-muted-foreground">
	      {t('last20Checks')}
      </span>
    </div>
  );
};