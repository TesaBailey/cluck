
import { useState } from "react";
import { useNavigate, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Egg, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailConfirmationError, setIsEmailConfirmationError] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if the user was redirected from email confirmation
  const fromEmailConfirmation = new URLSearchParams(location.search).get('confirmed') === 'true';

  if (isAuthenticated && !isLoading) {
    // If the user came from a protected route, redirect them there after login
    const from = location.state?.from || "/";
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsEmailConfirmationError(false);
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsSubmitting(true);

    try {
      await login(email, password);
      // Navigate will happen automatically via the condition above when isAuthenticated changes
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Check if the error is related to email confirmation
      if (error?.message?.includes("Email not confirmed")) {
        setIsEmailConfirmationError(true);
        setError("Please verify your email before logging in. Check your inbox for a confirmation link.");
      } else {
        setError(error?.message || "Invalid email or password. Please try again.");
      }
      
      setPassword("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Egg className="h-10 w-10 text-farm-green" />
            <h1 className="text-3xl font-bold text-farm-brown-dark">Cluck & Track</h1>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Enter your email and password to access your farm dashboard
            </CardDescription>
          </CardHeader>
          {fromEmailConfirmation && (
            <div className="px-6 -mt-4 mb-4">
              <Alert className="bg-green-50 border-green-100 text-green-800">
                <AlertDescription>
                  Email confirmed successfully! You can now sign in.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link 
                    to="/reset-password" 
                    className="text-sm text-farm-green hover:text-farm-green-dark"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              
              {isEmailConfirmationError && (
                <div className="pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full text-farm-green border-farm-green hover:bg-farm-green/10"
                    onClick={() => {
                      toast({
                        title: "Confirmation email",
                        description: "If your account exists, a new confirmation email will be sent.",
                      });
                      // Note: In a real app, you would integrate with Supabase's resend email confirmation functionality here
                    }}
                  >
                    Resend confirmation email
                  </Button>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-farm-green hover:bg-farm-green-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
              
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-farm-green hover:text-farm-green-dark">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
