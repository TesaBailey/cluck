
import { 
  ChickenData, 
  CoopData, 
  CageData, 
  EggProductionData,
  HealthAlert, 
  FeedInventoryItem,
  DashboardStats,
  EggCollectionRecord,
  Expense,
  Revenue,
  Report,
  ReportGenerationOptions,
  ReportType
} from '@/types';
import { format, subDays } from 'date-fns';

// Generate dates for the last 30 days
const generateDates = (days: number) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const dates = generateDates(30);

// Mock egg production data for the last 30 days
export const mockEggProduction: EggProductionData[] = dates.map((date) => {
  // Create some variation in the egg count
  const baseCount = 160;
  const randomVariation = Math.floor(Math.random() * 25) - 10; // -10 to +15
  const total = baseCount + randomVariation;
  
  return {
    date,
    total,
    damaged: Math.floor(total * 0.05), // 5% damaged eggs
    coopBreakdown: {
      "coop-1": Math.floor(total * 0.3),
      "coop-2": Math.floor(total * 0.4),
      "coop-3": Math.floor(total * 0.3),
    },
  };
});

// Mock feed data
export const mockFeedData: FeedInventoryItem[] = [
  {
    type: "Layer Feed",
    currentStock: 250,
    dailyConsumption: 15,
    reorderLevel: 50,
    costPerKg: 0.42,
  },
  {
    type: "Calcium Supplement",
    currentStock: 25,
    dailyConsumption: 1,
    reorderLevel: 10,
    costPerKg: 0.65,
  },
  {
    type: "Poultry Grit",
    currentStock: 40,
    dailyConsumption: 0.8,
    reorderLevel: 15,
    costPerKg: 0.30,
  },
];

// Mock coop data
export const mockCoopData: CoopData[] = [
  {
    id: "coop-1",
    name: "North Coop",
    capacity: 80,
    currentOccupancy: 72,
    temperature: 24.5,
    humidity: 65,
    lastCleaned: dates[3],
  },
  {
    id: "coop-2",
    name: "South Coop",
    capacity: 80,
    currentOccupancy: 78,
    temperature: 25.2,
    humidity: 62,
    lastCleaned: dates[1],
  },
  {
    id: "coop-3",
    name: "West Coop",
    capacity: 60,
    currentOccupancy: 50,
    temperature: 23.8,
    humidity: 67,
    lastCleaned: dates[5],
  },
];

// Mock health alert data
export const mockHealthAlerts: HealthAlert[] = [
  {
    id: "alert-1",
    date: dates[2],
    coopId: "coop-1",
    alertType: "temperature",
    severity: "medium",
    description: "Temperature spike detected in North Coop",
    resolved: true,
  },
  {
    id: "alert-2",
    date: dates[0],
    chickenId: "chicken-42",
    alertType: "behavior",
    severity: "high",
    description: "Unusual behavior detected in chicken #42",
    resolved: false,
  },
  {
    id: "alert-3",
    date: dates[1],
    coopId: "coop-3",
    alertType: "disease",
    severity: "high",
    description: "Potential respiratory issue in West Coop",
    resolved: false,
  },
];

// Get today's stats
export const getTodayStats = () => {
  const today = mockEggProduction[mockEggProduction.length - 1];
  
  return {
    eggCount: today.total,
    damagedEggs: today.damaged,
    healthyChickens: 194,
    sickChickens: 6,
  };
};

// Get weekly averages
export const getWeeklyStats = () => {
  const lastWeek = mockEggProduction.slice(-7);
  const totalEggs = lastWeek.reduce((sum, day) => sum + day.total, 0);
  const avgEggs = Math.round(totalEggs / 7);
  
  return {
    avgEggsPerDay: avgEggs,
    feedCost: 94.50,
    waterConsumption: 210, // liters
  };
};

// Add necessary mock functions to the existing mockData.ts file

