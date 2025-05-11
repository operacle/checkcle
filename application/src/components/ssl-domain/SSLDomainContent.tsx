
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

import { SSLCertificateStatusCards } from "./SSLCertificateStatusCards";
import { SSLCertificatesTable } from "./SSLCertificatesTable";
import { LoadingState } from "@/components/services/LoadingState";
import { fetchSSLCertificates, addSSLCertificate, checkAndUpdateCertificate } from "@/services/sslCertificateService";
import { AddSSLCertificateForm } from "./AddSSLCertificateForm";
import { AddSSLCertificateDto, SSLCertificate } from "@/types/ssl.types";

export const SSLDomainContent = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const { data: certificates = [], isLoading, error } = useQuery({
    queryKey: ['ssl-certificates'],
    queryFn: fetchSSLCertificates,
  });

  const addMutation = useMutation({
    mutationFn: addSSLCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ssl-certificates'] });
      setIsAddDialogOpen(false);
      toast.success("SSL certificate added successfully");
    },
    onError: (error) => {
      console.error("Error adding SSL certificate:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add SSL certificate");
    }
  });

  const refreshMutation = useMutation({
    mutationFn: checkAndUpdateCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ssl-certificates'] });
      setRefreshingId(null);
      toast.success("SSL certificate checked and updated successfully");
    },
    onError: (error) => {
      console.error("Error refreshing SSL certificate:", error);
      toast.error(error instanceof Error ? error.message : "Failed to refresh SSL certificate");
      setRefreshingId(null);
    }
  });

  const handleAddCertificate = async (data: AddSSLCertificateDto) => {
    addMutation.mutate(data);
  };

  const handleRefreshCertificate = (id: string) => {
    setRefreshingId(id);
    refreshMutation.mutate(id);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-foreground">
        <p>Error loading SSL certificate data.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col overflow-auto bg-background p-6 pb-0">
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">SSL & Domain Management</h2>
          <Button 
            className="text-primary-foreground"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Domain
          </Button>
        </div>
        
        <SSLCertificateStatusCards certificates={certificates} />
        
        <div className="mt-6 flex-1 flex flex-col pb-6">
          <SSLCertificatesTable 
            certificates={certificates} 
            onRefresh={handleRefreshCertificate}
            refreshingId={refreshingId}
          />
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add SSL Certificate</DialogTitle>
          </DialogHeader>
          <AddSSLCertificateForm 
            onSubmit={handleAddCertificate} 
            onCancel={() => setIsAddDialogOpen(false)} 
            isPending={addMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
};