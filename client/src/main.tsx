import { createRoot } from "react-dom/client";
import { useState } from "react";
import "./index.css";
import { AuthProvider } from "./lib/context/AuthContext";

// Simple standalone login page for testing
function SimpleLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log("Rendering SimpleLogin component");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        console.log("Registration attempted with:", { username, password, firstName, lastName });
        
        // Call registration API
        const response = await fetch("/api/register", {
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
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }
        
        console.log("Registration successful:", data);
        alert("Account created successfully! Please log in with your new credentials.");
        setIsRegistering(false);
      } else {
        console.log("Login attempted with:", { username, password });
        
        // Call login API
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }
        
        console.log("Login successful:", data);
        
        // Store the user id in localStorage
        localStorage.setItem("fittrack_user_id", data.user.id.toString());
        
        alert("Login successful! Redirecting to dashboard...");
        
        // Redirect to the main app (temporarily commented out since we're not using the full app)
        // window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      alert(error.message || "Authentication failed");
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

// For debugging, we're temporarily replacing the entire app with just the login component
const root = createRoot(document.getElementById("root")!);
console.log("Root element found:", document.getElementById("root"));
console.log("Rendering SimpleLogin directly");

root.render(<SimpleLogin />);
