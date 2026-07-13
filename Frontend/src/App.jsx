import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { AppProvider } from "./context/AppContext";
import { NotificationProvider } from "./context/NotificationContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { I18nProvider } from "./context/I18nContext";
import { CountryProvider } from "./context/CountryContext";

function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <CurrencyProvider>
          <I18nProvider>
            <CountryProvider>
              <AppRoutes />
            </CountryProvider>
          </I18nProvider>
        </CurrencyProvider>
      </NotificationProvider>
    </AppProvider>
  );
}

export default App;
