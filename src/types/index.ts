export interface Customer {
  id: string;
  name: string;
  engagementType: string;
  initialHours: number;
  createdAt: string;
  archived: boolean;
}

export interface TimeSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string | null;
  durationSeconds: number;
  durationFormatted: string;
  notes: string | null;
}

export interface CustomerTimeLog {
  customerId: string;
  customerName: string;
  engagementType: string;
  initialHours: number;
  sessions: TimeSession[];
  totalSecondsLogged: number;
  totalHoursLogged: number;
  hoursRemaining: number;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  alwaysOnTop: boolean;
  compactMode: boolean;
  autoStopHours: number;
  idleDetection: boolean;
  idleTimeoutMinutes: number;
}

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerState {
  status: TimerStatus;
  customerId: string | null;
  sessionId: string | null;
  startTime: string | null;
  elapsedSeconds: number;
}

export interface CustomerFormData {
  name: string;
  engagementType: string;
  initialHours: number;
}
