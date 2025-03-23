
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  colorVariant?: 'default' | 'purple' | 'blue' | 'green' | 'amber' | 'pink';
}

export function DataCard({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  className,
  colorVariant = 'default'
}: DataCardProps) {
  // Color variant classes
  const colorClasses = {
    default: '',
    purple: 'bg-purple-50 border-purple-100',
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    amber: 'bg-amber-50 border-amber-100',
    pink: 'bg-pink-50 border-pink-100',
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 card-hover", 
      colorClasses[colorVariant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground w-4 h-4">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={cn("flex items-center text-xs mt-2", {
            "text-green-500": trend === "up",
            "text-red-500": trend === "down",
            "text-muted-foreground": trend === "neutral"
          })}>
            {trend === "up" && <span className="mr-1">↑</span>}
            {trend === "down" && <span className="mr-1">↓</span>}
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
