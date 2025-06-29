
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { FeedInventoryItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { updateFeedStock } from "@/services/api";

interface OrderFeedDialogProps {
  feedItem: FeedInventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderFeedDialog = ({ feedItem, open, onOpenChange }: OrderFeedDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(50);

  const orderFeedMutation = useMutation({
    mutationFn: async ({ feedType, quantity }: { feedType: string, quantity: number }) => {
      return updateFeedStock(feedType, quantity);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['feedInventory'] });
      toast({
        title: "Order Placed",
        description: data.message,
      });
      onOpenChange(false);
      setQuantity(50);
    },
  });

  const handleSubmit = () => {
    if (!feedItem) return;
    orderFeedMutation.mutate({ 
      feedType: feedItem.type,
      quantity
    });
  };

  if (!feedItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order {feedItem.type}</DialogTitle>
          <DialogDescription>
            Specify the amount you want to order
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity (kg)</Label>
            <Input 
              id="quantity" 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
            />
          </div>
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm font-medium">Order Summary</p>
            <p className="text-sm mt-1">Cost: ${(quantity * feedItem.costPerKg).toFixed(2)}</p>
            <p className="text-sm mt-1">Current Stock: {feedItem.currentStock} kg</p>
            <p className="text-sm mt-1">New Stock after delivery: {feedItem.currentStock + quantity} kg</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={quantity <= 0 || orderFeedMutation.isPending}
            className="bg-farm-green hover:bg-farm-green-dark"
          >
            {orderFeedMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Place Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderFeedDialog;
