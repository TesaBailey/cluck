
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Signup from "@/pages/Signup";
import Chickens from "@/pages/Chickens";
import Coops from "@/pages/Coops";
import Cages from "@/pages/Cages";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import UpdatePassword from "@/pages/UpdatePassword";
import ResetPassword from "@/pages/ResetPassword";
import EggCollection from "@/pages/EggCollection";
import Inventory from "@/pages/Inventory";
import Finances from "@/pages/Finances";
import CreditTracker from "@/pages/CreditTracker";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="farm-app-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/chickens" element={<ProtectedRoute><Chickens /></ProtectedRoute>} />
              <Route path="/coops" element={<ProtectedRoute><Coops /></ProtectedRoute>} />
              <Route path="/cages" element={<ProtectedRoute><Cages /></ProtectedRoute>} />
              <Route path="/egg-collection" element={<ProtectedRoute><EggCollection /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/finances" element={<ProtectedRoute><Finances /></ProtectedRoute>} />
              <Route path="/credit-tracker" element={<ProtectedRoute><CreditTracker /></ProtectedRoute>} />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
