import { supabase } from '@/lib/supabase';
import { 
  DashboardStats, 
  CoopData, 
  User, 
  HealthAlert, 
  EggProductionData, 
  FeedInventoryItem, 
  ChickenData, 
  CageData, 
  EggCollectionRecord,
  Expense,
  Revenue, 
  CreditSale, 
  CreditSalesSummary 
} from '@/types';
import { format, subDays } from 'date-fns';

// Authentication functions
export const getCurrentUser = async (): Promise<User> => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    throw new Error("User not found");
  }
  
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  return {
    id: data.user.id,
    name: userProfile?.name || data.user.email?.split('@')[0] || 'User',
    email: data.user.email || '',
    role: userProfile?.role || 'farm_manager',
    avatarUrl: userProfile?.avatar_url || null
  };
};

export const login = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user) {
    throw new Error("Invalid credentials");
  }

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return {
    id: data.user.id,
    name: userProfile?.name || data.user.email?.split('@')[0] || 'User',
    email: data.user.email || '',
    role: userProfile?.role || 'farm_manager',
    avatarUrl: userProfile?.avatar_url || null
  };
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  return;
};

// Chicken CRUD operations
export const getChickens = async (): Promise<ChickenData[]> => {
  const { data, error } = await supabase
    .from('chickens')
    .select('*');

  if (error) {
    console.error("Error fetching chickens:", error);
    throw error;
  }

  return data.map(chicken => ({
    id: chicken.id,
    name: chicken.name,
    age: chicken.age,
    breed: chicken.breed,
    healthStatus: chicken.health_status,
    coopId: chicken.coop_id,
    lastWeightCheck: chicken.last_weight_check
  }));
};

export const addChicken = async (chickenData: Omit<ChickenData, "id">): Promise<{ success: boolean; message: string }> => {
  const { data, error } = await supabase
    .from('chickens')
    .insert({
      name: chickenData.name,
      age: chickenData.age,
      breed: chickenData.breed,
      health_status: chickenData.healthStatus,
      coop_id: chickenData.coopId,
      last_weight_check: chickenData.lastWeightCheck,
      created_at: new Date().toISOString()
    })
    .select();

  if (error) {
    console.error("Error adding chicken:", error);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Chicken added successfully" };
};

// Coop management
export const getCoops = async (): Promise<CoopData[]> => {
  const { data, error } = await supabase
    .from('coops')
    .select('*');

  if (error) {
    console.error("Error fetching coops:", error);
    throw error;
  }

  return data.map(coop => ({
    id: coop.id,
    name: coop.name,
    capacity: coop.capacity,
    currentOccupancy: coop.current_occupancy,
    temperature: coop.temperature,
    humidity: coop.humidity,
    lastCleaned: coop.last_cleaned
  }));
};

// Cage management
export const getCages = async (): Promise<CageData[]> => {
  const { data, error } = await supabase
    .from('cages')
    .select('*');

  if (error) {
    console.error("Error fetching cages:", error);
    throw error;
  }

  return data.map(cage => ({
    id: cage.id,
    name: cage.name,
    capacity: cage.capacity,
    currentOccupancy: cage.current_occupancy,
    newChickensCount: cage.new_chickens_count,
    oldChickensCount: cage.old_chickens_count
  }));
};

export const addCage = async (cageData: Omit<CageData, "id">): Promise<{ success: boolean; message: string }> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("User not authenticated:", userError);
    return { success: false, message: "User not authenticated" };
  }

  const { data, error } = await supabase
    .from('cages')
    .insert({
      name: cageData.name,
      capacity: cageData.capacity,
      current_occupancy: cageData.currentOccupancy,
      new_chickens_count: cageData.newChickensCount,
      old_chickens_count: cageData.oldChickensCount,
      user_id: userData.user.id,
      created_at: new Date().toISOString()
    })
    .select();

  if (error) {
    console.error("Error adding cage:", error);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Cage added successfully" };
};

