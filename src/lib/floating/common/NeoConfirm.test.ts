import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoConfirm.test.svelte';

afterEach(() => {
  cleanup();
});

function getRoot(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-confirm');
}

function getCloseButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-confirm-control-close-button');
}

function getCancelButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button[aria-label="Cancel confirmation tooltip"]');
}

function getConfirmButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button[aria-label="Confirm confirmation tooltip"]');
}

describe('neoConfirm — render', { tags: ['jsdom'] }, () => {
  it('renders a div.neo-confirm by default with the body and Cancel/Confirm controls', async () => {
    const { container } = render(Harness, { props: { bodyText: 'do this?' } as never });
    await tick();
    const root = getRoot(container);
    expect(root).not.toBeNull();
    expect(root?.tagName).toBe('DIV');
    expect(root?.querySelector('[data-testid="confirm-body"]')?.textContent).toBe('do this?');
    expect(getCancelButton(container)).not.toBeNull();
    expect(getConfirmButton(container)).not.toBeNull();
  });

  it('honors a caller-supplied tag', async () => {
    const { container } = render(Harness, { props: { tag: 'section' } as never });
    await tick();
    expect(getRoot(container)?.tagName).toBe('SECTION');
  });

  it('uses the supplied id and derives header/content ids from it', async () => {
    const { container } = render(Harness, { props: { id: 'cnf', headerText: 'h' } as never });
    await tick();
    expect(container.querySelector('#cnf')).not.toBeNull();
    expect(container.querySelector('#cnf-header')).not.toBeNull();
    expect(container.querySelector('#cnf-content')).not.toBeNull();
  });

  it('does not render a header when no header is provided', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(container.querySelector('.neo-confirm-header')).toBeNull();
    expect(container.querySelector('.neo-confirm-title')).toBeNull();
  });

  it('renders the header when supplied', async () => {
    const { container } = render(Harness, { props: { headerText: 'are you sure?' } as never });
    await tick();
    const header = container.querySelector<HTMLElement>('.neo-confirm-header');
    expect(header).not.toBeNull();
    expect(container.querySelector('.neo-confirm-title')?.textContent).toContain('are you sure?');
  });

  it('header tag defaults to h6 and is overridable via headerProps.tag', async () => {
    const { container, rerender } = render(Harness, { props: { headerText: 'h' } as never });
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-confirm-title')?.tagName).toBe('H6');
    await rerender({ headerText: 'h', headerProps: { tag: 'h2' } } as never);
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-confirm-title')?.tagName).toBe('H2');
  });

  it('content tag defaults to div and is overridable via contentProps.tag', async () => {
    const { container, rerender } = render(Harness, {});
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-confirm-content')?.tagName).toBe('DIV');
    await rerender({ contentProps: { tag: 'p' } } as never);
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-confirm-content')?.tagName).toBe('P');
  });

  it('controls tag defaults to div and is overridable via controlsProps.tag', async () => {
    const { container, rerender } = render(Harness, {});
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-confirm-control')?.tagName).toBe('DIV');
    await rerender({ controlsProps: { tag: 'footer' } } as never);
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-confirm-control')?.tagName).toBe('FOOTER');
  });
});

describe('neoConfirm — closable matrix', { tags: ['jsdom'] }, () => {
  it('renders a close button by default (closable=true) when no header is set, inside content area', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(getCloseButton(container)).not.toBeNull();
    expect(container.querySelector('.neo-confirm-content-close')).not.toBeNull();
  });

  it('renders the close button inside the header area when header is provided', async () => {
    const { container } = render(Harness, { props: { headerText: 'h' } as never });
    await tick();
    const header = container.querySelector<HTMLElement>('.neo-confirm-header');
    expect(header).not.toBeNull();
    expect(header?.querySelector('button.neo-confirm-control-close-button')).not.toBeNull();
    // Should not also appear in content area
    expect(container.querySelector('.neo-confirm-content-close')).toBeNull();
  });

  it('omits the close button entirely when closable=false (no header)', async () => {
    const { container } = render(Harness, { props: { closable: false } as never });
    await tick();
    expect(getCloseButton(container)).toBeNull();
  });

  it('omits the close button when closable=false and header is provided', async () => {
    const { container } = render(Harness, { props: { closable: false, headerText: 'h' } as never });
    await tick();
    expect(getCloseButton(container)).toBeNull();
  });
});

describe('neoConfirm — rounded class', { tags: ['jsdom'] }, () => {
  it('does not apply .neo-rounded by default', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(getRoot(container)?.classList.contains('neo-rounded')).toBe(false);
  });

  it('applies .neo-rounded when rounded=true', async () => {
    const { container } = render(Harness, { props: { rounded: true } as never });
    await tick();
    expect(getRoot(container)?.classList.contains('neo-rounded')).toBe(true);
  });
});

