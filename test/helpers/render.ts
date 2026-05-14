/**
 * Test conventions (Phase 0):
 *
 * - Co-locate component tests with the source: `Foo.svelte` -> `Foo.test.ts` for
 *   jsdom behavior/ARIA/state, `Foo.browser.test.ts` for real layout, pointer,
 *   scroll, focus traversal, drag, real rAF.
 * - Prefer `@testing-library/svelte` + `@testing-library/user-event` over manual
 *   events.
 * - Positioning assertions use `data-placement`, measured rect deltas, or
 *   transform-origin strings — never absolute pixel coordinates.
 * - Fake timers in jsdom for delay-driven behavior; real timers + `vi.waitFor`
 *   in browser project.
 *
 * The legacy `test/` folder keeps cross-cutting / library-index tests only.
 */

import type { RenderResult } from '@testing-library/svelte';
import type { Component, ComponentProps, SvelteComponent } from 'svelte';

import { render } from '@testing-library/svelte';

export { render } from '@testing-library/svelte';

export const PORTAL_ROOT_ID = 'neo-portal-root';

/**
 * Renders a component with a portal target div mounted on `document.body`.
 * The target is removed after the test via the returned cleanup callback,
 * which Testing Library invokes automatically through the `RenderResult`.
 */
export function renderWithPortalTarget<C extends SvelteComponent>(
  component: Component<ComponentProps<C>>,
  props?: ComponentProps<C>,
): RenderResult<C> & { portal: HTMLElement } {
  let portal = document.getElementById(PORTAL_ROOT_ID);
  const created = !portal;
  if (!portal) {
    portal = document.createElement('div');
    portal.id = PORTAL_ROOT_ID;
    document.body.appendChild(portal);
  }
  const result = render(component as never, { props } as never) as RenderResult<C>;
  const originalUnmount = result.unmount;
  result.unmount = () => {
    originalUnmount();
    if (created && portal?.parentNode) portal.parentNode.removeChild(portal);
  };
  return Object.assign(result, { portal });
}
