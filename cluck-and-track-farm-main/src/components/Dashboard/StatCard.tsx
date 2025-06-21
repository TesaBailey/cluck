
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  trend,
  className,
  valueClassName,
}: StatCardProps) => {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={cn("text-2xl font-bold mt-1", valueClassName)}>{value}</p>
        </div>
        <div className="p-2 rounded-full bg-farm-green/10 text-farm-green-dark">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center">
          <span
            className={cn(
              "text-xs font-medium mr-1",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-xs text-gray-500">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
