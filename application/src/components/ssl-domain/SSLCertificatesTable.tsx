
import React from "react";
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
import { RefreshCw } from "lucide-react";
import { SSLCertificate } from "@/types/ssl.types";
import { SSLStatusBadge } from "./SSLStatusBadge";

interface SSLCertificatesTableProps {
  certificates: SSLCertificate[];
  onRefresh: (id: string) => void;
  refreshingId: string | null;
}

export const SSLCertificatesTable = ({ certificates, onRefresh, refreshingId }: SSLCertificatesTableProps) => {
  const calculateDaysLeft = (expirationDate: string) => {
    try {
      const expDate = new Date(expirationDate);
      const today = new Date();
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error("Error calculating days left:", error);
      return 0;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>Issuer</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Days Left</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Notified</TableHead>
            <TableHead>Actions</TableHead>
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
                <TableCell>{certificate.issuer || 'Unknown'}</TableCell>
                <TableCell>
                  {certificate.expiration_date ? 
                    format(new Date(certificate.expiration_date), "MMM dd, yyyy") : 
                    'Unknown'}
                </TableCell>
                <TableCell>
                  {certificate.expiration_date ? 
                    calculateDaysLeft(certificate.expiration_date) : 
                    'Unknown'}
                </TableCell>
                <TableCell>
                  <SSLStatusBadge status={certificate.status} />
                </TableCell>
                <TableCell>
                  {certificate.last_notified 
                    ? format(new Date(certificate.last_notified), "MMM dd, yyyy")
                    : "Never"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={() => onRefresh(certificate.id)}
                      disabled={refreshingId === certificate.id}
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${refreshingId === certificate.id ? 'animate-spin' : ''}`} />
                      Check
                    </Button>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};