import { useState, useEffect } from "react";
import { Edit, Trash2, Archive, FileText, ArchiveRestore } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ScreenHeader } from "../layout/ScreenHeader";
import { useCustomerStore, useUIStore } from "../../store";
import type { Customer } from "../../types";

export function ManageCustomersScreen() {
  const { goToSettings, goToTimeLog } = useUIStore();
  const allCustomers = useCustomerStore((state) => state.allCustomers);
  const loadAllCustomers = useCustomerStore((state) => state.loadAllCustomers);
  const loadCustomers = useCustomerStore((state) => state.loadCustomers);
  const updateCustomer = useCustomerStore((state) => state.updateCustomer);
  const deleteCustomer = useCustomerStore((state) => state.deleteCustomer);

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editName, setEditName] = useState("");
  const [editEngagementType, setEditEngagementType] = useState("");
  const [editInitialHours, setEditInitialHours] = useState("");

  useEffect(() => {
    loadAllCustomers();
  }, [loadAllCustomers]);

  const activeCustomers = allCustomers.filter(c => !c.archived);
  const archivedCustomers = allCustomers.filter(c => c.archived);

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditName(customer.name);
    setEditEngagementType(customer.engagementType);
    setEditInitialHours(customer.initialHours.toString());
  };

  const handleSaveEdit = async () => {
    if (!editingCustomer) return;

    await updateCustomer({
      ...editingCustomer,
      name: editName,
      engagementType: editEngagementType,
      initialHours: parseFloat(editInitialHours),
    });

    await loadAllCustomers();
    setEditingCustomer(null);
  };

  const handleArchive = async (customer: Customer) => {
    try {
      await updateCustomer({
        ...customer,
        archived: true,
      });
      await loadAllCustomers();
      await loadCustomers();
    } catch (error) {
      console.error('Failed to archive customer:', error);
    }
  };

  const handleUnarchive = async (customer: Customer) => {
    await updateCustomer({
      ...customer,
      archived: false,
    });
    await loadAllCustomers();
    await loadCustomers();
  };

  const handleDelete = async (customerId: string, customerName: string) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${customerName}"? This cannot be undone.`);
    if (confirmed) {
      try {
        await deleteCustomer(customerId);
        await loadAllCustomers();
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  };

  const handleViewTimeLog = (customer: Customer) => {
    goToTimeLog(customer.id, customer.name);
  };

  const handleBack = () => {
    if (editingCustomer) {
      setEditingCustomer(null);
    } else {
      goToSettings();
    }
  };

  // If editing a customer, show the edit form only
  if (editingCustomer) {
    return (
      <div className="flex flex-col flex-1 p-4">
        <ScreenHeader title="Edit Customer" onBack={handleBack} />

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Name</Label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Engagement Type</Label>
            <Input
              value={editEngagementType}
              onChange={(e) => setEditEngagementType(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Initial Hours</Label>
            <Input
              type="number"
              value={editInitialHours}
              onChange={(e) => setEditInitialHours(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="flex justify-center pt-4">
            <Button
              className="h-8 text-sm px-8"
              onClick={handleSaveEdit}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-4">
      <ScreenHeader title="Manage Customers" onBack={handleBack} />

      <TooltipProvider>
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {/* Active Customers Section */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 mb-1.5">Active</h3>
            <div className="space-y-1">
              {activeCustomers.length === 0 ? (
                <div className="text-center py-2 text-xs text-muted-foreground">
                  No active customers
                </div>
              ) : (
                activeCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/50"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {customer.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {customer.engagementType} • {customer.initialHours}h
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleViewTimeLog(customer)}
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>View Time Log</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEdit(customer)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleArchive(customer)}
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Archive</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Archived Customers Section */}
          {archivedCustomers.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-1.5">Archived</h3>
              <div className="space-y-1">
                {archivedCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/30 opacity-60"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {customer.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {customer.engagementType} • {customer.initialHours}h
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleViewTimeLog(customer)}
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>View Time Log</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUnarchive(customer)}
                          >
                            <ArchiveRestore className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Unarchive</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDelete(customer.id, customer.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
