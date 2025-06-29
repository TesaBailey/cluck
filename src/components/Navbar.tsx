
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useMobile } from "@/hooks/use-mobile";
import { Egg, Menu, Home, Users, MapPin, ClipboardList, BarChart3, Settings, LogOut, ShoppingBasket, DollarSign, CreditCard } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    setIsSheetOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home className="h-6 w-6" /> },
    { name: "Chickens", path: "/chickens", icon: <Users className="h-6 w-6" /> },
    { name: "Coops", path: "/coops", icon: <MapPin className="h-6 w-6" /> },
    { name: "Cages", path: "/cages", icon: <Users className="h-6 w-6" /> },
    { name: "Egg Collection", path: "/egg-collection", icon: <ClipboardList className="h-6 w-6" /> },
    { name: "Credit Tracker", path: "/credit-tracker", icon: <CreditCard className="h-6 w-6" /> },
    { name: "Inventory", path: "/inventory", icon: <ShoppingBasket className="h-6 w-6" /> },
    { name: "Finances", path: "/finances", icon: <DollarSign className="h-6 w-6" /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 className="h-6 w-6" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-6 w-6" /> },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  };

  const handleLogout = async () => {
    await logout();
  };
  
  // Get initials from user name or email
  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.name) {
      return user.name
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return "U";
  };

  const renderNavItems = () => (
    <div className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center py-2 px-3 rounded-md transition-colors ${
            isActive(item.path)
              ? "bg-farm-green text-white"
              : "hover:bg-muted-foreground/10 text-gray-700"
          }`}
        >
          <div className="mr-3">{item.icon}</div>
          <span className="text-base font-medium">{item.name}</span>
        </Link>
      ))}
      <Separator className="my-2" />
      <Button
        variant="ghost"
        className="flex items-center justify-start hover:bg-muted-foreground/10 text-gray-700"
        onClick={handleLogout}
      >
        <LogOut className="mr-3 h-6 w-6" />
        <span className="text-base font-medium">Logout</span>
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex items-center space-x-2 mb-4">
                <Egg className="h-6 w-6 text-farm-green" />
                <h1 className="text-xl font-bold text-farm-brown-dark">Cluck & Track</h1>
              </div>
              <Separator className="my-2" />
              {renderNavItems()}
            </SheetContent>
          </Sheet>
          <div className="flex items-center space-x-2">
            <Egg className="h-5 w-5 text-farm-green" />
            <span className="text-lg font-bold text-farm-brown-dark">Cluck & Track</span>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl || undefined} />
            <AvatarFallback className="bg-farm-green text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 w-64 border-r bg-white z-30">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Egg className="h-8 w-8 text-farm-green" />
            <h1 className="text-2xl font-bold text-farm-brown-dark">Cluck & Track</h1>
          </div>
        </div>
        <Separator />
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6 mt-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatarUrl || undefined} />
              <AvatarFallback className="bg-farm-green text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user?.name || "User"}</span>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          {renderNavItems()}
        </div>
      </aside>
      <div className="h-full md:pl-64"></div>
    </>
  );
};

export default Navbar;
