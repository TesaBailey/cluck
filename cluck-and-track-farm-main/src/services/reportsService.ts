import { 
  ReportType,
  ReportGenerationOptions,
  Report 
} from "@/types";
import { format } from "date-fns";
import { getReportTitle } from "./reports/utils";
import { generateEggProductionReport } from "./reports/eggProductionReport";
import { generateFinancialReport } from "./reports/financialReport";

export async function generateReport(options: ReportGenerationOptions): Promise<Report | null> {
  try {
    let reportData = null;
    const reportId = crypto.randomUUID();
    const formattedStartDate = format(options.startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(options.endDate, 'yyyy-MM-dd');
    
    switch (options.type) {
      case "egg-production":
        reportData = await generateEggProductionReport(options.startDate, options.endDate);
        break;
      case "finances":
        reportData = await generateFinancialReport(options.startDate, options.endDate);
        break;
      // Other report types would be handled here
    }
    
    if (!reportData) {
      return null;
    }
    
    const report: Report = {
      id: reportId,
      title: `${getReportTitle(options.type)} (${formattedStartDate} - ${formattedEndDate})`,
      type: options.type,
      date: format(new Date(), 'yyyy-MM-dd'),
      data: reportData,
      createdAt: new Date().toISOString()
    };
    
    return report;
  } catch (error) {
    console.error("Error generating report:", error);
    return null;
  }
}

export async function getReports(): Promise<Report[]> {
  // For now, return an empty array as we would fetch from backend in a real app
  return [];
}

// Keep the object export for backward compatibility
export const reportsService = {
  generateReport,
  getReports
};
