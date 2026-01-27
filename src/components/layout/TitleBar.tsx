import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, X } from "lucide-react";
import { Button } from "../ui/button";
import { useTimerStore } from "../../store";

export function TitleBar() {
  const appWindow = getCurrentWindow();
  const status = useTimerStore((state) => state.status);

  const handleMinimize = async () => {
    await appWindow.minimize();
  };

  const handleClose = async () => {
    await appWindow.close();
  };

  const handleStartDrag = async (e: React.MouseEvent) => {
    // Only allow dragging on the title bar itself, not on buttons
    if ((e.target as HTMLElement).closest("button")) return;
    e.stopPropagation();
    await appWindow.startDragging();
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent clicks on the title bar from closing dialogs
    e.stopPropagation();
  };

  return (
    <div
      className="flex items-center justify-between px-3 py-2 bg-card cursor-grab active:cursor-grabbing select-none z-[60]"
      onMouseDown={handleStartDrag}
      onClick={handleClick}
      data-tauri-drag-region
    >
      {/* App Title */}
      <div className="flex items-center gap-2">
        {status === "running" && (
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        )}
        <span className="text-xs font-medium text-muted-foreground">
          Time Tracker
        </span>
      </div>

      {/* Window Controls */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 cursor-pointer"
          onClick={handleMinimize}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
