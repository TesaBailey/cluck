
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportGenerationOptions, ReportType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ReportGeneratorProps {
  onGenerate: (options: ReportGenerationOptions) => Promise<void>;
  isGenerating: boolean;
}

export const ReportGenerator = ({ onGenerate, isGenerating }: ReportGeneratorProps) => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState<ReportType>("egg-production");
  const [includeCharts, setIncludeCharts] = useState(true);

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Date selection required",
        description: "Please select both start and end dates for your report.",
        variant: "destructive",
      });
      return;
    }

    // Create a copy of the end date and set the time to the end of the day
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);

    if (startDate > adjustedEndDate) {
      toast({
        title: "Invalid date range",
        description: "Start date must be before or equal to end date.",
        variant: "destructive",
      });
      return;
    }

    await onGenerate({
      type: reportType,
      startDate,
      endDate: adjustedEndDate,
      includeCharts
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Report Generator
        </CardTitle>
        <CardDescription>
          Create custom reports based on your farm data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
          <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="egg-production">Egg Production</SelectItem>
              <SelectItem value="finances">Finances</SelectItem>
              <SelectItem value="feed-consumption">Feed Consumption</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="environment">Environmental Conditions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="includeCharts" 
            checked={includeCharts}
            onCheckedChange={(checked) => setIncludeCharts(checked === true)} 
          />
          <label 
            htmlFor="includeCharts" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include charts in report
          </label>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !startDate || !endDate}
          className="bg-farm-green hover:bg-farm-green-dark w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate Report</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
