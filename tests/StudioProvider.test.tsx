import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StudioProvider, useStudioPreferences, useStudioLabels, useToast } from '../src/provider/StudioProvider';

function Probe() {
  const { theme, density, setTheme, setDensity } = useStudioPreferences();
  const { loading } = useStudioLabels();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="density">{density}</span>
      <span data-testid="loading">{loading}</span>
      <button type="button" onClick={() => setTheme('light')}>theme</button>
      <button type="button" onClick={() => setDensity('compact')}>density</button>
    </div>
  );
}

function ToastProbe() {
  const { pushToast } = useToast();
  useEffect(() => {
    pushToast({ message: 'Saved', tone: 'success', duration: 20 });
  }, [pushToast]);
  return null;
}

describe('StudioProvider', () => {
  it('persists theme and density changes to the document and local storage', async () => {
    const user = userEvent.setup();
    render(
      <StudioProvider storageKey="studio-test">
        <Probe />
      </StudioProvider>,
    );

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-studio-theme', 'dark'));
    await user.click(screen.getByRole('button', { name: 'theme' }));
    await user.click(screen.getByRole('button', { name: 'density' }));

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-studio-theme', 'light'));
    expect(document.documentElement).toHaveAttribute('data-studio-density', 'compact');
    expect(JSON.parse(localStorage.getItem('studio-test') ?? '{}')).toEqual({
      theme: 'light',
      density: 'compact',
    });
  });

  it('uses a controlled theme without mutating it locally', async () => {
    const onThemeChange = vi.fn();
    const user = userEvent.setup();
    render(
      <StudioProvider theme="dark" onThemeChange={onThemeChange}>
        <Probe />
      </StudioProvider>,
    );

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-studio-theme', 'dark'));
    await user.click(screen.getByRole('button', { name: 'theme' }));
    expect(onThemeChange).toHaveBeenCalledWith('light');
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('keeps uncontrolled state moving when change callbacks are configured', async () => {
    const onThemeChange = vi.fn();
    const user = userEvent.setup();
    render(
      <StudioProvider onThemeChange={onThemeChange}>
        <Probe />
      </StudioProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'theme' }));
    expect(onThemeChange).toHaveBeenCalledWith('light');
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('merges application labels over the English defaults', () => {
    render(
      <StudioProvider labels={{ loading: '正在读取…' }}>
        <Probe />
      </StudioProvider>,
    );
    expect(screen.getByTestId('loading')).toHaveTextContent('正在读取…');
  });

  it('migrates preferences from the previous Zustand persistence shape', async () => {
    localStorage.setItem('studio-test', JSON.stringify({ state: { theme: 'light', density: 'compact' } }));
    render(
      <StudioProvider storageKey="studio-test">
        <Probe />
      </StudioProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('theme')).toHaveTextContent('light'));
    expect(screen.getByTestId('density')).toHaveTextContent('compact');
  });

  it('shows and automatically dismisses toasts', async () => {
    render(
      <StudioProvider>
        <ToastProbe />
      </StudioProvider>,
    );
    expect(await screen.findByText('Saved')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument(), { timeout: 1000 });
  });
});
