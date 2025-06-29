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

import { generateReport as generateReportService, getReports as getReportsService } from './reportsService';

// For now, we'll use mock data until Supabase is configured
const useSupabase = false;

// Chickens
export const getChickens = getMockChickens;
export const addChicken = mockAddChicken;

// Coops
export const getCoops = getMockCoops;

// Cages
export const getCages = getMockCages;
export const addCage = mockAddCage;

// Egg Production
export const getEggProductionData = getMockEggProductionData;

// Health Alerts
export const getHealthAlerts = getMockHealthAlerts;
export const getRecentHealthAlerts = getHealthAlerts;
export const resolveHealthAlert = mockResolveHealthAlert;

// Feed Inventory
export const getFeedInventory = getMockFeedInventory;
export const addFeedStock = mockAddFeedStock;
export const updateFeedStock = mockUpdateFeedStock;

// Dashboard Stats
export const getDashboardStats = getMockDashboardStats;

// Egg Collection
export const getEggCollectionRecords = getMockEggCollectionRecords;
export const addEggCollectionRecord = mockAddEggCollectionRecord;

// Credit tracking
export const getCreditSalesSummary = () => Promise.resolve({
  totalOutstanding: 0,
  overdueAmount: 0,
  pendingAmount: 0,
  buyerBreakdown: {},
  timeBasedAnalysis: { daily: {}, weekly: {}, monthly: {} }
});

export const updateEggCollectionPaymentStatus = (recordId: string, status: 'paid' | 'pending' | 'overdue') => 
  Promise.resolve({ success: true, message: 'Mock update successful' });

// Finances
export const getExpenses = getMockExpenses;
export const getRevenues = getMockRevenues;
export const addExpense = mockAddExpense;
export const addRevenue = mockAddRevenue;
export const deleteExpense = mockDeleteExpense;
export const deleteRevenue = mockDeleteRevenue;

// Reports
export const generateReport = mockGenerateReport;
export const getReports = getMockReports;