
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHealthAlerts, resolveHealthAlert } from "@/services/api";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const HealthStatus = () => {
  const [showResolved, setShowResolved] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: alerts, isLoading, error } = useQuery({
    queryKey: ['healthAlerts', showResolved],
    queryFn: () => getHealthAlerts(showResolved),
  });
  
  const mutation = useMutation({
    mutationFn: resolveHealthAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthAlerts'] });
      toast({
        title: "Alert resolved",
        description: "The health alert has been marked as resolved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resolve health alert",
        variant: "destructive",
      });
    }
  });
  
  const handleResolve = (alertId: string) => {
    mutation.mutate(alertId);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-farm-green" />
        </div>
      );
    }
    
    if (error || !alerts) {
      return (
        <div className="flex flex-col items-center justify-center h-32 text-red-500">
          <p>Failed to load health alerts</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['healthAlerts'] })}
          >
            Retry
          </Button>
        </div>
      );
    }
    
    if (alerts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-32 text-gray-400">
          <p>{showResolved ? "No resolved alerts" : "No active health alerts"}</p>
          <p className="text-sm">{showResolved ? "No historical alerts found" : "All chickens seem healthy!"}</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="flex items-start p-3 border rounded-md bg-white shadow-sm">
            <div className={`p-2 rounded-full mr-3 ${getSeverityColor(alert.severity)}`}>
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-800">{alert.description}</h4>
                <span className="text-xs text-gray-500">{formatDate(alert.date)}</span>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                {alert.coopId && <span>Location: {getCoopName(alert.coopId)} • </span>}
                <span className="capitalize">Type: {alert.alertType}</span>
              </div>
              {!showResolved && (
                <div className="mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-farm-green border-farm-green hover:bg-farm-green hover:text-white"
                    onClick={() => handleResolve(alert.id)}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending && mutation.variables === alert.id ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    )}
                    Mark as Resolved
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Health Alerts</h3>
        <div className="flex gap-2 items-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowResolved(!showResolved)}
            className="text-xs"
          >
            Show {showResolved ? "active" : "resolved"}
          </Button>
          <Badge variant="outline" className={showResolved 
            ? "bg-gray-100 text-gray-600 border-gray-200" 
            : "bg-farm-green/10 text-farm-green-dark border-farm-green/20"
          }>
            {showResolved ? "Resolved" : "Active"}
          </Badge>
        </div>
      </div>
      
      {renderContent()}
      
      <div className="mt-4 text-right">
        <a href="#" className="text-sm text-farm-green-dark hover:underline">
          View all alerts →
        </a>
      </div>
    </div>
  );
};

// Helper functions
const getSeverityColor = (severity: string) => {
  switch(severity) {
    case "low":
      return "bg-yellow-500";
    case "medium":
      return "bg-orange-500";
    case "high":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const getCoopName = (coopId: string) => {
  const coopNames: {[key: string]: string} = {
    "coop-1": "North Coop",
    "coop-2": "South Coop",
    "coop-3": "West Coop"
  };
  
  return coopNames[coopId] || coopId;
};

export default HealthStatus;
