import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoCollapseHarness from './NeoCollapse.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoCollapse — render', { tags: ['jsdom'] }, () => {
  it('renders a trigger when label is provided', async () => {
    const { container } = render(NeoCollapseHarness, { props: { label: 'Title' } as never });
    await tick();
    const trigger = container.querySelector<HTMLButtonElement>('.neo-collapse-trigger');
    expect(trigger).not.toBeNull();
    expect(trigger?.textContent?.trim()).toBe('Title');
  });

  it('renders a trigger with both label and description', async () => {
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', description: 'Sub' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-collapse-label-label')?.textContent?.trim()).toBe('Title');
    expect(container.querySelector('.neo-collapse-label-description')?.textContent?.trim()).toBe('Sub');
  });

  it('omits the trigger when no label/description', async () => {
    const { container } = render(NeoCollapseHarness, { props: { open: true } as never });
    await tick();
    expect(container.querySelector('.neo-collapse-trigger')).toBeNull();
  });

  it('open=false unmounts the content when unmountOnClose=true (default)', async () => {
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', open: false } as never,
    });
    await tick();
    expect(container.querySelector('.neo-collapse-content')).toBeNull();
  });

  it('unmountOnClose=false keeps content mounted with aria-hidden=true when closed', async () => {
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', open: false, unmountOnClose: false } as never,
    });
    await tick();
    const content = container.querySelector('.neo-collapse-content');
    expect(content).not.toBeNull();
    expect(content?.getAttribute('aria-hidden')).toBe('true');
  });

  it('open=true renders content visible (aria-hidden=false)', async () => {
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', open: true } as never,
    });
    await tick();
    const content = container.querySelector('.neo-collapse-content');
    expect(content).not.toBeNull();
    expect(content?.getAttribute('aria-hidden')).toBe('false');
  });

  it('trigger has aria-expanded reflecting open state', async () => {
    const { container, rerender } = render(NeoCollapseHarness, {
      props: { label: 'Title', open: false } as never,
    });
    await tick();
    expect(container.querySelector('.neo-collapse-trigger')?.getAttribute('aria-expanded')).toBe('false');
    await rerender({ label: 'Title', open: true } as never);
    await tick();
    expect(container.querySelector('.neo-collapse-trigger')?.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger aria-controls links to the content region id', async () => {
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', open: true } as never,
    });
    await tick();
    const trigger = container.querySelector('.neo-collapse-trigger');
    const content = container.querySelector('.neo-collapse-content');
    expect(trigger?.getAttribute('aria-controls')).toBe(content?.id);
    expect(content?.getAttribute('aria-labelledby')).toBe(trigger?.id);
  });

  it('horizontal=true adds the .neo-horizontal class', async () => {
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', horizontal: true } as never,
    });
    await tick();
    expect(container.querySelector('.neo-collapse.neo-horizontal')).not.toBeNull();
  });

  it('disabled=true sets the trigger disabled and adds .neo-disabled', async () => {
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', disabled: true } as never,
    });
    await tick();
    const trigger = container.querySelector<HTMLButtonElement>('.neo-collapse-trigger');
    expect(trigger?.disabled).toBe(true);
    expect(container.querySelector('.neo-collapse.neo-disabled')).not.toBeNull();
  });

  it('readonly=true marks the trigger with .neo-readonly', async () => {
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', readonly: true } as never,
    });
    await tick();
    expect(container.querySelector('.neo-collapse-trigger.neo-readonly')).not.toBeNull();
  });

  it('divider=true renders a divider between trigger and content', async () => {
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', divider: true, open: true } as never,
    });
    await tick();
    expect(container.querySelector('.neo-divider')).not.toBeNull();
  });

  it('fade=true (default) adds .neo-fade to the content region', async () => {
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', open: true } as never,
    });
    await tick();
    expect(container.querySelector('.neo-collapse-content.neo-fade')).not.toBeNull();
  });

  it('fade=false omits the .neo-fade class', async () => {
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', open: true, fade: false } as never,
    });
    await tick();
    expect(container.querySelector('.neo-collapse-content.neo-fade')).toBeNull();
  });
});

