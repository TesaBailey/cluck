
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EggCollectionRecord, CageData } from "@/types";
import { format } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface EggCollectionTableProps {
  records: EggCollectionRecord[];
  cages: CageData[];
}

const EggCollectionTable = ({ records, cages }: EggCollectionTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCage, setFilterCage] = useState("all");
  const [filterChickenType, setFilterChickenType] = useState("all");
  const [filterSaleStatus, setFilterSaleStatus] = useState("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  
  // Get unique dates from records
  const dates = Array.from(new Set(records.map(record => 
    record.date.split('T')[0]
  ))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  // Filter records based on search and filters
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchQuery === "" || 
      cages.find(cage => cage.id === record.cageId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.buyerName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCage = filterCage === "all" || record.cageId === filterCage;
    
    const matchesChickenType = filterChickenType === "all" || 
      (filterChickenType === "new" && record.isFromNewChickens) ||
      (filterChickenType === "old" && !record.isFromNewChickens);
    
    const matchesSaleStatus = filterSaleStatus === "all" ||
      (filterSaleStatus === "sold" && record.sold && record.sold > 0) ||
      (filterSaleStatus === "unsold" && (!record.sold || record.sold === 0)) ||
      (filterSaleStatus === "damaged" && record.damaged && record.damaged > 0) ||
      (filterSaleStatus === "spoiled" && record.spoiled && record.spoiled > 0);
      
    const matchesPaymentStatus = filterPaymentStatus === "all" ||
      (filterPaymentStatus === "credit" && record.paymentStatus && record.paymentStatus !== 'paid') ||
      (filterPaymentStatus === "paid" && record.paymentStatus === 'paid') ||
      (filterPaymentStatus === "pending" && record.paymentStatus === 'pending') ||
      (filterPaymentStatus === "overdue" && record.paymentStatus === 'overdue');
    
    return matchesSearch && matchesCage && matchesChickenType && matchesSaleStatus && matchesPaymentStatus;
  });
  
  // Function to get cage name from ID
  const getCageName = (cageId: string) => {
    return cages.find(cage => cage.id === cageId)?.name || cageId;
  };
  
  // Calculate totals for the stats bar
  const totalEggs = filteredRecords.reduce((sum, record) => sum + record.count, 0);
  const totalDamaged = filteredRecords.reduce((sum, record) => sum + (record.damaged || 0), 0);
  const totalSpoiled = filteredRecords.reduce((sum, record) => sum + (record.spoiled || 0), 0);
  const totalSold = filteredRecords.reduce((sum, record) => sum + (record.sold || 0), 0);
  const totalLeftover = totalEggs - totalDamaged - totalSpoiled - totalSold;
  
  const renderPaymentStatus = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Eggs</p>
          <p className="text-2xl font-bold">{totalEggs}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Damaged</p>
          <p className="text-2xl font-bold">{totalDamaged}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-sm text-amber-600 font-medium">Spoiled</p>
          <p className="text-2xl font-bold">{totalSpoiled}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Sold</p>
          <p className="text-2xl font-bold">{totalSold}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Leftover</p>
          <p className="text-2xl font-bold">{totalLeftover}</p>
        </div>
      </div>
    
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search by cage name or buyer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={filterCage} onValueChange={setFilterCage}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by cage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cages</SelectItem>
              {cages.map((cage) => (
                <SelectItem key={cage.id} value={cage.id}>
                  {cage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={filterChickenType} onValueChange={setFilterChickenType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by chicken type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chickens</SelectItem>
              <SelectItem value="new">New Chickens</SelectItem>
              <SelectItem value="old">Old Chickens</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={filterSaleStatus} onValueChange={setFilterSaleStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Records</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="unsold">Unsold</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
              <SelectItem value="spoiled">Spoiled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="credit">On Credit</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Cage</TableHead>
              <TableHead>Chicken Type</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Damaged</TableHead>
              <TableHead className="text-right">Spoiled</TableHead>
              <TableHead className="text-right">Sold</TableHead>
              <TableHead className="text-right">Leftover</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Sales Info</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => {
                const leftover = record.count - (record.damaged || 0) - (record.spoiled || 0) - (record.sold || 0);
                
                return (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{getCageName(record.cageId)}</TableCell>
                    <TableCell>
                      <span className={record.isFromNewChickens ? "text-purple-600" : "text-amber-600"}>
                        {record.isFromNewChickens ? "New" : "Old"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">{record.count}</TableCell>
                    <TableCell className="text-right text-red-500">{record.damaged || 0}</TableCell>
                    <TableCell className="text-right text-amber-600">{record.spoiled || 0}</TableCell>
                    <TableCell className="text-right text-green-600">{record.sold || 0}</TableCell>
                    <TableCell className="text-right">{leftover}</TableCell>
                    <TableCell>{record.buyerName || "-"}</TableCell>
                    <TableCell>
                      {record.sold && record.sold > 0 ? (
                        <div>
                          <span className="text-sm">
                            {record.soldAs === 'crate' ? 
                              `${Math.floor(record.sold / 30)} crates` : 
                              'Singles'}
                          </span>
                          {record.pricePerUnit && (
                            <div className="text-xs text-muted-foreground">
                              ${record.pricePerUnit} per {record.soldAs === 'crate' ? 'crate' : 'egg'}
                            </div>
                          )}
                        </div>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {renderPaymentStatus(record.paymentStatus)}
                      {record.paymentDue && record.paymentStatus !== 'paid' && (
                        <div className="text-xs mt-1">
                          Due: {format(new Date(record.paymentDue), "MMM d")}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                  No egg collection records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EggCollectionTable;
