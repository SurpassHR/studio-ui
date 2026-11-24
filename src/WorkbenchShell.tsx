import { useEffect, useRef, useState, type ReactNode } from 'react';
import { StudioIcon, type IconName } from './icons/StudioIcon';
import { IconButton } from './primitives';
import { CommandPalette } from './feedback/CommandPalette';
import { useStudioLabels, useStudioPreferences } from './provider/StudioProvider';
import type { CommandItem, NavItem } from './types';
import { cx } from './lib/cx';
import styles from './WorkbenchShell.module.css';

function renderIcon(icon: ReactNode) {
  return typeof icon === 'string' ? <StudioIcon name={icon as IconName} size={17} /> : icon;
}

function readInspectorState(key?: string) {
  if (!key || typeof window === 'undefined') return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? '{}') as { open?: boolean; pinned?: boolean };
    return typeof parsed.open === 'boolean' || typeof parsed.pinned === 'boolean' ? parsed : null;
  } catch {
    return null;
  }
}

export function WorkbenchShell({
  brand,
  breadcrumbs,
  navItems,
  activeNavId,
  onNavigate,
  status,
  headerActions,
  inspector,
  inspectorTitle = 'Inspector',
  inspectorEyebrow,
  inspectorActions,
  inspectorOpen: controlledInspectorOpen,
  defaultInspectorOpen = true,
  onInspectorOpenChange,
  inspectorPinned: controlledInspectorPinned,
  defaultInspectorPinned = false,
  onInspectorPinnedChange,
  inspectorStorageKey,
  commandBar,
  commands = [],
  railFooter,
  assistant,
  children,
}: {
  brand: { name: ReactNode; mark?: ReactNode; badge?: ReactNode; onClick?: () => void };
  breadcrumbs?: ReactNode;
  navItems: NavItem[];
  activeNavId?: string;
  onNavigate: (id: string) => void;
  status?: ReactNode;
  headerActions?: ReactNode;
  inspector?: ReactNode;
  inspectorTitle?: ReactNode;
  inspectorEyebrow?: ReactNode;
  inspectorActions?: ReactNode;
  inspectorOpen?: boolean;
  defaultInspectorOpen?: boolean;
  onInspectorOpenChange?: (open: boolean) => void;
  inspectorPinned?: boolean;
  defaultInspectorPinned?: boolean;
  onInspectorPinnedChange?: (pinned: boolean) => void;
  inspectorStorageKey?: string;
  commandBar?: ReactNode;
  commands?: CommandItem[];
  railFooter?: ReactNode;
  assistant?: ReactNode;
  children: ReactNode;
}) {
  const labels = useStudioLabels();
  const { theme, density, toggleTheme, toggleDensity } = useStudioPreferences();
  const [localOpen, setLocalOpen] = useState(defaultInspectorOpen);
  const [localPinned, setLocalPinned] = useState(defaultInspectorPinned);
  const [hydrated, setHydrated] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const inspectorRef = useRef<HTMLElement>(null);
  const inspectorOpen = controlledInspectorOpen ?? localOpen;
  const inspectorPinned = controlledInspectorPinned ?? localPinned;

  const setInspectorOpen = (open: boolean) => {
    if (controlledInspectorOpen === undefined) setLocalOpen(open);
    onInspectorOpenChange?.(open);
  };
  const setInspectorPinned = (pinned: boolean) => {
    if (controlledInspectorPinned === undefined) setLocalPinned(pinned);
    onInspectorPinnedChange?.(pinned);
    if (pinned) setInspectorOpen(true);
  };

  useEffect(() => {
    const saved = readInspectorState(inspectorStorageKey);
    if (typeof saved?.open === 'boolean') setLocalOpen(saved.open);
    if (typeof saved?.pinned === 'boolean') setLocalPinned(saved.pinned);
    setHydrated(true);
  }, [inspectorStorageKey]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(max-width: 1180px)');
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!hydrated || !inspectorStorageKey) return;
    try {
      window.localStorage.setItem(inspectorStorageKey, JSON.stringify({ open: inspectorOpen, pinned: inspectorPinned }));
    } catch {
      // Storage is optional.
    }
  }, [hydrated, inspectorOpen, inspectorPinned, inspectorStorageKey]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.matches('input, textarea, select, [contenteditable="true"]');
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && commands.length) {
        event.preventDefault();
        setPaletteOpen(true);
      } else if (!typing && event.key === '\\') {
        event.preventDefault();
        setInspectorOpen(!inspectorOpen);
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [commands.length, inspectorOpen, setInspectorOpen]);

  useEffect(() => {
    if (!hydrated || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(max-width: 1180px)');
    const collapse = (matches: boolean) => {
      if (matches && !inspectorPinned) setInspectorOpen(false);
    };
    collapse(media.matches);
    const onChange = (event: MediaQueryListEvent) => collapse(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [hydrated, inspectorPinned]);

  useEffect(() => {
    if (!inspectorOpen || inspectorPinned) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !paletteOpen && !document.querySelector('[role="dialog"]:not([data-studio-inspector])')) setInspectorOpen(false);
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [inspectorOpen, inspectorPinned, paletteOpen]);

  useEffect(() => {
    if (narrow && paletteOpen && inspectorOpen) setInspectorOpen(false);
  }, [narrow, paletteOpen]);

  useEffect(() => {
    if (!narrow || !inspectorOpen || paletteOpen) return;
    const node = inspectorRef.current;
    if (!node) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => node.focus(), 0);
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = [...node.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
      )];
      if (!focusable.length) {
        event.preventDefault();
        node.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!node.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (document.activeElement === node) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trap);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', trap);
      previous?.focus();
    };
  }, [inspectorOpen, narrow, paletteOpen]);

  return (
    <div className={cx('studio-root', styles.app)}>
      <header className={styles.header}>
        <button type="button" className={styles.brand} onClick={brand.onClick} title={typeof brand.name === 'string' ? brand.name : undefined}>
          {brand.mark ?? <span className={styles.brandMark} aria-hidden="true"><span /><span /></span>}
          <span className={styles.brandName}>{brand.name}</span>
          {brand.badge}
        </button>

        <div className={styles.breadcrumbs}>{breadcrumbs}</div>

        <div className={styles.headerActions}>
          {headerActions}
          {commands.length > 0 && (
            <button type="button" className={styles.commandTrigger} onClick={() => setPaletteOpen(true)} aria-label={labels.search}>
              <StudioIcon name="search" size={15} />
              <span>{labels.search}</span>
              <kbd>⌘K</kbd>
            </button>
          )}
          {status && <span className={styles.status}>{status}</span>}
          <IconButton
            icon={theme === 'dark' ? 'sun' : 'moon'}
            label={theme === 'dark' ? labels.switchToLight : labels.switchToDark}
            onClick={toggleTheme}
          />
          <IconButton
            icon={density === 'compact' ? 'grid' : 'list'}
            label={density === 'compact' ? labels.comfortableDensity : labels.compactDensity}
            onClick={toggleDensity}
          />
          <IconButton
            icon="settings"
            label={inspectorOpen ? labels.closeInspector : labels.openInspector}
            active={inspectorOpen}
            onClick={() => setInspectorOpen(!inspectorOpen)}
          />
        </div>
      </header>

      <div className={cx(styles.workspace, inspectorOpen && styles.withInspector)}>
        <nav className={styles.rail} aria-label={labels.navigation}>
          <div className={styles.railGroup}>
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cx(
                  styles.railButton,
                  activeNavId === item.id && styles.railActive,
                  item.status === 'attention' && styles.railAttention,
                )}
                onClick={() => onNavigate(item.id)}
                disabled={item.disabled}
                title={item.label}
                aria-current={activeNavId === item.id ? 'page' : undefined}
              >
                {item.icon && <span className={styles.railIcon}>{renderIcon(item.icon)}</span>}
                <span className={styles.railText}>{item.label}</span>
                {item.badge !== undefined && item.badge !== 0 && <span className={styles.railBadge}>{item.badge}</span>}
                {item.status === 'done' && item.badge === undefined && <span className={styles.railDone}><StudioIcon name="check" size={13} /></span>}
              </button>
            ))}
          </div>
          <div className={styles.railFooter}>{railFooter ?? <><span>LOCAL</span><span>STUDIO UI</span></>}</div>
        </nav>

        <main className={styles.main}>
          <div className={styles.mainContent}>{children}</div>
          {commandBar}
        </main>

        {inspectorOpen && (
          <button type="button" className={styles.inspectorScrim} aria-hidden="true" tabIndex={-1} onClick={() => setInspectorOpen(false)} />
        )}
        {inspectorOpen && (
          <aside
            ref={inspectorRef}
            className={cx(styles.inspector, styles.inspectorOpen)}
            role={narrow ? 'dialog' : undefined}
            aria-modal={narrow ? true : undefined}
            aria-label={typeof inspectorTitle === 'string' ? inspectorTitle : labels.inspector}
            tabIndex={narrow ? -1 : undefined}
            data-studio-inspector={narrow ? '' : undefined}
          >
            <div className={styles.inspectorHeader}>
              <div className={styles.inspectorHeading}>
                {inspectorEyebrow && <span className={styles.inspectorEyebrow}>{inspectorEyebrow}</span>}
                <h2>{inspectorTitle}</h2>
              </div>
              <div className={styles.inspectorHeaderActions}>
                {inspectorActions}
                <IconButton
                  icon="pin"
                  label={inspectorPinned ? labels.unpinInspector : labels.pinInspector}
                  active={inspectorPinned}
                  onClick={() => setInspectorPinned(!inspectorPinned)}
                />
                <IconButton icon="close" label={labels.closeInspector} onClick={() => setInspectorOpen(false)} />
              </div>
            </div>
            <div className={styles.inspectorBody}>{inspector}</div>
          </aside>
        )}
        {!inspectorOpen && (
          <button type="button" className={styles.inspectorHandle} onClick={() => setInspectorOpen(true)} title={labels.openInspector}>
            <StudioIcon name="chevron-left" size={15} />
            <span>{labels.inspector}</span>
          </button>
        )}
      </div>

      {assistant}
      {commands.length > 0 && (
        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} items={commands} />
      )}
    </div>
  );
}
