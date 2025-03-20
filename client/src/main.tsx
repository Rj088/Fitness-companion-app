import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import "./index.css";
import DirectApp from "./DirectApp";

// Create a client for React Query
const queryClient = new QueryClient();

// Direct rendering without any authentication
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <DirectApp />
    <Toaster />
  </QueryClientProvider>
);
