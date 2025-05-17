import React, { useState } from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { SSLCertificate } from "@/types/ssl.types";
import { SSLStatusBadge } from "./SSLStatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface SSLCertificatesTableProps {
  certificates: SSLCertificate[];
  onRefresh: (id: string) => void;
  refreshingId: string | null;
  onEdit?: (certificate: SSLCertificate) => void;
  onDelete?: (certificate: SSLCertificate) => void;
}

export const SSLCertificatesTable = ({ 
  certificates, 
  onRefresh, 
  refreshingId,
  onEdit,
  onDelete 
}: SSLCertificatesTableProps) => {
  const { t } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<SSLCertificate | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<SSLCertificate | null>(null);
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return t('unknown');
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date for formatting:", dateString);
        return t('unknown');
      }
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return t('unknown');
    }
  };

  const handleViewCertificate = (certificate: SSLCertificate) => {
    setSelectedCert(certificate);
  };

  const handleEditCertificate = (certificate: SSLCertificate) => {
    if (onEdit) {
      onEdit(certificate);
    } else {
      toast.error("Edit functionality not implemented yet");
    }
  };

  const handleDeleteCertificate = (certificate: SSLCertificate) => {
    setCertToDelete(certificate);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (certToDelete && onDelete) {
      onDelete(certToDelete);
      setDeleteConfirmOpen(false);
      setCertToDelete(null);
    }
  };

  return (
    <>
      <div className="rounded-md border relative">
        {refreshingId && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <div className="bg-background p-4 rounded-md shadow flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              <span>{t('checkingSSLCertificate')}</span>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('domain')}</TableHead>
              <TableHead>{t('issuer')}</TableHead>
              <TableHead>{t('expirationDate')}</TableHead>
              <TableHead>{t('daysLeft')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('lastNotified')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {t('noSSLCertificates')}
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell className="font-medium">{certificate.domain}</TableCell>
                  <TableCell>{certificate.issuer_o || t('unknown')}</TableCell>
                  <TableCell>
                    {formatDate(certificate.valid_till)}
                  </TableCell>
                  <TableCell>
                    {typeof certificate.days_left === 'number' ? certificate.days_left : t('unknown')}
                  </TableCell>
                  <TableCell>
                    <SSLStatusBadge status={certificate.status} />
                  </TableCell>
                  <TableCell>
                    {certificate.last_notified 
                      ? formatDate(certificate.last_notified)
                      : t('never')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border border-border">
                        <DropdownMenuItem 
                          onClick={() => handleViewCertificate(certificate)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" /> {t('view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            if (refreshingId === null) {
                              onRefresh(certificate.id);
                            }
                          }}
                          disabled={refreshingId !== null}
                          className="cursor-pointer"
                        >
                          <RefreshCw className={`mr-2 h-4 w-4 ${refreshingId === certificate.id ? 'animate-spin text-primary' : ''}`} /> 
                          {t('check')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleEditCertificate(certificate)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" /> {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCertificate(certificate)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* SSL Certificate Details Dialog */}
      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">
              {t('sslCertificateDetails')}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {t('detailedInfo')} {selectedCert?.domain}
            </p>
          </DialogHeader>
          
          {selectedCert && (
            <div className="p-6 pt-2 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">{t('basicInformation')}</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t('domain')}:</span>
                      <span>{selectedCert.domain}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t('status')}:</span>
                      <span><SSLStatusBadge status={selectedCert.status} /></span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t('issuer')}:</span>
                      <span>{selectedCert.issued_to || t('unknown')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">IP:</span>
                      <span>{selectedCert.resolved_ip || t('unknown')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Validity */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">{t('validity')}</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t('validFrom')}:</span>
                      <span>{selectedCert.valid_from ? formatDate(selectedCert.valid_from) : t('unknown')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t('validUntil')}:</span>
                      <span>{formatDate(selectedCert.valid_till)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t('daysLeft')}:</span>
                      <span>{selectedCert.days_left}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t('validityDays')}:</span>
                      <span>{selectedCert.validity_days || t('unknown')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Issuer */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">{t('issuerInfo')}</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t('organization')}:</span>
                      <span>{selectedCert.issuer_o || t('unknown')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t('commonName')}:</span>
                      <span>{selectedCert.issuer_cn || t('unknown')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Technical Details */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">{t('technicalDetails')}</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t('serialNumber')}:</span>
                      <span>{selectedCert.serial_number || t('unknown')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t('algorithm')}:</span>
                      <span>{selectedCert.cert_alg || t('unknown')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subject Alternative Names */}
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-3">{t('subjectAltNames')}</h3>
                <div>
                  {selectedCert.cert_sans ? (
                    <p className="break-words">{selectedCert.cert_sans}</p>
                  ) : (
                    <p>{t('none')}</p>
                  )}
                </div>
              </div>
              
              {/* Monitoring Configuration */}
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-3">{t('monitoringConfig')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">{t('warningThreshold')}:</div>
                    <div>{selectedCert.warning_threshold} {t('daysLeft').toLowerCase()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">{t('expiryThreshold')}:</div>
                    <div>{selectedCert.expiry_threshold} {t('daysLeft').toLowerCase()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">{t('notificationChannel')}:</div>
                    <div>{selectedCert.notification_channel}</div>
                  </div>
                </div>
              </div>
              
              {/* Timestamps */}
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-3">{t('recordInfo')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">{t('created')}:</div>
                    <div>{selectedCert.created ? formatDate(selectedCert.created) : t('unknown')}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">{t('lastUpdated')}:</div>
                    <div>{selectedCert.updated ? formatDate(selectedCert.updated) : t('unknown')}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">{t('lastNotification')}:</div>
                    <div>{selectedCert.last_notified ? formatDate(selectedCert.last_notified) : t('never')}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">{t('collectionId')}:</div>
                    <div>{selectedCert.collectionId || t('unknown')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="p-6 pt-0 border-t">
            <Button 
              variant="default" 
              onClick={() => setSelectedCert(null)}
              className="w-full sm:w-auto"
            >
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteSSLCertificate')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t('deleteConfirmation')} <strong>{certToDelete?.domain}</strong>?</p>
            <p className="text-sm text-muted-foreground mt-2">{t('deleteWarning')}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>{t('cancel')}</Button>
            <Button variant="destructive" onClick={confirmDelete}>{t('delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};