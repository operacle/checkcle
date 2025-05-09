
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { templateService } from "@/services/templateService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { TemplateList } from "./TemplateList";
import { TemplateDialog } from "./TemplateDialog";
import { useToast } from "@/hooks/use-toast";

export const AlertsTemplates = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const {
    data: templates = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notification_templates'],
    queryFn: templateService.getTemplates,
  });

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setIsDialogOpen(true);
  };

  const handleEditTemplate = (id: string) => {
    setEditingTemplate(id);
    setIsDialogOpen(true);
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing",
      description: "Updating template list...",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Alert Templates</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleAddTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center p-6">
            <p className="text-destructive mb-4">Error loading templates</p>
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        ) : (
          <TemplateList 
            templates={templates} 
            isLoading={isLoading} 
            onEdit={handleEditTemplate}
            refetchTemplates={refetch}
          />
        )}
      </CardContent>

      <TemplateDialog
        open={isDialogOpen}
        templateId={editingTemplate}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />
    </Card>
  );
};