// Egg collection
export const getEggCollectionRecords = async (): Promise<EggCollectionRecord[]> => {
  const { data, error } = await supabase
    .from('egg_collection_records')
    .select('*');

  if (error) {
    console.error("Error fetching egg collection records:", error);
    throw error;
  }

  return data.map(record => ({
    id: record.id,
    date: record.date,
    cageId: record.cage_id,
    count: record.count,
    isFromNewChickens: record.is_from_new_chickens,
    notes: record.notes || undefined
  }));
};

export const addEggCollectionRecord = async (record: Omit<EggCollectionRecord, "id">): Promise<{ success: boolean; message: string }> => {
  const { data, error } = await supabase
    .from('egg_collection_records')
    .insert({
      date: record.date,
      cage_id: record.cageId,
      count: record.count,
      is_from_new_chickens: record.isFromNewChickens,
      notes: record.notes || null,
      created_at: new Date().toISOString()
    })
    .select();

  if (error) {
    console.error("Error adding egg collection record:", error);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Egg collection record added successfully" };
};

// Feed inventory
export const getFeedInventory = async (): Promise<FeedInventoryItem[]> => {
  const { data, error } = await supabase
    .from('feed_inventory')
    .select('*');

  if (error) {
    console.error("Error fetching feed inventory:", error);
    throw error;
  }

  return data.map(item => ({
    type: item.type,
    currentStock: item.current_stock,
    dailyConsumption: item.daily_consumption,
    reorderLevel: item.reorder_level,
    costPerKg: item.cost_per_kg
  }));
};

export const addFeedStock = async (feedData: { type: string, amount: number, costPerKg: number }): Promise<{ success: boolean; message: string }> => {
  // First check if this feed type already exists
  const { data: existingFeed, error: fetchError } = await supabase
    .from('feed_inventory')
    .select('*')
    .eq('type', feedData.type)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no results found
    console.error("Error fetching existing feed:", fetchError);
    return { success: false, message: fetchError.message };
  }

  if (existingFeed) {
    // Update existing feed
    const { error: updateError } = await supabase
      .from('feed_inventory')
      .update({
        current_stock: existingFeed.current_stock + feedData.amount,
        cost_per_kg: feedData.costPerKg
      })
      .eq('id', existingFeed.id);

    if (updateError) {
      console.error("Error updating feed:", updateError);
      return { success: false, message: updateError.message };
    }
  } else {
    // Insert new feed
    const { error: insertError } = await supabase
      .from('feed_inventory')
      .insert({
        type: feedData.type,
        current_stock: feedData.amount,
        daily_consumption: 0, // Default value, can be updated later
        reorder_level: feedData.amount * 0.2, // Default 20% of current amount
        cost_per_kg: feedData.costPerKg,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error("Error inserting feed:", insertError);
      return { success: false, message: insertError.message };
    }
  }

  return { success: true, message: "Feed stock added successfully" };
};

export const updateFeedStock = async (feedType: string, quantity: number): Promise<{ success: boolean; message: string }> => {
  const { data: existingFeed, error: fetchError } = await supabase
    .from('feed_inventory')
    .select('*')
    .eq('type', feedType)
    .single();

  if (fetchError) {
    console.error("Error fetching feed:", fetchError);
    return { success: false, message: fetchError.message };
  }

  const { error: updateError } = await supabase
    .from('feed_inventory')
    .update({
      current_stock: existingFeed.current_stock + quantity
    })
    .eq('id', existingFeed.id);

  if (updateError) {
    console.error("Error updating feed:", updateError);
    return { success: false, message: updateError.message };
  }

  return { success: true, message: "Feed stock updated successfully" };
};

// Health alerts
export const getHealthAlerts = async (showResolved: boolean = false): Promise<HealthAlert[]> => {
  let query = supabase
    .from('health_alerts')
    .select('*');

  if (!showResolved) {
    query = query.eq('resolved', false);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching health alerts:", error);
    throw error;
  }

  return data.map(alert => ({
    id: alert.id,
    date: alert.date,
    chickenId: alert.chicken_id || undefined,
    coopId: alert.coop_id || undefined,
    alertType: alert.alert_type,
    severity: alert.severity,
    description: alert.description,
    resolved: alert.resolved
  }));
};

export const resolveHealthAlert = async (alertId: string): Promise<void> => {
  const { error } = await supabase
    .from('health_alerts')
    .update({ resolved: true })
    .eq('id', alertId);

  if (error) {
    console.error("Error resolving health alert:", error);
    throw error;
  }
};

// Dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Get today's date and format it
  const today = new Date();
  const todayFormatted = format(today, 'yyyy-MM-dd');
  
  // Get egg collection for today
  const { data: todayEggs, error: eggsError } = await supabase
    .from('egg_collection_records')
    .select('count')
    .gte('date', `${todayFormatted}T00:00:00Z`)
    .lte('date', `${todayFormatted}T23:59:59Z`);

  if (eggsError) {
    console.error("Error fetching today's eggs:", eggsError);
  }

  // Get weekly egg average
  const weekAgo = format(subDays(today, 7), 'yyyy-MM-dd');
  const { data: weeklyEggs, error: weeklyError } = await supabase
    .from('egg_collection_records')
    .select('count, date')
    .gte('date', `${weekAgo}T00:00:00Z`)
    .lte('date', `${todayFormatted}T23:59:59Z`);

  if (weeklyError) {
    console.error("Error fetching weekly eggs:", weeklyError);
  }

  // Get healthy chickens count
  const { data: chickens, error: chickensError } = await supabase
    .from('chickens')
    .select('health_status');

  if (chickensError) {
    console.error("Error fetching chickens:", chickensError);
  }

  // Calculate statistics
  const todayEggCount = todayEggs ? todayEggs.reduce((sum, record) => sum + record.count, 0) : 0;
  
  // Group weekly eggs by day and calculate average
  const weeklyEggsByDay: Record<string, number> = {};
  if (weeklyEggs) {
    weeklyEggs.forEach(record => {
      const day = record.date.substring(0, 10);
      weeklyEggsByDay[day] = (weeklyEggsByDay[day] || 0) + record.count;
    });
  }
  const weeklyEggAverage = Object.keys(weeklyEggsByDay).length > 0
    ? Math.round(Object.values(weeklyEggsByDay).reduce((sum, count) => sum + count, 0) / Object.keys(weeklyEggsByDay).length)
    : 0;

  // Calculate chicken health statistics
  const healthyChickensCount = chickens
    ? chickens.filter(c => c.health_status === 'healthy').length
    : 0;
  const healthyChickensPercentage = chickens && chickens.length > 0
    ? (healthyChickensCount / chickens.length) * 100
    : 0;

  // For now, use some default values for other stats that would require more complex calculations
  return {
    todayEggCount,
    weeklyEggAverage,
    healthyChickensCount,
    healthyChickensPercentage,
    waterConsumptionLiters: 65, // Default value
    feedCostWeekly: 280.50,    // Default value
    eggProductionTrend: 5,     // Default value
    healthyChickensTrend: -2,  // Default value
    waterConsumptionTrend: 3,  // Default value
    feedCostTrend: 1.2         // Default value
  };
};

