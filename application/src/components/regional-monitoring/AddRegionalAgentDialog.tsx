import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCurrentEndpoint } from "@/lib/pocketbase";
import { RegionalAgentConfigForm } from "./RegionalAgentConfigForm";
import { RegionalOneClickTab } from "./RegionalOneClickTab";
import { RegionalManualTab } from "./RegionalManualTab";

interface AddRegionalAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentAdded: () => void;
}

export const AddRegionalAgentDialog: React.FC<AddRegionalAgentDialogProps> = ({
  open,
  onOpenChange,
  onAgentAdded
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("configure");
  const [formData, setFormData] = useState({
    regionName: "",
    agentIp: "",
  });
  const [agentToken, setAgentToken] = useState("");
  const [agentId, setAgentId] = useState("");
  const [currentPocketBaseUrl, setCurrentPocketBaseUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate new credentials when dialog opens or after successful creation
  const generateNewCredentials = () => {
    const newToken = `rgn_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const newAgentId = `regional_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setAgentToken(newToken);
    setAgentId(newAgentId);
  };

  useEffect(() => {
    if (open) {
      const endpoint = getCurrentEndpoint();
      setCurrentPocketBaseUrl(endpoint);
      generateNewCredentials();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.regionName.trim() || !formData.agentIp.trim()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('success'),
        description: t('agentCreatedSuccessfully'),
      });
      setActiveTab("one-click");
      generateNewCredentials();
      
      onAgentAdded();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToCreateAgent'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setFormData({
      regionName: "",
      agentIp: "",
    });
    setActiveTab("configure");
    generateNewCredentials();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t('addRegionalMonitoringAgent')}</DialogTitle>
          <DialogDescription>
            {t('deployRegionalMonitoringAgent')}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configure">{t('configureAgent')}</TabsTrigger>
            <TabsTrigger value="one-click">{t('oneClickInstallTab')}</TabsTrigger>
            <TabsTrigger value="manual">{t('manualInstallTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            <RegionalAgentConfigForm
              formData={formData}
              setFormData={setFormData}
              agentId={agentId}
              agentToken={agentToken}
              currentPocketBaseUrl={currentPocketBaseUrl}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </TabsContent>

          <TabsContent value="one-click" className="space-y-6">
            <RegionalOneClickTab
              agentToken={agentToken}
              currentPocketBaseUrl={currentPocketBaseUrl}
              formData={formData}
              agentId={agentId}
              onDialogClose={handleDialogClose}
            />
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <RegionalManualTab
              agentToken={agentToken}
              currentPocketBaseUrl={currentPocketBaseUrl}
              formData={formData}
              agentId={agentId}
              onDialogClose={handleDialogClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};