import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoPillHarness from './NeoPill.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoPill — host element & content', { tags: ['jsdom'] }, () => {
  it('default tag=div renders the host with .neo-pill', async () => {
    const { container } = render(NeoPillHarness, { props: { label: 'hi' } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-pill');
    expect(host).not.toBeNull();
    expect(host?.tagName).toBe('DIV');
  });

  it('tag overrides the host element', async () => {
    const { container } = render(NeoPillHarness, {
      props: { tag: 'span', label: 'hi' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill')?.tagName).toBe('SPAN');
  });

  it('renders string label as text content', async () => {
    const { container } = render(NeoPillHarness, { props: { label: 'hello' } as never });
    await tick();
    expect(container.querySelector('.neo-pill')?.textContent?.trim()).toContain('hello');
  });

  it('renders children snippet', async () => {
    const { container } = render(NeoPillHarness, { props: { childrenText: 'kids' } as never });
    await tick();
    expect(container.querySelector('[data-testid="pill-children"]')?.textContent).toBe('kids');
  });

  it('renders icon snippet inside .neo-icon', async () => {
    const { container } = render(NeoPillHarness, {
      props: { iconText: 'i', label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-icon [data-testid="pill-icon"]')?.textContent).toBe('i');
  });

  it('renders icon string as NeoImage src', async () => {
    const { container } = render(NeoPillHarness, {
      props: { iconString: '/img.png', label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-icon .neo-image')).not.toBeNull();
  });

  it('icon-only (no label/children) gets .neo-only class on .neo-icon and .neo-empty on host', async () => {
    const { container } = render(NeoPillHarness, { props: { iconText: 'i' } as never });
    await tick();
    expect(container.querySelector('.neo-pill.neo-empty')).not.toBeNull();
    expect(container.querySelector('.neo-icon.neo-only')).not.toBeNull();
  });
});

describe('neoPill — size data-type', { tags: ['jsdom'] }, () => {
  it('size=small reflects data-type="small"', async () => {
    const { container } = render(NeoPillHarness, {
      props: { size: 'small', label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-pill')?.dataset.type).toBe('small');
  });

  it('size=medium reflects data-type="medium"', async () => {
    const { container } = render(NeoPillHarness, {
      props: { size: 'medium', label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-pill')?.dataset.type).toBe('medium');
  });

  it('size=large reflects data-type="large"', async () => {
    const { container } = render(NeoPillHarness, {
      props: { size: 'large', label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-pill')?.dataset.type).toBe('large');
  });

  it('size undefined leaves data-type unset', async () => {
    const { container } = render(NeoPillHarness, { props: { label: 'L' } as never });
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-pill')?.dataset.type).toBeUndefined();
  });
});

describe('neoPill — close affix', { tags: ['jsdom'] }, () => {
  it('close=true renders the close affix and clicking it fires onClose', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoPillHarness, {
      props: { close: true, label: 'L', onClose } as never,
    });
    // close button is debounced (~100ms) — wait for it to appear
    await new Promise(resolve => setTimeout(resolve, 250));
    await tick();
    const btn = await new Promise<HTMLButtonElement | null>((resolve) => {
      const start = Date.now();
      const tryFind = (): void => {
        const found = container.querySelector<HTMLButtonElement>('.neo-pill-affix button');
        if (found || Date.now() - start > 1000) resolve(found);
        else setTimeout(tryFind, 50);
      };
      tryFind();
    });
    expect(btn).not.toBeNull();
    await user.click(btn!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('close=true + disabled=true does NOT render the close affix', async () => {
    const { container } = render(NeoPillHarness, {
      props: { close: true, disabled: true, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill-affix button[aria-label="close"]')).toBeNull();
  });

  it('loading=true renders the affix even without close', async () => {
    const { container } = render(NeoPillHarness, {
      props: { loading: true, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill-affix')).not.toBeNull();
  });

  it('close=false and not loading → no affix', async () => {
    const { container } = render(NeoPillHarness, {
      props: { label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill-affix')).toBeNull();
  });
});

describe('neoPill — style modifiers', { tags: ['jsdom'] }, () => {
  it('rounded=true (default) adds .neo-rounded', async () => {
    const { container } = render(NeoPillHarness, { props: { label: 'L' } as never });
    await tick();
    expect(container.querySelector('.neo-pill.neo-rounded')).not.toBeNull();
  });

  it('rounded=false removes .neo-rounded', async () => {
    const { container } = render(NeoPillHarness, {
      props: { rounded: false, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill')?.classList.contains('neo-rounded')).toBe(false);
  });

  it('borderless=true adds .neo-borderless', async () => {
    const { container } = render(NeoPillHarness, {
      props: { borderless: true, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill.neo-borderless')).not.toBeNull();
  });

  it('text=true defaults borderless and elevation=0 (.neo-borderless + .neo-flat)', async () => {
    const { container } = render(NeoPillHarness, {
      props: { text: true, label: 'L' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-pill')!;
    expect(host.classList.contains('neo-borderless')).toBe(true);
    expect(host.classList.contains('neo-flat')).toBe(true);
  });

  it('disabled=true adds .neo-disabled', async () => {
    const { container } = render(NeoPillHarness, {
      props: { disabled: true, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill.neo-disabled')).not.toBeNull();
  });

  it('skeleton=true adds .neo-skeleton', async () => {
    const { container } = render(NeoPillHarness, {
      props: { skeleton: true, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill.neo-skeleton')).not.toBeNull();
  });

  it('pressed=true adds .neo-pressed and defaults elevation=-1 (.neo-inset)', async () => {
    const { container } = render(NeoPillHarness, {
      props: { pressed: true, label: 'L' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-pill')!;
    expect(host.classList.contains('neo-pressed')).toBe(true);
    expect(host.classList.contains('neo-inset')).toBe(true);
  });

  it('reverse=true adds .neo-reverse', async () => {
    const { container } = render(NeoPillHarness, {
      props: { reverse: true, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill.neo-reverse')).not.toBeNull();
  });

  it('glass=true adds .neo-glass', async () => {
    const { container } = render(NeoPillHarness, {
      props: { glass: true, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill.neo-glass')).not.toBeNull();
  });

  it('tinted=true adds .neo-tinted', async () => {
    const { container } = render(NeoPillHarness, {
      props: { tinted: true, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill.neo-tinted')).not.toBeNull();
  });

  it('filled=true adds .neo-filled', async () => {
    const { container } = render(NeoPillHarness, {
      props: { filled: true, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill.neo-filled')).not.toBeNull();
  });

  it('start=true adds .neo-start', async () => {
    const { container } = render(NeoPillHarness, {
      props: { start: true, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill.neo-start')).not.toBeNull();
  });
});

describe('neoPill — elevation', { tags: ['jsdom'] }, () => {
  it('elevation=0 (default) adds .neo-flat', async () => {
    const { container } = render(NeoPillHarness, {
      props: { elevation: 0, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill.neo-flat')).not.toBeNull();
  });

  it('elevation=1 (default) is not flat and not inset', async () => {
    const { container } = render(NeoPillHarness, { props: { label: 'L' } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-pill')!;
    expect(host.classList.contains('neo-flat')).toBe(false);
    expect(host.classList.contains('neo-inset')).toBe(false);
  });

  it('elevation<0 adds .neo-inset', async () => {
    const { container } = render(NeoPillHarness, {
      props: { elevation: -2, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill.neo-inset')).not.toBeNull();
  });

  it('hover>0 adds .neo-hover', async () => {
    const { container } = render(NeoPillHarness, {
      props: { hover: 1, label: 'L' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-pill.neo-hover')).not.toBeNull();
  });
});
