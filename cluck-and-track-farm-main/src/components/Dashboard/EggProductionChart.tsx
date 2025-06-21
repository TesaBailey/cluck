
import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getEggProductionData } from "@/services/api";
import { Loader2 } from "lucide-react";

type TimeRange = "week" | "month" | "year";

const EggProductionChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['eggProduction', timeRange],
    queryFn: () => getEggProductionData(timeRange),
  });
  
  if (isLoading) {
    return (
      <div className="chart-container flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-farm-green" />
      </div>
    );
  }
  
  if (error || !chartData) {
    return (
      <div className="chart-container flex flex-col items-center justify-center h-[400px]">
        <p className="text-red-500 mb-2">Failed to load egg production data</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="chart-container">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Egg Production</h3>
        <div className="flex gap-2">
          {(["week", "month", "year"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant="outline"
              size="sm"
              onClick={() => setTimeRange(range)}
              className={cn(
                timeRange === range 
                  ? "bg-farm-green text-white border-farm-green" 
                  : "text-gray-600"
              )}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip 
              formatter={(value) => [`${value} eggs`, '']} 
              labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              name="Total eggs"
              stroke="#589636" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="damaged" 
              name="Damaged eggs"
              stroke="#F9CA54" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EggProductionChart;
