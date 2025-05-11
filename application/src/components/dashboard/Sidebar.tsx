
import { Globe, Boxes, Radar, Calendar, BarChart2, LineChart, FileText, Settings, User, UserCog, Bell, FileClock, Database, RefreshCw, Info, ChevronDown, BookOpen } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar = ({
  collapsed
}: SidebarProps) => {
  const {
    theme
  } = useTheme();
  const {
    t
  } = useLanguage();
  const location = useLocation();
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
  
  const getMenuItemClasses = (isActive: boolean) => {
    return `p-2 ${isActive ? theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-sidebar-accent' : `hover:${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-sidebar-accent'}`} rounded-lg flex items-center`;
  };

  // New larger icon size for the main menu
  const mainIconSize = "h-6 w-6";
  
  return <div className={`${collapsed ? 'w-16' : 'w-64'} ${theme === 'dark' ? 'bg-[#121212] border-[#1e1e1e]' : 'bg-sidebar border-sidebar-border'} border-r flex flex-col transition-all duration-300 h-full`}>
      <div className={`p-4 ${theme === 'dark' ? 'border-[#1e1e1e]' : 'border-sidebar-border'} border-b flex items-center ${collapsed ? 'justify-center' : ''}`}>
        <div className="h-8 w-8 bg-green-500 rounded flex items-center justify-center mr-2">
          <span className="text-white font-bold">C</span>
        </div>
        {!collapsed && <h1 className="text-xl font-semibold">CheckCle App</h1>}
      </div>
      
      <nav className="my-2 mx-1 py-1 px-1">
        <Link to="/dashboard" className={`${collapsed ? 'p-3' : 'p-2 pl-3'} mb-1 rounded-lg ${location.pathname === '/dashboard' ? theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent' : `hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent'}`} flex items-center ${collapsed ? 'justify-center' : ''} transition-colors duration-200`}>
          <Globe className={`${mainIconSize} text-purple-400`} />
          {!collapsed && <span className="ml-2.5 font-medium text-foreground tracking-wide text-[15px]">{t("uptimeMonitoring")}</span>}
        </Link>
        <div className={`${collapsed ? 'p-3' : 'p-2 pl-3'} mb-1 rounded-lg hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent'} flex items-center ${collapsed ? 'justify-center' : ''} transition-colors duration-200`}>
          <Boxes className={`${mainIconSize} text-blue-400`} />
          {!collapsed && <span className="ml-2.5 font-medium text-foreground tracking-wide text-[15px]">{t("instanceMonitoring")}</span>}
        </div>
        <Link to="/ssl-domain" className={`${collapsed ? 'p-3' : 'p-2 pl-3'} mb-1 rounded-lg ${location.pathname === '/ssl-domain' ? theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent' : `hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent'}`} flex items-center ${collapsed ? 'justify-center' : ''} transition-colors duration-200`}>
          <Radar className={`${mainIconSize} text-cyan-400`} />
          {!collapsed && <span className="ml-2.5 font-medium text-foreground tracking-wide text-[15px]">{t("sslDomain")}</span>}
        </Link>
        <div className={`${collapsed ? 'p-3' : 'p-2 pl-3'} mb-1 rounded-lg hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent'} flex items-center ${collapsed ? 'justify-center' : ''} transition-colors duration-200`}>
          <Calendar className={`${mainIconSize} text-emerald-400`} />
          {!collapsed && <span className="ml-2.5 font-medium text-foreground tracking-wide text-[15px]">{t("scheduleIncident")}</span>}
        </div>
        <div className={`${collapsed ? 'p-3' : 'p-2 pl-3'} mb-1 rounded-lg hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent'} flex items-center ${collapsed ? 'justify-center' : ''} transition-colors duration-200`}>
          <BarChart2 className={`${mainIconSize} text-amber-400`} />
          {!collapsed && <span className="ml-2.5 font-medium text-foreground tracking-wide text-[15px]">{t("operationalPage")}</span>}
        </div>
        <div className={`${collapsed ? 'p-3' : 'p-2 pl-3'} mb-1 rounded-lg hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent'} flex items-center ${collapsed ? 'justify-center' : ''} transition-colors duration-200`}>
          <LineChart className={`${mainIconSize} text-rose-400`} />
          {!collapsed && <span className="ml-2.5 font-medium text-foreground tracking-wide text-[15px]">{t("reports")}</span>}
        </div>
        <div className={`${collapsed ? 'p-3' : 'p-2 pl-3'} mb-1 rounded-lg hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent'} flex items-center ${collapsed ? 'justify-center' : ''} transition-colors duration-200`}>
          <FileText className={`${mainIconSize} text-indigo-400`} />
          {!collapsed && <span className="ml-2.5 font-medium text-foreground tracking-wide text-[15px]">{t("apiDocumentation")}</span>}
        </div>
      </nav>
      
      {!collapsed && <div className={`flex-1 flex flex-col border-t ${theme === 'dark' ? 'border-[#1e1e1e] bg-[#121212]' : 'border-sidebar-border bg-sidebar'} p-4`}>
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
                    <Link to={`/settings?panel=general`} className={getMenuItemClasses(activeSettingsItem === 'general')} onClick={() => handleSettingsItemClick('general')}>
                      <Settings className="h-4 w-4 mr-2" />
                      <span className="text-sm">{t("generalSettings")}</span>
                    </Link>
                    <Link to={`/settings?panel=users`} className={getMenuItemClasses(activeSettingsItem === 'users')} onClick={() => handleSettingsItemClick('users')}>
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">{t("userManagement")}</span>
                    </Link>
                    <Link to={`/settings?panel=notifications`} className={getMenuItemClasses(activeSettingsItem === 'notifications')} onClick={() => handleSettingsItemClick('notifications')}>
                      <Bell className="h-4 w-4 mr-2" />
                      <span className="text-sm">{t("notificationSettings")}</span>
                    </Link>
                    <Link to={`/settings?panel=templates`} className={getMenuItemClasses(activeSettingsItem === 'templates')} onClick={() => handleSettingsItemClick('templates')}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span className="text-sm">{t("alertsTemplates")}</span>
                    </Link>
                    <div className={getMenuItemClasses(false)}>
                      <Database className="h-4 w-4 mr-2" />
                      <span className="text-sm">{t("dataRetention")}</span>
                    </div>
                    <Link to={`/settings?panel=about`} className={getMenuItemClasses(activeSettingsItem === 'about')} onClick={() => handleSettingsItemClick('about')}>
                      <Info className="h-4 w-4 mr-2" />
                      <span className="text-sm">{t("aboutSystem")}</span>
                    </Link>
                  </div>
                </ScrollArea>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>}
      
      {collapsed && <div className={`border-t ${theme === 'dark' ? 'border-[#1e1e1e] bg-[#121212]' : 'border-sidebar-border bg-sidebar'} p-4 flex justify-center`}>
          <Link to="/settings">
            <Settings className={`${mainIconSize} text-purple-400`} />
          </Link>
        </div>}
    </div>;
};