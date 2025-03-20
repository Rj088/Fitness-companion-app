import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Home from './Home';
import { useToast } from "@/hooks/use-toast";
import StatusBar from "@/components/StatusBar";
import TabBar from "@/components/TabBar";

// This is a special test page that will automatically log in
// and force display of the home page for testing

export default function ForceLoginPage() {
  const [showHome, setShowHome] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(true);
  
  useEffect(() => {
    // If we're already authenticated, show home
    if (isAuthenticated && user) {
      setShowHome(true);
      setShowForm(false);
    }
  }, [isAuthenticated, user]);
  
  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter username and password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = await login({ username, password });
      if (success) {
        toast({
          title: "Success",
          description: "Login successful",
        });
        setShowHome(true);
        setShowForm(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive",
      });
    }
  };
  
  if (showHome) {
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        <StatusBar />
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="bg-green-500 text-white p-2 text-center font-bold">
            LOGIN SUCCESSFUL - SHOWING HOME PAGE
          </div>
          <Home />
        </div>
        <TabBar />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Direct Login Test</h1>
        <p className="text-center mb-4">
          This page will log in and immediately show the home page for testing
        </p>
        
        {showForm && (
          <div className="space-y-4">
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
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Login and Show Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}