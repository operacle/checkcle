
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Settings, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { settingsMenuItems } from "./navigationData";

interface SettingsPanelProps {
  collapsed: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ collapsed }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSettingsItem, setActiveSettingsItem] = useState<string | null>("general");
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);

  // Update active settings item based on URL
  useEffect(() => {
    if (location.pathname === '/settings') {
      const params = new URLSearchParams(location.search);
      const panel = params.get('panel');
      if (panel) {
        setActiveSettingsItem(panel);
      }
    }
  }, [location]);

  const handleSettingsItemClick = (item: string) => {
    setActiveSettingsItem(item);
  };

  const handleMenuItemClick = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // Use navigate instead of window.location to prevent full page reload
    navigate(path, { replace: false });
  };

  const getMenuItemClasses = (isActive: boolean) => {
    return `p-2 ${isActive ? theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-sidebar-accent' : `hover:${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-sidebar-accent'}`} rounded-lg flex items-center`;
  };

  if (collapsed) {
    const mainIconSize = "h-6 w-6";
    return (
      <div className={`border-t ${theme === 'dark' ? 'border-[#1e1e1e] bg-[#121212]' : 'border-sidebar-border bg-sidebar'} p-4 flex justify-center`}>
        <div 
          onClick={(e) => handleMenuItemClick('/settings', e)} 
          className="cursor-pointer"
        >
          <Settings className={`${mainIconSize} text-purple-400`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col border-t ${theme === 'dark' ? 'border-[#1e1e1e] bg-[#121212]' : 'border-sidebar-border bg-sidebar'} p-4`}>
      <Collapsible open={settingsPanelOpen} onOpenChange={setSettingsPanelOpen} className="w-full flex flex-col flex-1">
        <CollapsibleTrigger className={`flex items-center justify-between w-full mb-4 px-2 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-[#1a1a1a]' : 'hover:bg-sidebar-accent'}`}>
          <div className="flex items-center">
            <span className="font-medium tracking-wide">{t("settingPanel")}</span>
          </div>
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${settingsPanelOpen ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className={`${theme === 'dark' ? 'bg-[#121212]' : 'bg-sidebar'} flex-1 flex flex-col`}>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar relative pr-1">
            <ScrollArea className="h-full">
              <div className="space-y-2 pr-4">
                {settingsMenuItems.map((item) => (
                  <div 
                    key={item.id}
                    className={getMenuItemClasses(activeSettingsItem === item.id)} 
                    onClick={(e) => {
                      handleMenuItemClick(`/settings?panel=${item.id}`, e);
                      handleSettingsItemClick(item.id);
                    }}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{t(item.translationKey)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};