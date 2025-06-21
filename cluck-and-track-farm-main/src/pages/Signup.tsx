
import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Egg, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password || !displayName) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // We've modified the signup function to auto-login users
      await signup(email, password, { display_name: displayName });
      // The signup function now navigates to home automatically on success
      // If it returns here, wait for auth state to update
      setTimeout(() => {
        if (!isAuthenticated && !isLoading) {
          navigate("/login", { replace: true });
        }
      }, 1000);
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error?.message || "Could not create account. Please try again.");
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
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Sign up to start managing your farm
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-farm-green hover:bg-farm-green-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
              
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-farm-green hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
