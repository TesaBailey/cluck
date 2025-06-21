
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EggProductionReport, FinancialReport, Report } from "@/types";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface ReportTableProps {
  report: Report;
}

export const ReportTable = ({ report }: ReportTableProps) => {
  switch (report.type) {
    case "egg-production":
      return <EggProductionTables data={report.data as EggProductionReport} />;
    case "finances":
      return <FinancialTable data={report.data as FinancialReport} />;
    default:
      return <div>No table data available for this report type.</div>;
  }
};

const EggProductionTables = ({ data }: { data: EggProductionReport }) => {
  const [activeTab, setActiveTab] = useState("daily");

  const sortedData = [...data.byDate].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="daily">Daily Production</TabsTrigger>
          <TabsTrigger value="cage">By Cage</TabsTrigger>
          <TabsTrigger value="age">By Chicken Age</TabsTrigger>
          <TabsTrigger value="sales">Sales & Income</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily">
          <Table>
            <TableCaption>Daily egg production data</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total Eggs</TableHead>
                <TableHead className="text-right">Damaged</TableHead>
                <TableHead className="text-right">Spoiled</TableHead>
                <TableHead className="text-right">Sold</TableHead>
                <TableHead className="text-right">Leftover</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((day) => (
                <TableRow key={day.date}>
                  <TableCell>
                    {format(new Date(day.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">{day.total}</TableCell>
                  <TableCell className="text-right">{day.damaged || 0}</TableCell>
                  <TableCell className="text-right">{day.spoiled || 0}</TableCell>
                  <TableCell className="text-right">{day.sold || 0}</TableCell>
                  <TableCell className="text-right">{day.leftover || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="cage">
          <Table>
            <TableCaption>Egg production by cage</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Cage</TableHead>
                <TableHead className="text-right">Total Eggs</TableHead>
                <TableHead className="text-right">New Chickens</TableHead>
                <TableHead className="text-right">Old Chickens</TableHead>
                <TableHead className="text-right">Damaged</TableHead>
                <TableHead className="text-right">Efficiency %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.byCage ? Object.entries(data.byCage).map(([cageId, stats]) => (
                <TableRow key={cageId}>
                  <TableCell>{cageId}</TableCell>
                  <TableCell className="text-right">{stats.total}</TableCell>
                  <TableCell className="text-right">{stats.newChickens}</TableCell>
                  <TableCell className="text-right">{stats.oldChickens}</TableCell>
                  <TableCell className="text-right">{stats.damaged}</TableCell>
                  <TableCell className="text-right">
                    {stats.total > 0 ? ((stats.total - stats.damaged) / stats.total * 100).toFixed(1) : 0}%
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No cage data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="age">
          <Table>
            <TableCaption>Production by chicken age</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Chicken Type</TableHead>
                <TableHead className="text-right">Total Eggs</TableHead>
                <TableHead className="text-right">Damaged</TableHead>
                <TableHead className="text-right">Sold</TableHead>
                <TableHead className="text-right">Income</TableHead>
                <TableHead className="text-right">Avg Price/Egg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>New Chickens</TableCell>
                <TableCell className="text-right">{data.byChickenAge?.new.total || 0}</TableCell>
                <TableCell className="text-right">{data.byChickenAge?.new.damaged || 0}</TableCell>
                <TableCell className="text-right">{data.byChickenAge?.new.sold || 0}</TableCell>
                <TableCell className="text-right">${data.byChickenAge?.new.income.toFixed(2) || '0.00'}</TableCell>
                <TableCell className="text-right">
                  {data.byChickenAge?.new.sold ? 
                    `$${(data.byChickenAge.new.income / data.byChickenAge.new.sold).toFixed(2)}` : 
                    '$0.00'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Old Chickens</TableCell>
                <TableCell className="text-right">{data.byChickenAge?.old.total || 0}</TableCell>
                <TableCell className="text-right">{data.byChickenAge?.old.damaged || 0}</TableCell>
                <TableCell className="text-right">{data.byChickenAge?.old.sold || 0}</TableCell>
                <TableCell className="text-right">${data.byChickenAge?.old.income.toFixed(2) || '0.00'}</TableCell>
                <TableCell className="text-right">
                  {data.byChickenAge?.old.sold ? 
                    `$${(data.byChickenAge.old.income / data.byChickenAge.old.sold).toFixed(2)}` : 
                    '$0.00'}
                </TableCell>
              </TableRow>
              <TableRow className="font-medium bg-muted/20">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{data.totalEggs}</TableCell>
                <TableCell className="text-right">{data.damagedCount}</TableCell>
                <TableCell className="text-right">{data.soldCount}</TableCell>
                <TableCell className="text-right">${data.actualIncome?.toFixed(2) || '0.00'}</TableCell>
                <TableCell className="text-right">
                  {data.soldCount ? 
                    `$${(data.actualIncome! / data.soldCount).toFixed(2)}` : 
                    '$0.00'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="sales">
          <Table>
            <TableCaption>Sales and profit analysis</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Eggs Sold as Singles</TableCell>
                <TableCell className="text-right">{data.soldSingles || 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Eggs Sold in Crates</TableCell>
                <TableCell className="text-right">{data.soldCrates || 0} crates ({(data.soldCrates || 0) * 30} eggs)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Leftover Eggs</TableCell>
                <TableCell className="text-right">{data.leftoverCount || 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Damaged/Spoiled Eggs</TableCell>
                <TableCell className="text-right">{(data.damagedCount || 0) + (data.spoiledCount || 0)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Potential Income (If All Sold)</TableCell>
                <TableCell className="text-right">${data.potentialIncome?.toFixed(2) || '0.00'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Actual Income</TableCell>
                <TableCell className="text-right">${data.actualIncome?.toFixed(2) || '0.00'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Income Lost (Damaged/Spoiled)</TableCell>
                <TableCell className="text-right">${data.lostIncomeFromDamaged?.toFixed(2) || '0.00'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Feed Cost</TableCell>
                <TableCell className="text-right">${data.feedCost?.toFixed(2) || '0.00'}</TableCell>
              </TableRow>
              <TableRow className="font-medium">
                <TableCell>Total Profit</TableCell>
                <TableCell className={`text-right ${(data.profit || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  ${data.profit?.toFixed(2) || '0.00'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const FinancialTable = ({ data }: { data: FinancialReport }) => {
  // Combine expenses and revenues for timeline view
  const combinedTransactions = [
    ...data.expenses.map(expense => ({
      date: expense.date,
      type: 'Expense',
      category: expense.category,
      description: expense.description,
      amount: -Number(expense.amount)
    })),
    ...data.revenues.map(revenue => ({
      date: revenue.date,
      type: 'Revenue',
      category: revenue.category,
      description: revenue.description,
      amount: Number(revenue.amount)
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Table>
      <TableCaption>Financial transactions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {combinedTransactions.map((transaction, index) => (
          <TableRow key={index}>
            <TableCell>
              {format(new Date(transaction.date), "MMM d, yyyy")}
            </TableCell>
            <TableCell>{transaction.type}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell className={`text-right font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              ${Math.abs(transaction.amount).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
