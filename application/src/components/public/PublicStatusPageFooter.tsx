
import { Globe } from 'lucide-react';
import { OperationalPageRecord } from '@/types/operational.types';

interface PublicStatusPageFooterProps {
  page: OperationalPageRecord;
}

export const PublicStatusPageFooter = ({ page }: PublicStatusPageFooterProps) => {
  return (
    <div className="text-center text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Globe className="h-4 w-4" />
        {page.custom_domain ? (
          <span>Status page hosted at {page.custom_domain}</span>
        ) : (
          <span>Status page</span>
        )}
      </div>
      <p>© {new Date().getFullYear()} {page.title}. All rights reserved.</p>
    </div>
  );
};