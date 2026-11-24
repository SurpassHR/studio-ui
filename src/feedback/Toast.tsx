import { useState } from 'react';
import type { StudioLabels, ToastMessage } from '../types';
import { StudioIcon } from '../icons/StudioIcon';
import styles from './Toast.module.css';

export function StudioToastViewport({
  toasts,
  labels,
  onDismiss,
}: {
  toasts: ToastMessage[];
  labels: StudioLabels;
  onDismiss: (id: number) => void;
}) {
  const [runningAction, setRunningAction] = useState<number | null>(null);

  return (
    <div className={`${styles.host} studio-portal`} aria-live="polite" aria-atomic="false" aria-label={labels.notifications}>
      {toasts.map((toast) => {
        const tone = toast.tone ?? 'default';
        return (
          <div key={toast.id} className={`${styles.toast} ${styles[tone]}`} role="status">
            <span className={styles.icon}>
              <StudioIcon name={tone === 'danger' ? 'warning' : tone === 'success' ? 'check' : 'sparkles'} size={16} />
            </span>
            <span className={styles.message}>{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                className={styles.action}
                disabled={runningAction === toast.id}
                onClick={async () => {
                  setRunningAction(toast.id);
                  try {
                    await toast.action?.run();
                    onDismiss(toast.id);
                  } finally {
                    setRunningAction(null);
                  }
                }}
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              className={styles.close}
              onClick={() => onDismiss(toast.id)}
              aria-label={labels.dismissNotification}
            >
              <StudioIcon name="close" size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
