
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EggProductionReport, FinancialReport, Report } from "@/types";
import { ChartContainer } from "@/components/ui/chart";

interface ReportChartsProps {
  report: Report;
}

export const ReportCharts = ({ report }: ReportChartsProps) => {
  switch (report.type) {
    case "egg-production":
      return <EggProductionCharts data={report.data as EggProductionReport} />;
    case "finances":
      return <FinancialCharts data={report.data as FinancialReport} />;
    default:
      return <div>No charts available for this report type.</div>;
  }
};

const EggProductionCharts = ({ data }: { data: EggProductionReport }) => {
  // Sort the data by date for proper timeline
  const sortedData = [...data.byDate].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Egg Production</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                total: {
                  label: "Total Eggs",
                  color: "#22c55e",
                },
                damaged: {
                  label: "Damaged",
                  color: "#f59e0b",
                }
              }}
            >
              <LineChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-total, #22c55e)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="damaged"
                  stroke="var(--color-damaged, #f59e0b)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FinancialCharts = ({ data }: { data: FinancialReport }) => {
  const pieData = [
    { name: "Revenue", value: data.totalRevenue },
    { name: "Expenses", value: data.totalExpenses },
  ];
  
  const COLORS = ["#22c55e", "#ef4444"];
  
  const categoryData = [
    ...Object.entries(data.revenuesByCategory).map(([category, amount]) => ({
      category,
      amount,
      type: "Revenue"
    })),
    ...Object.entries(data.expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
      type: "Expenses"
    }))
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                Revenue: {
                  label: "Revenue",
                  color: "#22c55e"
                },
                Expenses: {
                  label: "Expenses",
                  color: "#ef4444"
                }
              }}
            >
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Amount by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ChartContainer 
              config={{
                Revenue: {
                  label: "Revenue",
                  color: "#22c55e"
                },
                Expenses: {
                  label: "Expenses",
                  color: "#ef4444"
                }
              }}
            >
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Legend />
                <Bar dataKey="amount" name="Amount" fill="#8884d8">
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === "Revenue" ? "#22c55e" : "#ef4444"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
