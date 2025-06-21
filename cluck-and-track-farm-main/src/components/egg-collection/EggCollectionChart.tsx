
import { EggCollectionRecord, CageData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface EggCollectionChartProps {
  records: EggCollectionRecord[];
  cages: CageData[];
}

const EggCollectionChart = ({ records, cages }: EggCollectionChartProps) => {
  const [selectedCageId, setSelectedCageId] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<number>(7); // Last 7 days by default
  
  // Get the date range for filtering
  const endDate = new Date();
  const startDate = subDays(new Date(), timeRange);
  
  // Filter records by selected cage and date range
  const filteredRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const isInDateRange = recordDate >= startDate && recordDate <= endDate;
    const matchesCage = selectedCageId === "all" ? true : record.cageId === selectedCageId;
    
    return isInDateRange && matchesCage;
  });
  
  // Prepare data for the chart by grouping by date and chicken type
  const chartData = Array.from({ length: timeRange }, (_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, "yyyy-MM-dd");
    
    const dayRecords = filteredRecords.filter(r => r.date.startsWith(dateStr));
    
    const newChickensCount = dayRecords
      .filter(r => r.isFromNewChickens)
      .reduce((sum, r) => sum + r.count, 0);
      
    const oldChickensCount = dayRecords
      .filter(r => !r.isFromNewChickens)
      .reduce((sum, r) => sum + r.count, 0);
    
    return {
      date: format(date, "MMM d"),
      newChickens: newChickensCount,
      oldChickens: oldChickensCount,
      total: newChickensCount + oldChickensCount
    };
  }).reverse();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Egg Production Chart</span>
          <div className="flex gap-2">
            <Select value={selectedCageId} onValueChange={setSelectedCageId}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Cages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cages</SelectItem>
                {cages.map((cage) => (
                  <SelectItem key={cage.id} value={cage.id}>
                    {cage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeRange.toString()} onValueChange={(value) => setTimeRange(Number(value))}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="14">Last 14 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="newChickens" name="New Chickens" fill="#9333EA" />
              <Bar dataKey="oldChickens" name="Old Chickens" fill="#D97706" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EggCollectionChart;
