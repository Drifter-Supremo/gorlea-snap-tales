
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signUp, continueAsGuest, isAuthenticated, isLoading, forgotPassword } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  // If already authenticated, redirect to main app
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/app");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
      navigate("/app");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(signupEmail, signupPassword, signupName);
      navigate("/app");
    } catch (error) {
      console.error("Sign up failed", error);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(resetEmail);
      setShowResetForm(false);
    } catch (error) {
      console.error("Password reset failed", error);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate("/app");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gorlea-background">
        <div className="animate-pulse-slow">
          <Logo size="lg" />
          <p className="mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gorlea-background p-4 bg-pattern">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center text-center">
          <Logo size="lg" />
          <p className="mt-4 text-lg">Create AI-generated stories from your photos</p>
        </div>

        {showResetForm ? (
          <Card className="bg-gorlea-secondary border-gorlea-tertiary">
            <CardHeader>
              <CardTitle className="text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    placeholder="your.email@example.com"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="bg-gorlea-background border-gorlea-tertiary text-gorlea-text"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  type="submit" 
                  className="w-full bg-gorlea-accent hover:bg-gorlea-accent/80 text-white"
                >
                  Send Reset Link
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowResetForm(false)}
                  className="w-full border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                >
                  Back to Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-gorlea-tertiary">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="bg-gorlea-secondary border-gorlea-tertiary">
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle className="text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center">
                      Sign in to your account to continue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="your.email@example.com"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="bg-gorlea-background border-gorlea-tertiary text-gorlea-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Password</Label>
                        <button 
                          type="button" 
                          onClick={() => setShowResetForm(true)}
                          className="text-xs text-gorlea-accent hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="bg-gorlea-background border-gorlea-tertiary text-gorlea-text"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-gorlea-accent hover:bg-gorlea-accent/80 text-white"
                    >
                      Sign In
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGuest}
                      className="w-full border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                    >
                      Continue as Guest
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="bg-gorlea-secondary border-gorlea-tertiary">
                <form onSubmit={handleSignUp}>
                  <CardHeader>
                    <CardTitle className="text-center">Create Account</CardTitle>
                    <CardDescription className="text-center">
                      Join Gorlea Snaps to create your own AI stories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your Name"
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                        className="bg-gorlea-background border-gorlea-tertiary text-gorlea-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        placeholder="your.email@example.com"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        className="bg-gorlea-background border-gorlea-tertiary text-gorlea-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        className="bg-gorlea-background border-gorlea-tertiary text-gorlea-text"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-gorlea-accent hover:bg-gorlea-accent/80 text-white"
                    >
                      Create Account
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGuest}
                      className="w-full border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                    >
                      Continue as Guest
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
