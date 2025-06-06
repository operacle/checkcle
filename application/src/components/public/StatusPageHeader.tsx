
import { StatusBadge } from '@/components/operational-page/StatusBadge';
import { OperationalPageRecord } from '@/types/operational.types';

interface StatusPageHeaderProps {
  page: OperationalPageRecord;
}

export const StatusPageHeader = ({ page }: StatusPageHeaderProps) => {
  return (
    <div className="bg-card shadow-sm border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {page.logo_url && (
              <img src={page.logo_url} alt="Logo" className="h-8 w-8 rounded" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">{page.title}</h1>
              <p className="text-sm text-muted-foreground">
                {page.description}
              </p>
            </div>
          </div>
          <StatusBadge status={page.status} />
        </div>
      </div>
    </div>
  );
};