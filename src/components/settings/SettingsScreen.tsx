import { getCurrentWindow } from "@tauri-apps/api/window";
import { ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { ScreenHeader } from "../layout/ScreenHeader";
import { useSettingsStore, useUIStore } from "../../store";

export function SettingsScreen() {
  const { goHome, goToManageCustomers } = useUIStore();
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const handleDarkModeChange = (checked: boolean) => {
    updateSettings({ theme: checked ? "dark" : "light" });
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleAlwaysOnTopChange = async (checked: boolean) => {
    const appWindow = getCurrentWindow();
    await appWindow.setAlwaysOnTop(checked);
    updateSettings({ alwaysOnTop: checked });
  };

  const handleIdleDetectionChange = (checked: boolean) => {
    updateSettings({ idleDetection: checked });
  };

  const handleIdleTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateSettings({ idleTimeoutMinutes: Math.round(value * 60) });
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <ScreenHeader title="Settings" onBack={goHome} />

      <div className="space-y-3">
        {/* Appearance */}
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-gray-500">Appearance</h3>

          <div className="flex items-center justify-between ml-2">
            <Label htmlFor="darkMode" className="text-xs text-gray-700 dark:text-gray-300">
              Dark Mode
            </Label>
            <Switch
              id="darkMode"
              checked={settings.theme === "dark"}
              onCheckedChange={handleDarkModeChange}
              className="scale-90"
            />
          </div>
        </div>

        {/* Window */}
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-gray-500">Window</h3>

          <div className="flex items-center justify-between ml-2">
            <Label htmlFor="alwaysOnTop" className="text-xs text-gray-700 dark:text-gray-300">
              Always on Top
            </Label>
            <Switch
              id="alwaysOnTop"
              checked={settings.alwaysOnTop}
              onCheckedChange={handleAlwaysOnTopChange}
              className="scale-90"
            />
          </div>
        </div>

        {/* Timer */}
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-gray-500">Timer</h3>

          <div className="flex items-center justify-between ml-2">
            <Label htmlFor="idleDetection" className="text-xs text-gray-700 dark:text-gray-300">
              Idle Detection
            </Label>
            <Switch
              id="idleDetection"
              checked={settings.idleDetection}
              onCheckedChange={handleIdleDetectionChange}
              className="scale-90"
            />
          </div>

          {settings.idleDetection && (
            <div className="flex items-center justify-between ml-6 pl-2 border-l-2 border-accent">
              <Label htmlFor="idleTimeout" className="text-[11px] text-gray-500 dark:text-gray-400">
                Timeout (hours)
              </Label>
              <Input
                id="idleTimeout"
                type="number"
                value={(settings.idleTimeoutMinutes / 60).toFixed(1)}
                onChange={handleIdleTimeoutChange}
                className="w-14 h-6 text-[11px] text-center"
                min={0.5}
                max={8}
                step={0.5}
              />
            </div>
          )}
        </div>

        {/* Customer Management */}
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-gray-500">Customers</h3>
          <div 
            className="flex items-center justify-between ml-2 cursor-pointer hover:bg-muted/50 rounded py-1 px-1 transition-colors"
            onClick={goToManageCustomers}
          >
            <Label className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              Manage Customers
            </Label>
            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
