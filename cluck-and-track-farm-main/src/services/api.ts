
// This file provides a unified API service layer, directing requests
// to either the mock implementation or the real implementation

import {
  getChickens as getMockChickens,
  getCoops as getMockCoops,
  getCages as getMockCages,
  getEggProductionData as getMockEggProductionData,
  getHealthAlerts as getMockHealthAlerts,
  getFeedInventory as getMockFeedInventory,
  getDashboardStats as getMockDashboardStats,
  getEggCollectionRecords as getMockEggCollectionRecords,
  addEggCollectionRecord as mockAddEggCollectionRecord,
  addCage as mockAddCage,
  getExpenses as getMockExpenses,
  getRevenues as getMockRevenues,
  addExpense as mockAddExpense,
  addRevenue as mockAddRevenue,
  deleteExpense as mockDeleteExpense,
  deleteRevenue as mockDeleteRevenue,
  generateReport as mockGenerateReport,
  getReports as getMockReports,
  addChicken as mockAddChicken,
  addFeedStock as mockAddFeedStock,
  updateFeedStock as mockUpdateFeedStock,
  resolveHealthAlert as mockResolveHealthAlert
} from '../utils/mockData';

import {
  getChickens as getSupabaseChickens,
  getCoops as getSupabaseCoops,
  getCages as getSupabaseCages,
  getEggProductionData as getSupabaseEggProductionData,
  getHealthAlerts as getSupabaseHealthAlerts,
  getFeedInventory as getSupabaseFeedInventory,
  getDashboardStats as getSupabaseDashboardStats,
  getEggCollectionRecords as getSupabaseEggCollectionRecords,
  addEggCollectionRecord as supabaseAddEggCollectionRecord,
  addCage as supabaseAddCage,
  getExpenses as getSupabaseExpenses,
  getRevenues as getSupabaseRevenues,
  addExpense as supabaseAddExpense,
  addRevenue as supabaseAddRevenue,
  deleteExpense as supabaseDeleteExpense,
  deleteRevenue as supabaseDeleteRevenue,
  getCreditSalesSummary as getSupabaseCreditSalesSummary,
  updateEggCollectionPaymentStatus as supabaseUpdateEggCollectionPaymentStatus,
  addChicken as supabaseAddChicken,
  addFeedStock as supabaseAddFeedStock,
  updateFeedStock as supabaseUpdateFeedStock,
  resolveHealthAlert as supabaseResolveHealthAlert
} from '../services/supabaseApi';

import { generateReport as generateReportService, getReports as getReportsService } from './reportsService';

// Determines whether to use mock data or real data
const useSupabase = true;

// Chickens
export const getChickens = useSupabase ? getSupabaseChickens : getMockChickens;
export const addChicken = useSupabase ? supabaseAddChicken : mockAddChicken;

// Coops
export const getCoops = useSupabase ? getSupabaseCoops : getMockCoops;

// Cages
export const getCages = useSupabase ? getSupabaseCages : getMockCages;
export const addCage = useSupabase ? supabaseAddCage : mockAddCage;

// Egg Production
export const getEggProductionData = useSupabase ? getSupabaseEggProductionData : getMockEggProductionData;

// Health Alerts
export const getHealthAlerts = useSupabase ? getSupabaseHealthAlerts : getMockHealthAlerts;
export const getRecentHealthAlerts = getHealthAlerts;
export const resolveHealthAlert = useSupabase ? supabaseResolveHealthAlert : mockResolveHealthAlert;

// Feed Inventory
export const getFeedInventory = useSupabase ? getSupabaseFeedInventory : getMockFeedInventory;
export const addFeedStock = useSupabase ? supabaseAddFeedStock : mockAddFeedStock;
export const updateFeedStock = useSupabase ? supabaseUpdateFeedStock : mockUpdateFeedStock;

// Dashboard Stats
export const getDashboardStats = useSupabase ? getSupabaseDashboardStats : getMockDashboardStats;

// Egg Collection
export const getEggCollectionRecords = useSupabase ? getSupabaseEggCollectionRecords : getMockEggCollectionRecords;
export const addEggCollectionRecord = useSupabase ? supabaseAddEggCollectionRecord : mockAddEggCollectionRecord;

// Credit tracking
export const getCreditSalesSummary = useSupabase ? getSupabaseCreditSalesSummary : () => Promise.resolve({
  totalOutstanding: 0,
  overdueAmount: 0,
  pendingAmount: 0,
  buyerBreakdown: {},
  timeBasedAnalysis: { daily: {}, weekly: {}, monthly: {} }
});

export const updateEggCollectionPaymentStatus = useSupabase 
  ? supabaseUpdateEggCollectionPaymentStatus 
  : (recordId: string, status: 'paid' | 'pending' | 'overdue') => Promise.resolve({ success: true, message: 'Mock update successful' });

// Finances
export const getExpenses = useSupabase ? getSupabaseExpenses : getMockExpenses;
export const getRevenues = useSupabase ? getSupabaseRevenues : getMockRevenues;
export const addExpense = useSupabase ? supabaseAddExpense : mockAddExpense;
export const addRevenue = useSupabase ? supabaseAddRevenue : mockAddRevenue;
export const deleteExpense = useSupabase ? supabaseDeleteExpense : mockDeleteExpense;
export const deleteRevenue = useSupabase ? supabaseDeleteRevenue : mockDeleteRevenue;

// Reports
export const generateReport = useSupabase ? generateReportService : mockGenerateReport;
export const getReports = useSupabase ? getReportsService : getMockReports;
