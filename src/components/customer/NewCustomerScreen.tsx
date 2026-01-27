import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScreenHeader } from "../layout/ScreenHeader";
import { useCustomerStore, useUIStore } from "../../store";

export function NewCustomerScreen() {
  const { goHome } = useUIStore();
  const addCustomer = useCustomerStore((state) => state.addCustomer);

  const [name, setName] = useState("");
  const [engagementType, setEngagementType] = useState("");
  const [initialHours, setInitialHours] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !engagementType || !initialHours) return;

    setIsSubmitting(true);
    try {
      await addCustomer({
        name,
        engagementType,
        initialHours: parseFloat(initialHours),
      });
      goHome();
    } catch (error) {
      console.error("Failed to add customer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInitialHours(value);
    }
  };

  const handleHoursKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      ".",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];
    if (allowedKeys.includes(e.key)) {
      if (e.key === "." && initialHours.includes(".")) {
        e.preventDefault();
      }
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <ScreenHeader title="New Customer" onBack={goHome} />

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs">
            Customer Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter customer name"
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="engagementType" className="text-xs">
            Engagement Type
          </Label>
          <Input
            id="engagementType"
            value={engagementType}
            onChange={(e) => setEngagementType(e.target.value)}
            placeholder="e.g., RSA, Consulting, Support"
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="initialHours" className="text-xs">
            Initial Hours
          </Label>
          <Input
            id="initialHours"
            type="number"
            value={initialHours}
            onChange={handleHoursChange}
            onKeyDown={handleHoursKeyDown}
            placeholder="e.g., 200"
            className="h-8 text-sm"
          />
        </div>

        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || !name || !engagementType || !initialHours}
            className="h-7 text-xs px-6"
          >
            {isSubmitting ? "Adding..." : "Add Customer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
