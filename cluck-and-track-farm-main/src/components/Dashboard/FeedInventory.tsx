
import { CircleOff, Loader2, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFeedInventory, updateFeedStock } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FeedInventory = () => {
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const queryClient = useQueryClient();
  
  const { data: feedData, isLoading, error } = useQuery({
    queryKey: ['feedInventory'],
    queryFn: getFeedInventory,
  });

  const mutation = useMutation({
    mutationFn: ({ feedType, quantity }: { feedType: string; quantity: number }) => 
      updateFeedStock(feedType, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedInventory'] });
      toast({
        title: "Stock updated",
        description: "Feed inventory has been successfully updated.",
      });
      setSelectedFeed(null);
      setQuantity(0);
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update feed stock",
        variant: "destructive",
      });
    },
  });
  
  const handleAddStock = () => {
    if (selectedFeed && quantity > 0) {
      mutation.mutate({ feedType: selectedFeed, quantity });
    }
  };
  
  if (isLoading) {
    return (
      <div className="chart-container flex items-center justify-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-farm-green" />
      </div>
    );
  }
  
  if (error || !feedData) {
    return (
      <div className="chart-container flex flex-col items-center justify-center h-[300px]">
        <p className="text-red-500 mb-2">Failed to load feed inventory</p>
        <Button 
          variant="outline" 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['feedInventory'] })}
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="chart-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Feed Inventory</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-farm-green hover:text-white hover:bg-farm-green">
              <Plus className="h-4 w-4 mr-1" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Feed Stock</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feed-type">Feed Type</Label>
                <Select
                  value={selectedFeed || ""}
                  onValueChange={setSelectedFeed}
                >
                  <SelectTrigger id="feed-type">
                    <SelectValue placeholder="Select feed type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>Select feed type</SelectItem>
                    {feedData.map((feed) => (
                      <SelectItem key={feed.type} value={feed.type}>{feed.type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  value={quantity || ""}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                disabled={!selectedFeed || quantity <= 0 || mutation.isPending}
                onClick={handleAddStock}
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : null}
                Add Stock
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-5">
        {feedData.map((feed, index) => {
          // Calculate days remaining based on current stock and daily consumption
          const daysRemaining = Math.floor(feed.currentStock / feed.dailyConsumption);
          // Calculate percentage of stock remaining
          const stockPercentage = (feed.currentStock / (feed.reorderLevel * 3)) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{feed.type}</span>
                <span className="text-sm text-gray-500">
                  {feed.currentStock} kg remaining
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  {daysRemaining < 7 && (
                    <CircleOff className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={daysRemaining < 7 ? "text-red-500" : "text-gray-500"}>
                    {daysRemaining} days remaining
                  </span>
                </div>
                <span className="text-gray-500">
                  ${(feed.costPerKg * feed.currentStock).toFixed(2)} value
                </span>
              </div>
              
              <Progress 
                value={stockPercentage} 
                className={`h-2 ${getStockLevelColor(stockPercentage)}`} 
              />
            </div>
          );
        })}
      </div>
      
      <div className="mt-6">
        <a href="#" className="text-sm text-farm-green-dark hover:underline">
          Manage inventory →
        </a>
      </div>
    </div>
  );
};

// Helper function to get color based on stock level
const getStockLevelColor = (percentage: number) => {
  if (percentage <= 25) return "bg-red-500";
  if (percentage <= 50) return "bg-orange-500";
  if (percentage <= 75) return "bg-yellow-500";
  return "bg-farm-green";
};

export default FeedInventory;
