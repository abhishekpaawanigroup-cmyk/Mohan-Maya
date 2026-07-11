import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { I18nProvider } from "./context/I18nContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nProvider>
      <AppProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AppProvider>
    </I18nProvider>
  </StrictMode>
);
