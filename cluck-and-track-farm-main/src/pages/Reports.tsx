
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { ReportViewer } from "@/components/reports/ReportViewer";
import { useToast } from "@/hooks/use-toast";
import { Report, ReportGenerationOptions } from "@/types";
import { reportsService } from "@/services/reportsService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { generatePDF } from "@/utils/pdfGenerator";

const Reports = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  
  const handleGenerateReport = async (options: ReportGenerationOptions) => {
    setIsGenerating(true);
    try {
      const report = await reportsService.generateReport(options);
      
      if (report) {
        setCurrentReport(report);
        // Add to recent reports at the beginning of the array
        setRecentReports(prev => [report, ...prev.slice(0, 4)]);
        toast({
          title: "Report generated successfully",
          description: `${report.title} is ready to view.`,
        });
      } else {
        toast({
          title: "Failed to generate report",
          description: "No data available for the selected date range.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "There was a problem generating your report.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewReport = (report: Report) => {
    setCurrentReport(report);
  };

  const handlePrint = () => {
    if (currentReport) {
      window.print();
    }
  };

  const handleDownload = () => {
    if (currentReport) {
      try {
        // Generate PDF from the report data
        const pdfBlob = generatePDF(currentReport);
        
        // Create a download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${currentReport.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Report downloaded",
          description: `${currentReport.title} has been downloaded as PDF.`,
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
          title: "Error",
          description: "There was a problem generating your PDF.",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-farm-brown-dark">Reports</h1>
            <p className="text-muted-foreground">View and generate farm reports</p>
          </header>
          
          <div className="mb-8">
            <Tabs defaultValue="generate">
              <TabsList className="mb-6">
                <TabsTrigger value="generate">Generate Report</TabsTrigger>
                <TabsTrigger value="recent">Recent Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="generate">
                <ReportGenerator 
                  onGenerate={handleGenerateReport} 
                  isGenerating={isGenerating} 
                />
              </TabsContent>
              
              <TabsContent value="recent">
                <div className="bg-white rounded-lg shadow border border-border">
                  <div className="p-4 font-medium border-b">
                    Recent Reports
                  </div>
                  <div className="p-4">
                    {recentReports.length > 0 ? (
                      <div className="space-y-2">
                        {recentReports.map((report) => (
                          <div 
                            key={report.id} 
                            className="p-4 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
                            onClick={() => handleViewReport(report)}
                          >
                            <h3 className="font-medium">{report.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Generated on {new Date(report.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No recent reports</p>
                        <p className="text-sm">Generate a report to see it here</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {currentReport && (
            <div className="mb-6">
              <div className="flex justify-end mb-4 space-x-2 print:hidden">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              <ReportViewer report={currentReport} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
