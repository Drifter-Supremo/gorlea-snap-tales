
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

// Password validation regex - only requires 8+ characters
const PASSWORD_REGEX = /^.{8,}$/;
// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthView = 'login' | 'signup' | 'reset';

interface AuthPageProps {
  initialView?: AuthView;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialView = 'login' }) => {
  const navigate = useNavigate();
  const { login, signUp, isAuthenticated, isLoading: authLoading, forgotPassword } = useAuth();

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [activeTab, setActiveTab] = useState<AuthView>(initialView);
  const [showResetForm, setShowResetForm] = useState(initialView === 'reset');

  // Loading states
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Error states
  const [signupError, setSignupError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  // Validation states
  const [signupEmailValid, setSignupEmailValid] = useState(true);
  const [signupPasswordValid, setSignupPasswordValid] = useState(true);
  const [signupConfirmPasswordValid, setSignupConfirmPasswordValid] = useState(true);
  const [signupNameValid, setSignupNameValid] = useState(true);
  const [loginPasswordValid, setLoginPasswordValid] = useState(true);

  // Update active tab when initialView changes
  React.useEffect(() => {
    setActiveTab(initialView);
    setShowResetForm(initialView === 'reset');
  }, [initialView]);

  // If already authenticated, redirect to main app
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/app");
    }
  }, [isAuthenticated, navigate]);

  // Validate signup form
  const validateSignupForm = () => {
    let isValid = true;

    // Validate name
    if (!signupName.trim()) {
      setSignupNameValid(false);
      isValid = false;
    } else {
      setSignupNameValid(true);
    }

    // Validate email
    if (!EMAIL_REGEX.test(signupEmail)) {
      setSignupEmailValid(false);
      isValid = false;
    } else {
      setSignupEmailValid(true);
    }

    // Validate password
    if (!PASSWORD_REGEX.test(signupPassword)) {
      setSignupPasswordValid(false);
      isValid = false;
    } else {
      setSignupPasswordValid(true);
    }

    // Validate password confirmation
    if (signupPassword !== signupConfirmPassword) {
      setSignupConfirmPasswordValid(false);
      isValid = false;
    } else {
      setSignupConfirmPasswordValid(true);
    }

    return isValid;
  };

  // Validate login form
  const validateLoginForm = () => {
    let isValid = true;

    // Validate password (only check length)
    if (!PASSWORD_REGEX.test(loginPassword)) {
      setLoginPasswordValid(false);
      isValid = false;
    } else {
      setLoginPasswordValid(true);
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Validate form before submission
    if (!validateLoginForm()) {
      setLoginError("Please fix the validation errors before submitting.");
      return;
    }

    setIsLoggingIn(true);

    try {
      await login(loginEmail, loginPassword);
      navigate("/app");
    } catch (error: any) {
      console.error("Login failed", error);
      setLoginError(error.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    // Validate form before submission
    if (!validateSignupForm()) {
      setSignupError("Please fix the validation errors before submitting.");
      return;
    }

    setIsSigningUp(true);

    try {
      await signUp(signupEmail, signupPassword, signupName);
      // If successful, the auth state listener will update and redirect
    } catch (error: any) {
      console.error("Sign up failed", error);
      setSignupError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setIsResettingPassword(true);

    try {
      await forgotPassword(resetEmail);
      setShowResetForm(false);
    } catch (error: any) {
      console.error("Password reset failed", error);
      setResetError(error.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsResettingPassword(false);
    }
  };



  if (authLoading) {
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
          <p className="mt-4 text-lg">Create stories from your photos</p>
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
                {resetError && (
                  <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{resetError}</AlertDescription>
                  </Alert>
                )}

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
                    disabled={isResettingPassword}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-gorlea-accent hover:bg-gorlea-accent/80 text-white"
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowResetForm(false)}
                  disabled={isResettingPassword}
                  className="w-full border-gorlea-tertiary text-gorlea-text hover:bg-gorlea-tertiary"
                >
                  Back to Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as AuthView)}
            className="w-full"
          >
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
                    {loginError && (
                      <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}

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
                        disabled={isLoggingIn}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password" className={!loginPasswordValid ? "text-red-500" : ""}>Password</Label>
                        <button
                          type="button"
                          onClick={() => setShowResetForm(true)}
                          className="text-xs text-gorlea-accent hover:underline"
                          disabled={isLoggingIn}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (!loginPasswordValid) setLoginPasswordValid(true);
                        }}
                        required
                        className={`bg-gorlea-background text-gorlea-text ${!loginPasswordValid ? "border-red-500 focus-visible:ring-red-500" : "border-gorlea-tertiary"}`}
                        disabled={isLoggingIn}
                      />
                      {!loginPasswordValid && (
                        <p className="text-red-500 text-xs mt-1">Password must be at least 8 characters</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button
                      type="submit"
                      className="w-full bg-gorlea-accent hover:bg-gorlea-accent/80 text-white"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
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
                      Join Gorlea Snaps to create your own stories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {signupError && (
                      <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{signupError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name" className={!signupNameValid ? "text-red-500" : ""}>Name</Label>
                      <Input
                        id="name"
                        placeholder="Your Name"
                        type="text"
                        value={signupName}
                        onChange={(e) => {
                          setSignupName(e.target.value);
                          if (!signupNameValid) setSignupNameValid(true);
                        }}
                        required
                        className={`bg-gorlea-background text-gorlea-text ${!signupNameValid ? "border-red-500 focus-visible:ring-red-500" : "border-gorlea-tertiary"}`}
                      />
                      {!signupNameValid && (
                        <p className="text-red-500 text-xs mt-1">Please enter your name</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className={!signupEmailValid ? "text-red-500" : ""}>Email</Label>
                      <Input
                        id="signup-email"
                        placeholder="your.email@example.com"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => {
                          setSignupEmail(e.target.value);
                          if (!signupEmailValid) setSignupEmailValid(true);
                        }}
                        required
                        className={`bg-gorlea-background text-gorlea-text ${!signupEmailValid ? "border-red-500 focus-visible:ring-red-500" : "border-gorlea-tertiary"}`}
                      />
                      {!signupEmailValid && (
                        <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className={!signupPasswordValid ? "text-red-500" : ""}>Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => {
                          setSignupPassword(e.target.value);
                          if (!signupPasswordValid) setSignupPasswordValid(true);
                          // Also validate confirm password if it's already been entered
                          if (signupConfirmPassword && !signupConfirmPasswordValid) {
                            setSignupConfirmPasswordValid(e.target.value === signupConfirmPassword);
                          }
                        }}
                        required
                        className={`bg-gorlea-background text-gorlea-text ${!signupPasswordValid ? "border-red-500 focus-visible:ring-red-500" : "border-gorlea-tertiary"}`}
                      />
                      {!signupPasswordValid && (
                        <p className="text-red-500 text-xs mt-1">Password must be at least 8 characters</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className={!signupConfirmPasswordValid ? "text-red-500" : ""}>Confirm Password</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => {
                          setSignupConfirmPassword(e.target.value);
                          setSignupConfirmPasswordValid(signupPassword === e.target.value);
                        }}
                        required
                        className={`bg-gorlea-background text-gorlea-text ${!signupConfirmPasswordValid ? "border-red-500 focus-visible:ring-red-500" : "border-gorlea-tertiary"}`}
                      />
                      {!signupConfirmPasswordValid && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button
                      type="submit"
                      className="w-full bg-gorlea-accent hover:bg-gorlea-accent/80 text-white"
                      disabled={isSigningUp}
                    >
                      {isSigningUp ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
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
