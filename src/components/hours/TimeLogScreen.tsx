import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { save } from "@tauri-apps/plugin-dialog";
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { ScreenHeader } from "../layout/ScreenHeader";
import { useUIStore } from "../../store";
import { formatDuration } from "../../lib/utils";
import type { CustomerTimeLog } from "../../types";

export function TimeLogScreen() {
  const { timeLogCustomerId, timeLogCustomerName, goHome } = useUIStore();
  const [timeLog, setTimeLog] = useState<CustomerTimeLog | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timeLogCustomerId) {
      setLoading(true);
      invoke<CustomerTimeLog>("get_customer_time_log", {
        customerId: timeLogCustomerId,
      })
        .then((log) => {
          setTimeLog(log);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load time log:", err);
          setLoading(false);
        });
    }
  }, [timeLogCustomerId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleExport = async () => {
    if (!timeLog) return;

    const headers = ["Date", "Duration", "Start Time", "End Time"];
    const rows = timeLog.sessions.map((session) => [
      session.date,
      formatDuration(session.durationSeconds),
      session.startTime,
      session.endTime || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    try {
      const filePath = await save({
        defaultPath: `time-log-${timeLogCustomerName?.toLowerCase().replace(/\s+/g, "-")}.csv`,
        filters: [{ name: "CSV", extensions: ["csv"] }],
      });

      if (filePath) {
        await invoke("export_csv", { filePath, content: csvContent });
      }
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };

  const sortedSessions = timeLog?.sessions
    ? [...timeLog.sessions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : [];

  const title = (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/40 text-gray-800 dark:text-gray-300">
      Time Log: {timeLogCustomerName}
    </span>
  );

  return (
    <div className="flex flex-col flex-1 p-4">
      <ScreenHeader title={title} onBack={goHome} />

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      ) : timeLog ? (
        <>
          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[180px] pr-1">
            {sortedSessions.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No sessions recorded yet
              </div>
            ) : (
              sortedSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/50"
                >
                  <span className="text-xs text-muted-foreground">
                    {formatDate(session.date)}
                  </span>
                  <span className="text-xs font-medium">
                    {formatDuration(session.durationSeconds)}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="border-t border-border pt-3 mt-2">
            <div className="flex justify-between text-xs mb-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Total Logged</span>
                <span className="font-medium">
                  {formatDuration(timeLog.totalSecondsLogged)}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                <span
                  className={`font-medium ${
                    timeLog.hoursRemaining < 0 ? "text-destructive" : ""
                  }`}
                >
                  {formatDuration(
                    Math.round(Math.abs(timeLog.hoursRemaining) * 3600)
                  )}
                  {timeLog.hoursRemaining < 0 && " over"}
                </span>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={handleExport}
              >
                <Download className="w-3 h-3 mr-1.5" />
                Export CSV
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Failed to load time log
        </div>
      )}
    </div>
  );
}
