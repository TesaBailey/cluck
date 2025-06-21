
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { CoopData } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AddCoopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCoopDialog = ({ open, onOpenChange }: AddCoopDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    capacity: 50,
    temperature: 22,
    humidity: 60
  });

  const addCoopMutation = useMutation({
    mutationFn: async (data: Omit<CoopData, "id" | "currentOccupancy" | "lastCleaned">) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCoop: CoopData = {
        id: `coop-${Date.now()}`,
        name: data.name,
        capacity: data.capacity,
        currentOccupancy: 0,
        temperature: data.temperature,
        humidity: data.humidity,
        lastCleaned: new Date().toISOString()
      };
      return newCoop;
    },
    onSuccess: (newCoop) => {
      queryClient.setQueryData(['coops'], (oldData: CoopData[] = []) => [...oldData, newCoop]);
      toast({
        title: "Success",
        description: `${newCoop.name} has been added successfully`,
      });
      onOpenChange(false);
      setFormData({
        name: "",
        capacity: 50,
        temperature: 22,
        humidity: 60
      });
    },
  });

  const handleSubmit = () => {
    addCoopMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Coop</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new chicken coop to your farm.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="coop-name">Coop Name</Label>
            <Input 
              id="coop-name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter coop name" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input 
              id="capacity" 
              type="number" 
              value={formData.capacity} 
              onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
              min="1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input 
                id="temperature" 
                type="number" 
                value={formData.temperature} 
                onChange={(e) => setFormData({...formData, temperature: Number(e.target.value)})}
                step="0.1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input 
                id="humidity" 
                type="number" 
                value={formData.humidity} 
                onChange={(e) => setFormData({...formData, humidity: Number(e.target.value)})}
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name || formData.capacity <= 0 || addCoopMutation.isPending}
            className="bg-farm-green hover:bg-farm-green-dark"
          >
            {addCoopMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Coop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoopDialog;
