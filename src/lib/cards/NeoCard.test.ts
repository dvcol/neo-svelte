import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoCardHarness from './NeoCard.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoCard — render & content', { tags: ['jsdom'] }, () => {
  it('default tag=div renders the host with .neo-card and role="none"', async () => {
    const { container } = render(NeoCardHarness, {
      props: { contentText: 'hi' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-card');
    expect(host).not.toBeNull();
    expect(host?.tagName).toBe('DIV');
    expect(host?.getAttribute('role')).toBe('none');
  });

  it('tag overrides the host element', async () => {
    const { container } = render(NeoCardHarness, {
      props: { tag: 'article', contentText: 'x' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card')?.tagName).toBe('ARTICLE');
  });

  it('only content snippet → renders content text without segment wrappers', async () => {
    const { container } = render(NeoCardHarness, {
      props: { contentText: 'just content' } as never,
    });
    await tick();
    expect(container.querySelector('[data-testid="card-content"]')?.textContent).toBe('just content');
    // No segment wrappers since there's only one renderable slot
    expect(container.querySelector('.neo-card-content')).toBeNull();
    expect(container.querySelector('.neo-card-segments, .neo-segments')).toBeNull();
  });

  it('header + content + footer → wraps each in a .neo-card-* segment', async () => {
    const { container } = render(NeoCardHarness, {
      props: { headerText: 'h', contentText: 'c', footerText: 'f' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card-header [data-testid="card-header"]')?.textContent).toBe('h');
    expect(container.querySelector('.neo-card-content [data-testid="card-content"]')?.textContent).toBe('c');
    expect(container.querySelector('.neo-card-footer [data-testid="card-footer"]')?.textContent).toBe('f');
    expect(container.querySelector('.neo-card.neo-segments')).not.toBeNull();
  });

  it('media slot renders inside .neo-card-media', async () => {
    const { container } = render(NeoCardHarness, {
      props: { mediaText: 'img', contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card-media [data-testid="card-media"]')?.textContent).toBe('img');
  });

  it('action slot renders inside .neo-card-action', async () => {
    const { container } = render(NeoCardHarness, {
      props: { actionText: 'a', contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card-action [data-testid="card-action"]')?.textContent).toBe('a');
  });
});

describe('neoCard — close button', { tags: ['jsdom'] }, () => {
  it('close=true with header renders a NeoCloseButton in the header', async () => {
    const { container } = render(NeoCardHarness, {
      props: { close: true, headerText: 'h', contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card-header .neo-card-close button')).not.toBeNull();
  });

  it('close=true without header renders the close button in the content segment', async () => {
    const { container } = render(NeoCardHarness, {
      props: { close: true, contentText: 'c', footerText: 'f' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card-content .neo-card-close button')).not.toBeNull();
  });

  it('clicking the close button fires onClose', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoCardHarness, {
      props: { close: true, contentText: 'c', headerText: 'h', onClose } as never,
    });
    await tick();
    const btn = container.querySelector<HTMLButtonElement>('.neo-card-close button')!;
    await user.click(btn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('close=false renders no close button', async () => {
    const { container } = render(NeoCardHarness, {
      props: { close: false, headerText: 'h', contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card-close')).toBeNull();
  });
});

describe('neoCard — style modifiers', { tags: ['jsdom'] }, () => {
  it('rounded=true adds .neo-rounded', async () => {
    const { container } = render(NeoCardHarness, {
      props: { rounded: true, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-rounded')).not.toBeNull();
  });

  it('glass=true adds .neo-glass', async () => {
    const { container } = render(NeoCardHarness, {
      props: { glass: true, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-glass')).not.toBeNull();
  });

  it('tinted=true adds .neo-tinted', async () => {
    const { container } = render(NeoCardHarness, {
      props: { tinted: true, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-tinted')).not.toBeNull();
  });

  it('borderless=true adds .neo-borderless', async () => {
    const { container } = render(NeoCardHarness, {
      props: { borderless: true, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-borderless')).not.toBeNull();
  });

  it('disabled=true adds .neo-disabled', async () => {
    const { container } = render(NeoCardHarness, {
      props: { disabled: true, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-disabled')).not.toBeNull();
  });

  it('skeleton=true adds .neo-skeleton', async () => {
    const { container } = render(NeoCardHarness, {
      props: { skeleton: true, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-skeleton')).not.toBeNull();
  });

  it('horizontal=true adds .neo-horizontal', async () => {
    const { container } = render(NeoCardHarness, {
      props: { horizontal: true, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-horizontal')).not.toBeNull();
  });

  it('elevation=0 adds .neo-flat', async () => {
    const { container } = render(NeoCardHarness, {
      props: { elevation: 0, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-flat')).not.toBeNull();
  });

  it('elevation<0 adds .neo-inset', async () => {
    const { container } = render(NeoCardHarness, {
      props: { elevation: -2, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-inset')).not.toBeNull();
  });

  it('start=true adds .neo-start', async () => {
    const { container } = render(NeoCardHarness, {
      props: { start: true, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-start')).not.toBeNull();
  });

  it('pressed=true adds .neo-pressed', async () => {
    const { container } = render(NeoCardHarness, {
      props: { pressed: true, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-pressed')).not.toBeNull();
  });

  it('convex=true adds .neo-convex', async () => {
    const { container } = render(NeoCardHarness, {
      props: { convex: true, contentText: 'c' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card.neo-convex')).not.toBeNull();
  });

  it('width number sets px width', async () => {
    const { container } = render(NeoCardHarness, {
      props: { width: 320, contentText: 'c' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-card')!;
    expect(host.style.width).toBe('320px');
  });
});
