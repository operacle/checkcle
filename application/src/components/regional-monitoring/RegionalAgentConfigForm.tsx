import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { copyToClipboard } from "@/utils/copyUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface RegionalAgentConfigFormProps {
  formData: {
    regionName: string;
    agentIp: string;
  };
  setFormData: (data: { regionName: string; agentIp: string }) => void;
  agentId: string;
  agentToken: string;
  currentPocketBaseUrl: string;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegionalAgentConfigForm: React.FC<RegionalAgentConfigFormProps> = ({
  formData,
  setFormData,
  agentId,
  agentToken,
  currentPocketBaseUrl,
  isSubmitting,
  onSubmit,
}) => {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="regionName">{t('regionName')}</Label>
          <Input
            id="regionName"
            placeholder={t('regionNamePlaceholder')}
            value={formData.regionName}
            onChange={(e) => setFormData({ ...formData, regionName: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="agentIp">{t('agentServerIpAddress')}</Label>
          <Input
            id="agentIp"
            placeholder={t('agentIpPlaceholder')}
            value={formData.agentIp}
            onChange={(e) => setFormData({ ...formData, agentIp: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">{t('agentId')}</Label>
            <div className="relative">
              <Input
                value={agentId}
                readOnly
                className="font-mono text-sm bg-muted/50 border-muted-foreground/20 pr-10"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                onClick={() => copyToClipboard(agentId)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">{t('apiEndpoint')}</Label>
            <div className="relative">
              <Input
                value={currentPocketBaseUrl}
                readOnly
                className="font-mono text-sm bg-muted/50 border-muted-foreground/20 pr-10"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                onClick={() => copyToClipboard(currentPocketBaseUrl)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">{t('authenticationToken')}</Label>
          <div className="relative">
            <Input
              value={agentToken}
              readOnly
              className="font-mono text-sm bg-muted/50 border-muted-foreground/20 pr-10"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
              onClick={() => copyToClipboard(agentToken)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('creating') : t('createAgent')}
        </Button>
      </div>
    </form>
  );
};
