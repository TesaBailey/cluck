import { supabase } from "@/lib/supabase";
import { EggProductionData, EggProductionReport, EggCollectionRecord } from "@/types";
import { format, parseISO } from "date-fns";

// Constants for price calculations
const SINGLE_EGG_PRICE = 0.50; // Price per single egg
const CRATE_SIZE = 30; // Number of eggs in a crate
const CRATE_PRICE = 13.00; // Price per crate of eggs

export async function generateEggProductionReport(startDate: Date, endDate: Date): Promise<EggProductionReport | null> {
  try {
    // Use the correct client from integrations and properly type it
    const { data: eggData, error } = await supabase
      .from('egg_collection_records')
      .select('*')
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'));

    if (error) throw error;
    
    if (!eggData || eggData.length === 0) {
      return {
        totalEggs: 0,
        dailyAverage: 0,
        damagedCount: 0,
        damagedPercentage: 0,
        spoiledCount: 0,
        spoiledPercentage: 0,
        soldCount: 0,
        soldSingles: 0,
        soldCrates: 0,
        leftoverCount: 0,
        potentialIncome: 0,
        actualIncome: 0,
        lostIncomeFromDamaged: 0,
        profit: 0,
        byDate: [],
        byCage: {},
        byChickenAge: {
          new: { total: 0, damaged: 0, sold: 0, income: 0 },
          old: { total: 0, damaged: 0, sold: 0, income: 0 }
        }
      };
    }

    // Get feed costs for the same period for profit calculation
    const { data: feedData, error: feedError } = await supabase
      .from('expenses')
      .select('*')
      .eq('category', 'feed')
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'));
      
    if (feedError) console.error("Error fetching feed expenses:", feedError);
    
    // Calculate total feed costs for this period
    const feedCost = feedData ? feedData.reduce((sum, expense) => sum + Number(expense.amount), 0) : 0;

    // Group by date with proper typing
    const byDate = eggData.reduce((acc: Record<string, EggProductionData>, curr: any) => {
      const date = curr.date;
      if (!acc[date]) {
        acc[date] = {
          date,
          total: 0,
          damaged: 0,
          spoiled: 0,
          sold: 0,
          leftover: 0
        };
      }
      
      const count = curr.count || 0;
      const damaged = curr.damaged || 0;
      const spoiled = curr.spoiled || 0;
      const sold = curr.sold || 0;
      
      acc[date].total += count;
      acc[date].damaged += damaged;
      acc[date].spoiled += spoiled;
      acc[date].sold += sold;
      acc[date].leftover += (count - damaged - spoiled - sold);
      
      return acc;
    }, {});

    // Group by cage
    const byCage = eggData.reduce((acc: Record<string, any>, curr: any) => {
      const cageId = curr.cage_id;
      if (!acc[cageId]) {
        acc[cageId] = {
          total: 0,
          newChickens: 0,
          oldChickens: 0,
          damaged: 0
        };
      }
      
      const count = curr.count || 0;
      const damaged = curr.damaged || 0;
      
      acc[cageId].total += count;
      acc[cageId].damaged += damaged;
      
      if (curr.is_from_new_chickens) {
        acc[cageId].newChickens += count;
      } else {
        acc[cageId].oldChickens += count;
      }
      
      return acc;
    }, {});

    // Group by chicken age (new vs old)
    const byChickenAge = eggData.reduce((acc: any, curr: any) => {
      const isNew = curr.is_from_new_chickens;
      const category = isNew ? 'new' : 'old';
      const count = curr.count || 0;
      const damaged = curr.damaged || 0;
      const sold = curr.sold || 0;
      
      // Calculate income based on whether sold as singles or crates
      let income = 0;
      if (curr.soldAs === 'crate' || curr.sold_as === 'crate') {
        // Calculate number of complete crates
        const crates = Math.floor(sold / CRATE_SIZE);
        const singles = sold % CRATE_SIZE;
        income = (crates * CRATE_PRICE) + (singles * SINGLE_EGG_PRICE);
      } else {
        // Sold as singles
        income = sold * SINGLE_EGG_PRICE;
      }
      
      acc[category].total += count;
      acc[category].damaged += damaged;
      acc[category].sold += sold;
      acc[category].income += income;
      
      return acc;
    }, {
      new: { total: 0, damaged: 0, sold: 0, income: 0 },
      old: { total: 0, damaged: 0, sold: 0, income: 0 }
    });

    const dailyData: EggProductionData[] = Object.values(byDate);
    
    // Calculate main statistics
    const totalEggs = dailyData.reduce((sum, day) => sum + day.total, 0);
    const damagedCount = dailyData.reduce((sum, day) => sum + (day.damaged || 0), 0);
    const spoiledCount = dailyData.reduce((sum, day) => sum + (day.spoiled || 0), 0);
    const soldCount = dailyData.reduce((sum, day) => sum + (day.sold || 0), 0);
    const leftoverCount = dailyData.reduce((sum, day) => sum + (day.leftover || 0), 0);
    const dayCount = dailyData.length || 1;

    // Calculate single eggs vs crates sold
    const singlesSold = eggData
      .filter((record: any) => (record.soldAs === 'single' || record.sold_as === 'single'))
      .reduce((sum: number, record: any) => sum + (record.sold || 0), 0);
      
    const cratesSold = eggData
      .filter((record: any) => (record.soldAs === 'crate' || record.sold_as === 'crate'))
      .reduce((sum: number, record: any) => sum + (record.sold || 0), 0);

    // Calculate financial metrics
    const potentialIncome = totalEggs * SINGLE_EGG_PRICE;  // If all eggs were sold as singles
    const actualIncome = byChickenAge.new.income + byChickenAge.old.income;
    const lostIncomeFromDamaged = (damagedCount + spoiledCount) * SINGLE_EGG_PRICE;
    const profit = actualIncome - feedCost;
    
    return {
      totalEggs,
      dailyAverage: totalEggs / dayCount,
      damagedCount,
      damagedPercentage: totalEggs > 0 ? (damagedCount / totalEggs) * 100 : 0,
      spoiledCount,
      spoiledPercentage: totalEggs > 0 ? (spoiledCount / totalEggs) * 100 : 0,
      soldCount,
      soldSingles: singlesSold,
      soldCrates: Math.floor(cratesSold / CRATE_SIZE),
      leftoverCount,
      potentialIncome,
      actualIncome,
      lostIncomeFromDamaged,
      profit,
      feedCost,
      byDate: dailyData,
      byCage,
      byChickenAge
    };
  } catch (error) {
    console.error("Error generating egg production report:", error);
    return null;
  }
}