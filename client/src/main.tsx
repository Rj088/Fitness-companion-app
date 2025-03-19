import { createRoot } from "react-dom/client";
import "./index.css";
import SimpleLogin from "./simpleLogin";

// For now, let's use the direct SimpleLogin component to make sure it works
createRoot(document.getElementById("root")!).render(
  <SimpleLogin />
);
