
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LucideIcon } from "lucide-react";

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
  id,
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hasNavigation && path) {
      // Use navigate instead of window.location to prevent full page reload
      navigate(path, { replace: false });
    }
  };

  const isActive = path && location.pathname === path;
  const mainIconSize = "h-6 w-6";

  return (
    <div 
      className={`${collapsed ? 'p-3' : 'p-2 pl-3'} mb-1 rounded-lg ${isActive ? theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent' : `hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent'}`} flex items-center ${collapsed ? 'justify-center' : ''} transition-colors duration-200 cursor-pointer`}
      onClick={handleClick}
    >
      <Icon className={`${mainIconSize} ${color}`} />
      {!collapsed && <span className="ml-2.5 font-medium text-foreground tracking-wide text-[15px]">{t(translationKey)}</span>}
    </div>
  );
};