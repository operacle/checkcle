
import React from "react";
import { Check, X, Pause, AlertTriangle } from "lucide-react";

export interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge = ({ status, size = "sm" }: StatusBadgeProps) => {
  // Determine the sizing classes based on the size prop
  const getSizeClasses = () => {
    switch (size) {
      case "lg":
        return "px-3 py-1.5 text-sm gap-1.5";
      case "md":
        return "px-2.5 py-1 text-sm gap-1.5";
      case "sm":
      default:
        return "px-2 py-0.5 text-xs gap-0.5";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "lg":
        return "h-4 w-4";
      case "md":
        return "h-4 w-4";
      case "sm":
      default:
        return "h-3 w-3";
    }
  };

  const sizeClasses = getSizeClasses();
  const iconSize = getIconSize();

  switch (status) {
    case "up":
      return (
        <div className={`flex items-center bg-emerald-950/60 dark:bg-emerald-950/60 text-emerald-400 font-medium rounded-full w-fit ${sizeClasses}`}>
          <Check className={iconSize} />
          <span>Up</span>
        </div>
      );
    case "down":
      return (
        <div className={`flex items-center bg-red-950/60 dark:bg-red-950/60 text-red-400 font-medium rounded-full w-fit ${sizeClasses}`}>
          <X className={iconSize} />
          <span>Down</span>
        </div>
      );
    case "warning":
      return (
        <div className={`flex items-center bg-yellow-950/60 dark:bg-yellow-950/60 text-yellow-400 font-medium rounded-full w-fit ${sizeClasses}`}>
          <AlertTriangle className={iconSize} />
          <span>Warning</span>
        </div>
      );
    case "paused":
      return (
        <div className={`flex items-center bg-gray-200/30 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 font-medium rounded-full w-fit ${sizeClasses}`}>
          <Pause className={iconSize} />
          <span>Paused</span>
        </div>
      );
    default:
      return null;
  }
};
