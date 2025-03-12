import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SimpleAuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  
  // Login form state
  const [username, setUsername] = useState("testuser");
  const [password, setPassword] = useState("password123");
  
  // Registration form state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Attempting login with:", { username, password });
      
      // Direct login API call
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login error:", response.status, errorText);
        setError(errorText || "Login failed");
        return;
      }
      
      const userData = await response.json();
      console.log("Login successful:", userData);
      
      // Store user ID in localStorage for session persistence
      localStorage.setItem("fittrack_user_id", userData.id.toString());
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.firstName}!`,
      });
      
      // Navigate to the home page after login
      window.location.href = "/home";
      
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerUsername || !registerPassword || !firstName) {
      setError("Username, password, and first name are required");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = {
        username: registerUsername,
        password: registerPassword,
        firstName,
        lastName: lastName || undefined,
        fitnessLevel,
      };
      
      console.log("Attempting registration with:", userData);
      
      // Direct registration API call
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Registration error:", response.status, errorText);
        setError(errorText || "Registration failed");
        return;
      }
      
      const user = await response.json();
      console.log("Registration successful:", user);
      
      // Store user ID in localStorage for session persistence
      localStorage.setItem("fittrack_user_id", user.id.toString());
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.firstName}!`,
      });
      
      // Navigate to the home page after registration
      window.location.href = "/home";
      
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          FitTrack {mode === "login" ? "Login" : "Registration"}
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 mb-6">
            {error}
          </div>
        )}
        
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            
            <p className="text-sm text-center text-gray-500 mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                Register here
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="registerUsername" className="block text-sm font-medium">
                Username
              </label>
              <Input
                id="registerUsername"
                type="text"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                placeholder="Choose a username"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="registerPassword" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="registerPassword"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Choose a password"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="fitnessLevel" className="block text-sm font-medium">
                Fitness Level
              </label>
              <select
                id="fitnessLevel"
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
            
            <p className="text-sm text-center text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                Sign in here
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}