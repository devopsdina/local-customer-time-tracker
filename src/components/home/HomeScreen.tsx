import { X } from "lucide-react";
import { Button } from "../ui/button";
import { CustomerSelector } from "../customer/CustomerSelector";
import { TimerDisplay } from "../timer/TimerDisplay";
import { TimerControls } from "../timer/TimerControls";
import { HoursSummary } from "../hours/HoursSummary";
import { useUIStore } from "../../store";

export function HomeScreen() {
  const { idleDetectionMessage, clearIdleDetectionMessage } = useUIStore();

  return (
    <div className="flex flex-col flex-1">
      {/* Idle Detection Message */}
      {idleDetectionMessage && (
        <div className="mx-3 mt-2 p-2 bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-400 dark:border-yellow-500/50 rounded-lg flex items-center justify-between">
          <span className="text-xs text-yellow-800 dark:text-yellow-200">{idleDetectionMessage}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 hover:bg-yellow-200 dark:hover:bg-yellow-500/30"
            onClick={clearIdleDetectionMessage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Customer Selection */}
      <CustomerSelector />

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Timer Section */}
      <TimerDisplay />
      <TimerControls />

      {/* Hours Summary */}
      <HoursSummary />
    </div>
  );
}