// Mock chickens data
const mockChickensData: ChickenData[] = [
  {
    id: "chicken-1",
    name: "Hennifer",
    age: 12,
    breed: "Rhode Island Red",
    healthStatus: "healthy",
    coopId: "coop-1",
    lastWeightCheck: 1800
  },
  {
    id: "chicken-2",
    name: "Clucky",
    age: 8,
    breed: "Leghorn",
    healthStatus: "healthy",
    coopId: "coop-2",
    lastWeightCheck: 1600
  }
];

// Mock cages data
const mockCagesData: CageData[] = [
  {
    id: "cage-A",
    name: "A",
    capacity: 10,
    currentOccupancy: 8,
    newChickensCount: 5,
    oldChickensCount: 3
  },
  {
    id: "cage-B",
    name: "B",
    capacity: 10,
    currentOccupancy: 6,
    newChickensCount: 2,
    oldChickensCount: 4
  }
];

// Mock egg collection records
const mockEggCollectionRecords: EggCollectionRecord[] = [
  {
    id: "record-1",
    date: dates[0],
    cageId: "cage-A",
    count: 8,
    isFromNewChickens: true,
    damaged: 1,
    sold: 7,
    soldAs: "single",
    pricePerUnit: 0.5,
    paymentStatus: "paid",
    buyerName: "Local Market"
  },
  {
    id: "record-2",
    date: dates[1],
    cageId: "cage-B",
    count: 6,
    isFromNewChickens: false,
    damaged: 0,
    sold: 6,
    soldAs: "crate",
    pricePerUnit: 15,
    paymentDue: dates[10],
    paymentStatus: "pending",
    buyerName: "Restaurant Supplier"
  }
];

// Mock expenses
const mockExpensesData: Expense[] = [
  {
    id: "exp-1",
    userId: "user-1",
    amount: 200,
    description: "Feed purchase",
    category: "Feed",
    date: dates[3],
    createdAt: dates[3] + "T10:00:00Z",
    updatedAt: dates[3] + "T10:00:00Z"
  },
  {
    id: "exp-2",
    userId: "user-1",
    amount: 50,
    description: "Medicine for chickens",
    category: "Health",
    date: dates[5],
    createdAt: dates[5] + "T14:30:00Z",
    updatedAt: dates[5] + "T14:30:00Z"
  }
];

// Mock revenues
const mockRevenuesData: Revenue[] = [
  {
    id: "rev-1",
    userId: "user-1",
    amount: 300,
    description: "Egg sales",
    category: "Sales",
    date: dates[2],
    createdAt: dates[2] + "T09:15:00Z",
    updatedAt: dates[2] + "T09:15:00Z"
  },
  {
    id: "rev-2",
    userId: "user-1",
    amount: 150,
    description: "Chicken sales",
    category: "Sales",
    date: dates[4],
    createdAt: dates[4] + "T16:45:00Z",
    updatedAt: dates[4] + "T16:45:00Z"
  }
];

// Mock dashboard stats
const mockDashboardStats: DashboardStats = {
  todayEggCount: 155,
  weeklyEggAverage: 148,
  healthyChickensCount: 195,
  healthyChickensPercentage: 97.5,
  waterConsumptionLiters: 210,
  feedCostWeekly: 94.5,
  eggProductionTrend: 3.2,
  healthyChickensTrend: -0.5,
  waterConsumptionTrend: 1.8,
  feedCostTrend: 0.7
};

// Mock functions

export const addChicken = async (chickenData: Omit<ChickenData, "id">): Promise<{ success: boolean; message: string }> => {
  console.log('Mock addChicken called with:', chickenData);
  return { success: true, message: 'Mock chicken added successfully' };
};

export const addFeedStock = async (feedData: { type: string, amount: number, costPerKg: number }): Promise<{ success: boolean; message: string }> => {
  console.log('Mock addFeedStock called with:', feedData);
  return { success: true, message: 'Mock feed stock added successfully' };
};

export const updateFeedStock = async (feedType: string, quantity: number): Promise<{ success: boolean; message: string }> => {
  console.log('Mock updateFeedStock called with:', feedType, quantity);
  return { success: true, message: 'Mock feed stock updated successfully' };
};

