import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Badge,
  Button,
  Checkbox,
  EmptyState,
  Field,
  FilterTabs,
  Input,
  MetricGrid,
  PageHeader,
  Progress,
} from '../src';

describe('studio primitives', () => {
  it('renders a button with its icon, label, and disabled state', () => {
    render(<Button icon="plus" disabled>Add item</Button>);
    const button = screen.getByRole('button', { name: /add item/i });
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).not.toBeNull();
  });

  it('connects a labelled input to its field description', () => {
    render(
      <Field label="Project name" hint="Use a short name" htmlFor="project-name">
        <Input id="project-name" defaultValue="miku" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Project name' });
    expect(input).toHaveValue('miku');
    expect(screen.getByText('Use a short name')).toBeInTheDocument();
  });

  it('supports labelled static field groups without an input', () => {
    render(<Field asGroup label="Training base"><div>SDXL · Illustrious</div></Field>);
    const group = screen.getByRole('group', { name: 'Training base' });
    expect(group).toHaveTextContent('SDXL · Illustrious');
  });

  it('reports filter tab state and selection', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <FilterTabs
        value="all"
        label="Dataset filters"
        options={[
          { value: 'all', label: 'All', count: 4 },
          { value: 'review', label: 'Review', count: 2 },
        ]}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('button', { name: 'All 4' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Review 2' }));
    expect(onChange).toHaveBeenCalledWith('review');
  });

  it('renders accessible metrics and progress values', () => {
    render(
      <>
        <MetricGrid columns={2} items={[{ label: 'Images', value: 12 }, { label: 'Captioned', value: 8, tone: 'accent' }]} />
        <Progress value={0.75} label="Caption progress" />
      </>
    );
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Caption progress' })).toHaveAttribute('aria-valuenow', '75');
  });

  it('keeps checkbox, badge, empty and heading semantics', () => {
    render(
      <>
        <Checkbox label="Include rejected" />
        <Badge tone="warn" dot>Waiting</Badge>
        <EmptyState icon="library" title="Nothing here">Start with an import.</EmptyState>
        <PageHeader kicker="WORKSPACE" title="Datasets" description="All local projects" />
      </>
    );
    expect(screen.getByRole('checkbox', { name: 'Include rejected' })).toBeInTheDocument();
    expect(screen.getByText('Waiting')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Datasets' })).toBeInTheDocument();
    expect(screen.getByText('Start with an import.')).toBeInTheDocument();
  });
});
