
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/contexts/ThemeContext";

interface OverviewCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
  isLoading?: boolean;
  color?: string;
  gradient?: string;
}

export const OverviewCard = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  valueClassName,
  isLoading = false,
  color = "blue",
  gradient,
}: OverviewCardProps) => {
  const { theme } = useTheme();
  
  // Map color prop to gradient colors
  const getGradientBackground = () => {
    if (gradient) {
      return gradient;
    }
    const colors = {
      blue: theme === 'dark'
        ? "linear-gradient(135deg, rgba(25, 118, 210, 0.8) 0%, rgba(66, 165, 245, 0.6) 100%)"
        : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
      green: theme === 'dark'
        ? "linear-gradient(135deg, rgba(67, 160, 71, 0.8) 0%, rgba(102, 187, 106, 0.6) 100%)"
        : "linear-gradient(135deg, #43a047 0%, #66bb6a 100%)",
      amber: theme === 'dark'
        ? "linear-gradient(135deg, rgba(255, 152, 0, 0.8) 0%, rgba(255, 183, 77, 0.6) 100%)"
        : "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
      red: theme === 'dark'
        ? "linear-gradient(135deg, rgba(229, 57, 53, 0.8) 0%, rgba(239, 83, 80, 0.6) 100%)"
        : "linear-gradient(135deg, #e53935 0%, #ef5350 100%)",
      purple: theme === 'dark'
        ? "linear-gradient(135deg, rgba(123, 31, 162, 0.8) 0%, rgba(156, 39, 176, 0.6) 100%)"
        : "linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)",
      orange: theme === 'dark'
        ? "linear-gradient(135deg, rgba(230, 81, 0, 0.8) 0%, rgba(255, 109, 0, 0.6) 100%)"
        : "linear-gradient(135deg, #e65100 0%, #ff6d00 100%)",
    };
    
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Card 
      className={cn(
        "border-none rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 relative z-10", 
        className
      )}
      style={{
        background: getGradientBackground()
      }}
    >
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="w-full h-full" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), 
                              linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        ></div>
      </div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/90 mb-1">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 bg-white/20" />
            ) : (
              <h3 className={cn("text-3xl font-bold text-white", valueClassName)}>{value}</h3>
            )}
            {description && (
              <p className="text-sm text-white/80 mt-1">{description}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-100' : 'text-red-100'}`}>
                <span className="mr-1">
                  {trend.isPositive ? '↑' : '↓'}
                </span>
                <span>{Math.abs(trend.value)}%</span>
                <span className="ml-1 text-white/70">vs last month</span>
              </div>
            )}
          </div>
          <div className="rounded-full p-3 bg-white/25 backdrop-blur-sm">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
