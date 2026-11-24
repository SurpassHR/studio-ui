import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const packageRoot = process.cwd();
const temp = mkdtempSync(join(tmpdir(), 'studio-ui-react18-'));

try {
  const packOutput = execFileSync('npm', ['pack', '--pack-destination', temp], {
    cwd: packageRoot,
    encoding: 'utf8',
  }).trim().split('\n').at(-1);
  if (!packOutput) throw new Error('npm pack did not return a tarball name');

  writeFileSync(join(temp, 'package.json'), JSON.stringify({ type: 'module' }, null, 2));
  execFileSync('npm', [
    'install', '--ignore-scripts', '--no-audit', '--no-fund',
    join(temp, packOutput), 'react@18.3.1', 'react-dom@18.3.1',
  ], { cwd: temp, stdio: 'pipe' });

  writeFileSync(join(temp, 'smoke.mjs'), `
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, PageHeader, StudioProvider, WorkbenchShell } from '@xmsthc/studio-ui';
const html = renderToStaticMarkup(createElement(StudioProvider, null,
  createElement(WorkbenchShell, {
    key: 'shell',
    brand: { name: 'React 18' },
    navItems: [{ id: 'home', label: 'Home' }],
    activeNavId: 'home',
    onNavigate: () => undefined,
    inspectorTitle: 'Details',
    inspector: createElement('div', null, 'Inspector'),
  }, createElement(PageHeader, { title: 'React 18' }), createElement(Button, null, 'Continue')),
));
if (!html.includes('React 18') || !html.includes('Continue')) throw new Error('React 18 render failed');
console.log('React 18 render ok');
`);
  execFileSync('node', ['smoke.mjs'], { cwd: temp, stdio: 'pipe' });
  console.log(`React 18 pack smoke ok: ${packOutput}`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
