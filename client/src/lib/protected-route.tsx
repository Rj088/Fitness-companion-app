import { useAuth } from "./context/AuthContext";
import { Route, Redirect } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  path: string;
  component: React.FC<any>;
}

export function ProtectedRoute({
  path,
  component: Component,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Route path={path}>
      {(params) => {
        if (loading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        if (!isAuthenticated) {
          return <Redirect to="/auth" />;
        }

        return <Component params={params} />;
      }}
    </Route>
  );
}