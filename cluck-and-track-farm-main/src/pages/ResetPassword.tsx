
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Egg, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Missing information",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Reset failed",
        description: "Unable to send reset email. Please try again.",
        variant: "destructive",
      });
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
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          
          {isSuccess ? (
            <CardContent className="text-center space-y-4">
              <p className="text-green-600">Check your email for the reset link!</p>
              <Link to="/login" className="text-farm-green hover:text-farm-green-dark">
                Back to login
              </Link>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
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
                      required
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-farm-green hover:bg-farm-green-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </Button>
                
                <Link 
                  to="/login"
                  className="text-sm text-farm-green hover:text-farm-green-dark"
                >
                  Back to login
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
