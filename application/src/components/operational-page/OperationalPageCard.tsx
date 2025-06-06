
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OperationalPageRecord } from '@/types/operational.types';
import { StatusBadge } from './StatusBadge';
import { Globe, ExternalLink, Eye, Settings, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface OperationalPageCardProps {
  page: OperationalPageRecord;
  onEdit?: (page: OperationalPageRecord) => void;
  onView?: (page: OperationalPageRecord) => void;
  onDelete?: (page: OperationalPageRecord) => void;
}

export const OperationalPageCard = ({ page, onEdit, onView, onDelete }: OperationalPageCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-1">{page.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {page.description}
            </CardDescription>
          </div>
          <StatusBadge status={page.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Slug:</span>
            <p className="mt-1">{page.slug}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Theme:</span>
            <p className="mt-1 capitalize">{page.theme}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Public:</span>
            <p className="mt-1">
              <Badge variant={page.is_public === 'true' ? 'default' : 'secondary'}>
                {page.is_public === 'true' ? 'Yes' : 'No'}
              </Badge>
            </p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Updated:</span>
            <p className="mt-1">{format(new Date(page.updated), 'MMM dd, yyyy')}</p>
          </div>
        </div>

        {page.custom_domain && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{page.custom_domain}</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(page)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(page)}
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(page)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};