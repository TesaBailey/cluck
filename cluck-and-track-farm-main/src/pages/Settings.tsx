
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const [farmSettings, setFarmSettings] = useState({
    farmName: "Green Valley Poultry",
    address: "123 Farm Road, Countryside",
    phoneNumber: "(555) 123-4567",
    email: "contact@greenvalleypoultry.com"
  });
  
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    dailyReports: true,
    healthAlerts: true
  });
  
  const handleFarmSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFarmSettings({
      ...farmSettings,
      [e.target.name]: e.target.value
    });
  };
  
  const handleNotificationChange = (setting: string) => {
    setNotifications({
      ...notifications,
      [setting]: !notifications[setting as keyof typeof notifications]
    });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your farm settings have been updated successfully.",
    });
  };
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-farm-brown-dark">Settings</h1>
            <p className="text-muted-foreground">Manage your farm account and preferences</p>
          </header>
          
          <div className="space-y-6">
            {/* Farm Information */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-farm-brown/10">
              <h2 className="text-xl font-semibold mb-4">Farm Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">
                    Farm Name
                  </label>
                  <Input
                    id="farmName"
                    name="farmName"
                    value={farmSettings.farmName}
                    onChange={handleFarmSettingChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={farmSettings.address}
                    onChange={handleFarmSettingChange}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={farmSettings.phoneNumber}
                      onChange={handleFarmSettingChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      value={farmSettings.email}
                      onChange={handleFarmSettingChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings} className="mt-4 bg-farm-green hover:bg-farm-green-dark">
                Save Changes
              </Button>
            </div>
            
            {/* Notification Preferences */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-farm-brown/10">
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      id={key}
                      type="checkbox"
                      checked={value}
                      onChange={() => handleNotificationChange(key)}
                      className="h-4 w-4 border-gray-300 rounded text-farm-green focus:ring-farm-green"
                    />
                    <label htmlFor={key} className="ml-2 text-sm font-medium text-gray-700">
                      {formatLabel(key)}
                    </label>
                  </div>
                ))}
              </div>
              
              <Button onClick={handleSaveSettings} className="mt-4 bg-farm-green hover:bg-farm-green-dark">
                Save Preferences
              </Button>
            </div>
            
            {/* Account Settings */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-farm-brown/10">
              <h2 className="text-xl font-semibold mb-4">Account</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Logged in as:</p>
                  <p className="text-base">{user?.name} ({user?.email})</p>
                  <p className="text-sm text-gray-500">Role: {formatRole(user?.role)}</p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatLabel = (key: string): string => {
  // Convert camelCase to Title Case with spaces
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const formatRole = (role?: string): string => {
  if (!role) return 'User';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default Settings;
