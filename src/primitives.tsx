import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type ReactElement,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useId,
} from 'react';
import { StudioIcon, type IconName } from './icons/StudioIcon';
import { useStudioLabels } from './provider/StudioProvider';
import type { FilterOption, StudioTone } from './types';
import { cx } from './lib/cx';
import styles from './primitives.module.css';

export type IconSlot = IconName | ReactNode;

function renderIcon(icon: IconSlot, size: number) {
  return typeof icon === 'string' ? <StudioIcon name={icon as IconName} size={size} /> : icon;
}

export function Button({
  variant = 'ghost',
  size = 'md',
  icon,
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'accent' | 'ghost' | 'quiet' | 'danger';
  size?: 'md' | 'sm';
  icon?: IconSlot;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      className={cx(styles.button, styles[variant], size === 'sm' && styles.small, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner size={size === 'sm' ? 12 : 14} /> : icon ? renderIcon(icon, size === 'sm' ? 13 : 15) : null}
      {children}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  active = false,
  size = 'md',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconSlot;
  label: string;
  active?: boolean;
  size?: 'md' | 'sm';
}) {
  return (
    <button
      type="button"
      className={cx(styles.iconButton, active && styles.active, size === 'sm' && styles.iconButtonSmall, className)}
      aria-label={label}
      title={label}
      {...props}
    >
      {renderIcon(icon, size === 'sm' ? 14 : 16)}
    </button>
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  asGroup = false,
  children,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  asGroup?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const generatedId = useId();
  const fieldId = htmlFor ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  let control: ReactNode = children;
  if (!asGroup && !htmlFor && isValidElement(children)) {
    const element = children as ReactElement<{ id?: string; 'aria-describedby'?: string }>;
    control = cloneElement(element, {
      id: element.props.id ?? fieldId,
      'aria-describedby': [element.props['aria-describedby'], describedBy].filter(Boolean).join(' ') || undefined,
    });
  }
  if (asGroup) {
    const groupLabelId = `${fieldId}-group`;
    return (
      <div className={cx(styles.field, className)} role="group" aria-labelledby={groupLabelId}>
        <span id={groupLabelId} className={styles.fieldLabel}><span>{label}</span></span>
        {children}
        {hint && <span id={hintId} className={styles.hint}>{hint}</span>}
        {error && <span id={errorId} className={styles.error}>{error}</span>}
      </div>
    );
  }
  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.fieldLabel} htmlFor={fieldId}>
        <span>{label}</span>
      </label>
      {control}
      {hint && <span id={hintId} className={styles.hint}>{hint}</span>}
      {error && <span id={errorId} className={styles.error}>{error}</span>}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cx(styles.input, className)} {...props} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cx(styles.textarea, className)} {...props} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...props }, ref) {
    return <select ref={ref} className={cx(styles.select, className)} {...props} />;
  },
);

export function Checkbox({
  label,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; hint?: ReactNode }) {
  return (
    <label className={cx(styles.checkbox, className)}>
      <input type="checkbox" {...props} />
      <span className={styles.checkboxText}>
        <span>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
    </label>
  );
}

export function Badge({
  tone = 'default',
  dot = false,
  children,
  className,
}: {
  tone?: StudioTone;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cx(styles.badge, tone !== 'default' && styles[`badge${capitalize(tone)}`], className)}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  const labels = useStudioLabels();
  const percent = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={styles.progress} role="progressbar" aria-label={label ?? labels.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: Array<{ value: T; label: ReactNode; disabled?: boolean }>;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className={styles.segmented} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          className={cx(styles.segment, value === option.value && styles.segmentActive)}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          disabled={option.disabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function FilterTabs<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: {
  value: T;
  options: Array<FilterOption<T>>;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div className={cx(styles.filterTabs, className)} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          className={cx(styles.filterTab, value === option.value && styles.filterTabActive)}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          aria-label={typeof option.label === 'string' && option.count !== undefined ? `${option.label} ${String(option.count)}` : undefined}
          disabled={option.disabled}
        >
          <span>{option.label}</span>
          {option.count !== undefined && <span className={styles.filterCount}>{option.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className={styles.kbd}>{children}</kbd>;
}

export function Spinner({ size = 14 }: { size?: number }) {
  return <span className={styles.spinner} style={{ width: size, height: size }} aria-hidden="true" />;
}

export function Loading({ label }: { label?: ReactNode }) {
  const labels = useStudioLabels();
  return (
    <div className={cx(styles.empty, styles.loading)} role="status">
      <Spinner />
      <span className={styles.emptyText}>{label ?? labels.loading}</span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  children,
  action,
  className,
}: {
  icon?: IconName;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx(styles.empty, className)}>
      {icon && <span className={styles.emptyIcon}><StudioIcon name={icon} size={18} /></span>}
      <span className={styles.emptyTitle}>{title}</span>
      {children && <div className={styles.emptyText}>{children}</div>}
      {action}
    </div>
  );
}

export function SectionTitle({ children, actions, className, ...props }: HTMLAttributes<HTMLDivElement> & { actions?: ReactNode }) {
  return (
    <div className={cx(styles.sectionTitle, className)} {...props}>
      <div>{children}</div>
      {actions}
    </div>
  );
}

export function Toolbar({ left, center, actions, className }: {
  left?: ReactNode;
  center?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx(styles.toolbar, className)}>
      <div className={styles.toolbarSide}>{left}</div>
      <div className={styles.toolbarCenter}>{center}</div>
      <div className={cx(styles.toolbarSide, styles.toolbarActions)}>{actions}</div>
    </div>
  );
}

export function WorkbenchCommandBar({
  left,
  center,
  actions,
  progress,
  progressLabel,
  className,
}: {
  left?: ReactNode;
  center?: ReactNode;
  actions?: ReactNode;
  progress?: number;
  progressLabel?: string;
  className?: string;
}) {
  return (
    <Toolbar
      className={className}
      left={left}
      center={(
        <>
          {progress !== undefined && <Progress value={progress} label={progressLabel} />}
          {center && <span className={styles.commandCenterText}>{center}</span>}
        </>
      )}
      actions={actions}
    />
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
