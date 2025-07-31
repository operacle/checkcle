
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/services/authService";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, PanelLeft, PanelLeftClose, Sun, Globe, FileText, Github, Twitter, MessageSquare, Bell, User, Settings, LogOut, Grid3x3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import QuickActionsDialog from "./QuickActionsDialog";

interface HeaderProps {
  currentUser: AuthUser | null;
  onLogout: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Header = ({
  currentUser,
  onLogout,
  sidebarCollapsed,
  toggleSidebar
}: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [greeting, setGreeting] = useState<string>("");
  const { systemName } = useSystemSettings();
  const navigate = useNavigate();
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  // Set greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting(t("goodMorning"));
      } else if (hour >= 12 && hour < 18) {
        setGreeting(t("goodAfternoon"));
      } else {
        setGreeting(t("goodEvening"));
      }
    };
    updateGreeting();
    // Update greeting if language changes

    // You could add a timer to update the greeting throughout the day
    // but that's typically unnecessary since most sessions aren't active across time periods
  }, [language, t]);

  // Log avatar data for debugging
  useEffect(() => {
    if (currentUser) {
    //  console.log("Avatar URL in Header:", currentUser.avatar);
    }
  }, [currentUser]);

  // Prepare avatar URL - ensure it displays correctly if it's a local profile image
  let avatarUrl = '';
  if (currentUser?.avatar) {
    // If it's a relative path from the public folder, make sure it's resolved properly
    if (currentUser.avatar.startsWith('/upload/profile/')) {
      avatarUrl = currentUser.avatar;
    } else {
      avatarUrl = currentUser.avatar;
    }
   // console.log("Final avatar URL:", avatarUrl);
  }

  return (
    <header className="relative bg-background border-b border-border px-6 flex justify-between items-center py-[12px] overflow-hidden">
      {/* Grid Pattern Overlay - Similar to StatusCards */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full"
          style={{ 
            backgroundImage: `linear-gradient(${theme === 'dark' ? '#ffffff10' : '#00000010'} 1px, transparent 1px), 
                              linear-gradient(90deg, ${theme === 'dark' ? '#ffffff10' : '#00000010'} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        >
          <div className="w-full h-full backdrop-blur-[1px]"></div>
        </div>
      </div>
      
      {/* Header Content */}
      <div className="flex items-center gap-4 z-10">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
          {sidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
        
        {/* Quick Actions Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setQuickActionsOpen(true)} 
          className="mr-2"
        >
          <Grid3x3 className="h-5 w-5 text-green-500" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-medium">{greeting}, {currentUser?.name || currentUser?.email?.split('@')[0] || 'User'} 👋 ✨</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 z-10">
        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-border" onClick={toggleTheme}>
          <span className="sr-only">Toggle theme</span>
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-border">
              <span className="sr-only">{t("language")}</span>
              <Globe className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
              {t("english")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("km")} className={language === "km" ? "bg-accent" : ""}>
              {t("khmer")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("de")} className={language === "de" ? "bg-accent" : ""}>
              {t("Deutsch")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("ja")} className={language === "ja" ? "bg-accent" : ""}>
              {t("japanese")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("zh-CN")} className={language === "zh-CN" ? "bg-accent" : ""}>
              {t("simplifiedChinese")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Documentation */}
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-8 h-8 border-border"
          onClick={() => window.open("https://docs.checkcle.io", "_blank")}
        >
          <span className="sr-only">{t("documentation")}</span>
          <FileText className="w-4 h-4" />
        </Button>
        
        {/* GitHub */}
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-8 h-8 border-border"
          onClick={() => window.open("https://github.com/operacle/checkcle", "_blank")}
        >
          <span className="sr-only">GitHub</span>
          <Github className="w-4 h-4" />
        </Button>
        
        {/* X (Twitter) */}
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-8 h-8 border-border"
          onClick={() => window.open("https://x.com/checkcle_oss", "_blank")}
        >
          <span className="sr-only">X (Twitter)</span>
          <Twitter className="w-4 h-4" />
        </Button>
        
        {/* Discord */}
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-8 h-8 border-border"
          onClick={() => window.open("https://discord.gg/xs9gbubGwX", "_blank")}
        >
          <span className="sr-only">Discord</span>
          <MessageSquare className="w-4 h-4" />
        </Button>
        
        {/* Notifications */}
        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-border">
          <span className="sr-only">{t("notifications")}</span>
          <Bell className="w-4 h-4" />
        </Button>
        
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={currentUser?.name || currentUser?.email?.split('@')[0] || 'User'} /> : <AvatarFallback className="bg-primary/20 text-primary">
                  {currentUser?.name?.[0] || currentUser?.email?.[0] || 'U'}
                </AvatarFallback>}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-10 w-10">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={currentUser?.name || currentUser?.email?.split('@')[0] || 'User'} /> : <AvatarFallback className="bg-primary/20 text-primary">
                    {currentUser?.name?.[0] || currentUser?.email?.[0] || 'U'}
                  </AvatarFallback>}
              </Avatar>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">{currentUser?.name || 'User'}</span>
                <span className="text-xs text-muted-foreground truncate">{currentUser?.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>{t("profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("settings")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Quick Actions Dialog */}
      <QuickActionsDialog isOpen={quickActionsOpen} setIsOpen={setQuickActionsOpen} />
    </header>
  );
};