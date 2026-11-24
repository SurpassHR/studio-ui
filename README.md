# @xmsthc/studio-ui

Reusable React components for the darkroom-style Studio workbench. The package
keeps visual tokens, primitives, overlays, and the generic workbench shell
separate from application routers, APIs, and domain state.

## Install from GitHub Releases

This repository is private, so download the release asset with an authenticated
GitHub CLI, then install the local tarball:

```bash
gh release download v0.1.0 -R SurpassHR/studio-ui -p '*.tgz' -D /tmp
npm install /tmp/xmsthc-studio-ui-0.1.0.tgz
```

If the repository is later made public, the release asset can be installed
directly from its GitHub URL.

For local development from a checkout:

```bash
npm install
npm run build
```

Then import the package:

```tsx
import '@xmsthc/studio-ui/styles.css';
import { StudioProvider } from '@xmsthc/studio-ui';

<StudioProvider storageKey="my-studio-ui" labels={{ loading: '正在读取…' }}>
  <App />
</StudioProvider>
```

`@xmsthc/studio-ui/tokens.css` exports only the namespaced design tokens when
a project needs the visual language without the React components.

## Workbench shell

`WorkbenchShell` owns the header rhythm, responsive navigation rail, search
command palette, theme/density controls, inspector drawer, and keyboard
handling. Applications provide navigation items, commands, status, header
actions, inspector content, and an optional command bar.

```tsx
<WorkbenchShell
  brand={{ name: 'Acme Studio' }}
  navItems={[{ id: 'library', label: 'Library', icon: <StudioIcon name="library" /> }]}
  activeNavId="library"
  onNavigate={setStage}
  inspectorTitle="Details"
  inspector={<InspectorPanel />}
>
  <Page><PageHeader title="Library" /></Page>
</WorkbenchShell>
```

The shell does not import React Router, Zustand, React Query, or application
types. Theme, density, labels, inspector state, and toasts are managed through
the provider and shell with controlled or uncontrolled props.

## Components

- Primitives: buttons, fields, inputs, select, checkbox, badges, progress,
  segmented controls, filter tabs, empty/loading states, metrics, and keyboard hints.
- Layout: `Page`, `PageHeader`, `Panel`, `PanelHeader`, `InspectorSection`,
  `MetricGrid`, `WorkbenchCommandBar`.
- Overlays: `Modal`, `ConfirmDialog`, `CommandPalette`, provider-backed toasts.
- Icons: `StudioIcon` plus an `Icon` compatibility alias.

## Tokens and themes

All public variables use the `--studio-` prefix to avoid collisions with host
applications. Themes are selected with `data-studio-theme="dark|light"` and
density with `data-studio-density="comfortable|compact"`.

Run `npm run dev:gallery` to open the component
gallery. `npm run test:gallery` runs the responsive visual and interaction checks.

The package is import-safe during SSR, but interactive components are client
components. In a Next App Router project, render them inside a `'use client'`
boundary; import the token CSS globally.