// Egg production data
export const getEggProductionData = async (timeRange: "week" | "month" | "year"): Promise<EggProductionData[]> => {
  const today = new Date();
  let startDate: string;
  
  if (timeRange === "week") {
    startDate = format(subDays(today, 7), 'yyyy-MM-dd');
  } else if (timeRange === "month") {
    startDate = format(subDays(today, 30), 'yyyy-MM-dd');
  } else {
    startDate = format(subDays(today, 365), 'yyyy-MM-dd');
  }
  
  const endDate = format(today, 'yyyy-MM-dd');
  
  // Get egg collection records for the period
  const { data: records, error } = await supabase
    .from('egg_collection_records')
    .select('date, count, cage_id')
    .gte('date', `${startDate}T00:00:00Z`)
    .lte('date', `${endDate}T23:59:59Z`);
  
  if (error) {
    console.error("Error fetching egg production data:", error);
    throw error;
  }
  
  // Get cages to map to coops
  const { data: cages, error: cagesError } = await supabase
    .from('cages')
    .select('id, name');
    
  if (cagesError) {
    console.error("Error fetching cages:", cagesError);
    throw cagesError;
  }
  
  // Group records by date
  const recordsByDate: Record<string, { total: number, damaged: number, cages: Record<string, number> }> = {};
  
  records.forEach(record => {
    const date = record.date.substring(0, 10); // Get YYYY-MM-DD part
    
    if (!recordsByDate[date]) {
      recordsByDate[date] = { total: 0, damaged: 0, cages: {} };
    }
    
    recordsByDate[date].total += record.count;
    recordsByDate[date].cages[record.cage_id] = (recordsByDate[date].cages[record.cage_id] || 0) + record.count;
  });
  
  // Convert to EggProductionData array
  const productionData: EggProductionData[] = Object.keys(recordsByDate).map(date => {
    const data = recordsByDate[date];
    
    // For simplicity, estimate damaged eggs as about 2%
    const damaged = Math.round(data.total * 0.02);
    
    return {
      date: `${date}T00:00:00Z`,
      total: data.total,
      damaged,
      coopBreakdown: data.cages
    };
  });
  
  // Sort by date ascending
  productionData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return productionData;
};

