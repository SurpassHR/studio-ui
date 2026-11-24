import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette, ConfirmDialog, Modal, StudioProvider } from '../src';

describe('overlays', () => {
  it('keeps input focus while its parent rerenders on every keystroke', async () => {
    function FormModal() {
      const [value, setValue] = useState('');
      return (
        <StudioProvider>
          <Modal open title="Editing" onClose={vi.fn()} footer={<button type="button">Save</button>}>
            <label>Name<input aria-label="Name" value={value} onChange={(event) => setValue(event.target.value)} /></label>
          </Modal>
        </StudioProvider>
      );
    }
    const user = userEvent.setup();
    render(<FormModal />);
    const input = await screen.findByLabelText('Name');
    await user.click(input);
    await user.keyboard('provider-name');
    expect(input).toHaveValue('provider-name');
    expect(input).toHaveFocus();
  });

  it('closes a modal with Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <StudioProvider>
          <button type="button" onClick={() => setOpen(true)}>Open dialog</button>
          <Modal open={open} title="Edit project" onClose={() => setOpen(false)}>
            <button type="button">Inside</button>
          </Modal>
        </StudioProvider>
      );
    }
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Edit project' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('uses configured confirm labels and runs the destructive action', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <StudioProvider labels={{ cancel: '取消', confirm: '确定' }}>
        <ConfirmDialog open title="Delete" message="This cannot be undone." dangerous onConfirm={onConfirm} onClose={vi.fn()} confirmLabel="删除" />
      </StudioProvider>,
    );
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '删除' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('filters commands and executes the active item with Enter', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const openDataset = vi.fn();
    render(
      <StudioProvider>
        <CommandPalette
          open
          onOpenChange={onOpenChange}
          items={[
            { id: 'library', label: 'Go to library', keywords: ['datasets'], run: vi.fn() },
            { id: 'miku', label: 'Open miku', keywords: ['dataset'], run: openDataset },
          ]}
        />
      </StudioProvider>,
    );
    const search = screen.getByRole('combobox', { name: 'Search and actions' });
    await user.type(search, 'miku');
    expect(screen.queryByRole('option', { name: /Go to library/ })).not.toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(openDataset).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
