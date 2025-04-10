
import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    percentage: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
}) => {
  return (
    <div className={cn("card-stats", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
        {change && (
          <div className="flex items-center mt-1 text-sm">
            {change.trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 text-income mr-1" />
            ) : change.trend === 'down' ? (
              <ArrowDownRight className="h-4 w-4 text-expense mr-1" />
            ) : null}
            <span
              className={cn(
                change.trend === 'up' 
                  ? 'text-income' 
                  : change.trend === 'down' 
                  ? 'text-expense' 
                  : 'text-muted-foreground'
              )}
            >
              {change.value} ({change.percentage})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
