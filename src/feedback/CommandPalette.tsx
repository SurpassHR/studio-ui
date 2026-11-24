import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Modal } from './Modal';
import { StudioIcon } from '../icons/StudioIcon';
import { useStudioLabels } from '../provider/StudioProvider';
import type { CommandItem } from '../types';
import styles from './CommandPalette.module.css';

function searchable(item: CommandItem) {
  const keywords = Array.isArray(item.keywords) ? item.keywords.join(' ') : item.keywords ?? '';
  return `${item.label} ${keywords} ${item.group ?? ''}`.toLowerCase();
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder,
  emptyLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  emptyLabel?: string;
}) {
  const labels = useStudioLabels();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const optionId = (index: number) => `${listId}-${index}`;

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => !item.disabled && (!term || searchable(item).includes(term)));
  }, [items, query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  const choose = (index: number) => {
    const item = results[index];
    if (!item) return;
    onOpenChange(false);
    void item.run();
  };

  return (
    <Modal open={open} onClose={() => onOpenChange(false)} title={labels.search} wide>
      <div className={styles.palette}>
        <div className={styles.search}>
          <StudioIcon name="search" size={17} />
          <input
            ref={inputRef}
            role="combobox"
            aria-label={labels.search}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded="true"
            aria-activedescendant={results[activeIndex] ? optionId(activeIndex) : undefined}
            value={query}
            placeholder={placeholder ?? labels.searchPlaceholder}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActiveIndex((value) => Math.min(results.length - 1, value + 1));
              } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveIndex((value) => Math.max(0, value - 1));
              } else if (event.key === 'Enter') {
                event.preventDefault();
                choose(activeIndex);
              }
            }}
          />
          <kbd>ESC</kbd>
        </div>
        <div id={listId} className={styles.results} role="listbox" aria-label={labels.search}>
          {results.length === 0 && <div className={styles.noResults}>{emptyLabel ?? labels.noResults}</div>}
          {results.map((item, index) => (
            <button
              type="button"
              role="option"
              id={optionId(index)}
              aria-selected={index === activeIndex}
              key={item.id}
              className={`${styles.result} ${index === activeIndex ? styles.activeResult : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(index)}
            >
              <span className={styles.resultIcon}>
                {item.icon ?? <StudioIcon name="arrow-right" size={15} />}
              </span>
              <span className={styles.resultLabel}>{item.label}</span>
              {item.group && <span className={styles.group}>{item.group}</span>}
              {item.meta && <span className={styles.meta}>{item.meta}</span>}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
