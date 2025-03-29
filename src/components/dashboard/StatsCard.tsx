
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  bgColor?: string;
  iconBgColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtext,
  icon,
  trend,
  className,
  bgColor = "bg-white",
  iconBgColor = "bg-indigo-100",
}) => {
  return (
    <Card className={cn("overflow-hidden border shadow-soft transition-all duration-200 hover:shadow-md", bgColor, className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-sm text-slate-500 mt-1">{subtext}</p>
            
            {trend && (
              <div className="flex items-center mt-1">
                <span 
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-emerald-600" : "text-rose-600"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-slate-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
          
          <div className={cn("p-3 rounded-full", iconBgColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
