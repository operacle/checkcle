import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOperationalPages, useDeleteOperationalPage } from '@/hooks/useOperationalPage';
import { CreateOperationalPageDialog } from './CreateOperationalPageDialog';
import { EditOperationalPageDialog } from './EditOperationalPageDialog';
import { OperationalPageCard } from './OperationalPageCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OperationalPageRecord } from '@/types/operational.types';
import { Activity, Plus, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const OperationalPageContent = () => {
  const navigate = useNavigate();
  const { data: pages, isLoading, error, refetch, isRefetching } = useOperationalPages();
  const deleteMutation = useDeleteOperationalPage();
  
  const [editingPage, setEditingPage] = useState<OperationalPageRecord | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<OperationalPageRecord | null>(null);

  const handleEdit = (page: OperationalPageRecord) => {
    setEditingPage(page);
    setEditDialogOpen(true);
  };

  const handleView = (page: OperationalPageRecord) => {
    if (page.custom_domain) {
      window.open(`https://${page.custom_domain}`, '_blank');
    } else {
      // Navigate to the public status page route
      window.open(`/status/${page.slug}`, '_blank');
    }
  };

  const handleDelete = (page: OperationalPageRecord) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (pageToDelete) {
      try {
        await deleteMutation.mutateAsync(pageToDelete.id);
        setDeleteDialogOpen(false);
        setPageToDelete(null);
      } catch (error) {
        console.error('Error deleting page:', error);
      }
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-4">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Failed to load operational pages</h3>
          <p className="text-muted-foreground mb-4">
            There was an error loading your operational pages. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Operational Pages</h1>
          <p className="text-muted-foreground">
            Manage your public status pages and monitor service health
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <CreateOperationalPageDialog />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!pages || pages.length === 0) && (
        <Card className="p-12">
          <CardContent className="text-center">
            <div className="mb-4">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No operational pages found</h3>
            <p className="text-muted-foreground mb-6">
              Create your first operational page to start monitoring your services and communicate status to your users.
            </p>
            <CreateOperationalPageDialog />
          </CardContent>
        </Card>
      )}

      {/* Pages Grid */}
      {!isLoading && pages && pages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <OperationalPageCard
              key={page.id}
              page={page}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {!isLoading && pages && pages.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Total Pages:</span> {pages.length}
            </div>
            <div>
              <span className="font-medium">Public Pages:</span>{' '}
              {pages.filter(p => p.is_public === 'true').length}
            </div>
            <div>
              <span className="font-medium">Operational:</span>{' '}
              {pages.filter(p => p.status === 'operational').length}
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <EditOperationalPageDialog
        page={editingPage}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Operational Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{pageToDelete?.title}"? This action cannot be undone and will permanently remove the operational page and all its components.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};