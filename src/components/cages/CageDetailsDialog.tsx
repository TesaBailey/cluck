
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CageData } from "@/types";
import { Grid2X2, ChevronRight, BarChart3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface CageDetailsDialogProps {
  cage: CageData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CageDetailsDialog = ({ cage, open, onOpenChange }: CageDetailsDialogProps) => {
  const navigate = useNavigate();

  if (!cage) return null;

  const handleViewEggCollection = () => {
    navigate(`/egg-collection?cageId=${cage.id}`);
    onOpenChange(false);
  };

  const handleViewReports = () => {
    navigate(`/reports?section=cages&cageId=${cage.id}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Grid2X2 className="mr-2 h-5 w-5 text-farm-green" />
            {cage.name} Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium">{cage.capacity} chickens</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Occupancy</span>
                <span className="font-medium">{cage.currentOccupancy} chickens</span>
              </div>
              <Progress 
                value={(cage.currentOccupancy / cage.capacity) * 100} 
                className="h-2"
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-3 rounded-md">
              <p className="text-purple-600 text-sm font-medium">New Chickens</p>
              <p className="text-xl font-bold">{cage.newChickensCount}</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-md">
              <p className="text-amber-600 text-sm font-medium">Old Chickens</p>
              <p className="text-xl font-bold">{cage.oldChickensCount}</p>
            </div>
          </div>
          
          <div className="pt-2 space-y-2">
            <Button 
              variant="outline" 
              className="w-full flex justify-between items-center"
              onClick={handleViewEggCollection}
            >
              <span>View Egg Collection</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button 
              className="w-full bg-farm-green hover:bg-farm-green-dark flex justify-between items-center"
              onClick={handleViewReports}
            >
              <span>View Analytics</span>
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CageDetailsDialog;
