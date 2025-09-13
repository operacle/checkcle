
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SSLStatusBadge } from "./SSLStatusBadge";
import { AddSSLCertificateForm } from "./AddSSLCertificateForm";
import { EditSSLCertificateForm } from "./EditSSLCertificateForm";
import { SSLCertificateActions } from "./SSLCertificateActions";
import { SSLCertificateDetailDialog } from "./SSLCertificateDetailDialog";
import { SSLPagination } from "./SSLPagination";
import { fetchSSLCertificates, addSSLCertificate, deleteSSLCertificate } from "@/services/sslCertificateService";
import { pb } from "@/lib/pocketbase";
import { SSLCertificate } from "@/types/ssl.types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSSLPagination } from "@/hooks/useSSLPagination";
import { toast } from "sonner";

export const SSLCertificatesTable = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<SSLCertificate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: certificates = [], isLoading, isError } = useQuery({
    queryKey: ['ssl-certificates'],
    queryFn: fetchSSLCertificates,
  });

  const {
    paginatedCertificates,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
  } = useSSLPagination({ certificates });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading certificates</div>;

  const handleAddCertificate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addSSLCertificate(data);
      await queryClient.invalidateQueries({ queryKey: ['ssl-certificates'] });
      setShowAddDialog(false);
      toast.success(t('certificateAdded'));
    } catch (error) {
      toast.error(t('failedToAddCertificate'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCertificate = async (updatedCertificate: SSLCertificate) => {
    setIsSubmitting(true);
    try {
      await pb.collection('ssl_certificates').update(updatedCertificate.id, {
        warning_threshold: updatedCertificate.warning_threshold,
        expiry_threshold: updatedCertificate.expiry_threshold,
        notification_channel: updatedCertificate.notification_channel,
        notification_id: updatedCertificate.notification_id,
        template_id: updatedCertificate.template_id,
        check_interval: updatedCertificate.check_interval,
      });
      
      await queryClient.invalidateQueries({ queryKey: ['ssl-certificates'] });
      setShowEditDialog(false);
      setSelectedCertificate(null);
      toast.success(t('certificateUpdated'));
    } catch (error) {
      toast.error(t('failedToUpdateCertificate'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCertificate = async () => {
    if (!selectedCertificate) return;
    
    setIsSubmitting(true);
    try {
      await deleteSSLCertificate(selectedCertificate.id);
      await queryClient.invalidateQueries({ queryKey: ['ssl-certificates'] });
      setShowDeleteDialog(false);
      setSelectedCertificate(null);
      toast.success(t('certificateDeleted'));
    } catch (error) {
      toast.error(t('failedToDeleteCertificate'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewDialog = (certificate: SSLCertificate) => {
    setSelectedCertificate(certificate);
    setShowViewDialog(true);
  };

  const openEditDialog = (certificate: SSLCertificate) => {
    setSelectedCertificate(certificate);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (certificate: SSLCertificate) => {
    setSelectedCertificate(certificate);
    setShowDeleteDialog(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {certificates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {t('noCertificatesFound')}
        </div>
      ) : (
        <>
          <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg border border-border shadow-sm`}>
            <Table>
              <TableHeader className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <TableRow className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-100'}`}>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t('domain')}</TableHead>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t('status')}</TableHead>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t('issuer')}</TableHead>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t('validUntil')}</TableHead>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>{t('daysLeft')}</TableHead>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4`}>Check Interval</TableHead>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-base py-4 text-right w-[50px]`}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCertificates.map((certificate) => (
                  <TableRow 
                    key={certificate.id} 
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => openViewDialog(certificate)}
                  >
                    <TableCell className="font-medium">
                      {certificate.domain}
                    </TableCell>
                    <TableCell>
                      <SSLStatusBadge status={certificate.status} />
                    </TableCell>
                    <TableCell>{certificate.issuer_o || certificate.issuer_cn || 'Unknown'}</TableCell>
                    <TableCell>
                      {certificate.valid_till ? new Date(certificate.valid_till).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={certificate.days_left <= 7 ? 'text-red-600 font-semibold' : certificate.days_left <= 30 ? 'text-yellow-600 font-semibold' : 'text-green-600'}>
                        {certificate.days_left} {t('days')}
                      </span>
                    </TableCell>
                    <TableCell>
                      {certificate.check_interval || 1} {t('days')}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <SSLCertificateActions
                        certificate={certificate}
                        onView={openViewDialog}
                        onEdit={openEditDialog}
                        onDelete={openDeleteDialog}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <SSLPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      {/* View Certificate Dialog */}
      <SSLCertificateDetailDialog
        certificate={selectedCertificate}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
      />

      {/* Add Certificate Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addSSLCertificate')}</DialogTitle>
            <DialogDescription>
              {t('addCertificateDescription')}
            </DialogDescription>
          </DialogHeader>
          <AddSSLCertificateForm
            onSubmit={handleAddCertificate}
            onCancel={() => setShowAddDialog(false)}
            isPending={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Certificate Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('editSSLCertificate')}</DialogTitle>
            <DialogDescription>
              {t('editCertificateDescription')}
            </DialogDescription>
          </DialogHeader>
          {selectedCertificate && (
            <EditSSLCertificateForm
              certificate={selectedCertificate}
              onSubmit={handleEditCertificate}
              onCancel={() => setShowEditDialog(false)}
              isPending={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Certificate Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteCertificate')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteCertificateConfirmation')} {selectedCertificate?.domain}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCertificate}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? t('deleting') : t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};