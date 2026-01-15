import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { authClient } from "./lib/auth";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
import "@neondatabase/neon-js/ui/css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NeonAuthUIProvider emailOTP authClient={authClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </NeonAuthUIProvider>
  </StrictMode>
);
