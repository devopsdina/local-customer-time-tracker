import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { Customer, CustomerTimeLog } from '../types';

// Helper to sort customers alphabetically by name
const sortByName = (customers: Customer[]) => 
  [...customers].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

interface CustomerState {
  customers: Customer[];
  allCustomers: Customer[];
  selectedCustomerId: string | null;
  currentTimeLog: CustomerTimeLog | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadCustomers: () => Promise<void>;
  loadAllCustomers: () => Promise<void>;
  selectCustomer: (customerId: string | null) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'archived'>) => Promise<Customer>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  refreshTimeLog: () => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  allCustomers: [],
  selectedCustomerId: null,
  currentTimeLog: null,
  isLoading: false,
  error: null,

  loadAllCustomers: async () => {
    try {
      const customers = await invoke<Customer[]>('get_customers');
      set({ allCustomers: sortByName(customers) });
    } catch (error) {
      console.error('Failed to load all customers:', error);
    }
  },

  loadCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const customers = await invoke<Customer[]>('get_customers');
      const activeCustomers = sortByName(customers.filter(c => !c.archived));
      set({ customers: activeCustomers, isLoading: false });
      
      const currentSelectedId = get().selectedCustomerId;
      const isSelectedStillActive = currentSelectedId && activeCustomers.some(c => c.id === currentSelectedId);
      
      // If selected customer is no longer active, clear selection
      if (currentSelectedId && !isSelectedStillActive) {
        // Select first available customer, or clear if none
        if (activeCustomers.length > 0) {
          await get().selectCustomer(activeCustomers[0].id);
        } else {
          set({ selectedCustomerId: null, currentTimeLog: null });
        }
      }
      // Auto-select first customer if none selected
      else if (activeCustomers.length > 0 && !currentSelectedId) {
        await get().selectCustomer(activeCustomers[0].id);
      }
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  selectCustomer: async (customerId: string | null) => {
    set({ selectedCustomerId: customerId });
    
    if (customerId) {
      try {
        const timeLog = await invoke<CustomerTimeLog>('get_customer_time_log', { customerId });
        set({ currentTimeLog: timeLog });
      } catch (error) {
        console.error('Failed to load time log:', error);
        set({ currentTimeLog: null });
      }
    } else {
      set({ currentTimeLog: null });
    }
  },

  addCustomer: async (customerData) => {
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      name: customerData.name,
      engagementType: customerData.engagementType,
      initialHours: customerData.initialHours,
      createdAt: new Date().toISOString(),
      archived: false,
    };

    try {
      const savedCustomer = await invoke<Customer>('save_customer', { customer: newCustomer });
      set(state => ({ customers: sortByName([...state.customers, savedCustomer]) }));
      return savedCustomer;
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  updateCustomer: async (customer) => {
    try {
      await invoke('save_customer', { customer });
      
      // If customer was archived, reload to update the list and selection
      if (customer.archived) {
        await get().loadCustomers();
      } else {
        set(state => ({
          customers: sortByName(state.customers.map(c => c.id === customer.id ? customer : c))
        }));
      }
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  deleteCustomer: async (customerId) => {
    try {
      await invoke('delete_customer', { customerId });
      set(state => ({
        customers: state.customers.filter(c => c.id !== customerId),
        selectedCustomerId: state.selectedCustomerId === customerId ? null : state.selectedCustomerId,
        currentTimeLog: state.selectedCustomerId === customerId ? null : state.currentTimeLog,
      }));
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  refreshTimeLog: async () => {
    const { selectedCustomerId } = get();
    if (selectedCustomerId) {
      try {
        const timeLog = await invoke<CustomerTimeLog>('get_customer_time_log', { customerId: selectedCustomerId });
        set({ currentTimeLog: timeLog });
      } catch (error) {
        console.error('Failed to refresh time log:', error);
      }
    }
  },
}));