// Expense management
export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }

  return data.map(expense => ({
    id: expense.id,
    userId: expense.user_id,
    amount: expense.amount,
    description: expense.description,
    category: expense.category,
    date: expense.date,
    createdAt: expense.created_at,
    updatedAt: expense.updated_at
  }));
};

export const addExpense = async (expenseData: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">): Promise<{ success: boolean; message: string }> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("User not authenticated:", userError);
    return { success: false, message: "User not authenticated" };
  }

  const { error } = await supabase
    .from('expenses')
    .insert({
      user_id: userData.user.id,
      amount: expenseData.amount,
      description: expenseData.description,
      category: expenseData.category,
      date: expenseData.date
    });

  if (error) {
    console.error("Error adding expense:", error);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Expense added successfully" };
};

export const deleteExpense = async (expenseId: string): Promise<{ success: boolean; message: string }> => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId);

  if (error) {
    console.error("Error deleting expense:", error);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Expense deleted successfully" };
};

// Revenue management
export const getRevenues = async (): Promise<Revenue[]> => {
  const { data, error } = await supabase
    .from('revenues')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching revenues:", error);
    throw error;
  }

  return data.map(revenue => ({
    id: revenue.id,
    userId: revenue.user_id,
    amount: revenue.amount,
    description: revenue.description,
    category: revenue.category,
    date: revenue.date,
    createdAt: revenue.created_at,
    updatedAt: revenue.updated_at
  }));
};

export const addRevenue = async (revenueData: Omit<Revenue, "id" | "userId" | "createdAt" | "updatedAt">): Promise<{ success: boolean; message: string }> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("User not authenticated:", userError);
    return { success: false, message: "User not authenticated" };
  }

  const { error } = await supabase
    .from('revenues')
    .insert({
      user_id: userData.user.id,
      amount: revenueData.amount,
      description: revenueData.description,
      category: revenueData.category,
      date: revenueData.date
    });

  if (error) {
    console.error("Error adding revenue:", error);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Revenue added successfully" };
};

