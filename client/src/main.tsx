import { createRoot } from "react-dom/client";
import "./index.css";
import FullApp from "./FullApp";

// Render the FullApp with complete functionality
createRoot(document.getElementById("root")!).render(
  <FullApp />
);
