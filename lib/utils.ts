import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function painColor(level: number): string {
  if (level <= 3) return '#34C759'   // Apple green
  if (level <= 6) return '#FF9F0A'   // Apple orange
  return '#FF3B30'                   // Apple red
}

export const PRESET_COLORS = ['#007AFF', '#34C759', '#FF9F0A', '#AF52DE', '#FF3B30', '#5AC8FA']
