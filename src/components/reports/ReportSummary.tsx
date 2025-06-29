
import { Card, CardContent } from "@/components/ui/card";
import { EggProductionReport, FinancialReport, Report } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface ReportSummaryProps {
  report: Report;
}

export const ReportSummary = ({ report }: ReportSummaryProps) => {
  switch (report.type) {
    case "egg-production":
      return <EggProductionSummary data={report.data as EggProductionReport} />;
    case "finances":
      return <FinancialSummary data={report.data as FinancialReport} />;
    default:
      return <div>Summary not available for this report type.</div>;
  }
};

const EggProductionSummary = ({ data }: { data: EggProductionReport }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Production Metrics */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Production Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Eggs:</span>
              <span className="font-medium">{data.totalEggs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Average:</span>
              <span className="font-medium">{data.dailyAverage.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">New Chicken Eggs:</span>
              <span className="font-medium">{data.byChickenAge?.new.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Old Chicken Eggs:</span>
              <span className="font-medium">{data.byChickenAge?.old.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Damaged/Spoiled:</span>
              <span className="font-medium">{data.damagedCount + (data.spoiledCount || 0)} ({(data.damagedPercentage + (data.spoiledPercentage || 0)).toFixed(1)}%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Metrics */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Sales Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Eggs Sold:</span>
              <span className="font-medium">{data.soldCount || 0} ({((data.soldCount || 0) / data.totalEggs * 100).toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Singles:</span>
              <span className="font-medium">{data.soldSingles || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Crates:</span>
              <span className="font-medium">{data.soldCrates || 0} ({(data.soldCrates || 0) * 30} eggs)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Leftover:</span>
              <span className="font-medium">{data.leftoverCount || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actual Income:</span>
              <span className="font-medium text-green-600">${data.actualIncome?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Potential Income:</span>
              <span className="font-medium">${data.potentialIncome?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lost Revenue:</span>
              <span className="font-medium text-red-500">${data.lostIncomeFromDamaged?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Feed Cost:</span>
              <span className="font-medium text-red-500">${data.feedCost?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Profit:</span>
              <span className={`${(data.profit || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                ${data.profit?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FinancialSummary = ({ data }: { data: FinancialReport }) => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <h3 className="text-lg font-medium text-center">Total Revenue</h3>
              <p className="text-3xl font-bold text-center text-green-600">
                ${data.totalRevenue.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div>
              <h3 className="text-lg font-medium text-center">Total Expenses</h3>
              <p className="text-3xl font-bold text-center text-red-500">
                ${data.totalExpenses.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div>
              <h3 className="text-lg font-medium text-center">Net Profit</h3>
              <p className={`text-3xl font-bold text-center ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                ${data.netProfit.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Time-based Financial Analysis */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Time-based Financial Analysis</h3>
          <Tabs defaultValue="daily">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily">
              <PerformanceTable 
                data={data.timeBasedMetrics.daily} 
                trends={data.trends} 
                periodType="daily"
                formatDate={(date) => format(new Date(date), 'MMM dd, yyyy')}
              />
            </TabsContent>
            
            <TabsContent value="weekly">
              <PerformanceTable 
                data={data.timeBasedMetrics.weekly} 
                trends={data.trends} 
                periodType="weekly"
                formatDate={(date) => `Week of ${format(new Date(date), 'MMM dd, yyyy')}`}
              />
            </TabsContent>
            
            <TabsContent value="monthly">
              <PerformanceTable 
                data={data.timeBasedMetrics.monthly} 
                trends={data.trends}
                periodType="monthly" 
                formatDate={(date) => format(new Date(`${date}-01`), 'MMMM yyyy')}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Revenue by Category</h3>
            <div className="space-y-2">
              {Object.entries(data.revenuesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between">
                  <span className="font-medium">{category}</span>
                  <span className="text-green-600">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Expenses by Category</h3>
            <div className="space-y-2">
              {Object.entries(data.expensesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between">
                  <span className="font-medium">{category}</span>
                  <span className="text-red-500">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper component to display performance metrics in a table
const PerformanceTable = ({ 
  data, 
  trends, 
  periodType,
  formatDate 
}: { 
  data: Record<string, { revenue: number; expenses: number; profit: number }>, 
  trends: any,
  periodType: 'daily' | 'weekly' | 'monthly',
  formatDate: (dateStr: string) => string
}) => {
  const sortedEntries = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Revenue Trend</h4>
              <TrendIndicator value={trends.revenue[periodType]} />
            </div>
            <p className="text-2xl font-bold mt-2">{Math.abs(trends.revenue[periodType]).toFixed(1)}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Expenses Trend</h4>
              <TrendIndicator value={trends.expenses[periodType]} inverted />
            </div>
            <p className="text-2xl font-bold mt-2">{Math.abs(trends.expenses[periodType]).toFixed(1)}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Profit Trend</h4>
              <TrendIndicator value={trends.profit[periodType]} />
            </div>
            <p className="text-2xl font-bold mt-2">{Math.abs(trends.profit[periodType]).toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="h-10 px-4 text-left font-medium">Period</th>
              <th className="h-10 px-4 text-right font-medium">Revenue</th>
              <th className="h-10 px-4 text-right font-medium">Expenses</th>
              <th className="h-10 px-4 text-right font-medium">Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map(([date, metrics]) => (
              <tr key={date} className="border-b">
                <td className="p-4">{formatDate(date)}</td>
                <td className="p-4 text-right text-green-600">${metrics.revenue.toFixed(2)}</td>
                <td className="p-4 text-right text-red-500">${metrics.expenses.toFixed(2)}</td>
                <td className={`p-4 text-right font-medium ${metrics.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  ${metrics.profit.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper component to display trend indicators
const TrendIndicator = ({ value, inverted = false }: { value: number, inverted?: boolean }) => {
  let isPositive = value > 0;
  
  // For expenses, lower is better, so invert the indicator
  if (inverted) isPositive = !isPositive;
  
  if (value === 0) return <span className="text-gray-500">—</span>;
  
  return isPositive ? (
    <div className="flex items-center text-green-600">
      <ArrowUpIcon className="h-4 w-4 mr-1" />
      <span>Up</span>
    </div>
  ) : (
    <div className="flex items-center text-red-500">
      <ArrowDownIcon className="h-4 w-4 mr-1" />
      <span>Down</span>
    </div>
  );
};
