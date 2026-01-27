import { Plus, Settings } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useCustomerStore, useTimerStore, useUIStore } from "../../store";

export function CustomerSelector() {
  const customers = useCustomerStore((state) => state.customers);
  const selectedCustomerId = useCustomerStore(
    (state) => state.selectedCustomerId
  );
  const currentTimeLog = useCustomerStore((state) => state.currentTimeLog);
  const selectCustomer = useCustomerStore((state) => state.selectCustomer);
  const { goToNewCustomer, goToSettings } = useUIStore();
  const timerStatus = useTimerStore((state) => state.status);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const isTimerActive = timerStatus !== "idle";

  return (
    <TooltipProvider>
      <div className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            {isTimerActive ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-not-allowed">
                    <Select
                      value={selectedCustomerId || ""}
                      onValueChange={selectCustomer}
                      disabled={true}
                    >
                      <SelectTrigger className="h-8 text-sm pointer-events-none">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Stop timer to change customer</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Select
                value={selectedCustomerId || ""}
                onValueChange={selectCustomer}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={goToNewCustomer}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>New Customer</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={goToSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Engagement Type Pill */}
        {selectedCustomer && (
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-gray-700 dark:text-gray-400">
              {selectedCustomer.engagementType}
            </span>
            {currentTimeLog && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-gray-700 dark:text-gray-400">
                {currentTimeLog.initialHours}h 
              </span>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
