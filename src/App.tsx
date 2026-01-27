import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { TitleBar } from "./components/layout/TitleBar";
import { HomeScreen } from "./components/home/HomeScreen";
import { SettingsScreen } from "./components/settings/SettingsScreen";
import { ManageCustomersScreen } from "./components/customer/ManageCustomersScreen";
import { NewCustomerScreen } from "./components/customer/NewCustomerScreen";
import { TimeLogScreen } from "./components/hours/TimeLogScreen";
import { useCustomerStore, useSettingsStore, useTimerStore, useUIStore } from "./store";

function App() {
  const loadCustomers = useCustomerStore((state) => state.loadCustomers);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const settings = useSettingsStore((state) => state.settings);
  const { status, tick, elapsedSeconds, stopTimer } = useTimerStore();
  const { currentScreen, showIdleDetectionMessage } = useUIStore();

  useEffect(() => {
    loadCustomers();
    loadSettings();
  }, [loadCustomers, loadSettings]);

  // Auto-save timer on app close
  useEffect(() => {
    const appWindow = getCurrentWindow();
    
    const unlisten = appWindow.onCloseRequested(async (event) => {
      const { status, stopTimer } = useTimerStore.getState();
      
      if (status !== "idle") {
        event.preventDefault();
        await stopTimer();
        await appWindow.close();
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  // Apply theme
  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  // Apply always on top setting
  useEffect(() => {
    const appWindow = getCurrentWindow();
    appWindow.setAlwaysOnTop(settings.alwaysOnTop);
  }, [settings.alwaysOnTop]);

  // Timer tick - runs at App level to ensure it continues across screens
  useEffect(() => {
    if (status !== "running") return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, tick]);

  // Idle detection
  useEffect(() => {
    if (status !== "running" || !settings.idleDetection) return;

    const idleTimeoutSeconds = settings.idleTimeoutMinutes * 60;
    
    if (elapsedSeconds >= idleTimeoutSeconds) {
      stopTimer();
      const hours = (settings.idleTimeoutMinutes / 60).toFixed(1);
      showIdleDetectionMessage(
        `Timer stopped: Idle detection triggered after ${hours} hour${parseFloat(hours) !== 1 ? 's' : ''}`
      );
    }
  }, [elapsedSeconds, status, settings.idleDetection, settings.idleTimeoutMinutes, stopTimer, showIdleDetectionMessage]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'settings':
        return <SettingsScreen />;
      case 'manageCustomers':
        return <ManageCustomersScreen />;
      case 'newCustomer':
        return <NewCustomerScreen />;
      case 'timeLog':
        return <TimeLogScreen />;
      case 'editCustomer':
        return <ManageCustomersScreen />;
      case 'home':
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="h-screen w-screen p-1 border-0 outline-none">
      <div className="window-frame window-content h-full flex flex-col gradient-bg rounded-xl overflow-hidden border-0 outline-none">
        {/* Title Bar - Always visible */}
        <TitleBar />

        {/* Screen Content */}
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
