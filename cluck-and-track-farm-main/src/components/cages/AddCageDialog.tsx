import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addCage } from "@/services/supabaseApi";

interface AddCageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCageDialog = ({ open, onOpenChange }: AddCageDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(20);
  const [newChickensCount, setNewChickensCount] = useState(0);
  const [oldChickensCount, setOldChickensCount] = useState(0);

  const addCageMutation = useMutation({
    mutationFn: addCage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cages'] });
      toast({
        title: "Success",
        description: "Cage added successfully",
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add cage",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setName("");
    setCapacity(20);
    setNewChickensCount(0);
    setOldChickensCount(0);
  };

  const calculateCurrentOccupancy = () => {
    return newChickensCount + oldChickensCount;
  };

  const handleSubmit = () => {
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a cage name",
        variant: "destructive",
      });
      return;
    }

    const currentOccupancy = calculateCurrentOccupancy();
    if (currentOccupancy > capacity) {
      toast({
        title: "Error",
        description: "Total chickens cannot exceed cage capacity",
        variant: "destructive",
      });
      return;
    }

    addCageMutation.mutate({
      name,
      capacity,
      currentOccupancy,
      newChickensCount,
      oldChickensCount
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Cage</DialogTitle>
          <DialogDescription>
            Create a new cage to track egg production
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Cage Name</Label>
            <Input
              id="name"
              placeholder="e.g. Cage A"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              min="1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-chickens">New Chickens</Label>
              <Input
                id="new-chickens"
                type="number"
                value={newChickensCount}
                onChange={(e) => setNewChickensCount(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="old-chickens">Old Chickens</Label>
              <Input
                id="old-chickens"
                type="number"
                value={oldChickensCount}
                onChange={(e) => setOldChickensCount(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">Current Occupancy: {calculateCurrentOccupancy()}/{capacity}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!name || capacity <= 0 || addCageMutation.isPending}
            className="bg-farm-green hover:bg-farm-green-dark"
          >
            {addCageMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Cage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCageDialog;
