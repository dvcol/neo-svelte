import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoPassword from './NeoPassword.svelte';

afterEach(() => {
  cleanup();
});

function getInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-input');
}

function getToggle(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-password-toggle');
}

describe('neoPassword — render', () => {
  it('renders an <input type="password"> by default', async () => {
    const { container } = render(NeoPassword, {});
    await tick();
    expect(getInput(container)?.type).toBe('password');
  });

  it('renders the visibility toggle button', async () => {
    const { container } = render(NeoPassword, {});
    await tick();
    expect(getToggle(container)).not.toBeNull();
    expect(getToggle(container)?.getAttribute('aria-label')).toBe('Toggle password visibility');
  });

  it('uses the default placeholder unless overridden', async () => {
    const { container, rerender } = render(NeoPassword, {});
    await tick();
    expect(getInput(container)?.placeholder).toBe('Enter your password');
    await rerender({ placeholder: 'Custom' });
    await tick();
    expect(getInput(container)?.placeholder).toBe('Custom');
  });

  it('pin=true renders a NeoPin instead of NeoInput', async () => {
    const { container } = render(NeoPassword, { props: { pin: true, value: '' } as never });
    await tick();
    expect(container.querySelector('input.neo-input-pin')).not.toBeNull();
  });
});

describe('neoPassword — visibility toggle', () => {
  it('clicking the toggle flips the input type between password and text', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoPassword, {});
    await tick();
    expect(getInput(container)?.type).toBe('password');
    await user.click(getToggle(container)!);
    await tick();
    expect(getInput(container)?.type).toBe('text');
    await user.click(getToggle(container)!);
    await tick();
    expect(getInput(container)?.type).toBe('password');
  });
});
