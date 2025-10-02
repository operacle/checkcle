
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { copyToClipboard } from "@/utils/copyUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface OneClickInstallTabProps {
  serverToken: string;
  currentPocketBaseUrl: string;
  formData: {
    serverName: string;
    osType: string;
    checkInterval: string;
    retryAttempt: string;
  };
  serverId: string;
  onDialogClose: () => void;
}

export const OneClickInstallTab: React.FC<OneClickInstallTabProps> = ({
  serverToken,
  currentPocketBaseUrl,
  formData,
  serverId,
  onDialogClose,
}) => {
  const { t } = useLanguage();

  const getOneClickInstallCommand = () => {
    const scriptUrl = "https://cdn.checkcle.io/scripts/server-agent.sh";

    return `curl -L -o server-agent.sh "${scriptUrl}"
chmod +x server-agent.sh
SERVER_TOKEN="${serverToken}" \\
POCKETBASE_URL="${currentPocketBaseUrl}" \\
SERVER_NAME="${formData.serverName}" \\
AGENT_ID="${serverId}" \\
OS_TYPE="${formData.osType}" \\
CHECK_INTERVAL="${formData.checkInterval}" \\
RETRY_ATTEMPTS="${formData.retryAttempt}" \\
sudo -E bash ./server-agent.sh`;
  };

  const handleCopyCommand = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Copy button clicked'); // Debug log
    const command = getOneClickInstallCommand();
    console.log('Copying command:', command); // Debug log
    await copyToClipboard(command);
  };

  return (
    <Card className="border-green-500/20 bg-green-0/50 dark:bg-green-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <Download className="h-5 w-5" />
          {t('oneClickInstallTitle')}
        </CardTitle>
        <CardDescription className="text-green-600 dark:text-green-300">
          {t('oneClickInstallDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-green-700 dark:text-green-400">{t('quickInstallCommand')}</Label>
          <div className="relative">
            <pre className="bg-black-50 dark:bg-green-100/950 border border-green-200 dark:border-green-800 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap break-all text-green-800 dark:text-green-200">
              <code>{getOneClickInstallCommand()}</code>
            </pre>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900 text-green-700 dark:text-green-400"
              onClick={handleCopyCommand}
            >
              <Copy className="h-4 w-4 mr-1" />
              {t('copy')}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 p-3 rounded-md">
          <p className="font-medium mb-1">{t('runCommandOnServer')}</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>{t('sshIntoServer')}</li>
            <li>{t('pasteAndRun')}</li>
            <li>{t('agentInstalled')}</li>
          </ol>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onDialogClose}>
            {t('done')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};