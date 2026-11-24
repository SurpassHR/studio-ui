import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  if (typeof document !== 'undefined') {
    cleanup();
    document.documentElement.removeAttribute('data-studio-theme');
    document.documentElement.removeAttribute('data-studio-density');
  }
  if (typeof localStorage !== 'undefined') localStorage.clear();
  vi.unstubAllGlobals();
});
