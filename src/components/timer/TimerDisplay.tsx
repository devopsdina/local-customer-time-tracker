import { useTimerStore } from "../../store";
import { formatTime } from "../../lib/utils";

export function TimerDisplay() {
  const { status, elapsedSeconds } = useTimerStore();

  return (
    <div className="flex flex-col items-center py-3">
      {/* Status Text */}
      {status !== "idle" && (
        <div className="flex items-center gap-1.5 mb-1">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              status === "running"
                ? "bg-green-500 animate-pulse"
                : "bg-yellow-500"
            }`}
          />
          <span className="text-xs text-muted-foreground capitalize">
            {status}
          </span>
        </div>
      )}
      
      {/* Timer Display */}
      <div
        className={`font-mono text-3xl font-bold tracking-wider ${
          status === "running" ? "timer-glow text-primary" : "text-foreground"
        }`}
      >
        {formatTime(elapsedSeconds)}
      </div>
    </div>
  );
}
