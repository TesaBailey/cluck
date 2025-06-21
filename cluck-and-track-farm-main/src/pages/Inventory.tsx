
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFeedInventory, addFeedStock } from "@/services/api";
import { Loader2, Plus, PackageOpen, ShoppingCart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import OrderFeedDialog from "@/components/inventory/OrderFeedDialog";
import { FeedInventoryItem } from "@/types";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addFeedOpen, setAddFeedOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<FeedInventoryItem | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [newFeed, setNewFeed] = useState({
    type: "",
    amount: 0,
    costPerKg: 0
  });
  
  const { data: feedInventory, isLoading, error } = useQuery({
    queryKey: ['feedInventory'],
    queryFn: getFeedInventory,
  });
  
  const addFeedMutation = useMutation({
    mutationFn: addFeedStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedInventory'] });
      toast({
        title: "Success",
        description: `Added ${newFeed.amount}kg of ${newFeed.type} feed to inventory`,
      });
      setAddFeedOpen(false);
      setNewFeed({ type: "", amount: 0, costPerKg: 0 });
    },
  });
  
  const handleAddFeed = () => {
    addFeedMutation.mutate(newFeed);
  };

  const handleOrderMore = (feed: FeedInventoryItem) => {
    setSelectedFeed(feed);
    setOrderDialogOpen(true);
  };

  const getStockPercentage = (current: number, reorder: number) => {
    // Assume max stock is double the reorder level
    const max = reorder * 2;
    return Math.min(100, Math.max(0, (current / max) * 100));
  };
  
  const getDaysRemaining = (current: number, daily: number) => {
    if (daily <= 0) return "∞";
    return Math.floor(current / daily);
  };

  const viewInventoryReport = () => {
    navigate('/reports?category=inventory');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-farm-brown-dark">Inventory Management</h1>
            <p className="text-muted-foreground">Track and manage your feed and supplies</p>
          </header>
          
          <div className="mb-6 flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={viewInventoryReport}
            >
              View Inventory Analytics
            </Button>
          
            <Dialog open={addFeedOpen} onOpenChange={setAddFeedOpen}>
              <DialogTrigger asChild>
                <Button className="bg-farm-green hover:bg-farm-green-dark">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Feed Stock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Feed Stock</DialogTitle>
                  <DialogDescription>
                    Add new feed to your inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="feed-type">Feed Type</Label>
                    <Select 
                      onValueChange={(value) => setNewFeed({...newFeed, type: value})}
                      value={newFeed.type}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select feed type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="layer">Layer Feed</SelectItem>
                        <SelectItem value="grower">Grower Feed</SelectItem>
                        <SelectItem value="starter">Starter Feed</SelectItem>
                        <SelectItem value="organic">Organic Feed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (kg)</Label>
                    <Input 
                      id="amount" 
                      type="number"
                      min="0"
                      value={newFeed.amount || ""} 
                      onChange={(e) => setNewFeed({...newFeed, amount: Number(e.target.value)})} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cost">Cost per kg ($)</Label>
                    <Input 
                      id="cost" 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={newFeed.costPerKg || ""} 
                      onChange={(e) => setNewFeed({...newFeed, costPerKg: Number(e.target.value)})} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddFeedOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={handleAddFeed}
                    disabled={!newFeed.type || newFeed.amount <= 0 || newFeed.costPerKg <= 0 || addFeedMutation.isPending}
                    className="bg-farm-green hover:bg-farm-green-dark"
                  >
                    {addFeedMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add to Inventory
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-farm-green" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-2">Failed to load inventory data</p>
              <Button variant="outline">Try Again</Button>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-farm-brown-dark">Feed Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedInventory?.map((feed) => (
                  <Card key={feed.type}>
                    <CardHeader className="pb-2">
                      <CardTitle>{feed.type}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Current Stock</span>
                          <span className="font-medium">{feed.currentStock} kg</span>
                        </div>
                        <Progress 
                          value={getStockPercentage(feed.currentStock, feed.reorderLevel)} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded-md flex flex-col items-center">
                          <PackageOpen className="h-5 w-5 text-blue-500 mb-1" />
                          <p className="text-xs text-blue-700">Reorder at</p>
                          <p className="font-medium">{feed.reorderLevel} kg</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md flex flex-col items-center">
                          <Calendar className="h-5 w-5 text-blue-500 mb-1" />
                          <p className="text-xs text-blue-700">Days left</p>
                          <p className="font-medium">{getDaysRemaining(feed.currentStock, feed.dailyConsumption)}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md flex flex-col items-center">
                          <ShoppingCart className="h-5 w-5 text-blue-500 mb-1" />
                          <p className="text-xs text-blue-700">Cost/kg</p>
                          <p className="font-medium">${feed.costPerKg.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleOrderMore(feed)}
                        >
                          Order More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Feed Dialog */}
      <OrderFeedDialog 
        feedItem={selectedFeed} 
        open={orderDialogOpen} 
        onOpenChange={setOrderDialogOpen} 
      />
    </div>
  );
};

export default Inventory;
