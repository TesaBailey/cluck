
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { getEggCollectionRecords, getCages } from "@/services/api";
import { Loader2, CalendarDays, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";
import AddEggRecordDialog from "@/components/egg-collection/AddEggRecordDialog";
import EggCollectionTable from "@/components/egg-collection/EggCollectionTable";
import EggCollectionChart from "@/components/egg-collection/EggCollectionChart";

const EggCollection = () => {
  const navigate = useNavigate();
  const [addRecordOpen, setAddRecordOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("table");
  
  const { data: eggRecords, isLoading: recordsLoading } = useQuery({
    queryKey: ['eggCollectionRecords'],
    queryFn: getEggCollectionRecords,
  });
  
  const { data: cages, isLoading: cagesLoading } = useQuery({
    queryKey: ['cages'],
    queryFn: getCages,
  });

  const isLoading = recordsLoading || cagesLoading;
  
  const handleViewReports = () => {
    navigate("/reports?section=egg-collection");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-farm-brown-dark">Egg Collection Records</h1>
              <p className="text-muted-foreground">Track and manage egg production by cage</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="bg-farm-green hover:bg-farm-green-dark"
                onClick={() => setAddRecordOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> New Record
              </Button>
              <Button 
                variant="outline" 
                onClick={handleViewReports}
              >
                View Analytics
              </Button>
            </div>
          </header>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-farm-green" />
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Egg Collection Summary</CardTitle>
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {format(selectedDate, "MMMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Today's Collection</p>
                      <p className="text-2xl font-bold">
                        {eggRecords
                          ?.filter(r => r.date.includes(format(new Date(), "yyyy-MM-dd")))
                          .reduce((sum, r) => sum + r.count, 0) || 0}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Yesterday</p>
                      <p className="text-2xl font-bold">
                        {eggRecords
                          ?.filter(r => r.date.includes(format(subDays(new Date(), 1), "yyyy-MM-dd")))
                          .reduce((sum, r) => sum + r.count, 0) || 0}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">New Chickens</p>
                      <p className="text-2xl font-bold">
                        {eggRecords
                          ?.filter(r => r.date.includes(format(new Date(), "yyyy-MM-dd")) && r.isFromNewChickens)
                          .reduce((sum, r) => sum + r.count, 0) || 0}
                      </p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="text-sm text-amber-600 font-medium">Old Chickens</p>
                      <p className="text-2xl font-bold">
                        {eggRecords
                          ?.filter(r => r.date.includes(format(new Date(), "yyyy-MM-dd")) && !r.isFromNewChickens)
                          .reduce((sum, r) => sum + r.count, 0) || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="chart">Chart View</TabsTrigger>
                </TabsList>
                <TabsContent value="table">
                  <EggCollectionTable records={eggRecords || []} cages={cages || []} />
                </TabsContent>
                <TabsContent value="chart">
                  <EggCollectionChart records={eggRecords || []} cages={cages || []} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
      
      <AddEggRecordDialog open={addRecordOpen} onOpenChange={setAddRecordOpen} cages={cages || []} />
    </div>
  );
};

export default EggCollection;
