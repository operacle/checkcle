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
  const {
    theme
  } = useTheme();
  const {
    t
  } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasNavigation && path) {
      navigate(path, {
        replace: false
      });
    }
  };
  const isActive = path && location.pathname === path;
  const mainIconSize = "h-5 w-5";
  return <div className={`
        ${collapsed ? 'p-3' : 'py-3 px-3'} 
        mb-1 rounded-lg 
        ${isActive ? theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent' : `hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-sidebar-accent'}`} 
        flex items-center gap-3
        ${collapsed ? 'justify-center' : ''} 
        cursor-pointer transition-colors
      `} onClick={handleClick}>
      <Icon className={`${mainIconSize} flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`} />
      {!collapsed && <span className="text-sidebar-foreground font-inter text-[14px] font-medium tracking-tight leading-tight whitespace-nowrap">
          {t(translationKey)}
        </span>}
    </div>;
};