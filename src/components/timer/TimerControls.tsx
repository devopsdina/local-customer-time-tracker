import { Play, Pause, Square } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useCustomerStore, useTimerStore } from "../../store";

export function TimerControls() {
  const selectedCustomerId = useCustomerStore(
    (state) => state.selectedCustomerId
  );
  const { status, startTimer, pauseTimer, resumeTimer, stopTimer } =
    useTimerStore();

  const handleStart = () => {
    if (selectedCustomerId) {
      startTimer(selectedCustomerId);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex justify-center gap-2 pb-4">
        {status === "idle" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-9 w-9"
                onClick={handleStart}
                disabled={!selectedCustomerId}
              >
                <Play className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Start Timer</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={status === "running" ? "secondary" : "default"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={status === "running" ? pauseTimer : resumeTimer}
                >
                  {status === "running" ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{status === "running" ? "Pause Timer" : "Resume Timer"}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-9 w-9"
                  onClick={stopTimer}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Stop Timer</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
