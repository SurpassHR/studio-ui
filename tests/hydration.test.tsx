import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StudioProvider, WorkbenchShell } from '../src';

describe('SSR hydration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not change theme or inspector markup before persistence hydrates', async () => {
    localStorage.setItem('studio-hydration', JSON.stringify({ theme: 'light', density: 'compact' }));
    localStorage.setItem('studio-hydration-inspector', JSON.stringify({ open: false, pinned: false }));
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const tree = (
      <StudioProvider storageKey="studio-hydration">
        <WorkbenchShell
          brand={{ name: 'Studio' }}
          navItems={[{ id: 'home', label: 'Home' }]}
          activeNavId="home"
          onNavigate={() => undefined}
          inspectorTitle="Details"
          inspector={<div>Inspector</div>}
          inspectorStorageKey="studio-hydration-inspector"
        >
          <div>Main</div>
        </WorkbenchShell>
      </StudioProvider>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(tree);
    document.body.appendChild(container);

    let root: ReturnType<typeof hydrateRoot> | null = null;
    await act(async () => {
      root = hydrateRoot(container, tree);
      await Promise.resolve();
    });
    expect(errors.mock.calls.flat().join(' ')).not.toMatch(/hydration|did not match|server rendered/i);
    act(() => root?.unmount());
    container.remove();
  });
});
