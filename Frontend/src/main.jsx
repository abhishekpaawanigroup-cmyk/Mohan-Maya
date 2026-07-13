import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { I18nProvider } from "./context/I18nContext.jsx";
 community
import { CurrencyProvider } from "./context/CurrencyContext.jsx";

import { NotificationProvider } from "./context/NotificationContext.jsx";
 main

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nProvider>
 community
      <CurrencyProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </CurrencyProvider>

      <AppProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AppProvider>
 main
    </I18nProvider>
  </StrictMode>
);
