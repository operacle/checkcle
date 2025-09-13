
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTemplateForm } from "./hooks/useTemplateForm";
import { ServerTemplateFields } from "./form/ServerTemplateFields";
import { ServiceTemplateFields } from "./form/ServiceTemplateFields";
import { SslTemplateFields } from "./form/SslTemplateFields";
import { ServerThresholdFields } from "./form/ServerThresholdFields";
import { Loader2, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TemplateType, templateTypeConfigs } from "@/services/templateService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {z} from "zod";

interface TemplateDialogProps {
  open: boolean;
  templateId: string | null;
  templateType: TemplateType | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const TemplateDialog: React.FC<TemplateDialogProps> = ({
  open,
  templateId,
  templateType: initialTemplateType,
  onOpenChange,
  onSuccess,
}) => {
  const [selectedTemplateType, setSelectedTemplateType] = useState<TemplateType>(initialTemplateType || 'service');
  
  const {
    form,
    isEditMode,
    isLoadingTemplate,
    isSubmitting,
    onSubmit
  } = useTemplateForm({
    templateId,
    templateType: selectedTemplateType,
    open,
    onOpenChange,
    onSuccess
  });

  // Update template type when prop changes or dialog opens
  useEffect(() => {
    if (initialTemplateType) {
      setSelectedTemplateType(initialTemplateType);
    } else if (open && !isEditMode) {
      setSelectedTemplateType('service');
    }
  }, [initialTemplateType, open, isEditMode]);

  // Handle template type change
  const handleTemplateTypeChange = (newType: TemplateType) => {
    if (!isEditMode) {
      setSelectedTemplateType(newType);
      form.setValue('templateType', newType);
    }
  };

  const renderTemplateFields = () => {
    switch (selectedTemplateType) {
      case 'server':
        return <ServerTemplateFields control={form.control} />;
      case 'service':
        return <ServiceTemplateFields control={form.control} />;
      case 'ssl':
        return <SslTemplateFields control={form.control} />;
      case 'server_threshold':
        return <ServerThresholdFields control={form.control} />;
      default:
        return null;
    }
  };

  const renderPlaceholderGuide = () => {

    const config = templateTypeConfigs[selectedTemplateType];
    if (!config) return null;

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Available Placeholders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            {config.description}. Use these placeholders in your messages:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {config.placeholders.map((placeholder) => (
              <div key={placeholder} className="bg-muted/30 p-2 rounded">
                <code className="text-xs">{placeholder}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
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
                    {/* Basic Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter template name" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="templateType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template Type</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={handleTemplateTypeChange}
                                value={selectedTemplateType}
                                disabled={isEditMode}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select template type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="server">Server Monitoring</SelectItem>
                                  <SelectItem value="service">Service Uptime</SelectItem>
                                  <SelectItem value="ssl">SSL Certificate</SelectItem>
                                  <SelectItem value="server_threshold">Server Threshold</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {selectedTemplateType !== 'server_threshold' && (
                        <FormField
                          control={form.control}
                          name="placeholder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Placeholder</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Optional custom placeholder"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    <Tabs defaultValue="messages">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="messages">{selectedTemplateType === 'server_threshold' ? 'Thresholds' : 'Messages'}</TabsTrigger>
                        <TabsTrigger value="placeholders">Placeholders</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="messages" className="pt-4">
                        {renderTemplateFields()}
                      </TabsContent>
                      
                      <TabsContent value="placeholders" className="pt-4">
                        {renderPlaceholderGuide()}
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