
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { getCages } from "@/services/supabaseApi";
import { Grid2X2, Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import AddCageDialog from "@/components/cages/AddCageDialog";
import CageDetailsDialog from "@/components/cages/CageDetailsDialog";
import { CageData } from "@/types";

const Cages = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCage, setSelectedCage] = useState<CageData | null>(null);
  
  const { data: cages, isLoading } = useQuery({
    queryKey: ['cages'],
    queryFn: getCages,
  });

  const filteredCages = cages?.filter(cage => 
    cage.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleViewCageDetails = (cage: CageData) => {
    setSelectedCage(cage);
    setDetailsDialogOpen(true);
  };

  const handleViewReports = () => {
    navigate("/reports?section=cages");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-farm-brown-dark">Chicken Cages</h1>
              <p className="text-muted-foreground">Manage your A-Z chicken cages</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="bg-farm-green hover:bg-farm-green-dark"
                onClick={() => setAddDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> New Cage
              </Button>
              <Button 
                variant="outline" 
                onClick={handleViewReports}
              >
                View Analytics
              </Button>
            </div>
          </header>
          
          <div className="mb-6">
            <Input
              placeholder="Search cages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-farm-green" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCages.map((cage) => (
                <Card 
                  key={cage.id} 
                  className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleViewCageDetails(cage)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Grid2X2 className="h-5 w-5 mr-2 text-farm-green" />
                      {cage.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Occupancy:</span>
                        <span className="font-medium">{cage.currentOccupancy}/{cage.capacity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">New Chickens:</span>
                        <span className="font-medium text-purple-600">{cage.newChickensCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Old Chickens:</span>
                        <span className="font-medium text-amber-600">{cage.oldChickensCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredCages.length === 0 && (
                <div className="col-span-full flex justify-center py-12 text-muted-foreground">
                  No cages found. Add a new cage to get started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <AddCageDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <CageDetailsDialog 
        open={detailsDialogOpen} 
        onOpenChange={setDetailsDialogOpen} 
        cage={selectedCage} 
      />
    </div>
  );
};

export default Cages;
