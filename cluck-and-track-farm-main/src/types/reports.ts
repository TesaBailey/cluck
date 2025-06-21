
import { EggProductionData, Expense, Revenue } from "@/types";

export type ReportType = 
  | "egg-production" 
  | "finances" 
  | "feed-consumption" 
  | "health" 
  | "environment";

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  date: string;
  data: any;
  createdAt: string;
}

export interface ReportGenerationOptions {
  type: ReportType;
  startDate: Date;
  endDate: Date;
  includeCharts?: boolean;
}

export interface EggProductionReport {
  totalEggs: number;
  dailyAverage: number;
  damagedCount: number;
  damagedPercentage: number;
  byDate: EggProductionData[];
}

export interface FinancialReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  expensesByCategory: Record<string, number>;
  revenuesByCategory: Record<string, number>;
  expenses: Expense[];
  revenues: Revenue[];
}
