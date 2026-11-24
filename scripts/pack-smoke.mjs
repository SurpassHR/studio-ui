import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const packageRoot = process.cwd();
const temp = mkdtempSync(join(tmpdir(), 'studio-ui-pack-'));

try {
  const packOutput = execFileSync('npm', ['pack', '--pack-destination', temp], {
    cwd: packageRoot,
    encoding: 'utf8',
  }).trim().split('\n').at(-1);
  if (!packOutput) throw new Error('npm pack did not return a tarball name');
  const tarball = join(temp, packOutput);

  writeFileSync(join(temp, 'package.json'), JSON.stringify({
    type: 'module',
    dependencies: {},
  }, null, 2));
  execFileSync('npm', [
    'install', '--ignore-scripts', '--no-audit', '--no-fund',
    tarball, 'react@19.2.0', 'react-dom@19.2.0',
  ], { cwd: temp, stdio: 'pipe' });

  writeFileSync(join(temp, 'smoke.mjs'), `
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, PageHeader, StudioProvider } from '@xmsthc/studio-ui';
const html = renderToStaticMarkup(createElement(StudioProvider, null,
  createElement(PageHeader, { key: 'heading', title: 'Packed package' }),
  createElement(Button, { key: 'button' }, 'Ready'),
));
if (!html.includes('Packed package') || !html.includes('Ready')) throw new Error('packed render failed');
console.log('packed render ok');
`);
  execFileSync('node', ['smoke.mjs'], { cwd: temp, stdio: 'pipe' });

  const manifest = JSON.parse(readFileSync(join(temp, 'node_modules/@xmsthc/studio-ui/package.json'), 'utf8'));
  if (manifest.exports['./styles.css'] !== './dist/studio-ui.css') throw new Error('styles export missing');
  const tokens = readFileSync(join(temp, 'node_modules/@xmsthc/studio-ui/dist/studio-tokens.css'), 'utf8');
  if (!tokens.includes('--studio-bg')) throw new Error('token export missing');
  const styles = readFileSync(join(temp, 'node_modules/@xmsthc/studio-ui/dist/studio-ui.css'), 'utf8');
  if (!styles.includes('--studio-bg') || !styles.includes('.studio-root')) throw new Error('combined styles missing');
  console.log(`pack smoke ok: ${packOutput}`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
