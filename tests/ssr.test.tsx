// @vitest-environment node

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Page, PageHeader, StudioProvider, WorkbenchShell } from '../src';

describe('server import safety', () => {
  it('renders the provider and workbench shell without browser globals', () => {
    const html = renderToStaticMarkup(
      <StudioProvider>
        <WorkbenchShell
          brand={{ name: 'Studio' }}
          navItems={[{ id: 'home', label: 'Home' }]}
          activeNavId="home"
          onNavigate={() => undefined}
          inspectorTitle="Details"
          inspector={<div>Inspector</div>}
        >
          <Page><PageHeader title="Server-safe" /></Page>
        </WorkbenchShell>
      </StudioProvider>,
    );
    expect(html).toContain('Server-safe');
    expect(html).toContain('Inspector');
  });
});
