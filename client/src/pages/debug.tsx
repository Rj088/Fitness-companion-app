import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";

export default function DebugPage() {
  useEffect(() => {
    console.log("Debug page loaded");
  }, []);

  const { isAuthenticated, user, loading, error } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Auth Debug Page</CardTitle>
          <CardDescription>
            Use this page to debug authentication issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg overflow-hidden">
            <pre className="overflow-x-auto whitespace-pre-wrap break-words">
              {`isAuthenticated: ${isAuthenticated}
loading: ${loading}
error: ${error}
user: ${JSON.stringify(user, null, 2)}`}
            </pre>
          </div>

          <div className="flex gap-4">
            <Button asChild>
              <Link href="/auth">Go to Auth Page</Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}