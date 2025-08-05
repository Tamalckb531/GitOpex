import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TabProvider } from "./context/TabProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <TabProvider>
    <App />
  </TabProvider>
);