describe('neoCollapse — interaction', { tags: ['jsdom'] }, () => {
  it('clicking the trigger toggles open', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', open: false, unmountOnClose: false } as never,
    });
    await tick();
    const trigger = container.querySelector<HTMLButtonElement>('.neo-collapse-trigger')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await user.click(trigger);
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    await user.click(trigger);
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('disabled=true blocks toggling', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', disabled: true, open: false, unmountOnClose: false } as never,
    });
    await tick();
    const trigger = container.querySelector<HTMLButtonElement>('.neo-collapse-trigger')!;
    await user.click(trigger);
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('readonly=true blocks toggling', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoCollapseHarness, {
      props: { label: 'Title', readonly: true, open: false, unmountOnClose: false } as never,
    });
    await tick();
    const trigger = container.querySelector<HTMLButtonElement>('.neo-collapse-trigger')!;
    await user.click(trigger);
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('neoCollapse — component-instance API', { tags: ['jsdom'] }, () => {
  interface CollapseInstance { toggle: (state?: boolean) => void }

  function captureInstance(props: Record<string, unknown> = {}): { instance: CollapseInstance; container: HTMLElement } {
    let instance: CollapseInstance | undefined;
    const { container } = render(NeoCollapseHarness, {
      props: {
        label: 'Title',
        ...props,
        onInstance: (i: unknown) => {
          instance = i as never;
        },
      } as never,
    });
    return { instance: instance as CollapseInstance, container };
  }

  it('exposes toggle on the component instance', async () => {
    const { instance } = captureInstance();
    await tick();
    expect(typeof instance.toggle).toBe('function');
  });

  it('does not attach toggle onto the section DOM ref', async () => {
    const { container } = captureInstance({ open: true, unmountOnClose: false });
    await tick();
    const section = container.querySelector<HTMLElement>('.neo-collapse-content')!;
    expect(Object.hasOwn(section, 'toggle')).toBe(false);
    expect((section as unknown as Record<string, unknown>).toggle).toBeUndefined();
  });

  it('does not attach toggle onto the trigger DOM ref', async () => {
    const { container } = captureInstance();
    await tick();
    const trigger = container.querySelector<HTMLButtonElement>('.neo-collapse-trigger')!;
    expect(Object.hasOwn(trigger, 'toggle')).toBe(false);
    expect((trigger as unknown as Record<string, unknown>).toggle).toBeUndefined();
  });

  it('instance.toggle() flips the open state on the trigger', async () => {
    const { instance, container } = captureInstance({ open: false, unmountOnClose: false });
    await tick();
    const trigger = container.querySelector<HTMLButtonElement>('.neo-collapse-trigger')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    instance.toggle();
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    instance.toggle();
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('instance.toggle(true) opens; instance.toggle(false) closes', async () => {
    const { instance, container } = captureInstance({ open: false, unmountOnClose: false });
    await tick();
    const trigger = container.querySelector<HTMLButtonElement>('.neo-collapse-trigger')!;
    instance.toggle(true);
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    instance.toggle(true);
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    instance.toggle(false);
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('instance.toggle is a no-op when disabled=true', async () => {
    const { instance, container } = captureInstance({ open: false, disabled: true, unmountOnClose: false });
    await tick();
    const trigger = container.querySelector<HTMLButtonElement>('.neo-collapse-trigger')!;
    instance.toggle(true);
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('instance.toggle is a no-op when readonly=true', async () => {
    const { instance, container } = captureInstance({ open: false, readonly: true, unmountOnClose: false });
    await tick();
    const trigger = container.querySelector<HTMLButtonElement>('.neo-collapse-trigger')!;
    instance.toggle(true);
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
