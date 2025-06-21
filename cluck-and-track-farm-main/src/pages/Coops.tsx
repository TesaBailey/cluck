
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { getCoops } from "@/services/api";
import { Loader2, Thermometer, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddCoopDialog from "@/components/coops/AddCoopDialog";
import CoopDetails from "@/components/coops/CoopDetails";
import { CoopData } from "@/types";

const Coops = () => {
  const [addCoopOpen, setAddCoopOpen] = useState(false);
  const [selectedCoop, setSelectedCoop] = useState<CoopData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const { data: coops, isLoading, error, refetch } = useQuery({
    queryKey: ['coops'],
    queryFn: getCoops,
  });
  
  const getDaysFromLastCleaned = (lastCleanedDate: string) => {
    const daysDiff = Math.floor(
      (Date.now() - new Date(lastCleanedDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff;
  };

  const handleViewDetails = (coop: CoopData) => {
    setSelectedCoop(coop);
    setDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-farm-brown-dark">Coop Management</h1>
            <p className="text-muted-foreground">Monitor and manage your chicken coops</p>
          </header>
          
          <div className="mb-6 flex justify-end">
            <Button 
              className="bg-farm-green hover:bg-farm-green-dark"
              onClick={() => setAddCoopOpen(true)}
            >
              Add New Coop
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-farm-green" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-2">Failed to load coop data</p>
              <Button variant="outline" onClick={() => refetch()}>Try Again</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coops?.map((coop) => (
                <Card key={coop.id}>
                  <CardHeader>
                    <CardTitle>{coop.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Occupancy</span>
                        <span className="font-medium">{coop.currentOccupancy}/{coop.capacity}</span>
                      </div>
                      <Progress 
                        value={(coop.currentOccupancy / coop.capacity) * 100} 
                        className="h-2"
                      />
                    </div>
                    
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
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Last Cleaned</p>
                      <p className="font-medium">
                        {new Date(coop.lastCleaned).toLocaleDateString()}
                        <span className="text-sm ml-2 text-gray-500">
                          ({getDaysFromLastCleaned(coop.lastCleaned)} days ago)
                        </span>
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleViewDetails(coop)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AddCoopDialog open={addCoopOpen} onOpenChange={setAddCoopOpen} />
      <CoopDetails coop={selectedCoop} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </div>
  );
};

export default Coops;
