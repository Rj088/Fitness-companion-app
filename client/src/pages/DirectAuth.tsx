import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";

export default function DirectAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const { login, register, loading } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Improved redirection function with more direct approach
  const redirectToHome = () => {
    console.log("DirectAuth: Preparing forced redirect to home page");
    
    // Clear any redirection flags in session storage
    sessionStorage.clear();
    
    // Show visual confirmation
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
    
    // Set flags for the Home component to detect
    const timestamp = new Date().getTime();
    localStorage.setItem('LOGIN_REDIRECT_SUCCESS', 'true');
    localStorage.setItem('LOGIN_REDIRECT_TIMESTAMP', timestamp.toString());
    
    // Use a shorter delay for better user experience
    setTimeout(() => {
      try {
        console.log("DirectAuth: Executing direct homepage navigation");
        
        // Force the browser to do a full reload to reset all React state
        window.open('/', '_self');
        
      } catch (e) {
        console.error("DirectAuth: Redirect failed:", e);
        
        // Last resort emergency redirect
        window.location.href = '/';
      }
    }, 500);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!isRegistering) {
        // Login
        console.log("DirectAuth: Attempting login...");
        const success = await login({ username, password });
        
        if (success) {
          console.log("DirectAuth: Login successful, preparing to redirect...");
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          
          // Use our improved redirect function
          redirectToHome();
        } else {
          console.log("DirectAuth: Login failed");
        }
      } else {
        // Register
        console.log("DirectAuth: Attempting registration...");
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
          console.log("DirectAuth: Registration successful, preparing to redirect...");
          toast({
            title: "Registration successful",
            description: "Welcome to FitTrack!",
          });
          
          // Use our improved redirect function
          redirectToHome();
        } else {
          console.log("DirectAuth: Registration failed");
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isRegistering ? "Create an Account" : "Sign In"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>
          
          {isRegistering && (
            <>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter your last name"
                />
              </div>
            </>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Processing..." : isRegistering ? "Register" : "Sign In"}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:underline"
          >
            {isRegistering
              ? "Already have an account? Sign in"
              : "Need an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}