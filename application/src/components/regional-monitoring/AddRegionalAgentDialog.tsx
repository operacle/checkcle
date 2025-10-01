import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Terminal, CheckCircle, Zap, Play } from "lucide-react";
import { regionalService } from "@/services/regionalService";
import { InstallCommand } from "@/types/regional.types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [step, setStep] = useState(1);
  const [regionName, setRegionName] = useState("");
  const [agentIp, setAgentIp] = useState("");
  const [installCommand, setInstallCommand] = useState<InstallCommand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regionName.trim() || !agentIp.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await regionalService.createRegionalService({
        region_name: regionName,
        agent_ip_address: agentIp,
      });
      
      setInstallCommand(result.installCommand);
      setStep(2);
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

  const copyToClipboard = async (text: string, description: string = "Content") => {
    try {
      // Try the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast({
          title: t('copied'),
          description: `${description} copied to clipboard.`,
        });
        return;
      }
      
      // Fallback for older browsers or non-secure contexts (like localhost)
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast({
          title: t('copied'),
          description: `${description} copied to clipboard.`,
          //description: t('copiedDescription', { description }),
        });
      } else {
        throw new Error('execCommand failed');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      
      // Show the text in a modal or alert as final fallback
      const userAgent = navigator.userAgent.toLowerCase();
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      let errorMessage = t('copyFailedDescription');
      if (isLocalhost) {
        errorMessage += " " + t('copyFailedLocalhost');
      } else if (userAgent.includes('chrome')) {
        errorMessage += " " + t('copyFailedChrome');
      }
      
      toast({
        title: t('copyFailed'),
        description: errorMessage,
        variant: "destructive",
      });
      
      // As a last resort, select the text for manual copying
      try {
        const textarea = document.querySelector('textarea[readonly]') as HTMLTextAreaElement;
        if (textarea) {
          textarea.select();
          textarea.setSelectionRange(0, 99999); // For mobile devices
        }
      } catch (selectError) {
      //  console.error('Failed to select text:', selectError);
      }
    }
  };

  const downloadScript = () => {
    if (!installCommand) return;
    
    const blob = new Blob([installCommand.bash_script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `install-regional-agent-${installCommand.agent_id}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t('downloaded'),
      description: t('downloadedDescription'),
    });
  };

  const handleComplete = () => {
    onAgentAdded();
    setStep(1);
    setRegionName("");
    setAgentIp("");
    setInstallCommand(null);
    onOpenChange(false);
  };

  const resetDialog = () => {
    setStep(1);
    setRegionName("");
    setAgentIp("");
    setInstallCommand(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t('addRegionalMonitoringAgent')}</DialogTitle>
          <DialogDescription>
            {t('deployRegionalMonitoringAgent')}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={handleCreateAgent} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="regionName">{t('regionName')}</Label>
                <Input
                  id="regionName"
                  placeholder={t('regionNamePlaceholder')}
                  value={regionName}
                  onChange={(e) => setRegionName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="agentIp">{t('agentServerIpAddress')}</Label>
                <Input
                  id="agentIp"
                  placeholder={t('agentIpPlaceholder')}
                  value={agentIp}
                  onChange={(e) => setAgentIp(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('generating') : t('generateInstallation')}
              </Button>
            </div>
          </form>
        )}

        {step === 2 && installCommand && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-lg font-semibold">{t('agentConfigurationReady')}</h3>
              <p className="text-muted-foreground">
                {t('oneClickInstallScriptGenerated')}
              </p>
            </div>

            <Tabs defaultValue="oneclicK" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="oneclicK">{t('oneClickInstallTab')}</TabsTrigger>
                <TabsTrigger value="details">{t('agentDetailsTab')}</TabsTrigger>
                <TabsTrigger value="manual">{t('manualInstallTab')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="oneclicK" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      {t('oneClickAutomaticInstallation')}
                    </CardTitle>
                    <CardDescription>
                      {t('completeInstallationDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                        <Play className="h-4 w-4" />
                        {t('whatThisScriptDoes')}
                      </div>
                      <ul className="text-sm text-green-700 space-y-1 ml-6">
                        <li>• {t('scriptActionDownload')}</li>
                        <li>• {t('scriptActionInstall')}</li>
                        <li>• {t('scriptActionConfigure')}</li>
                        <li>• {t('scriptActionStart')}</li>
                        <li>• {t('scriptActionHealthChecks')}</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('runCommandOnServer')}</Label>
                      <div className="relative">
                        <Textarea
                          readOnly
                          value={`# One-click installation command:
curl -fsSL https://raw.githubusercontent.com/operacle/checkcle/refs/heads/main/scripts/install-regional-agent.sh | sudo bash -s -- \\
  --region-name="${regionName}" \\
  --agent-id="${installCommand.agent_id}" \\
  --agent-ip="${agentIp}" \\
  --token="${installCommand.token}" \\
  --pocketbase-url="${installCommand.api_endpoint}"`}
                          className="font-mono text-sm min-h-[120px] pr-12"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(`curl -fsSL https://raw.githubusercontent.com/operacle/checkcle/refs/heads/main/scripts/install-regional-agent.sh | sudo bash -s -- --region-name="${regionName}" --agent-id="${installCommand.agent_id}" --agent-ip="${agentIp}" --token="${installCommand.token}" --pocketbase-url="${installCommand.api_endpoint}"`, "Installation command")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={downloadScript} variant="outline" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        {t('downloadCompleteScript')}
                      </Button>
                      <Button 
                        onClick={() => copyToClipboard(installCommand.bash_script, "Installation script")} 
                        variant="outline" 
                        className="flex-1"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {t('copyFullScript')}
                      </Button>
                    </div>

                    {/* Local development notice */}
                    {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800" dangerouslySetInnerHTML={{ __html: t('localDevelopmentNotice') }} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('generatedAgentConfiguration')}</CardTitle>
                    <CardDescription>
                      {t('autoConfiguredDuringInstallation')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-foreground">{t('agentId')}</Label>
                        <div className="relative">
                          <Input
                            value={installCommand.agent_id}
                            readOnly
                            className="font-mono text-sm bg-muted/50 border-muted-foreground/20 text-foreground pr-10"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                            onClick={() => copyToClipboard(installCommand.agent_id, t('agentId'))}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-foreground">{t('regionNameDetail')}</Label>
                        <Input
                          value={regionName}
                          readOnly
                          className="font-mono text-sm bg-muted/50 border-muted-foreground/20 text-foreground"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-foreground">{t('serverIp')}</Label>
                        <Input
                          value={agentIp}
                          readOnly
                          className="font-mono text-sm bg-muted/50 border-muted-foreground/20 text-foreground"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-foreground">{t('apiEndpoint')}</Label>
                        <Input
                          value={installCommand.api_endpoint}
                          readOnly
                          className="font-mono text-sm bg-muted/50 border-muted-foreground/20 text-foreground"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-foreground">{t('authenticationToken')}</Label>
                      <div className="relative">
                        <Input
                          value={installCommand.token}
                          readOnly
                          className="font-mono text-sm bg-muted/50 border-muted-foreground/20 text-foreground pr-10"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                          onClick={() => copyToClipboard(installCommand.token, t('authenticationToken'))}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800" dangerouslySetInnerHTML={{ __html: t('configurationFileLocation') }} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      {t('manualInstallationSteps')}
                    </CardTitle>
                    <CardDescription>
                      {t('stepByStepManualInstallation')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="font-medium">{t('step1DownloadPackage')}</p>
                        <code className="text-xs bg-muted p-2 rounded block mt-1">
                          <p className="text-xs text-muted-foreground mt-1">{t('downloadAmd64Notice')}</p>
                          <br/>
                          wget https://github.com/operacle/Distributed-Regional-Monitoring/releases/download/V1.0.0/distributed-regional-check-agent_1.0.0_amd64.deb
                        </code>
                        <code className="text-xs bg-muted p-2 rounded block mt-1">
                          <p className="text-xs text-muted-foreground mt-1">{t('downloadArm64Notice')}</p>
                          <br/>
                          wget https://github.com/operacle/Distributed-Regional-Monitoring/releases/download/V1.0.0/distributed-regional-check-agent_1.0.0_arm64.deb
                        </code>
                      </div>
                      
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="font-medium">{t('step2InstallPackage')}</p>
                        <code className="text-xs bg-muted p-2 rounded block mt-1">
                          sudo dpkg -i distributed-regional-check-agent_1.0.0_amd64.deb<br/>
                          sudo apt-get install -f
                        </code>
                      </div>
                      
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="font-medium">{t('step3ConfigureAgent')}</p>
                        <code className="text-xs bg-muted p-2 rounded block mt-1">
                          sudo nano /etc/regional-check-agent/regional-check-agent.env
                        </code>
                        <code className="text-xs bg-muted p-2 rounded block mt-1">
                          {t('copySampleConfiguration')}
                        </code>
                        <p className="text-xs text-muted-foreground mt-1">{t('addConfigurationValues')}</p>
                      </div>
                      
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="font-medium">{t('step4StartService')}</p>
                        <code className="text-xs bg-muted p-2 rounded block mt-1">
                          sudo systemctl enable regional-check-agent<br/>
                          sudo systemctl start regional-check-agent
                        </code>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="font-medium">{t('step5VerifyInstallation')}</p>
                        <code className="text-xs bg-muted p-2 rounded block mt-1">
                          sudo systemctl status regional-check-agent<br/>
                          curl http://localhost:8091/health
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetDialog}>
                {t('addAnotherAgent')}
              </Button>
              <Button onClick={handleComplete}>
                {t('completeSetup')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};