describe('neoConfirm — disabled matrix', { tags: ['jsdom'] }, () => {
  it('disabled=false leaves both buttons enabled', async () => {
    const { container } = render(Harness, { props: { disabled: false } as never });
    await tick();
    expect(getCancelButton(container)?.disabled).toBe(false);
    expect(getConfirmButton(container)?.disabled).toBe(false);
  });

  it('disabled=true disables both buttons', async () => {
    const { container } = render(Harness, { props: { disabled: true } as never });
    await tick();
    expect(getCancelButton(container)?.disabled).toBe(true);
    expect(getConfirmButton(container)?.disabled).toBe(true);
  });

  it('disabled.cancel=true disables only Cancel', async () => {
    const { container } = render(Harness, { props: { disabled: { cancel: true } } as never });
    await tick();
    expect(getCancelButton(container)?.disabled).toBe(true);
    expect(getConfirmButton(container)?.disabled).toBe(false);
  });

  it('disabled.confirm=true disables only Confirm', async () => {
    const { container } = render(Harness, { props: { disabled: { confirm: true } } as never });
    await tick();
    expect(getCancelButton(container)?.disabled).toBe(false);
    expect(getConfirmButton(container)?.disabled).toBe(true);
  });
});

describe('neoConfirm — loading matrix', { tags: ['jsdom'] }, () => {
  it('loading.cancel=true applies .neo-loading on Cancel', async () => {
    const { container } = render(Harness, { props: { loading: { cancel: true } } as never });
    await tick();
    expect(getCancelButton(container)?.classList.contains('neo-loading')).toBe(true);
    expect(getConfirmButton(container)?.classList.contains('neo-loading')).toBe(false);
  });

  it('loading.confirm=true applies .neo-loading on Confirm', async () => {
    const { container } = render(Harness, { props: { loading: { confirm: true } } as never });
    await tick();
    expect(getConfirmButton(container)?.classList.contains('neo-loading')).toBe(true);
    expect(getCancelButton(container)?.classList.contains('neo-loading')).toBe(false);
  });

  it('loading={cancel:false,confirm:false} leaves both without .neo-loading', async () => {
    const { container } = render(Harness, { props: { loading: { cancel: false, confirm: false } } as never });
    await tick();
    expect(getCancelButton(container)?.classList.contains('neo-loading')).toBe(false);
    expect(getConfirmButton(container)?.classList.contains('neo-loading')).toBe(false);
  });

  it('loading={cancel:true,confirm:true} applies .neo-loading on both', async () => {
    const { container } = render(Harness, { props: { loading: { cancel: true, confirm: true } } as never });
    await tick();
    expect(getCancelButton(container)?.classList.contains('neo-loading')).toBe(true);
    expect(getConfirmButton(container)?.classList.contains('neo-loading')).toBe(true);
  });
});

describe('neoConfirm — events', { tags: ['jsdom'] }, () => {
  it('clicking close fires onClose and closeProps.onclick (in that order)', async () => {
    const onClose = vi.fn();
    const closeOnClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, {
      props: { onClose, closeProps: { onclick: closeOnClick } } as never,
    });
    await tick();
    await user.click(getCloseButton(container)!);
    expect(closeOnClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    // closeProps.onclick is invoked first
    expect(closeOnClick.mock.invocationCallOrder[0]).toBeLessThan(onClose.mock.invocationCallOrder[0]);
  });

  it('clicking Cancel fires onCancel and cancelProps.onclick (in that order)', async () => {
    const onCancel = vi.fn();
    const cancelOnClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, {
      props: { onCancel, cancelProps: { onclick: cancelOnClick } } as never,
    });
    await tick();
    await user.click(getCancelButton(container)!);
    expect(cancelOnClick).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(cancelOnClick.mock.invocationCallOrder[0]).toBeLessThan(onCancel.mock.invocationCallOrder[0]);
  });

  it('clicking Confirm fires onConfirm and confirmProps.onclick (in that order)', async () => {
    const onConfirm = vi.fn();
    const confirmOnClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, {
      props: { onConfirm, confirmProps: { onclick: confirmOnClick } } as never,
    });
    await tick();
    await user.click(getConfirmButton(container)!);
    expect(confirmOnClick).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(confirmOnClick.mock.invocationCallOrder[0]).toBeLessThan(onConfirm.mock.invocationCallOrder[0]);
  });

  it('disabled buttons do not fire events on click', async () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, {
      props: { disabled: true, onCancel, onConfirm } as never,
    });
    await tick();
    await user.click(getCancelButton(container)!);
    await user.click(getConfirmButton(container)!);
    expect(onCancel).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
