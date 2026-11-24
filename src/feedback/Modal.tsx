import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useStudioLabels } from '../provider/StudioProvider';
import { StudioIcon } from '../icons/StudioIcon';
import { Button } from '../primitives';
import styles from './Modal.module.css';

export function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  wide = false,
  className,
}: {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  wide?: boolean;
  className?: string;
}) {
  const labels = useStudioLabels();
  const titleId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab' || !boxRef.current) return;
      const focusable = [...boxRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
      )];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (document.activeElement === boxRef.current) {
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
    document.addEventListener('keydown', keydown);
    const focusTimer = window.setTimeout(() => {
      const box = boxRef.current;
      if (!box) return;
      const first = box.querySelector<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
      );
      (first ?? box).focus();
    }, 0);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', keydown);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [open]);

  if (!open || !mounted || typeof document === 'undefined') return null;
  return createPortal(
    <div
      className={`${styles.overlay} studio-portal`}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={boxRef}
        className={`${styles.box} ${wide ? styles.wide : ''} ${className ?? ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 id={titleId}>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={labels.close}>
            <StudioIcon name="close" size={16} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  dangerous = false,
  onConfirm,
  onClose,
  children,
}: {
  open: boolean;
  title: ReactNode;
  message: ReactNode;
  confirmLabel?: ReactNode;
  dangerous?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
}) {
  const labels = useStudioLabels();
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{labels.cancel}</Button>
          <Button variant={dangerous ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel ?? labels.confirm}</Button>
        </>
      }
    >
      <div className={styles.message}>{message}</div>
      {children}
    </Modal>
  );
}
