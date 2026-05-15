import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoFilePicker from './NeoFilePicker.svelte';

afterEach(() => {
  cleanup();
});

function getInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-input-file-picker');
}

function getDropContainer(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-drop-container');
}

function getOverlay(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-drop-overlay');
}

function getAddButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button[aria-label="Add files"]');
}

describe('neoFilePicker — render', { tags: ['jsdom'] }, () => {
  it('renders an <input type="file"> wrapped in a drop container by default', async () => {
    const { container } = render(NeoFilePicker, {});
    await tick();
    const input = getInput(container);
    expect(input).not.toBeNull();
    expect(input?.type).toBe('file');
    expect(getDropContainer(container)).not.toBeNull();
  });

  it('renders the drop overlay text by default', async () => {
    const { container } = render(NeoFilePicker, {});
    await tick();
    const overlay = getOverlay(container);
    expect(overlay).not.toBeNull();
    expect(overlay?.textContent?.trim()).toBe('Drop a File here');
  });

  it('multiple=true pluralizes the default drop overlay text', async () => {
    const { container } = render(NeoFilePicker, { props: { multiple: true } as never });
    await tick();
    expect(getOverlay(container)?.textContent?.trim()).toBe('Drop Files here');
    expect(getInput(container)?.multiple).toBe(true);
  });

  it('drop=false omits the drop container', async () => {
    const { container } = render(NeoFilePicker, { props: { drop: false } as never });
    await tick();
    expect(getDropContainer(container)).toBeNull();
    expect(getInput(container)).not.toBeNull();
  });

  it('renders the upload button with aria-label "Add files"', async () => {
    const { container } = render(NeoFilePicker, {});
    await tick();
    expect(getAddButton(container)).not.toBeNull();
  });

  it('disabled is reflected on the input', async () => {
    const { container } = render(NeoFilePicker, { props: { disabled: true } as never });
    await tick();
    expect(getInput(container)?.disabled).toBe(true);
  });

  it('expanded=true renders the file picker card surface', async () => {
    const { container } = render(NeoFilePicker, { props: { expanded: true } as never });
    await tick();
    expect(container.querySelector('.neo-file-picker-card')).not.toBeNull();
  });
});
