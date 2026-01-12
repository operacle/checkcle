import { Button } from "@/components/ui/button";
import { AuthUser } from "@/services/authService";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Moon, PanelLeft, PanelLeftClose, Sun, Globe, FileText, 
  Github, Twitter, MessageSquare, Bell, User, Settings, 
  LogOut, Menu, X 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface HeaderProps {
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export const Header = ({
  currentUser,
  onLogout,
}: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { sidebarCollapsed, toggleSidebar, isMobileOpen, toggleMobileMenu } = useSidebar();
  const [greeting, setGreeting] = useState<string>("");
  const { systemName } = useSystemSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setGreeting(t("goodMorning"));
      else if (hour >= 12 && hour < 18) setGreeting(t("goodAfternoon"));
      else setGreeting(t("goodEvening"));
    };
    updateGreeting();
  }, [language, t]);

  const avatarUrl = currentUser?.avatar || '';

  const openExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <header className="relative bg-background border-b border-border px-4 lg:px-6 flex justify-between items-center h-16 shrink-0 z-30 overflow-hidden">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
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
      
      <div className="flex items-center gap-2 lg:gap-4 z-10">
        {/* Mobile Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="lg:hidden h-9 w-9">
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Desktop Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden lg:flex h-9 w-9">
          {sidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
        
        <div className="flex items-center">
          <h1 className="text-sm lg:text-lg font-medium truncate max-w-[150px] lg:max-w-none">
            {greeting}, {currentUser?.name || currentUser?.email?.split('@')[0] || 'User'} 👋 ✨
          </h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-1 lg:space-x-3 z-10">
        {/* External Links - Hidden on small screens */}
        <div className="hidden md:flex items-center space-x-1 mr-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-8 h-8 border-border"
            onClick={() => openExternalLink('https://docs.checkcle.io')}
            title={t("documentation")}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-8 h-8 border-border"
            onClick={() => openExternalLink('https://github.com/operacle/checkcle')}
            title="GitHub"
          >
            <Github className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-8 h-8 border-border"
            onClick={() => openExternalLink('https://x.com/checkcle_oss')}
            title="X (Twitter)"
          >
            <Twitter className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-8 h-8 border-border"
            onClick={() => openExternalLink('https://discord.gg/xs9gbubGwX')}
            title="Discord"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-8 h-8 border-border"
            title={t("notifications")}
          >
            <Bell className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-border hidden sm:flex" onClick={toggleTheme}>
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
              {t("english")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("km")} className={language === "km" ? "bg-accent" : ""}>
              {t("khmer")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("de")} className={language === "de" ? "bg-accent" : ""}>
              {t("german")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("ko")} className={language === "ko" ? "bg-accent" : ""}>
              {t("korean")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("ja")} className={language === "ja" ? "bg-accent" : ""}>
              {t("japanese")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("zhcn")} className={language === "zhcn" ? "bg-accent" : ""}>
              {t("simplifiedChinese")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer border hover:ring-2 hover:ring-primary/20 transition-all">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt="User" /> : <AvatarFallback className="bg-primary/20 text-primary">{currentUser?.name?.[0] || 'U'}</AvatarFallback>}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-10 w-10">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt="User" /> : <AvatarFallback className="bg-primary/20 text-primary">{currentUser?.name?.[0] || 'U'}</AvatarFallback>}
              </Avatar>
              <div className="flex flex-col space-y-0.5">
                <span className="text-sm font-medium truncate">{currentUser?.name || 'User'}</span>
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
    </header>
  );
};