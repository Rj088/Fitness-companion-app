import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import "./index.css";
import { STORAGE_KEYS } from "./lib/constants";

// Simple dashboard component
function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchUserData() {
      try {
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
        
        if (!userId) {
          throw new Error("Not authenticated");
        }
        
        const response = await fetch(`/api/users/${userId}`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        
        const userData = await response.json();
        setUser(userData);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setError(error.message);
        setLoading(false);
        
        // Redirect back to login after error
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    }
    
    fetchUserData();
  }, []);
  
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include"
      });
      
      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      
      // Redirect to login
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out");
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
          <p className="mb-4">{error}</p>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FitTrack Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Welcome, {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 mb-1">Username</p>
              <p className="font-medium">{user?.username}</p>
            </div>
            
            <div>
              <p className="text-gray-500 mb-1">Name</p>
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
            </div>
            
            <div>
              <p className="text-gray-500 mb-1">Fitness Level</p>
              <p className="font-medium capitalize">{user?.fitnessLevel || "Not set"}</p>
            </div>
            
            <div>
              <p className="text-gray-500 mb-1">Daily Steps Goal</p>
              <p className="font-medium">{user?.dailyStepsGoal || "Not set"}</p>
            </div>
            
            <div>
              <p className="text-gray-500 mb-1">Weekly Workout Goal</p>
              <p className="font-medium">{user?.workoutFrequency || "Not set"} workouts per week</p>
            </div>
            
            <div>
              <p className="text-gray-500 mb-1">Member Since</p>
              <p className="font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
          
          <hr className="my-6 border-gray-200" />
          
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Multi-User System</h2>
          <p className="mb-4">This application supports multiple users with secure authentication:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Each user has their own profile and data</li>
            <li className="mb-2">Passwords are securely hashed using scrypt</li>
            <li className="mb-2">User-specific fitness data is isolated</li>
            <li className="mb-2">Workout tracking is personalized per user</li>
          </ul>
          
          <p>Try logging out and creating another account to see the multi-user functionality!</p>
        </div>
      </main>
    </div>
  );
}

// Render the dashboard
const root = createRoot(document.getElementById("root")!);
root.render(<Dashboard />);