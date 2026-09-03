import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { queryClient } from "@/config/queryClient";
import { AppBootstrap } from "@/features/bootstrap/ui/AppBootstrap";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppBootstrap>
          <App />
        </AppBootstrap>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
