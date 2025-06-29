import { supabase } from "@/lib/supabase";
import { Expense, Revenue, FinancialReport, TimeBasedMetrics } from "@/types";
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

// Helper function to group financial data by time period
function groupByTimePeriod(data: (Expense | Revenue)[], startDate: Date, endDate: Date): TimeBasedMetrics {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const result: TimeBasedMetrics = {
    daily: {},
    weekly: {},
    monthly: {}
  };

  // Initialize the periods
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    result.daily[dateStr] = { revenue: 0, expenses: 0, profit: 0 };
  }

  // Group by week
  let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday as start of week
  while (currentWeekStart <= endDate) {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const weekKey = `${format(currentWeekStart, 'yyyy-MM-dd')}`;
    result.weekly[weekKey] = { revenue: 0, expenses: 0, profit: 0 };
    currentWeekStart = new Date(currentWeekStart);
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }

  // Group by month
  let currentMonthStart = startOfMonth(startDate);
  while (currentMonthStart <= endDate) {
    const monthKey = format(currentMonthStart, 'yyyy-MM');
    result.monthly[monthKey] = { revenue: 0, expenses: 0, profit: 0 };
    currentMonthStart = new Date(currentMonthStart);
    currentMonthStart.setMonth(currentMonthStart.getMonth() + 1);
  }

  // Populate the data
  data.forEach(item => {
    const date = new Date(item.date);
    const dateStr = format(date, 'yyyy-MM-dd');
    const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const monthStr = format(date, 'yyyy-MM');

    const amount = Number(item.amount);
    
    // Update daily metrics
    if (result.daily[dateStr]) {
      if ('description' in item && item.category) { // Expense
        result.daily[dateStr].expenses += amount;
      } else { // Revenue
        result.daily[dateStr].revenue += amount;
      }
      result.daily[dateStr].profit = result.daily[dateStr].revenue - result.daily[dateStr].expenses;
    }

    // Update weekly metrics
    if (result.weekly[weekStart]) {
      if ('description' in item && item.category) { // Expense
        result.weekly[weekStart].expenses += amount;
      } else { // Revenue
        result.weekly[weekStart].revenue += amount;
      }
      result.weekly[weekStart].profit = result.weekly[weekStart].revenue - result.weekly[weekStart].expenses;
    }

    // Update monthly metrics
    if (result.monthly[monthStr]) {
      if ('description' in item && item.category) { // Expense
        result.monthly[monthStr].expenses += amount;
      } else { // Revenue
        result.monthly[monthStr].revenue += amount;
      }
      result.monthly[monthStr].profit = result.monthly[monthStr].revenue - result.monthly[monthStr].expenses;
    }
  });

  return result;
}

export async function generateFinancialReport(startDate: Date, endDate: Date): Promise<FinancialReport | null> {
  try {
    // Get expenses with proper typing
    const { data: expensesData, error: expenseError } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'));

    if (expenseError) throw expenseError;

    // Get revenues with proper typing
    const { data: revenuesData, error: revenueError } = await supabase
      .from('revenues')
      .select('*')
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'));

    if (revenueError) throw revenueError;

    // Convert database results to our types
    const expenses: Expense[] = (expensesData || []).map(expense => ({
      id: expense.id,
      userId: expense.user_id,
      amount: Number(expense.amount),
      description: expense.description,
      category: expense.category,
      date: expense.date,
      createdAt: expense.created_at,
      updatedAt: expense.updated_at
    }));

    const revenues: Revenue[] = (revenuesData || []).map(revenue => ({
      id: revenue.id,
      userId: revenue.user_id,
      amount: Number(revenue.amount),
      description: revenue.description,
      category: revenue.category,
      date: revenue.date,
      createdAt: revenue.created_at,
      updatedAt: revenue.updated_at
    }));

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const totalRevenue = revenues.reduce((sum, revenue) => sum + Number(revenue.amount), 0);
    const netProfit = totalRevenue - totalExpenses;

    // Group by category
    const expensesByCategory = expenses.reduce((acc: Record<string, number>, expense) => {
      const category = expense.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Number(expense.amount);
      return acc;
    }, {});

    const revenuesByCategory = revenues.reduce((acc: Record<string, number>, revenue) => {
      const category = revenue.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Number(revenue.amount);
      return acc;
    }, {});

    // Generate time-based metrics
    const allFinancialItems = [...expenses, ...revenues];
    const timeBasedMetrics = groupByTimePeriod(allFinancialItems, startDate, endDate);

    // Calculate trends based on available data
    const trends = calculateFinancialTrends(timeBasedMetrics);

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      expensesByCategory,
      revenuesByCategory,
      timeBasedMetrics,
      trends,
      expenses,
      revenues
    };
  } catch (error) {
    console.error("Error generating financial report:", error);
    return null;
  }
}

// Calculate financial trends based on time metrics
function calculateFinancialTrends(metrics: TimeBasedMetrics) {
  const trends = {
    revenue: { daily: 0, weekly: 0, monthly: 0 },
    expenses: { daily: 0, weekly: 0, monthly: 0 },
    profit: { daily: 0, weekly: 0, monthly: 0 }
  };
  
  // Calculate daily trend (comparing last day to previous day)
  const dailyEntries = Object.entries(metrics.daily).sort();
  if (dailyEntries.length >= 2) {
    const [, lastDay] = dailyEntries[dailyEntries.length - 1];
    const [, previousDay] = dailyEntries[dailyEntries.length - 2];
    
    trends.revenue.daily = calculatePercentChange(previousDay.revenue, lastDay.revenue);
    trends.expenses.daily = calculatePercentChange(previousDay.expenses, lastDay.expenses);
    trends.profit.daily = calculatePercentChange(previousDay.profit, lastDay.profit);
  }
  
  // Calculate weekly trend
  const weeklyEntries = Object.entries(metrics.weekly).sort();
  if (weeklyEntries.length >= 2) {
    const [, lastWeek] = weeklyEntries[weeklyEntries.length - 1];
    const [, previousWeek] = weeklyEntries[weeklyEntries.length - 2];
    
    trends.revenue.weekly = calculatePercentChange(previousWeek.revenue, lastWeek.revenue);
    trends.expenses.weekly = calculatePercentChange(previousWeek.expenses, lastWeek.expenses);
    trends.profit.weekly = calculatePercentChange(previousWeek.profit, lastWeek.profit);
  }
  
  // Calculate monthly trend
  const monthlyEntries = Object.entries(metrics.monthly).sort();
  if (monthlyEntries.length >= 2) {
    const [, lastMonth] = monthlyEntries[monthlyEntries.length - 1];
    const [, previousMonth] = monthlyEntries[monthlyEntries.length - 2];
    
    trends.revenue.monthly = calculatePercentChange(previousMonth.revenue, lastMonth.revenue);
    trends.expenses.monthly = calculatePercentChange(previousMonth.expenses, lastMonth.expenses);
    trends.profit.monthly = calculatePercentChange(previousMonth.profit, lastMonth.profit);
  }
  
  return trends;
}

// Helper function to calculate percent change
function calculatePercentChange(previous: number, current: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}