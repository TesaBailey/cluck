
import Navbar from "@/components/Navbar";
import StatCard from "@/components/Dashboard/StatCard";
import EggProductionChart from "@/components/Dashboard/EggProductionChart";
import HealthStatus from "@/components/Dashboard/HealthStatus";
import FeedInventory from "@/components/Dashboard/FeedInventory";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/api";
import { Egg, Activity, Droplets, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-farm-green mb-4" />
          <p className="text-farm-brown-dark">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="text-red-500 mb-4">Failed to load dashboard data</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      {/* Main content */}
      <div className="md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-farm-brown-dark">Farm Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || 'Farmer'}! Here's your farm overview.
            </p>
          </header>
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard
              title="Today's Egg Count"
              value={stats.todayEggCount}
              icon={<Egg className="h-5 w-5" />}
              trend={{ value: stats.eggProductionTrend, isPositive: stats.eggProductionTrend > 0 }}
              valueClassName="text-farm-straw-dark"
            />
            <StatCard
              title="Healthy Chickens"
              value={`${stats.healthyChickensCount}/200`}
              icon={<Activity className="h-5 w-5" />}
              trend={{ value: stats.healthyChickensTrend, isPositive: stats.healthyChickensTrend > 0 }}
              valueClassName="text-farm-green"
            />
            <StatCard
              title="Avg. Daily Water"
              value={`${stats.waterConsumptionLiters}L`}
              icon={<Droplets className="h-5 w-5" />}
              trend={{ value: Math.abs(stats.waterConsumptionTrend), isPositive: stats.waterConsumptionTrend > 0 }}
              valueClassName="text-blue-600"
            />
            <StatCard
              title="Weekly Feed Cost"
              value={`$${stats.feedCostWeekly.toFixed(2)}`}
              icon={<DollarSign className="h-5 w-5" />}
              trend={{ value: Math.abs(stats.feedCostTrend), isPositive: stats.feedCostTrend > 0 }}
              valueClassName="text-farm-brown"
            />
          </div>
          
          {/* Charts & Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 space-y-6">
              <EggProductionChart />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md border border-farm-brown/10">
                  <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="default" 
                      className="w-full bg-farm-green text-white text-left justify-start hover:bg-farm-green-dark"
                      asChild
                    >
                      <Link to="/reports">Record Today's Egg Collection</Link>
                    </Button>
                    <Button 
                      variant="default" 
                      className="w-full bg-farm-straw text-farm-brown-dark text-left justify-start hover:bg-farm-straw-dark"
                      asChild
                    >
                      <Link to="/coops">Schedule Coop Cleaning</Link>
                    </Button>
                    <Button 
                      variant="default" 
                      className="w-full bg-farm-brown text-white text-left justify-start hover:bg-farm-brown-dark"
                      asChild
                    >
                      <Link to="/inventory">Order More Feed</Link>
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md border border-farm-brown/10">
                  <h3 className="text-lg font-semibold mb-3">Weekly Overview</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Average Eggs/Day</p>
                      <p className="text-xl font-bold">{stats.weeklyEggAverage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Eggs/Chicken Ratio</p>
                      <p className="text-xl font-bold">{(stats.weeklyEggAverage / 200).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Feed Efficiency</p>
                      <p className="text-xl font-bold">${(stats.feedCostWeekly / (stats.weeklyEggAverage * 7)).toFixed(3)}/egg</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <HealthStatus />
              <FeedInventory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
