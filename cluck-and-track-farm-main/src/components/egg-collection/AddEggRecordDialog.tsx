
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CageData } from "@/types";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addEggCollectionRecord } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AddEggRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cages: CageData[];
}

type FormValues = {
  cageId: string;
  count: number;
  isFromNewChickens: boolean;
  date: Date;
  notes?: string;
  damaged?: number;
  spoiled?: number;
  sold?: number;
  soldAs?: 'single' | 'crate';
  pricePerUnit?: number;
  paymentDue?: Date;
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  buyerName?: string;
};

const AddEggRecordDialog = ({ open, onOpenChange, cages }: AddEggRecordDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFromNewChickens, setIsFromNewChickens] = useState(false);
  const [activeTab, setActiveTab] = useState("collection");
  const [trackSales, setTrackSales] = useState(false);
  const [paymentDueDate, setPaymentDueDate] = useState<Date | undefined>(undefined);
  const [sellOnCredit, setSellOnCredit] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      cageId: "",
      count: 0,
      isFromNewChickens: false,
      date: new Date(),
      damaged: 0,
      spoiled: 0,
      sold: 0,
      soldAs: 'single',
      paymentStatus: 'paid',
      buyerName: ''
    },
  });

  const count = watch('count') || 0;
  const damaged = watch('damaged') || 0;
  const spoiled = watch('spoiled') || 0;
  const sold = watch('sold') || 0;
  const buyerName = watch('buyerName');
  
  const leftover = Math.max(0, count - damaged - spoiled - sold);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format the date as ISO string for the API
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      // Create the record object
      const recordData = {
        cageId: data.cageId,
        count: data.count,
        isFromNewChickens,
        date: formattedDate,
        notes: data.notes,
        damaged: data.damaged || 0,
        spoiled: data.spoiled || 0,
        sold: trackSales ? data.sold || 0 : 0,
        soldAs: trackSales ? data.soldAs : undefined,
        pricePerUnit: trackSales ? data.pricePerUnit : undefined,
        paymentDue: paymentDueDate ? format(paymentDueDate, "yyyy-MM-dd") : undefined,
        paymentStatus: trackSales && sellOnCredit ? data.paymentStatus : undefined,
        buyerName: trackSales && sellOnCredit ? data.buyerName : undefined
      };
      
      // Validate that the numbers make sense
      if ((data.damaged || 0) + (data.spoiled || 0) + (data.sold || 0) > data.count) {
        toast({
          title: "Invalid quantities",
          description: "The sum of damaged, spoiled, and sold eggs cannot exceed the total count.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Validate buyer name is provided if selling on credit
      if (trackSales && sellOnCredit && !data.buyerName) {
        toast({
          title: "Missing buyer information",
          description: "Please provide the buyer's name when selling on credit.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const result = await addEggCollectionRecord(recordData);
      
      if (result.success) {
        toast({
          title: "Record added",
          description: "Egg collection record has been added successfully.",
        });
        
        // Reset form and close dialog
        reset();
        setSelectedDate(new Date());
        setIsFromNewChickens(false);
        setActiveTab("collection");
        setTrackSales(false);
        setSellOnCredit(false);
        setPaymentDueDate(undefined);
        onOpenChange(false);
      } else {
        throw new Error("Failed to add record");
      }
    } catch (error) {
      console.error("Error adding egg collection record:", error);
      toast({
        title: "Error",
        description: "There was a problem adding the egg collection record.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when dialog is closed
      reset();
      setSelectedDate(new Date());
      setIsFromNewChickens(false);
      setActiveTab("collection");
      setTrackSales(false);
      setPaymentDueDate(undefined);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Egg Collection Record</DialogTitle>
            <DialogDescription>
              Enter the details for the egg collection.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="collection" className="flex-1">Collection</TabsTrigger>
              <TabsTrigger value="quality" className="flex-1">Quality</TabsTrigger>
              <TabsTrigger value="sales" className="flex-1">Sales</TabsTrigger>
            </TabsList>
            
            <TabsContent value="collection" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Collection Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date || new Date());
                          setValue("date", date || new Date());
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cage">Cage</Label>
                  <Select
                    onValueChange={(value) => setValue("cageId", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cage" />
                    </SelectTrigger>
                    <SelectContent>
                      {cages.map((cage) => (
                        <SelectItem key={cage.id} value={cage.id}>
                          {cage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="count">Egg Count</Label>
                <Input
                  id="count"
                  type="number"
                  min="0"
                  {...register("count", { 
                    required: "Egg count is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Count must be positive" }
                  })}
                />
                {errors.count && <p className="text-sm text-red-500">{errors.count.message}</p>}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-new-chickens"
                  checked={isFromNewChickens}
                  onCheckedChange={(checked) => {
                    setIsFromNewChickens(checked);
                    setValue("isFromNewChickens", checked);
                  }}
                />
                <Label htmlFor="is-new-chickens">Eggs from new chickens</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes here"
                  {...register("notes")}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="quality" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="damaged">Damaged Eggs</Label>
                <Input
                  id="damaged"
                  type="number"
                  min="0"
                  max={count}
                  {...register("damaged", { 
                    valueAsNumber: true,
                    min: { value: 0, message: "Value must be positive" },
                    max: { value: count, message: "Cannot exceed total count" }
                  })}
                />
                {errors.damaged && <p className="text-sm text-red-500">{errors.damaged.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="spoiled">Spoiled Eggs</Label>
                <Input
                  id="spoiled"
                  type="number"
                  min="0"
                  max={count}
                  {...register("spoiled", { 
                    valueAsNumber: true,
                    min: { value: 0, message: "Value must be positive" },
                    max: { value: count, message: "Cannot exceed total count" }
                  })}
                />
                {errors.spoiled && <p className="text-sm text-red-500">{errors.spoiled.message}</p>}
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Eggs:</span>
                  <span>{count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Damaged + Spoiled:</span>
                  <span>{damaged + spoiled}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Good Eggs:</span>
                  <span>{Math.max(0, count - damaged - spoiled)}</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sales" className="mt-4 space-y-4">
              <div className="flex items-center space-x-2 pb-2">
                <Switch
                  id="track-sales"
                  checked={trackSales}
                  onCheckedChange={setTrackSales}
                />
                <Label htmlFor="track-sales">Track sales for this collection</Label>
              </div>
              
              {trackSales && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="sold">Eggs Sold</Label>
                    <Input
                      id="sold"
                      type="number"
                      min="0"
                      max={count - damaged - spoiled}
                      {...register("sold", { 
                        valueAsNumber: true,
                        min: { value: 0, message: "Value must be positive" },
                        max: { 
                          value: count - damaged - spoiled,
                          message: "Cannot exceed good eggs available" 
                        }
                      })}
                    />
                    {errors.sold && <p className="text-sm text-red-500">{errors.sold.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="soldAs">Sold As</Label>
                    <Select
                      onValueChange={(value) => setValue("soldAs", value as 'single' | 'crate')}
                      defaultValue="single"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How were eggs sold?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Individual Eggs</SelectItem>
                        <SelectItem value="crate">Crates (30 eggs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pricePerUnit">Price Per Unit ($)</Label>
                    <Input
                      id="pricePerUnit"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("pricePerUnit", { 
                        valueAsNumber: true,
                        min: { value: 0, message: "Price must be positive" }
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 py-2">
                    <Switch
                      id="sell-on-credit"
                      checked={sellOnCredit}
                      onCheckedChange={setSellOnCredit}
                    />
                    <Label htmlFor="sell-on-credit">Sell on credit</Label>
                  </div>
                  
                  {sellOnCredit && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="buyerName">Buyer Name</Label>
                        <Input
                          id="buyerName"
                          placeholder="Enter buyer's name"
                          {...register("buyerName", { 
                            required: "Buyer name is required for credit sales"
                          })}
                        />
                        {errors.buyerName && (
                          <p className="text-sm text-red-500">{errors.buyerName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paymentStatus">Payment Status</Label>
                        <Select
                          onValueChange={(value) => setValue("paymentStatus", value as 'paid' | 'pending' | 'overdue')}
                          defaultValue="pending"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Payment status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paymentDue">Payment Due Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !paymentDueDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {paymentDueDate ? format(paymentDueDate, "PPP") : <span>Select due date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={paymentDueDate}
                              onSelect={setPaymentDueDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </>
                  )}
                  
                  <div className="pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Eggs Available:</span>
                      <span>{count - damaged - spoiled}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Eggs Sold:</span>
                      <span>{sold}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Leftover:</span>
                      <span>{leftover}</span>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEggRecordDialog;