export const deleteRevenue = async (revenueId: string): Promise<{ success: boolean; message: string }> => {
  const { error } = await supabase
    .from('revenues')
    .delete()
    .eq('id', revenueId);

  if (error) {
    console.error("Error deleting revenue:", error);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Revenue deleted successfully" };
};

// Credit Sales functions
export const getCreditSales = async (): Promise<CreditSale[]> => {
  const { data, error } = await supabase
    .from('credit_sales')
    .select('*')
    .order('payment_due', { ascending: false });

  if (error) {
    console.error("Error fetching credit sales:", error);
    throw error;
  }

  return data.map(sale => ({
    id: sale.id,
    eggCollectionId: sale.egg_collection_id,
    buyerName: sale.buyer_name,
    amount: sale.amount,
    quantity: sale.quantity,
    soldAs: sale.sold_as,
    paymentDue: sale.payment_due,
    paymentStatus: sale.payment_status,
    createdAt: sale.created_at,
    updatedAt: sale.updated_at
  }));
};

export const updateEggCollectionPaymentStatus = async (
  recordId: string, 
  paymentStatus: 'paid' | 'pending' | 'overdue'
): Promise<{ success: boolean; message: string }> => {
  const { error } = await supabase
    .from('egg_collection_records')
    .update({ payment_status: paymentStatus })
    .eq('id', recordId);

  if (error) {
    console.error("Error updating payment status:", error);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Payment status updated successfully" };
};

export const getCreditSalesSummary = async (): Promise<CreditSalesSummary> => {
  const { data: eggRecords, error } = await supabase
    .from('egg_collection_records')
    .select('*')
    .not('payment_status', 'eq', 'paid')
    .not('buyer_name', 'is', null);

  if (error) {
    console.error("Error fetching credit sales summary:", error);
    throw error;
  }

  const buyerBreakdown: Record<string, { total: number, pending: number, overdue: number, lastPaymentDue: string }> = {};
  let totalOutstanding = 0;
  let pendingAmount = 0;
  let overdueAmount = 0;

  const timeBasedAnalysis = {
    daily: {} as Record<string, number>,
    weekly: {} as Record<string, number>,
    monthly: {} as Record<string, number>
  };

  eggRecords.forEach(record => {
    if (!record.buyer_name || !record.price_per_unit || !record.sold) return;

    const amount = record.price_per_unit * record.sold;
    const today = new Date();
    const dueDate = new Date(record.payment_due);
    const isOverdue = dueDate < today && record.payment_status !== 'paid';
    
    // Update buyer breakdown
    if (!buyerBreakdown[record.buyer_name]) {
      buyerBreakdown[record.buyer_name] = {
        total: 0,
        pending: 0,
        overdue: 0,
        lastPaymentDue: record.payment_due
      };
    }

    buyerBreakdown[record.buyer_name].total += amount;

    if (isOverdue) {
      buyerBreakdown[record.buyer_name].overdue += amount;
      overdueAmount += amount;
    } else if (record.payment_status === 'pending') {
      buyerBreakdown[record.buyer_name].pending += amount;
      pendingAmount += amount;
    }

    // Update total outstanding
    if (record.payment_status !== 'paid') {
      totalOutstanding += amount;
    }

    // Time-based analysis
    const dateStr = record.date.substring(0, 10);
    const month = dateStr.substring(0, 7);
    const week = getWeekNumber(new Date(record.date));

    // Daily
    if (!timeBasedAnalysis.daily[dateStr]) {
      timeBasedAnalysis.daily[dateStr] = 0;
    }
    timeBasedAnalysis.daily[dateStr] += amount;

    // Weekly
    if (!timeBasedAnalysis.weekly[week]) {
      timeBasedAnalysis.weekly[week] = 0;
    }
    timeBasedAnalysis.weekly[week] += amount;

    // Monthly
    if (!timeBasedAnalysis.monthly[month]) {
      timeBasedAnalysis.monthly[month] = 0;
    }
    timeBasedAnalysis.monthly[month] += amount;

    // Update buyer's last payment due date if the current one is later
    if (new Date(record.payment_due) > new Date(buyerBreakdown[record.buyer_name].lastPaymentDue)) {
      buyerBreakdown[record.buyer_name].lastPaymentDue = record.payment_due;
    }
  });

  return {
    totalOutstanding,
    overdueAmount,
    pendingAmount,
    buyerBreakdown,
    timeBasedAnalysis
  };
};

// Helper function to get week number
function getWeekNumber(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
}
