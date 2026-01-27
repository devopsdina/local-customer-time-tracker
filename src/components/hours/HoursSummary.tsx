import { FileText } from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useCustomerStore, useTimerStore, useUIStore } from "../../store";
import { formatDuration } from "../../lib/utils";

export function HoursSummary() {
  const currentTimeLog = useCustomerStore((state) => state.currentTimeLog);
  const selectedCustomerId = useCustomerStore(
    (state) => state.selectedCustomerId
  );
  const customers = useCustomerStore((state) => state.customers);
  const elapsedSeconds = useTimerStore((state) => state.elapsedSeconds);
  const timerStatus = useTimerStore((state) => state.status);
  const { goToTimeLog } = useUIStore();

  if (!currentTimeLog) return null;

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Calculate current session hours if timer is running
  const currentSessionHours = timerStatus !== "idle" ? elapsedSeconds / 3600 : 0;

  const totalSpent = currentTimeLog.totalHoursLogged + currentSessionHours;
  const remaining = currentTimeLog.initialHours - totalSpent;
  const progressPercent = Math.min(
    (totalSpent / currentTimeLog.initialHours) * 100,
    100
  );

  const handleOpenTimeLog = () => {
    if (selectedCustomerId && selectedCustomer) {
      goToTimeLog(selectedCustomerId, selectedCustomer.name);
    }
  };

  return (
    <TooltipProvider>
      <div className="px-3 pb-3 pt-2 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Hours Summary
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleOpenTimeLog}
              >
                <FileText className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>View Time Log</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Progress value={progressPercent} className="h-1.5 mb-2" />

        <div className="flex justify-between text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Spent</span>
            <span className="font-medium text-foreground">
              {formatDuration(Math.round(totalSpent * 3600))}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-gray-600 dark:text-gray-400">Remaining</span>
            <span
              className={`font-medium ${
                remaining < 0 ? "text-destructive" : "text-foreground"
              }`}
            >
              {formatDuration(Math.round(Math.abs(remaining) * 3600))}
              {remaining < 0 && " over"}
            </span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
