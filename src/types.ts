import type { ReactNode } from 'react';

export type StudioTheme = 'dark' | 'light';
export type StudioDensity = 'comfortable' | 'compact';
export type StudioTone = 'default' | 'accent' | 'warn' | 'danger';

export interface StudioLabels {
  close: string;
  cancel: string;
  confirm: string;
  loading: string;
  search: string;
  searchPlaceholder: string;
  noResults: string;
  progress: string;
  notifications: string;
  dismissNotification: string;
  switchToDark: string;
  switchToLight: string;
  compactDensity: string;
  comfortableDensity: string;
  openInspector: string;
  closeInspector: string;
  pinInspector: string;
  unpinInspector: string;
  navigation: string;
  inspector: string;
}

export const DEFAULT_LABELS: StudioLabels = {
  close: 'Close',
  cancel: 'Cancel',
  confirm: 'Confirm',
  loading: 'Loading…',
  search: 'Search and actions',
  searchPlaceholder: 'Search actions and projects…',
  noResults: 'No matches',
  progress: 'Progress',
  notifications: 'Notifications',
  dismissNotification: 'Dismiss notification',
  switchToDark: 'Switch to dark theme',
  switchToLight: 'Switch to light theme',
  compactDensity: 'Use compact density',
  comfortableDensity: 'Use comfortable density',
  openInspector: 'Open inspector',
  closeInspector: 'Close inspector',
  pinInspector: 'Pin inspector',
  unpinInspector: 'Unpin inspector',
  navigation: 'Main navigation',
  inspector: 'Inspector',
};

export interface ToastAction {
  label: string;
  run: () => void | Promise<void>;
}

export interface ToastMessage {
  id: number;
  message: ReactNode;
  tone?: 'default' | 'success' | 'danger';
  action?: ToastAction;
  duration?: number;
}

export interface ToastInput extends Omit<ToastMessage, 'id'> {}

export interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  status?: 'idle' | 'active' | 'done' | 'attention';
  disabled?: boolean;
}

export interface CommandItem {
  id: string;
  label: string;
  keywords?: string | string[];
  group?: string;
  meta?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  run: () => void | Promise<void>;
}

export interface MetricItem {
  label: string;
  value: ReactNode;
  tone?: StudioTone;
}

export interface FilterOption<T extends string = string> {
  value: T;
  label: ReactNode;
  count?: ReactNode;
  disabled?: boolean;
}
