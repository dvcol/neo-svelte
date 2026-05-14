import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoFieldSetHarness from './NeoFieldSetHarness.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoFieldSet — render', () => {
  it('renders a fieldset with .neo-fieldset and the children content', async () => {
    const { container } = render(NeoFieldSetHarness, {
      props: { childrenText: 'inside' } as never,
    });
    await tick();
    const fs = container.querySelector<HTMLFieldSetElement>('fieldset.neo-fieldset')!;
    expect(fs).not.toBeNull();
    expect(fs.querySelector('[data-testid="field-content"]')?.textContent).toBe('inside');
    // No legend element when legend is undefined
    expect(container.querySelector('legend')).toBeNull();
  });

  it('renders a snippet legend inside .neo-fieldset-legend', async () => {
    const { container } = render(NeoFieldSetHarness, {
      props: { legendText: 'Hello', childrenText: 'inside' } as never,
    });
    await tick();
    const legend = container.querySelector<HTMLLegendElement>('legend.neo-fieldset-legend')!;
    expect(legend).not.toBeNull();
    expect(legend.querySelector('[data-testid="legend-snip"]')?.textContent).toBe('Hello');
  });

  it('renders a string legend inside .neo-fieldset-legend', async () => {
    const { container } = render(NeoFieldSetHarness, {
      props: { legendString: 'Stringy', childrenText: 'inside' } as never,
    });
    await tick();
    const legend = container.querySelector<HTMLLegendElement>('legend.neo-fieldset-legend')!;
    expect(legend.textContent?.trim()).toBe('Stringy');
  });

  it('legend with no explicit id auto-generates an id starting with neo-form-legend-', async () => {
    const { container } = render(NeoFieldSetHarness, {
      props: { legendString: 'L', childrenText: 'inside' } as never,
    });
    await tick();
    const legend = container.querySelector<HTMLLegendElement>('legend')!;
    expect(legend.id).toMatch(/^neo-form-legend-/);
  });

  it('explicit id is honored on the legend', async () => {
    const { container } = render(NeoFieldSetHarness, {
      props: { legendString: 'L', id: 'my-legend', childrenText: 'inside' } as never,
    });
    await tick();
    expect(container.querySelector('legend')?.id).toBe('my-legend');
  });
});

describe('neoFieldSet — modifiers', () => {
  it('borderless=true adds .neo-borderless on the fieldset', async () => {
    const { container } = render(NeoFieldSetHarness, {
      props: { borderless: true, childrenText: 'x' } as never,
    });
    await tick();
    expect(container.querySelector('fieldset.neo-borderless')).not.toBeNull();
  });

  it('borderless=false (default) does not add .neo-borderless', async () => {
    const { container } = render(NeoFieldSetHarness, {
      props: { childrenText: 'x' } as never,
    });
    await tick();
    expect(container.querySelector('fieldset.neo-borderless')).toBeNull();
  });

  it('flex prop forwards to inline style', async () => {
    const { container } = render(NeoFieldSetHarness, {
      props: { flex: '1 1 auto', childrenText: 'x' } as never,
    });
    await tick();
    const fs = container.querySelector<HTMLFieldSetElement>('fieldset')!;
    expect(fs.style.flex).toBe('1 1 auto');
  });
});

describe('neoFieldSet — sizing (width / height via toSize)', () => {
  it('plain string width forwards as inline width only', async () => {
    const { container } = render(NeoFieldSetHarness, {
      props: { width: '320px', childrenText: 'x' } as never,
    });
    await tick();
    const fs = container.querySelector<HTMLFieldSetElement>('fieldset')!;
    expect(fs.style.width).toBe('320px');
  });

  it('width object {min, max, absolute} maps to all three CSS props', async () => {
    const { container } = render(NeoFieldSetHarness, {
      props: { width: { min: '100px', max: '500px', absolute: '300px' }, childrenText: 'x' } as never,
    });
    await tick();
    const fs = container.querySelector<HTMLFieldSetElement>('fieldset')!;
    expect(fs.style.width).toBe('300px');
    expect(fs.style.minWidth).toBe('100px');
    expect(fs.style.maxWidth).toBe('500px');
  });

  it('plain string height forwards as inline height only', async () => {
    const { container } = render(NeoFieldSetHarness, {
      props: { height: '200px', childrenText: 'x' } as never,
    });
    await tick();
    const fs = container.querySelector<HTMLFieldSetElement>('fieldset')!;
    expect(fs.style.height).toBe('200px');
  });
});
