import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LABELS,
  type StudioDensity,
  type StudioLabels,
  type StudioTheme,
  type ToastInput,
  type ToastMessage,
} from '../types';
import { StudioToastViewport } from '../feedback/Toast';

interface PersistedPreferences {
  theme?: StudioTheme;
  density?: StudioDensity;
}

interface StudioContextValue {
  theme: StudioTheme;
  density: StudioDensity;
  labels: StudioLabels;
  setTheme: (theme: StudioTheme) => void;
  setDensity: (density: StudioDensity) => void;
  toggleTheme: () => void;
  toggleDensity: () => void;
  toasts: ToastMessage[];
  pushToast: (toast: ToastInput) => number;
  dismissToast: (id: number) => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

function readPreferences(key: string): PersistedPreferences {
  if (typeof window === 'undefined') return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? '{}') as PersistedPreferences & {
      state?: PersistedPreferences;
    };
    const source = parsed.theme || parsed.density ? parsed : parsed.state ?? parsed;
    return {
      theme: source.theme === 'light' || source.theme === 'dark' ? source.theme : undefined,
      density: source.density === 'compact' || source.density === 'comfortable' ? source.density : undefined,
    };
  } catch {
    return {};
  }
}

export function StudioProvider({
  theme: controlledTheme,
  defaultTheme = 'dark',
  onThemeChange,
  density: controlledDensity,
  defaultDensity = 'comfortable',
  onDensityChange,
  labels: labelOverrides,
  storageKey = 'studio-ui-preferences',
  children,
}: {
  theme?: StudioTheme;
  defaultTheme?: StudioTheme;
  onThemeChange?: (theme: StudioTheme) => void;
  density?: StudioDensity;
  defaultDensity?: StudioDensity;
  onDensityChange?: (density: StudioDensity) => void;
  labels?: Partial<StudioLabels>;
  storageKey?: string;
  children: ReactNode;
}) {
  const [localTheme, setLocalTheme] = useState<StudioTheme>(defaultTheme);
  const [localDensity, setLocalDensity] = useState<StudioDensity>(defaultDensity);
  const [hydrated, setHydrated] = useState(false);
  const theme = controlledTheme ?? localTheme;
  const density = controlledDensity ?? localDensity;
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...labelOverrides }), [labelOverrides]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const sequence = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismissToast = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((toast: ToastInput) => {
    const id = ++sequence.current;
    const duration = toast.duration ?? 5000;
    setToasts((current) => [...current, { ...toast, id }]);
    if (duration > 0) {
      const timer = setTimeout(() => {
        timers.current.delete(id);
        setToasts((current) => current.filter((item) => item.id !== id));
      }, duration);
      timers.current.set(id, timer);
    }
    return id;
  }, []);

  const setTheme = useCallback((next: StudioTheme) => {
    if (controlledTheme === undefined) setLocalTheme(next);
    onThemeChange?.(next);
  }, [controlledTheme, onThemeChange]);

  const setDensity = useCallback((next: StudioDensity) => {
    if (controlledDensity === undefined) setLocalDensity(next);
    onDensityChange?.(next);
  }, [controlledDensity, onDensityChange]);

  useEffect(() => {
    const stored = readPreferences(storageKey);
    if (stored.theme) setLocalTheme(stored.theme);
    if (stored.density) setLocalDensity(stored.density);
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.studioTheme = theme;
    root.dataset.studioDensity = density;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#f2f2ee' : '#0c0d0f');
  }, [density, theme]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ theme, density }));
    } catch {
      // Storage can be unavailable in private browsing or embedded contexts.
    }
  }, [density, hydrated, storageKey, theme]);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  const value = useMemo<StudioContextValue>(() => ({
    theme,
    density,
    labels,
    setTheme,
    setDensity,
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    toggleDensity: () => setDensity(density === 'compact' ? 'comfortable' : 'compact'),
    toasts,
    pushToast,
    dismissToast,
  }), [density, dismissToast, labels, pushToast, setDensity, setTheme, theme, toasts]);

  return (
    <StudioContext.Provider value={value}>
      {children}
      <StudioToastViewport toasts={toasts} labels={labels} onDismiss={dismissToast} />
    </StudioContext.Provider>
  );
}

const fallbackPreferences = {
  theme: 'dark' as const,
  density: 'comfortable' as const,
  setTheme: () => undefined,
  setDensity: () => undefined,
  toggleTheme: () => undefined,
  toggleDensity: () => undefined,
};

export function useStudioPreferences(): Pick<StudioContextValue, 'theme' | 'density' | 'setTheme' | 'setDensity' | 'toggleTheme' | 'toggleDensity'> {
  const context = useContext(StudioContext);
  if (!context) return fallbackPreferences;
  return {
    theme: context.theme,
    density: context.density,
    setTheme: context.setTheme,
    setDensity: context.setDensity,
    toggleTheme: context.toggleTheme,
    toggleDensity: context.toggleDensity,
  };
}

export function useStudioLabels() {
  return useContext(StudioContext)?.labels ?? DEFAULT_LABELS;
}

export function useToast() {
  const context = useContext(StudioContext);
  if (!context) throw new Error('useToast must be used inside StudioProvider');
  return {
    pushToast: context.pushToast,
    dismissToast: context.dismissToast,
    toasts: context.toasts,
  };
}
