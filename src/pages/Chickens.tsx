
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChickens, getCoops, addChicken } from "@/services/api";
import { Loader2, Plus, Search, Filter, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChickenData } from "@/types";

const getHealthStatusColor = (status: ChickenData['healthStatus']) => {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 text-green-800';
    case 'sick':
      return 'bg-red-100 text-red-800';
    case 'recovering':
      return 'bg-yellow-100 text-yellow-800';
    case 'deceased':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

const Chickens = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [newChicken, setNewChicken] = useState({
    name: "",
    age: 0,
    breed: "",
    healthStatus: "healthy" as ChickenData['healthStatus'],
    coopId: "",
    lastWeightCheck: 0
  });
  
  const { data: chickens, isLoading, error } = useQuery({
    queryKey: ['chickens'],
    queryFn: getChickens,
  });
  
  const { data: coops } = useQuery({
    queryKey: ['coops'],
    queryFn: getCoops,
  });
  
  const addChickenMutation = useMutation({
    mutationFn: addChicken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chickens'] });
      toast({
        title: "Success",
        description: `Added new chicken: ${newChicken.name}`,
      });
      setOpen(false);
      setNewChicken({
        name: "",
        age: 0,
        breed: "",
        healthStatus: "healthy",
        coopId: "",
        lastWeightCheck: 0
      });
    },
  });
  
  const handleAddChicken = () => {
    addChickenMutation.mutate(newChicken);
  };

  const filteredChickens = chickens?.filter(chicken => 
    chicken.name.toLowerCase().includes(search.toLowerCase()) || 
    chicken.breed.toLowerCase().includes(search.toLowerCase())
  );

  const getCoopName = (coopId: string) => {
    const coop = coops?.find(c => c.id === coopId);
    return coop?.name || coopId;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-farm-brown-dark">Chicken Management</h1>
            <p className="text-muted-foreground">Manage your flock's information and health status</p>
          </header>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search chickens..." 
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-farm-green hover:bg-farm-green-dark">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Chicken
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Chicken</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="chicken-name">Chicken Name</Label>
                      <Input 
                        id="chicken-name" 
                        value={newChicken.name} 
                        onChange={(e) => setNewChicken({...newChicken, name: e.target.value})} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="age">Age (weeks)</Label>
                        <Input 
                          id="age" 
                          type="number"
                          min="0"
                          value={newChicken.age || ""} 
                          onChange={(e) => setNewChicken({...newChicken, age: Number(e.target.value)})} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="weight">Weight (grams)</Label>
                        <Input 
                          id="weight" 
                          type="number"
                          min="0"
                          value={newChicken.lastWeightCheck || ""} 
                          onChange={(e) => setNewChicken({...newChicken, lastWeightCheck: Number(e.target.value)})} 
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="breed">Breed</Label>
                      <Input 
                        id="breed" 
                        value={newChicken.breed} 
                        onChange={(e) => setNewChicken({...newChicken, breed: e.target.value})} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="coop">Assign to Coop</Label>
                      <Select 
                        onValueChange={(value) => setNewChicken({...newChicken, coopId: value})}
                        value={newChicken.coopId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select coop" />
                        </SelectTrigger>
                        <SelectContent>
                          {coops?.map(coop => (
                            <SelectItem key={coop.id} value={coop.id}>
                              {coop.name} ({coop.currentOccupancy}/{coop.capacity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="health">Health Status</Label>
                      <Select 
                        onValueChange={(value) => setNewChicken({...newChicken, healthStatus: value as ChickenData['healthStatus']})}
                        value={newChicken.healthStatus}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select health status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthy">Healthy</SelectItem>
                          <SelectItem value="sick">Sick</SelectItem>
                          <SelectItem value="recovering">Recovering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button 
                      onClick={handleAddChicken}
                      disabled={
                        !newChicken.name || 
                        newChicken.age <= 0 || 
                        !newChicken.breed ||
                        !newChicken.coopId ||
                        addChickenMutation.isPending
                      }
                      className="bg-farm-green hover:bg-farm-green-dark"
                    >
                      {addChickenMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Chicken
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-farm-green" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-2">Failed to load chicken data</p>
              <Button variant="outline">Try Again</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChickens?.map((chicken) => (
                <Card key={chicken.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{chicken.name}</CardTitle>
                      <Badge className={getHealthStatusColor(chicken.healthStatus)}>
                        {chicken.healthStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Breed</p>
                        <p className="font-medium">{chicken.breed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{chicken.age} weeks</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="font-medium">{chicken.lastWeightCheck} g</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Coop</p>
                        <p className="font-medium">{getCoopName(chicken.coopId)}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" className="w-full gap-2">
                        <HeartPulse className="h-4 w-4" />
                        Health Record
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chickens;
