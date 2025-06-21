export interface ChickenData {
  id: string;
  name: string;
  age: number;
  breed: string;
  healthStatus: 'healthy' | 'sick' | 'recovering' | 'deceased';
  coopId: string;
  lastWeightCheck: number; // in grams
}

export interface EggProductionData {
  date: string;
  total: number;
  damaged: number;
  spoiled?: number;
  sold?: number;
  leftover?: number;
  coopBreakdown?: {
    [coopId: string]: number;
  };
  cageBreakdown?: {
    [cageId: string]: {
      total: number;
      damaged: number;
      newChickens: number;
      oldChickens: number;
    }
  };
}

export interface FeedInventoryItem {
  type: string;
  chickenType?: 'new' | 'old' | 'all';  // Added to specify if feed is for new or old chickens
  currentStock: number; // in kg
  dailyConsumption: number; // in kg
  reorderLevel: number; // in kg
  costPerKg: number;
}

export interface CoopData {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  temperature: number;
  humidity: number;
  lastCleaned: string;
}

export interface HealthAlert {
  id: string;
  date: string;
  chickenId?: string;
  coopId?: string;
  alertType: 'disease' | 'injury' | 'behavior' | 'temperature' | 'water' | 'feed' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
  resolved: boolean;
}

export interface DashboardStats {
  todayEggCount: number;
  weeklyEggAverage: number;
  healthyChickensCount: number;
  healthyChickensPercentage: number;
  waterConsumptionLiters: number;
  feedCostWeekly: number;
  eggProductionTrend: number;
  healthyChickensTrend: number;
  waterConsumptionTrend: number;
  feedCostTrend: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'worker' | 'farm_manager';
  avatarUrl?: string | null;
}

export interface EggCollectionRecord {
  id: string;
  date: string;
  cageId: string; // A to Z identifier
  count: number;
  isFromNewChickens: boolean;
  damaged?: number;
  spoiled?: number;
  sold?: number;
  soldAs?: 'single' | 'crate';
  pricePerUnit?: number;
  paymentDue?: string;
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  buyerName?: string;
  notes?: string;
}

export interface CageData {
  id: string;
  name: string; // A to Z identifier
  capacity: number;
  currentOccupancy: number;
  newChickensCount: number;
  oldChickensCount: number;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Revenue {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

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
  spoiledCount?: number;
  spoiledPercentage?: number;
  soldCount?: number;
  soldSingles?: number;
  soldCrates?: number;
  leftoverCount?: number;
  potentialIncome?: number;
  actualIncome?: number;
  lostIncomeFromDamaged?: number;
  profit?: number;
  feedCost?: number;
  byDate: EggProductionData[];
  byCage?: {
    [cageId: string]: {
      total: number;
      newChickens: number;
      oldChickens: number;
      damaged: number;
    }
  };
  byChickenAge?: {
    new: {
      total: number;
      damaged: number;
      sold: number;
      income: number;
    },
    old: {
      total: number;
      damaged: number;
      sold: number;
      income: number;
    }
  };
}

export interface FinancialMetric {
  revenue: number;
  expenses: number;
  profit: number;
}

export interface TimeBasedMetrics {
  daily: Record<string, FinancialMetric>;
  weekly: Record<string, FinancialMetric>;
  monthly: Record<string, FinancialMetric>;
}

export interface FinancialTrends {
  revenue: { daily: number, weekly: number, monthly: number };
  expenses: { daily: number, weekly: number, monthly: number };
  profit: { daily: number, weekly: number, monthly: number };
}

export interface FinancialReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  expensesByCategory: Record<string, number>;
  revenuesByCategory: Record<string, number>;
  timeBasedMetrics: TimeBasedMetrics;
  trends: FinancialTrends;
  expenses: Expense[];
  revenues: Revenue[];
}

export interface CreditSale {
  id: string;
  eggCollectionId: string;
  buyerName: string;
  amount: number;
  quantity: number;
  soldAs: 'single' | 'crate';
  paymentDue: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface CreditSalesSummary {
  totalOutstanding: number;
  overdueAmount: number;
  pendingAmount: number;
  buyerBreakdown: Record<string, {
    total: number;
    pending: number;
    overdue: number;
    lastPaymentDue: string;
  }>;
  timeBasedAnalysis: {
    daily: Record<string, number>;
    weekly: Record<string, number>;
    monthly: Record<string, number>;
  };
}
