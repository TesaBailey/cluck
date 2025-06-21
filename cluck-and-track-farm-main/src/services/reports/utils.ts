
import { format } from "date-fns";
import { ReportType } from "@/types";

export function getReportTitle(type: ReportType): string {
  switch (type) {
    case "egg-production":
      return "Egg Production Report";
    case "finances":
      return "Financial Report";
    case "feed-consumption":
      return "Feed Consumption Report";
    case "health":
      return "Health Report";
    case "environment":
      return "Environmental Conditions Report";
    default:
      return "Custom Report";
  }
}
