import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./lib/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import "./index.css";
import SimpleLogin from "./simpleLogin";

// Create a client for React Query
const queryClient = new QueryClient();

// Wrap the SimpleLogin in the necessary providers
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SimpleLogin />
      <Toaster />
    </AuthProvider>
  </QueryClientProvider>
);
