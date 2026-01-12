import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemProps {
  id: string;
  path: string | null;
  icon: LucideIcon;
  translationKey: string;
  color: string;
  hasNavigation: boolean;
  collapsed: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  path,
  icon: Icon,
  translationKey,
  color,
  hasNavigation,
  collapsed
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = path && location.pathname === path;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasNavigation && path) {
      navigate(path);
    }
  };

  return (
    <div 
      className={cn(
        "group relative flex items-center mb-1 rounded-lg cursor-pointer transition-all duration-200",
        collapsed ? "p-3 justify-center" : "p-2.5 px-4",
        isActive 
          ? (theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-primary/10 text-primary') 
          : (theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white' : 'text-zinc-600 hover:bg-zinc-100')
      )}
      onClick={handleClick}
      title={collapsed ? t(translationKey) : ""}
    >
      <Icon className={cn("h-5 w-5 shrink-0 transition-colors", color, isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100")} />
      
      {!collapsed && (
        <span className="ml-3 font-medium tracking-wide text-sm truncate">
          {t(translationKey)}
        </span>
      )}

      {/* Small Indicator for active state */}
      {isActive && !collapsed && (
        <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
      )}
    </div>
  );
};