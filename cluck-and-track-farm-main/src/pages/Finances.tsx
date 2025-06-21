
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getExpenses, getRevenues, deleteExpense, deleteRevenue } from "@/services/supabaseApi";
import { Expense, Revenue } from "@/types";
import AddExpenseDialog from "@/components/finances/AddExpenseDialog";
import AddRevenueDialog from "@/components/finances/AddRevenueDialog";
import { PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const Finances = () => {
  const [activeTab, setActiveTab] = useState<string>("expenses");
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState<boolean>(false);
  const [showAddRevenueDialog, setShowAddRevenueDialog] = useState<boolean>(false);
  
  const { 
    data: expenses, 
    isLoading: isLoadingExpenses, 
    isError: isErrorExpenses, 
    refetch: refetchExpenses 
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  });
  
  const { 
    data: revenues, 
    isLoading: isLoadingRevenues, 
    isError: isErrorRevenues, 
    refetch: refetchRevenues 
  } = useQuery({
    queryKey: ['revenues'],
    queryFn: getRevenues,
  });

  const handleDeleteExpense = async (id: string) => {
    try {
      const result = await deleteExpense(id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Expense deleted successfully",
        });
        refetchExpenses();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRevenue = async (id: string) => {
    try {
      const result = await deleteRevenue(id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Revenue deleted successfully",
        });
        refetchRevenues();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete revenue",
        variant: "destructive",
      });
    }
  };

  // Calculate summary statistics
  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const totalRevenues = revenues?.reduce((sum, revenue) => sum + revenue.amount, 0) || 0;
  const netIncome = totalRevenues - totalExpenses;

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Financial Management</h1>
            <p className="text-muted-foreground">Track expenses and revenues for your farm</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">${totalRevenues.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Net Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${netIncome.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="revenues">Revenues</TabsTrigger>
              </TabsList>
              
              {activeTab === "expenses" ? (
                <Button onClick={() => setShowAddExpenseDialog(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
                </Button>
              ) : (
                <Button onClick={() => setShowAddRevenueDialog(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Revenue
                </Button>
              )}
            </div>

            <TabsContent value="expenses">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingExpenses ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : isErrorExpenses ? (
                    <div className="text-center py-4 text-red-500">Error loading expenses</div>
                  ) : expenses?.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No expenses recorded yet</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expenses?.map((expense) => (
                            <TableRow key={expense.id}>
                              <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                              <TableCell>{expense.category}</TableCell>
                              <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                              <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="revenues">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingRevenues ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : isErrorRevenues ? (
                    <div className="text-center py-4 text-red-500">Error loading revenues</div>
                  ) : revenues?.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No revenues recorded yet</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {revenues?.map((revenue) => (
                            <TableRow key={revenue.id}>
                              <TableCell>{format(new Date(revenue.date), 'MMM d, yyyy')}</TableCell>
                              <TableCell>{revenue.category}</TableCell>
                              <TableCell className="max-w-xs truncate">{revenue.description}</TableCell>
                              <TableCell className="text-right">${revenue.amount.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteRevenue(revenue.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <AddExpenseDialog 
        isOpen={showAddExpenseDialog} 
        onClose={() => setShowAddExpenseDialog(false)} 
        onSuccess={() => {
          refetchExpenses();
          setShowAddExpenseDialog(false);
        }}
      />
      
      <AddRevenueDialog 
        isOpen={showAddRevenueDialog} 
        onClose={() => setShowAddRevenueDialog(false)} 
        onSuccess={() => {
          refetchRevenues();
          setShowAddRevenueDialog(false);
        }}
      />
    </div>
  );
};

export default Finances;
