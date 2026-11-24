import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StudioProvider, WorkbenchShell } from '../src';

function Shell() {
  return (
    <StudioProvider labels={{ closeInspector: '收起检查器', openInspector: '打开检查器', pinInspector: '固定检查器' }}>
      <WorkbenchShell
        brand={{ name: 'Studio', onClick: vi.fn() }}
        activeNavId="library"
        navItems={[
          { id: 'library', label: 'Library', icon: 'library', badge: 3 },
          { id: 'queue', label: 'Queue', icon: 'list', status: 'attention' },
        ]}
        onNavigate={vi.fn()}
        breadcrumbs={<span>Project / miku</span>}
        status={<span>Online</span>}
        headerActions={<button type="button">Agent</button>}
        inspectorTitle="Dataset inspector"
        inspector={<div>Inspector content</div>}
        commandBar={<div>Command bar</div>}
        commands={[{ id: 'settings', label: 'Open settings', run: vi.fn() }]}
      >
        <div>Main content</div>
      </WorkbenchShell>
    </StudioProvider>
  );
}

describe('WorkbenchShell', () => {
  it('renders generic navigation, breadcrumbs, slots, and inspector content', () => {
    render(<Shell />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Library/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Project / miku')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Dataset inspector' })).toHaveTextContent('Inspector content');
    expect(screen.getByText('Command bar')).toBeInTheDocument();
  });

  it('toggles the inspector and theme controls', async () => {
    const user = userEvent.setup();
    render(<Shell />);
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-studio-theme', 'dark'));
    await user.click(within(screen.getByRole('complementary', { name: 'Dataset inspector' })).getByRole('button', { name: '收起检查器' }));
    expect(screen.queryByText('Inspector content')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '打开检查器' }));
    expect(screen.getByText('Inspector content')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-studio-theme', 'light'));
  });

  it('opens the generic command palette from the search trigger and shortcut', async () => {
    const user = userEvent.setup();
    render(<Shell />);
    await user.click(screen.getByRole('button', { name: 'Search and actions' }));
    expect(screen.getByRole('combobox', { name: 'Search and actions' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Open settings/ })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await user.keyboard('{Meta>}k{/Meta}');
    expect(screen.getByRole('combobox', { name: 'Search and actions' })).toBeInTheDocument();
  });

  it('turns the narrow inspector into a focused modal drawer', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const user = userEvent.setup();
    render(<Shell />);
    await user.click(screen.getByRole('button', { name: '打开检查器' }));
    const drawer = await screen.findByRole('dialog', { name: 'Dataset inspector' });
    await waitFor(() => expect(drawer.contains(document.activeElement)).toBe(true));
    await user.tab();
    expect(drawer.contains(document.activeElement)).toBe(true);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Dataset inspector' })).not.toBeInTheDocument();
  });
});
