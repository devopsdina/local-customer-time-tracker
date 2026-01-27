import { create } from 'zustand';

type Screen = 'home' | 'settings' | 'manageCustomers' | 'newCustomer' | 'timeLog' | 'editCustomer';

interface UIState {
  currentScreen: Screen;
  timeLogCustomerId: string | null;
  timeLogCustomerName: string | null;
  editingCustomerId: string | null;
  idleDetectionMessage: string | null;
  
  // Navigation actions
  goHome: () => void;
  goToSettings: () => void;
  goToManageCustomers: () => void;
  goToNewCustomer: () => void;
  goToTimeLog: (customerId: string, customerName: string) => void;
  goToEditCustomer: (customerId: string) => void;
  
  // Other actions
  showIdleDetectionMessage: (message: string) => void;
  clearIdleDetectionMessage: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentScreen: 'home',
  timeLogCustomerId: null,
  timeLogCustomerName: null,
  editingCustomerId: null,
  idleDetectionMessage: null,

  goHome: () => set({ 
    currentScreen: 'home',
    editingCustomerId: null,
  }),
  
  goToSettings: () => set({ currentScreen: 'settings' }),
  
  goToManageCustomers: () => set({ 
    currentScreen: 'manageCustomers',
    editingCustomerId: null,
  }),
  
  goToNewCustomer: () => set({ currentScreen: 'newCustomer' }),
  
  goToTimeLog: (customerId: string, customerName: string) => set({ 
    currentScreen: 'timeLog',
    timeLogCustomerId: customerId,
    timeLogCustomerName: customerName,
  }),
  
  goToEditCustomer: (customerId: string) => set({
    currentScreen: 'editCustomer',
    editingCustomerId: customerId,
  }),

  showIdleDetectionMessage: (message) => set({ idleDetectionMessage: message }),
  clearIdleDetectionMessage: () => set({ idleDetectionMessage: null }),
}));
