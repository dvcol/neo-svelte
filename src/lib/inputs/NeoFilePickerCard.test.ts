import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoFilePickerCard from './NeoFilePickerCard.svelte';

afterEach(() => {
  cleanup();
});

function getCard(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-file-picker-card');
}

function makeFileList(...names: string[]): FileList {
  const files = names.map(name => new File(['x'], name, { type: 'text/plain' }));
  const list = {
    length: files.length,
    item: (i: number) => files[i] ?? null,
    * [Symbol.iterator]() {
      for (const file of files) yield file;
    },
  } as unknown as FileList;
  files.forEach((file, i) => {
    (list as unknown as Record<number, File>)[i] = file;
  });
  return list;
}

describe('neoFilePickerCard — empty state', () => {
  it('renders the empty placeholder when no files are provided', async () => {
    const { container } = render(NeoFilePickerCard, { props: { placeholder: 'Choose a file', dropText: 'Drop a File here' } as never });
    await tick();
    expect(getCard(container)).not.toBeNull();
    expect(container.querySelector('.neo-expanded-empty')).not.toBeNull();
    expect(container.textContent).toContain('Choose a file');
  });

  it('dragging=true swaps the placeholder text for dropText', async () => {
    const { container } = render(NeoFilePickerCard, {
      props: { placeholder: 'Choose a file', dropText: 'Drop here', dragging: true } as never,
    });
    await tick();
    expect(container.querySelector('.neo-expanded-placeholder-drop')?.textContent).toBe('Drop here');
    expect(container.querySelector('.neo-expanded-placeholder-select')).toBeNull();
  });

  it('renders the Add files button by default', async () => {
    const { container } = render(NeoFilePickerCard, { props: { placeholder: 'Choose a file' } as never });
    await tick();
    expect(container.querySelector('button[aria-label="Add files"]')).not.toBeNull();
  });
});

describe('neoFilePickerCard — file list', () => {
  it('renders a row per file with the file name', async () => {
    const files = makeFileList('a.txt', 'b.txt');
    const { container } = render(NeoFilePickerCard, { props: { files, placeholder: 'Choose a file' } as never });
    await tick();
    const rows = container.querySelectorAll('.neo-file');
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toContain('a.txt');
    expect(rows[1].textContent).toContain('b.txt');
  });

  it('clearable=true renders a remove button per file and triggers onRemove', async () => {
    const onRemove = vi.fn();
    const files = makeFileList('a.txt', 'b.txt');
    const { container } = render(NeoFilePickerCard, {
      props: { files, clearable: true, placeholder: 'Choose a file', onRemove } as never,
    });
    await tick();
    const removes = container.querySelectorAll<HTMLButtonElement>('button[aria-label="Remove file"]');
    expect(removes).toHaveLength(2);
    removes[0].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await tick();
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove.mock.calls[0][0]).toBe(0);
  });

  it('clearable=false does not render the remove buttons', async () => {
    const files = makeFileList('a.txt');
    const { container } = render(NeoFilePickerCard, {
      props: { files, clearable: false, placeholder: 'Choose a file' } as never,
    });
    await tick();
    expect(container.querySelector('button[aria-label="Remove file"]')).toBeNull();
  });

  it('renders the Edit files button when files are present', async () => {
    const files = makeFileList('a.txt');
    const { container } = render(NeoFilePickerCard, { props: { files, placeholder: 'Choose a file' } as never });
    await tick();
    expect(container.querySelector('button[aria-label="Edit files"]')).not.toBeNull();
  });
});
