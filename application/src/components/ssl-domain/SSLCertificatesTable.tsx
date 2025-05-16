
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
  const [selectedCert, setSelectedCert] = useState<SSLCertificate | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<SSLCertificate | null>(null);
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date for formatting:", dateString);
        return 'Unknown';
      }
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Unknown';
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
              <span>Checking SSL certificate...</span>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Notified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No SSL certificates found
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell className="font-medium">{certificate.domain}</TableCell>
                  <TableCell>{certificate.issuer_o || 'Unknown'}</TableCell>
                  <TableCell>
                    {formatDate(certificate.valid_till)}
                  </TableCell>
                  <TableCell>
                    {typeof certificate.days_left === 'number' ? certificate.days_left : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <SSLStatusBadge status={certificate.status} />
                  </TableCell>
                  <TableCell>
                    {certificate.last_notified 
                      ? formatDate(certificate.last_notified)
                      : "Never"}
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
                          <Eye className="mr-2 h-4 w-4" /> View
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
                          Check
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleEditCertificate(certificate)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCertificate(certificate)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
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
              SSL Certificate Details
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed information about the SSL certificate for {selectedCert?.domain}
            </p>
          </DialogHeader>
          
          {selectedCert && (
            <div className="p-6 pt-2 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Domain:</span>
                      <span>{selectedCert.domain}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Status:</span>
                      <span><SSLStatusBadge status={selectedCert.status} /></span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Issued To:</span>
                      <span>{selectedCert.issued_to || 'Unknown'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Resolved IP:</span>
                      <span>{selectedCert.resolved_ip || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Validity */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">Validity</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Valid From:</span>
                      <span>{selectedCert.valid_from ? formatDate(selectedCert.valid_from) : 'Unknown'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Valid Until:</span>
                      <span>{formatDate(selectedCert.valid_till)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Days Left:</span>
                      <span>{selectedCert.days_left}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Validity Days:</span>
                      <span>{selectedCert.validity_days || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Issuer */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">Issuer</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Organization:</span>
                      <span>{selectedCert.issuer_o || 'Unknown'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Common Name:</span>
                      <span>{selectedCert.issuer_cn || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Technical Details */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">Technical Details</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Serial Number:</span>
                      <span>{selectedCert.serial_number || 'Unknown'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Algorithm:</span>
                      <span>{selectedCert.cert_alg || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subject Alternative Names */}
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-3">Subject Alternative Names (SANs)</h3>
                <div>
                  {selectedCert.cert_sans ? (
                    <p className="break-words">{selectedCert.cert_sans}</p>
                  ) : (
                    <p>None</p>
                  )}
                </div>
              </div>
              
              {/* Monitoring Configuration */}
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-3">Monitoring Configuration</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Warning Threshold:</div>
                    <div>{selectedCert.warning_threshold} days</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Expiry Threshold:</div>
                    <div>{selectedCert.expiry_threshold} days</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Notification Channel:</div>
                    <div>{selectedCert.notification_channel}</div>
                  </div>
                </div>
              </div>
              
              {/* Timestamps */}
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-3">Record Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Created:</div>
                    <div>{selectedCert.created ? formatDate(selectedCert.created) : 'Unknown'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Last Updated:</div>
                    <div>{selectedCert.updated ? formatDate(selectedCert.updated) : 'Unknown'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Last Notification:</div>
                    <div>{selectedCert.last_notified ? formatDate(selectedCert.last_notified) : 'Never'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Collection ID:</div>
                    <div>{selectedCert.collectionId || 'Unknown'}</div>
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
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete SSL Certificate</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the SSL certificate for <strong>{certToDelete?.domain}</strong>?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};