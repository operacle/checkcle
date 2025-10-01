
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy } from "lucide-react";
import { copyToClipboard } from "@/utils/copyUtils";
import { OSSelector } from "./OSSelector";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServerAgentConfigFormProps {
  formData: {
    serverName: string;
    description: string;
    osType: string;
    checkInterval: string;
    retryAttempt: string;
    dockerEnabled: boolean;
    notificationEnabled: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    serverName: string;
    description: string;
    osType: string;
    checkInterval: string;
    retryAttempt: string;
    dockerEnabled: boolean;
    notificationEnabled: boolean;
  }>>;
  serverId: string;
  serverToken: string;
  currentPocketBaseUrl: string;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ServerAgentConfigForm: React.FC<ServerAgentConfigFormProps> = ({
  formData,
  setFormData,
  serverId,
  serverToken,
  currentPocketBaseUrl,
  isSubmitting,
  onSubmit,
}) => {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serverName">{t('serverName')} *</Label>
          <Input
            id="serverName"
            placeholder={t('serverNamePlaceholder')}
            value={formData.serverName}
            onChange={(e) => setFormData(prev => ({ ...prev, serverName: e.target.value }))}
            required
          />
          <p className="text-xs text-muted-foreground">{t('serverNameDesc')}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="serverId">{t('serverAgentId')}</Label>
          <div className="flex gap-2">
            <Input
              id="serverId"
              value={serverId}
              readOnly
              className="font-mono text-sm bg-muted"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(serverId)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{t('serverAgentIdDesc')}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('operatingSystem')} *</Label>
          <OSSelector
            value={formData.osType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, osType: value }))}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkInterval">{t('checkInterval')}</Label>
            <Select
              value={formData.checkInterval}
              onValueChange={(value) => setFormData(prev => ({ ...prev, checkInterval: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectInterval')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">{t('interval30s')}</SelectItem>
                <SelectItem value="60">{t('interval1m')}</SelectItem>
                <SelectItem value="120">{t('interval2m')}</SelectItem>
                <SelectItem value="300">{t('interval5m')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t('checkIntervalDesc')}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="retryAttempt">{t('retryAttempts')}</Label>
            <Select
              value={formData.retryAttempt}
              onValueChange={(value) => setFormData(prev => ({ ...prev, retryAttempt: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectRetryAttempts')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{t('attempt1')}</SelectItem>
                <SelectItem value="2">{t('attempt2')}</SelectItem>
                <SelectItem value="3">{t('attempt3')}</SelectItem>
                <SelectItem value="5">{t('attempt5')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t('retryAttemptsDesc')}</p>
          </div>

          <div className="space-y-2">
            <Label>{t('serverToken')}</Label>
            <div className="flex gap-2">
              <Input value={serverToken} readOnly className="font-mono text-sm bg-muted" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(serverToken)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t('serverTokenDesc')}</p>
          </div>

          <div className="space-y-2">
            <Label>{t('systemUrl')}</Label>
            <div className="flex gap-2">
              <Input value={currentPocketBaseUrl} readOnly className="font-mono text-sm bg-muted" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(currentPocketBaseUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t('systemUrlDesc')}</p>
          </div>
        </div>
      </div>
     
      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('creatingAgent') : t('createServerAgent')}
        </Button>
      </div>
    </form>
  );
};