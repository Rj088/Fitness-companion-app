
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/context/AuthContext";

export default function SimpleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration form state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { login: authLogin, register: authRegister } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Attempting login with:", { username, password });
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login error:", response.status, errorText);
        setError(errorText || "Login failed");
        return;
      }
      
      const userData = await response.json();
      console.log("Login successful:", userData);
      
      // Store user ID in localStorage for persistence
      localStorage.setItem("fittrack_user_id", userData.id.toString());
      
      // Update auth context
      authLogin(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.firstName}!`
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
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
        age: age ? parseInt(age) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined
      };
      
      console.log("Attempting registration with:", userData);
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include"
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Registration error:", response.status, errorText);
        setError(errorText || "Registration failed");
        return;
      }
      
      const newUser = await response.json();
      console.log("Registration successful:", newUser);
      
      // Store user ID in localStorage for persistence
      localStorage.setItem("fittrack_user_id", newUser.id.toString());
      
      // Update auth context
      authRegister(newUser);
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${newUser.firstName}!`
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleMode = () => {
    setActiveTab(activeTab === "login" ? "register" : "login");
    setError(null);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">FitTrack</CardTitle>
          <CardDescription className="text-center">
            {activeTab === "login" ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 my-4">
                {error}
              </div>
            )}
            
            <TabsContent value="login">
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
                    required
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
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
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
                      required
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
                    required
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
                    required
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
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                    disabled={isLoading}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="age" className="block text-sm font-medium">
                      Age
                    </label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="weight" className="block text-sm font-medium">
                      Weight (kg)
                    </label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Weight"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="height" className="block text-sm font-medium">
                      Height (cm)
                    </label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Height"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
