import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { I18nProvider } from "./context/I18nContext.jsx";
import { CurrencyProvider } from "./context/CurrencyContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nProvider>
      <CurrencyProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </CurrencyProvider>
    </I18nProvider>
  </StrictMode>
);
