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
    // Store a flag in sessionStorage to prevent infinite loops
    const redirectAttempted = sessionStorage.getItem('redirect_attempted');
    
    if (redirectAttempted) {
      console.log("Redirect already attempted in this session, preventing loop");
      return;
    }
    
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (userId) {
      console.log("Checking auth for user ID:", userId);
      
      // Set the flag to prevent loops
      sessionStorage.setItem('redirect_attempted', 'true');
      
      // Verify user exists on the server
      fetch(`/api/users/${userId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error("User not found or server error");
          }
          return res.json();
        })
        .then(data => {
          if (data.message === "User not found" || !data.id) {
            console.log("User auth check failed, clearing stored data");
            localStorage.removeItem(STORAGE_KEYS.USER_ID);
            sessionStorage.removeItem('redirect_attempted');
            return;
          }
          
          console.log("User auth check successful:", data);
          // Redirect to home page immediately if user is authenticated
          window.location.href = '/';
        })
        .catch(err => {
          console.error("Failed to verify user:", err);
          // Clear invalid user ID
          localStorage.removeItem(STORAGE_KEYS.USER_ID);
          sessionStorage.removeItem('redirect_attempted');
        });
    } else {
      console.log("No stored user ID found, not authenticated");
    }
  }, []);
  
  // Enhanced function to handle redirect after successful auth
  const redirectToHome = () => {
    console.log("SimpleLogin: Preparing enhanced home page redirect");
    
    // Clear all session storage to avoid any redirection loops
    sessionStorage.clear();
    
    // Verify user ID exists in localStorage 
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) {
      console.error("SimpleLogin: No user ID found in local storage before redirect!");
      toast({
        title: "Error",
        description: "Authentication issue - unable to complete login process",
        variant: "destructive"
      });
      return;
    }
    
    // Show visual feedback
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '0';
    message.style.left = '0';
    message.style.width = '100%';
    message.style.padding = '1rem';
    message.style.backgroundColor = '#4CAF50';
    message.style.color = 'white';
    message.style.textAlign = 'center';
    message.style.zIndex = '9999';
    message.innerText = 'Authentication successful! Redirecting...';
    document.body.appendChild(message);
    
    // Set success flags for the home component to detect
    const timestamp = new Date().getTime();
    localStorage.setItem('LOGIN_REDIRECT_SUCCESS', 'true');
    localStorage.setItem('LOGIN_REDIRECT_TIMESTAMP', timestamp.toString());
    
    // Use minimal delay for better UX
    setTimeout(() => {
      try {
        console.log("SimpleLogin: Executing direct homepage navigation");
        
        // Use window.open with _self for most reliable navigation reset
        window.open('/', '_self');
      } catch (e) {
        console.error("SimpleLogin: Primary redirect method failed:", e);
        
        // Add a backup flag for emergency situations
        localStorage.setItem('REDIRECT_EMERGENCY', 'true');
        
        // Try fallback method without alert for better UX
        window.location.href = '/';
      }
    }, 100);
  };
  
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
        
        // Try direct API call first to bypass potential AuthContext issues
        console.log("Attempting direct API registration");
        
        const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            firstName,
            lastName,
            fitnessLevel: "beginner",
            dailyStepsGoal: 10000,
            workoutFrequency: 3
          }),
          credentials: 'include'
        });
        
        const data = await response.json();
        console.log("Registration API response:", data);
        
        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }
        
        // Store user data directly for testing
        localStorage.setItem(STORAGE_KEYS.USER_ID, data.id.toString());
        
        // Show single success toast (no alert in production)
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        });
        
        // Set registration flag to show a special welcome message
        localStorage.setItem('REGISTRATION_SUCCESS', 'true');
        
        // Call the redirect function after a brief delay to let toast appear
        setTimeout(() => {
          redirectToHome();
        }, 300);
      } else {
        // Validation
        if (!username || !password) {
          throw new Error("Please enter both username and password");
        }
        
        console.log("Login attempted with:", { username, password });
        
        // Try direct API call first to bypass potential AuthContext issues
        console.log("Attempting direct API login");
        
        const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
          credentials: 'include'
        });
        
        const data = await response.json();
        console.log("Login API response:", data);
        
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
        
        // Store user data directly for testing
        localStorage.setItem(STORAGE_KEYS.USER_ID, data.id.toString());
        
        // Show success toast (no alert in production)
        toast({
          title: "Login successful",
          description: "You have been logged in successfully!",
        });
        
        // Call the redirect function after a brief delay to let toast appear
        setTimeout(() => {
          redirectToHome();
        }, 300);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      // More detailed error logging to help debug the issue
      if (error.cause) console.error("Error cause:", error.cause);
      if (error.stack) console.error("Error stack:", error.stack);
      
      // Enhanced error feedback with more details
      const errorMessage = error.message || "Authentication failed";
      
      // Clear any previous error tracking
      localStorage.removeItem('AUTH_ERROR'); 
      
      // Track this error with timestamp
      localStorage.setItem('AUTH_ERROR', 'true');
      localStorage.setItem('AUTH_ERROR_TIME', new Date().getTime().toString());
      
      // Show error toast (no alert in production)
      toast({
        title: isRegistering ? "Registration failed" : "Login failed",
        description: errorMessage,
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