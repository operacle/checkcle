
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTemplateForm } from "./hooks/useTemplateForm";
import { BasicTemplateFields } from "./form/BasicTemplateFields";
import { MessagesTabContent } from "./form/MessagesTabContent";
import { PlaceholdersTabContent } from "./form/PlaceholdersTabContent";
import { Loader2, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateDialogProps {
  open: boolean;
  templateId: string | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const TemplateDialog: React.FC<TemplateDialogProps> = ({
  open,
  templateId,
  onOpenChange,
  onSuccess,
}) => {
  const {
    form,
    isEditMode,
    isLoadingTemplate,
    isSubmitting,
    onSubmit
  } = useTemplateForm({
    templateId,
    open,
    onOpenChange,
    onSuccess
  });

  // For debugging purposes
  useEffect(() => {
    if (open) {
      console.log("Template dialog opened. Edit mode:", isEditMode, "Template ID:", templateId);
      
      // Log form values when they change
      const subscription = form.watch((value) => {
        console.log("Current form values:", value);
      });
      
      return () => subscription.unsubscribe();
    }
  }, [open, isEditMode, templateId, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Template" : "Add Template"}</DialogTitle>
        </DialogHeader>
        
        {isLoadingTemplate ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading template data...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col">
              <div className="relative flex-1">
                <ScrollArea className="pr-4 overflow-auto" style={{ height: "calc(80vh - 180px)" }}>
                  <div className="space-y-6 pb-6 pr-4">
                    <BasicTemplateFields control={form.control} />
                    
                    <Tabs defaultValue="messages">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                        <TabsTrigger value="placeholders">Placeholders</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="messages" className="pt-4">
                        <MessagesTabContent control={form.control} />
                      </TabsContent>
                      
                      <TabsContent value="placeholders" className="pt-4">
                        <PlaceholdersTabContent control={form.control} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </ScrollArea>
                <div className="absolute bottom-2 right-4 text-muted-foreground opacity-60">
                  <ChevronDown className="h-4 w-4 animate-bounce" />
                </div>
              </div>
              
              <DialogFooter className="mt-2 pt-2 border-t border-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)} 
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isLoadingTemplate}
                  className="relative"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting 
                    ? (isEditMode ? "Updating..." : "Creating...") 
                    : (isEditMode ? "Update Template" : "Create Template")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
