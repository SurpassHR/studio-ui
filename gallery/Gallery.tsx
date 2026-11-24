import { useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  CommandPalette,
  ConfirmDialog,
  EmptyState,
  Field,
  FilterTabs,
  IconButton,
  Input,
  InspectorSection,
  Kbd,
  MetricGrid,
  Modal,
  Page,
  PageHeader,
  Panel,
  PanelHeader,
  Progress,
  Segmented,
  Select,
  StudioIcon,
  Textarea,
  WorkbenchCommandBar,
  WorkbenchShell,
  useStudioPreferences,
  useToast,
  type CommandItem,
} from '../src';
import styles from './gallery.module.css';

type GalleryFilter = 'all' | 'active' | 'archive';

const sections = [
  { id: 'foundations', label: 'Foundations', icon: 'grid' },
  { id: 'primitives', label: 'Primitives', icon: 'list' },
  { id: 'metrics', label: 'Signals', icon: 'sparkles' },
  { id: 'workbench', label: 'Workbench', icon: 'workflow' },
];

export function Gallery() {
  const { theme, density } = useStudioPreferences();
  const { pushToast } = useToast();
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [segment, setSegment] = useState<'compact' | 'comfortable'>('comfortable');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('foundations');

  const commands: CommandItem[] = [
    { id: 'foundations', label: 'Jump to foundations', group: 'Sections', icon: <StudioIcon name="grid" size={15} />, run: () => navigate('foundations') },
    { id: 'primitives', label: 'Jump to primitives', group: 'Sections', icon: <StudioIcon name="list" size={15} />, run: () => navigate('primitives') },
    { id: 'overlay', label: 'Open modal specimen', group: 'Actions', icon: <StudioIcon name="sparkles" size={15} />, run: () => setModalOpen(true) },
    { id: 'toast', label: 'Show success toast', group: 'Actions', icon: <StudioIcon name="check" size={15} />, run: () => pushToast({ message: 'Component saved', tone: 'success' }) },
  ];

  const navigate = (id: string) => {
    setActiveSection(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <WorkbenchShell
      brand={{ name: 'Studio UI', badge: <Badge tone="accent">v0.1</Badge> }}
      breadcrumbs={<span className={styles.crumb}>Component specimen / darkroom workbench</span>}
      navItems={sections.map((section) => ({ id: section.id, label: section.label, icon: <StudioIcon name={section.icon as 'grid'} size={17} /> }))}
      activeNavId={activeSection}
      onNavigate={navigate}
      status={<span className={styles.live}><span />{theme} / {density}</span>}
      commands={commands}
      inspectorTitle="Details"
      inspectorEyebrow="STUDIO UI"
      inspector={(
        <div className={styles.inspector}>
          <InspectorSection title="Current theme">
            <p className={styles.prose}>The gallery and every specimen share the same namespaced token contract. Theme and density are persisted by the provider.</p>
            <MetricGrid columns={2} items={[{ label: 'Theme', value: theme }, { label: 'Density', value: density }]} />
          </InspectorSection>
          <InspectorSection title="Principles">
            <ul className={styles.principles}>
              <li>Image-first, instrument-like surfaces.</li>
              <li>Small type earns its place through hierarchy.</li>
              <li>Motion confirms action, never decorates idle screens.</li>
            </ul>
          </InspectorSection>
          <InspectorSection title="Shortcuts">
            <div className={styles.shortcuts}><span><Kbd>⌘</Kbd><Kbd>K</Kbd> Search</span><span><Kbd>\</Kbd> Inspector</span><span><Kbd>Esc</Kbd> Close</span></div>
          </InspectorSection>
        </div>
      )}
      commandBar={(
        <WorkbenchCommandBar
          left={<span className={styles.barMeta}>12 components · 2 themes</span>}
          center="Package source is the design source"
          progress={0.72}
          progressLabel="Gallery coverage"
          actions={<Button variant="accent" icon="sparkles" onClick={() => setPaletteOpen(true)}>Open command palette</Button>}
        />
      )}
    >
      <Page className={styles.page}>
        <PageHeader
          kicker="@XMSTHC/STUDIO-UI"
          title="Studio UI"
          description="A compact darkroom-style React system for image-heavy production tools. Foundations, primitives, and the reusable workbench shell live together here."
          actions={<Button variant="primary" icon="arrow-right" onClick={() => navigate('primitives')}>Browse primitives</Button>}
        />

        <section id="section-foundations" className={styles.section}>
          <SectionLabel index="01" title="Foundations" note="Semantic tokens, contrast, and the reading scale" />
          <div className={styles.foundationGrid}>
            <Panel className={styles.specimen}>
              <PanelHeader eyebrow="PALETTE" title="Darkroom light" description="Mint signals action; amber marks judgment; red is reserved for destructive intent." />
              <div className={styles.swatches}>
                {['bg', 'surface', 'surface-raised', 'text', 'muted', 'accent', 'crop', 'danger'].map((name) => (
                  <div key={name}><span style={{ background: `var(--studio-${name})` }} /><code>{name}</code></div>
                ))}
              </div>
            </Panel>
            <Panel className={styles.specimen}>
              <PanelHeader eyebrow="TYPE" title="Instrument typography" description="Inter carries the work; JetBrains Mono identifies measurements, IDs, and keyboard surfaces." />
              <div className={styles.typeSpecimen}>
                <span className={styles.displayType}>Image first.</span>
                <span className={styles.bodyType}>A quieter interface gives the pixels more authority. Secondary text remains readable at 11px and controls hold a 12px floor.</span>
                <code className={styles.monoType}>SEEDVR2 · 1280 px · 34 / 64 frames</code>
              </div>
            </Panel>
          </div>
        </section>

        <section id="section-primitives" className={styles.section}>
          <SectionLabel index="02" title="Primitives" note="Actions, forms, status, and selection controls" />
          <div className={styles.primitiveGrid}>
            <Panel className={styles.specimen}>
              <PanelHeader eyebrow="ACTIONS" title="Buttons" />
              <div className={styles.rowWrap}>
                <Button variant="primary" icon="plus">Primary</Button>
                <Button variant="accent" icon="play">Accent</Button>
                <Button icon="refresh">Ghost</Button>
                <Button variant="danger" icon="trash">Danger</Button>
                <Button loading>Working</Button>
                <IconButton icon="settings" label="Settings" />
              </div>
            </Panel>
            <Panel className={styles.specimen}>
              <PanelHeader eyebrow="FORM" title="Inputs" />
              <div className={styles.formStack}>
                <Field label="Project name" hint="Slug used in local storage"><Input defaultValue="miku_stage_02" /></Field>
                <Field label="Caption style"><Select defaultValue="long"><option value="long">Long description</option><option value="tags">Danbooru tags</option></Select></Field>
                <Checkbox label="Keep original pixels" hint="Always available beside generated derivatives." defaultChecked />
                <Field label="Prompt"><Textarea rows={3} defaultValue="A quiet portrait on a graphite background, narrow depth of field." /></Field>
              </div>
            </Panel>
            <Panel className={styles.specimen}>
              <PanelHeader eyebrow="SELECTION" title="Filters and density" />
              <div className={styles.formStack}>
                <FilterTabs value={filter} label="Gallery filter" onChange={setFilter} options={[{ value: 'all', label: 'All', count: 18 }, { value: 'active', label: 'Active', count: 4 }, { value: 'archive', label: 'Archive', count: 14 }]} />
                <Segmented value={segment} label="Density" onChange={setSegment} options={[{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]} />
                <div className={styles.rowWrap}><Badge tone="accent" dot>Ready</Badge><Badge tone="warn" dot>Review</Badge><Badge tone="danger" dot>Failed</Badge><Badge>Idle</Badge></div>
                <Progress value={0.68} label="Caption coverage" />
              </div>
            </Panel>
          </div>
        </section>

        <section id="section-metrics" className={styles.section}>
          <SectionLabel index="03" title="Signals" note="Metrics, empty states, and overlay feedback" />
          <MetricGrid columns={4} items={[{ label: 'Frames', value: 128 }, { label: 'Approved', value: 96, tone: 'accent' }, { label: 'Review', value: 24, tone: 'warn' }, { label: 'Failed', value: 8, tone: 'danger' }]} />
          <div className={styles.signalGrid}>
            <Panel className={styles.specimen}>
              <PanelHeader eyebrow="EMPTY" title="Nothing selected" />
              <EmptyState icon="library" title="Start with a contact sheet" action={<Button icon="plus">Import dataset</Button>}>A useful empty state points to the next concrete action.</EmptyState>
            </Panel>
            <Panel className={styles.specimen}>
              <PanelHeader eyebrow="OVERLAYS" title="Feedback and judgment" />
              <div className={styles.overlayButtons}>
                <Button icon="search" onClick={() => setPaletteOpen(true)}>Open command palette</Button>
                <Button icon="grid" onClick={() => setModalOpen(true)}>Open modal</Button>
                <Button icon="trash" variant="danger" onClick={() => setConfirmOpen(true)}>Open confirmation</Button>
                <Button icon="sparkles" variant="accent" onClick={() => pushToast({ message: 'Component saved', tone: 'success', action: { label: 'Undo', run: () => undefined } })}>Show toast</Button>
              </div>
            </Panel>
          </div>
        </section>

        <section id="section-workbench" className={styles.section}>
          <SectionLabel index="04" title="Workbench" note="The shell is a composition boundary, not an application" />
          <Panel className={styles.workbenchNote}>
            <div className={styles.workbenchStatement}>
              <span className={styles.statementIndex}>SHELL / SLOTS</span>
              <h2>Navigation, inspector, search, and the action rail are composition, not domain logic.</h2>
              <p>The surrounding shell is the specimen. Applications provide nav items, commands, header actions, and domain panels; the package owns keyboard behavior, theme, density, persistence, and the responsive drawer.</p>
            </div>
            <div className={styles.slotGrid}>
              {['brand', 'breadcrumbs', 'navItems', 'commands', 'status', 'headerActions', 'inspector', 'commandBar'].map((slot) => <code key={slot}>{slot}</code>)}
            </div>
          </Panel>
        </section>
      </Page>

      <Modal open={modalOpen} title="Component modal" onClose={() => setModalOpen(false)} footer={<Button variant="primary" onClick={() => setModalOpen(false)}>Done</Button>}>
        <div className={styles.modalCopy}><p>The modal owns focus trapping, Escape handling, portal rendering, and scroll locking.</p><Field label="Example field"><Input defaultValue="Editable while the dialog is open" /></Field></div>
      </Modal>
      <ConfirmDialog open={confirmOpen} title="Delete component?" message="Destructive actions use the same dialog grammar with a danger confirmation." dangerous confirmLabel="Delete" onClose={() => setConfirmOpen(false)} onConfirm={() => { setConfirmOpen(false); pushToast({ message: 'Component deleted', tone: 'success' }); }} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} items={commands} />
    </WorkbenchShell>
  );
}

function SectionLabel({ index, title, note }: { index: string; title: string; note: string }) {
  return (
    <div className={styles.sectionLabel}>
      <span>{index}</span>
      <h2>{title}</h2>
      <p>{note}</p>
    </div>
  );
}
