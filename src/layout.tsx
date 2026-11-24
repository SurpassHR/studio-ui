import type { HTMLAttributes, ReactNode } from 'react';
import type { MetricItem } from './types';
import { cx } from './lib/cx';
import styles from './layout.module.css';

export function Page({ children, className, grid = true, ...props }: HTMLAttributes<HTMLDivElement> & { grid?: boolean }) {
  return (
    <div className={cx(styles.page, grid && styles.grid, className)} {...props}>
      {children}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
  actions,
  headingLevel = 1,
  className,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  headingLevel?: 1 | 2;
  className?: string;
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <header className={cx(styles.pageHeader, className)}>
      <div className={styles.pageHeading}>
        {kicker && <span className={styles.kicker}>{kicker}</span>}
        <Heading>{title}</Heading>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className={styles.pageActions}>{actions}</div>}
    </header>
  );
}

export function Panel({
  children,
  className,
  tone = 'surface',
  interactive = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  tone?: 'surface' | 'raised' | 'sunken';
  interactive?: boolean;
}) {
  return (
    <div className={cx(styles.panel, styles[`panel${capitalize(tone)}`], interactive && styles.panelInteractive, className)} {...props}>
      {children}
    </div>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx(styles.panelHeader, className)}>
      <div className={styles.panelHeading}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className={styles.panelActions}>{actions}</div>}
    </div>
  );
}

export function InspectorSection({
  title,
  actions,
  children,
  className,
}: {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx(styles.inspectorSection, className)}>
      {(title || actions) && (
        <div className={styles.inspectorTitleRow}>
          {title && <h3>{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function MetricGrid({
  items,
  columns = 2,
  className,
}: {
  items: MetricItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <dl className={cx(styles.metrics, styles[`columns${columns}`], className)}>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className={styles.metric}>
          <dt>{item.label}</dt>
          <dd data-tone={item.tone ?? 'default'}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cx(styles.divider, className)} role="separator" />;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
