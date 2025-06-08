
import React from "react";
import { MenuItem } from "./MenuItem";
import { mainMenuItems } from "./navigationData";

interface MainNavigationProps {
  collapsed: boolean;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ collapsed }) => {
  return (
    <nav className="my-2 mx-1 py-1 px-1">
      {mainMenuItems.map((item) => (
        <MenuItem
          key={item.id}
          id={item.id}
          path={item.path}
          icon={item.icon}
          translationKey={item.translationKey}
          color={item.color}
          hasNavigation={item.hasNavigation}
          collapsed={collapsed}
        />
      ))}
    </nav>
  );
};