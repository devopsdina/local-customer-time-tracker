import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  // Less than 1 minute - show seconds
  if (hours === 0 && minutes === 0) {
    return `${seconds}s`;
  }
  
  // Less than 1 hour - show minutes and seconds
  if (hours === 0) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }
  
  // 1 hour or more - show hours and minutes
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

export function formatHours(hours: number): string {
  return hours.toFixed(2);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function getCurrentTimeISO(): string {
  return new Date().toISOString();
}
