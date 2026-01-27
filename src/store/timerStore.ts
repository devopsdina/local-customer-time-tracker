import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { TimerState, TimeSession, CustomerTimeLog } from '../types';
import { getCurrentDateISO, getCurrentTimeISO, formatDuration } from '../lib/utils';
import { useCustomerStore } from './customerStore';

interface TimerStore extends TimerState {
  // Actions
  startTimer: (customerId: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => Promise<void>;
  tick: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  status: 'idle',
  customerId: null,
  sessionId: null,
  startTime: null,
  elapsedSeconds: 0,

  startTimer: (customerId: string) => {
    const sessionId = crypto.randomUUID();
    set({
      status: 'running',
      customerId,
      sessionId,
      startTime: getCurrentTimeISO(),
      elapsedSeconds: 0,
    });
  },

  pauseTimer: () => {
    set({ status: 'paused' });
  },

  resumeTimer: () => {
    set({ status: 'running' });
  },

  stopTimer: async () => {
    const { customerId, sessionId, startTime, elapsedSeconds, status } = get();
    
    if (!customerId || !sessionId || !startTime || status === 'idle') {
      return;
    }

    const session: TimeSession = {
      id: sessionId,
      date: getCurrentDateISO(),
      startTime,
      endTime: getCurrentTimeISO(),
      durationSeconds: elapsedSeconds,
      durationFormatted: formatDuration(elapsedSeconds),
      notes: null,
    };

    try {
      const updatedLog = await invoke<CustomerTimeLog>('save_time_session', {
        customerId,
        session,
      });
      
      // Update the customer store with the new time log
      useCustomerStore.setState({ currentTimeLog: updatedLog });
    } catch (error) {
      console.error('Failed to save time session:', error);
    }

    // Reset timer state
    set({
      status: 'idle',
      customerId: null,
      sessionId: null,
      startTime: null,
      elapsedSeconds: 0,
    });
  },

  tick: () => {
    set(state => ({ elapsedSeconds: state.elapsedSeconds + 1 }));
  },

  reset: () => {
    set({
      status: 'idle',
      customerId: null,
      sessionId: null,
      startTime: null,
      elapsedSeconds: 0,
    });
  },
}));