export const getHealthAlerts = async (showResolved: boolean = false): Promise<HealthAlert[]> => {
  const alerts: HealthAlert[] = [
    {
      id: 'alert1',
      date: new Date().toISOString(),
      coopId: 'coop1',
      alertType: 'temperature',
      severity: 'high',
      description: 'Temperature too high in Coop A',
      resolved: false
    },
    {
      id: 'alert2',
      date: subDays(new Date(), 1).toISOString(),
      chickenId: 'chicken1',
      alertType: 'behavior',
      severity: 'medium',
      description: 'Chicken showing unusual behavior',
      resolved: false
    },
    {
      id: 'alert3',
      date: subDays(new Date(), 2).toISOString(),
      coopId: 'coop2',
      alertType: 'water',
      severity: 'low',
      description: 'Water level low in Coop B',
      resolved: true
    }
  ];

  return showResolved ? alerts : alerts.filter(alert => !alert.resolved);
};

export const resolveHealthAlert = async (alertId: string): Promise<void> => {
  console.log('Mock resolveHealthAlert called with:', alertId);
  return;
};

export const getChickens = async (): Promise<ChickenData[]> => {
  return mockChickensData;
};

export const getCoops = async (): Promise<CoopData[]> => {
  return mockCoopData;
};

export const getCages = async (): Promise<CageData[]> => {
  return mockCagesData;
};

export const getEggProductionData = async (): Promise<EggProductionData[]> => {
  return mockEggProduction;
};

export const getFeedInventory = async (): Promise<FeedInventoryItem[]> => {
  return mockFeedData;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  return mockDashboardStats;
};

export const getEggCollectionRecords = async (): Promise<EggCollectionRecord[]> => {
  return mockEggCollectionRecords;
};

export const addEggCollectionRecord = async (record: Omit<EggCollectionRecord, "id">): Promise<{ success: boolean; message: string }> => {
  console.log('Mock addEggCollectionRecord called with:', record);
  return { success: true, message: 'Mock record added successfully' };
};

export const addCage = async (cage: Omit<CageData, "id">): Promise<{ success: boolean; message: string; id: string }> => {
  console.log('Mock addCage called with:', cage);
  return { success: true, message: 'Mock cage added successfully', id: 'new-cage-id' };
};

export const getExpenses = async (): Promise<Expense[]> => {
  return mockExpensesData;
};

export const getRevenues = async (): Promise<Revenue[]> => {
  return mockRevenuesData;
};

export const addExpense = async (expense: Omit<Expense, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; message: string }> => {
  console.log('Mock addExpense called with:', expense);
  return { success: true, message: 'Mock expense added successfully' };
};

export const addRevenue = async (revenue: Omit<Revenue, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; message: string }> => {
  console.log('Mock addRevenue called with:', revenue);
  return { success: true, message: 'Mock revenue added successfully' };
};

export const deleteExpense = async (id: string): Promise<{ success: boolean; message: string }> => {
  console.log('Mock deleteExpense called with:', id);
  return { success: true, message: 'Mock expense deleted successfully' };
};

export const deleteRevenue = async (id: string): Promise<{ success: boolean; message: string }> => {
  console.log('Mock deleteRevenue called with:', id);
  return { success: true, message: 'Mock revenue deleted successfully' };
};

export const generateReport = async (options: ReportGenerationOptions): Promise<Report | null> => {
  console.log('Mock generateReport called with:', options);
  return {
    id: 'mock-report-1',
    title: `Mock ${options.type} Report`,
    type: options.type,
    date: format(new Date(), 'yyyy-MM-dd'),
    data: { message: 'This is mock report data' },
    createdAt: new Date().toISOString()
  };
};

export const getReports = async (): Promise<Report[]> => {
  return [
    {
      id: 'mock-report-1',
      title: 'Mock Egg Production Report',
      type: 'egg-production',
      date: dates[1],
      data: { message: 'This is mock egg production report data' },
      createdAt: dates[1] + 'T12:00:00Z'
    },
    {
      id: 'mock-report-2',
      title: 'Mock Financial Report',
      type: 'finances',
      date: dates[3],
      data: { message: 'This is mock financial report data' },
      createdAt: dates[3] + 'T14:30:00Z'
    }
  ];
};
