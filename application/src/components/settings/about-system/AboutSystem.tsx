
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, FileText, Twitter, MessageCircle, Code2, ServerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSystemSettings } from "@/hooks/useSystemSettings";
export const AboutSystem: React.FC = () => {
  const {
    t
  } = useLanguage();
  const {
    theme
  } = useTheme();
  const {
    systemName
  } = useSystemSettings();
  return <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('aboutSystem')}</h1>
        <p className="text-muted-foreground text-base leading-relaxed mt-2">{t('aboutCheckcle')}</p>
      </div>
      
      <Separator />
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="overflow-hidden border border-border transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-sky-400' : 'text-sky-600'}`} />
              <span className="font-thin text-xl">{t('systemDescription')}</span>
            </CardTitle>
            <CardDescription className="font-medium text-base">{systemName || 'ReamStack'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col space-y-4">
              <p className="text-base leading-relaxed">
                {t('systemVersion')} <span className="font-semibold">1.0.0</span> {t('isAModern')} {t('serverMonitoring')} {t('solution')} {t('designedFor')} {t('enterpriseUse')}. {t('providesRealtime')} {t('uptimeTracking')}, {t('performanceAnalytics')}, {t('andAlertNotifications')}.
              </p>
              
              <div className="flex flex-col space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('systemVersion')}</span>
                  <span className="text-foreground font-medium">{t('version')} 1.0.0</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('license')}</span>
                  <span className="text-foreground font-medium">{t('mitLicense')}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('releasedOn')}</span>
                  <span className="text-foreground font-medium">January 15, 2025</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border border-border transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Code2 className={`h-5 w-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span>{t('links')}</span>
            </CardTitle>
            <CardDescription className="font-medium text-base">{systemName || 'ReamStack'} {t('resources').toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="flex items-center justify-start gap-3 h-12 hover:bg-muted/50 transition-all duration-200" onClick={() => window.open("https://github.com/operacle/checkcle", "_blank")}>
                <Github className={`h-5 w-5 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`} />
                <span>{t('viewOnGithub')}</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-start gap-3 h-12 hover:bg-muted/50 transition-all duration-200" onClick={() => window.open("https://docs.checkcle.io", "_blank")}>
                <FileText className={`h-5 w-5 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`} />
                <span>{t('viewDocumentation')}</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-start gap-3 h-12 hover:bg-muted/50 transition-all duration-200" onClick={() => window.open("https://x.com/tlengoss", "_blank")}>
                <Twitter className={`h-5 w-5 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`} />
                <span>{t('followOnX')}</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-start gap-3 h-12 hover:bg-muted/50 transition-all duration-200" onClick={() => window.open("https://discord.gg/xs9gbubGwX", "_blank")}>
                <MessageCircle className={`h-5 w-5 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`} />
                <span>{t('joinDiscord')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default AboutSystem;