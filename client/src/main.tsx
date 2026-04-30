import { createRoot } from "react-dom/client";
import App from "./App";
import "./lib/api-url";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
