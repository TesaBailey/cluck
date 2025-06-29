
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CoopData } from "@/types";
import { Thermometer, Droplets, CalendarDays, Users, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CoopDetailsProps {
  coop: CoopData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CoopDetails = ({ coop, open, onOpenChange }: CoopDetailsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cleaningCoop, setCleaningCoop] = useState(false);

  if (!coop) return null;

  const getDaysFromLastCleaned = (lastCleanedDate: string) => {
    const daysDiff = Math.floor(
      (Date.now() - new Date(lastCleanedDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff;
  };

  const handleCleanCoop = async () => {
    setCleaningCoop(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCleaningCoop(false);
    toast({
      title: "Success",
      description: `${coop.name} has been marked as cleaned`,
    });
    onOpenChange(false);
  };

  const viewCoopReport = () => {
    navigate(`/reports?coopId=${coop.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{coop.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Occupancy</p>
                <p className="font-medium">{coop.currentOccupancy}/{coop.capacity}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Last Cleaned</p>
                <p className="font-medium">{getDaysFromLastCleaned(coop.lastCleaned)} days ago</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-md flex items-center">
              <Thermometer className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-xs text-blue-700">Temperature</p>
                <p className="font-medium">{coop.temperature}°C</p>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-md flex items-center">
              <Droplets className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-xs text-blue-700">Humidity</p>
                <p className="font-medium">{coop.humidity}%</p>
              </div>
            </div>
          </div>
          
          <div className="pt-2 space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleCleanCoop}
              disabled={cleaningCoop}
            >
              {cleaningCoop ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Marking as Cleaned...
                </>
              ) : "Mark as Cleaned"}
            </Button>
            
            <Button 
              className="w-full bg-farm-green hover:bg-farm-green-dark"
              onClick={viewCoopReport}
            >
              View Analytics
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

export default CoopDetails;
