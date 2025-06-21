
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { getCreditSalesSummary, updateEggCollectionPaymentStatus, getEggCollectionRecords } from "@/services/supabaseApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isAfter, parseISO, subMonths } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Loader2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CreditTracker = () => {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [timeframe, setTimeframe] = useState<string>("all");
  const [selectedBuyer, setSelectedBuyer] = useState<string>("all");
  
  const { data: summary, isLoading: isSummaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['creditSalesSummary'],
    queryFn: getCreditSalesSummary,
  });
  
  const { data: eggRecords, isLoading: isRecordsLoading, refetch: refetchRecords } = useQuery({
    queryKey: ['eggCollectionRecords'],
    queryFn: getEggCollectionRecords,
  });
  
  const isLoading = isSummaryLoading || isRecordsLoading;
  
  const handleUpdatePaymentStatus = async (recordId: string, status: 'paid' | 'pending' | 'overdue') => {
    try {
      const result = await updateEggCollectionPaymentStatus(recordId, status);
      
      if (result.success) {
        toast({
          title: "Payment status updated",
          description: `The payment status has been updated to ${status}.`,
        });
        refetchSummary();
        refetchRecords();
      } else {
        toast({
          title: "Error updating status",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Error",
        description: "There was a problem updating the payment status.",
        variant: "destructive",
      });
    }
  };
  
  // Filter egg records to only show those sold on credit
  const creditRecords = eggRecords?.filter(record => 
    record.buyerName && 
    record.sold && 
    record.sold > 0 && 
    record.paymentStatus
  ) || [];
  
  // Filter based on timeframe
  const filteredRecords = creditRecords.filter(record => {
    if (timeframe === "all") return true;
    if (!record.paymentDue) return false;
    
    const dueDate = parseISO(record.paymentDue);
    
    switch (timeframe) {
      case "month": return isAfter(dueDate, subMonths(new Date(), 1));
      case "3months": return isAfter(dueDate, subMonths(new Date(), 3));
      case "6months": return isAfter(dueDate, subMonths(new Date(), 6));
      default: return true;
    }
  });
  
  // Filter based on buyer
  const buyerFilteredRecords = selectedBuyer === "all" 
    ? filteredRecords 
    : filteredRecords.filter(record => record.buyerName === selectedBuyer);
  
  // Get unique buyer names
  const buyers = Array.from(new Set(creditRecords.map(record => record.buyerName))).filter(Boolean) as string[];
  
  // Prepare data for the charts
  const prepareBuyerData = () => {
    if (!summary) return [];
    
    return Object.entries(summary.buyerBreakdown).map(([name, data]) => ({
      name,
      total: data.total,
      pending: data.pending,
      overdue: data.overdue
    }));
  };
  
  const prepareTimeData = () => {
    if (!summary) return [];
    
    // Choose which time analysis to use based on timeframe
    let timeData: Record<string, number>;
    
    switch(timeframe) {
      case "month": 
        timeData = summary.timeBasedAnalysis.daily;
        break;
      case "3months":
        timeData = summary.timeBasedAnalysis.weekly;
        break;
      default:
        timeData = summary.timeBasedAnalysis.monthly;
    }
    
    return Object.entries(timeData)
      .map(([date, amount]) => ({
        date,
        amount
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };
  
  const buyerData = prepareBuyerData();
  const timeData = prepareTimeData();
  
  const formatPaymentStatus = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return status;
    }
  };
  
  const statusColors = {
    paid: "#10b981",
    pending: "#f59e0b",
    overdue: "#ef4444"
  };
  
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-farm-brown-dark">Credit Sales Tracker</h1>
            <p className="text-muted-foreground">Monitor customer credit, payment due dates, and payment history</p>
          </header>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-farm-green" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Outstanding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${summary?.totalOutstanding.toFixed(2) || '0.00'}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-500">${summary?.pendingAmount.toFixed(2) || '0.00'}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">${summary?.overdueAmount.toFixed(2) || '0.00'}</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedBuyer} onValueChange={setSelectedBuyer}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select buyer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Buyers</SelectItem>
                    {buyers.map(buyer => (
                      <SelectItem key={buyer} value={buyer}>
                        {buyer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="buyers">Buyers</TabsTrigger>
                  <TabsTrigger value="records">Records</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Credit Sales Over Time</CardTitle>
                        <CardDescription>
                          Tracking credit sales amount
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          {timeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={timeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="date" 
                                  tickFormatter={(value) => {
                                    // Format based on timeframe
                                    if (value.includes('W')) {
                                      // Weekly format: 2023-W01
                                      const [year, week] = value.split('-W');
                                      return `Wk ${week}`;
                                    } else if (value.length === 7) {
                                      // Monthly format: 2023-01
                                      return format(new Date(value + '-01'), 'MMM yy');
                                    } else {
                                      // Daily format
                                      return format(new Date(value), 'MMM d');
                                    }
                                  }}
                                />
                                <YAxis />
                                <Tooltip 
                                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                                  labelFormatter={(value) => {
                                    if (value.includes('W')) {
                                      const [year, week] = value.split('-W');
                                      return `Week ${week}, ${year}`;
                                    } else if (value.length === 7) {
                                      return format(new Date(value + '-01'), 'MMMM yyyy');
                                    } else {
                                      return format(new Date(value), 'MMMM d, yyyy');
                                    }
                                  }}
                                />
                                <Bar dataKey="amount" fill="#4f46e5" />
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-muted-foreground">No credit sales data available for the selected period</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="buyers">
                  <Card>
                    <CardHeader>
                      <CardTitle>Buyer Summary</CardTitle>
                      <CardDescription>
                        Credit sales broken down by buyer
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 mb-6">
                        {buyerData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={buyerData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, '']} />
                              <Legend />
                              <Bar dataKey="pending" name="Pending" fill={statusColors.pending} />
                              <Bar dataKey="overdue" name="Overdue" fill={statusColors.overdue} />
                              <Bar dataKey="total" name="Total" fill="#4f46e5" />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">No buyer data available</p>
                          </div>
                        )}
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Buyer</TableHead>
                            <TableHead className="text-right">Total Credit</TableHead>
                            <TableHead className="text-right">Pending</TableHead>
                            <TableHead className="text-right">Overdue</TableHead>
                            <TableHead>Next Due Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(summary?.buyerBreakdown || {}).length > 0 ? (
                            Object.entries(summary?.buyerBreakdown || {})
                              .filter(([name]) => selectedBuyer === "all" || name === selectedBuyer)
                              .map(([name, data]) => (
                                <TableRow key={name}>
                                  <TableCell className="font-medium">{name}</TableCell>
                                  <TableCell className="text-right">${data.total.toFixed(2)}</TableCell>
                                  <TableCell className="text-right text-yellow-600">${data.pending.toFixed(2)}</TableCell>
                                  <TableCell className="text-right text-red-600">${data.overdue.toFixed(2)}</TableCell>
                                  <TableCell>
                                    {data.lastPaymentDue ? (
                                      <div className="flex items-center">
                                        {isAfter(new Date(), new Date(data.lastPaymentDue)) && data.overdue > 0 && (
                                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                                        )}
                                        {format(new Date(data.lastPaymentDue), "MMM d, yyyy")}
                                      </div>
                                    ) : "N/A"}
                                  </TableCell>
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                No buyer data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="records">
                  <Card>
                    <CardHeader>
                      <CardTitle>Credit Sale Records</CardTitle>
                      <CardDescription>
                        Detailed records of all credit sales
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Buyer</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Payment Due</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {buyerFilteredRecords.length > 0 ? (
                            buyerFilteredRecords.map(record => (
                              <TableRow key={record.id}>
                                <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                                <TableCell>{record.buyerName}</TableCell>
                                <TableCell>
                                  {record.sold} {record.soldAs === 'crate' ? 
                                    `(${Math.floor(record.sold / 30)} crates)` : 
                                    'eggs'}
                                </TableCell>
                                <TableCell>
                                  ${((record.pricePerUnit || 0) * (record.sold || 0)).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  {record.paymentDue ? (
                                    <div className="flex items-center">
                                      {isAfter(new Date(), new Date(record.paymentDue)) && 
                                       record.paymentStatus === 'pending' && (
                                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                                      )}
                                      {format(new Date(record.paymentDue), "MMM d, yyyy")}
                                    </div>
                                  ) : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {formatPaymentStatus(record.paymentStatus || '')}
                                </TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">Update</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Update Payment Status</DialogTitle>
                                        <DialogDescription>
                                          Change the payment status for this record.
                                        </DialogDescription>
                                      </DialogHeader>
                                      
                                      <div className="py-4">
                                        <p>
                                          <strong>Buyer:</strong> {record.buyerName}
                                        </p>
                                        <p>
                                          <strong>Amount:</strong> ${((record.pricePerUnit || 0) * (record.sold || 0)).toFixed(2)}
                                        </p>
                                        <p>
                                          <strong>Current Status:</strong> {record.paymentStatus}
                                        </p>
                                      </div>
                                      
                                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                        <Button 
                                          variant="default"
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() => handleUpdatePaymentStatus(record.id, 'paid')}
                                        >
                                          Mark as Paid
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                                          onClick={() => handleUpdatePaymentStatus(record.id, 'pending')}
                                        >
                                          Mark as Pending
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-red-500 text-red-500 hover:bg-red-50"
                                          onClick={() => handleUpdatePaymentStatus(record.id, 'overdue')}
                                        >
                                          Mark as Overdue
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                No credit sale records found for the selected filters
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditTracker;
