import { useState, useEffect } from "react";
import { useAuth } from "./lib/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS, API_ENDPOINTS } from "./lib/constants";
import "./index.css";

// Simple standalone login page for testing
function SimpleLogin() {
  const { isAuthenticated, login, register, user } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log("Rendering SimpleLogin component");
  
  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User already authenticated, redirecting to main app");
      window.location.href = "/";
    }
  }, [isAuthenticated, user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        // Validation
        if (!username || !password || !firstName) {
          throw new Error("Please fill out all required fields");
        }
        
        if (username.length < 3) {
          throw new Error("Username must be at least 3 characters");
        }
        
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        
        console.log("Registration attempted with:", { username, password, firstName, lastName });
        
        // Use the AuthContext register function
        const success = await register({
          username,
          password,
          firstName,
          lastName,
          fitnessLevel: "beginner",
          dailyStepsGoal: 10000,
          workoutFrequency: 3
        });
        
        if (success) {
          console.log("Registration successful via AuthContext");
          toast({
            title: "Account created",
            description: "Your account has been created successfully!",
          });
          
          // AuthContext handles the storage and redirecting
        } else {
          throw new Error("Registration failed");
        }
      } else {
        // Validation
        if (!username || !password) {
          throw new Error("Please enter both username and password");
        }
        
        console.log("Login attempted with:", { username, password });
        
        // Use the AuthContext login function
        const success = await login({ username, password });
        
        if (success) {
          console.log("Login successful via AuthContext");
          toast({
            title: "Login successful",
            description: "You have been logged in successfully!",
          });
          
          // AuthContext handles the storage and redirecting
        } else {
          throw new Error("Login failed");
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: isRegistering ? "Registration failed" : "Login failed",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">FitTrack</h1>
        <p className="text-center text-gray-600 mb-8">
          {isRegistering ? "Create a new account" : "Sign in to your account"}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          {isRegistering && (
            <>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading 
              ? (isRegistering ? "Creating account..." : "Signing in...") 
              : (isRegistering ? "Create account" : "Sign in")
            }
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {isRegistering 
              ? "Already have an account?" 
              : "Don't have an account?"
            }{" "}
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-600 hover:underline"
            >
              {isRegistering ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SimpleLogin;