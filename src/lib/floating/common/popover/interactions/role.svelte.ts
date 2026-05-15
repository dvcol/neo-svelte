import type { AriaRole, ComponentRole, Interaction, RoleOptions } from '../popover.types.js';

const ROLE_TO_ARIA = new Map<AriaRole | ComponentRole, AriaRole | false>([
  ['select', 'listbox'],
  ['combobox', 'listbox'],
  ['label', false],
]);

/**
 * ARIA wiring interaction. Pure declarative — no event listeners. Maps the
 * configured role to the ARIA attributes on reference and floating nodes.
 *
 * **Locked tooltip mapping** (the only role with active consumer coverage):
 * - Floating: `role="tooltip"`.
 * - Reference: `aria-describedby={popover.floatingId}` while open.
 *
 * Other roles port from skeleton's `useRole` for parity (no consumer tests).
 */
export function role(options: RoleOptions = {}): Interaction {
  return (ctx) => {
    const enabled = $derived(options.enabled ?? true);
    const desiredRole = $derived(options.role);
    const ariaRole = $derived.by((): AriaRole | false | undefined => {
      if (desiredRole === undefined) return undefined;
      return ROLE_TO_ARIA.get(desiredRole) ?? (desiredRole as AriaRole);
    });

    return {
      reference: {
        aria: () => {
          if (!enabled) return {};
          if (desiredRole === undefined) return {};
          const open = ctx.popover.open;
          if (ariaRole === 'tooltip' || desiredRole === 'label') {
            const key = desiredRole === 'label' ? 'aria-labelledby' : 'aria-describedby';
            return { [key]: open ? ctx.floatingId : undefined };
          }
          return {
            'aria-expanded': open ? 'true' : 'false',
            'aria-haspopup': ariaRole === 'alertdialog' ? 'dialog' : (ariaRole || undefined),
            'aria-controls': open ? ctx.floatingId : undefined,
          };
        },
      },
      floating: {
        aria: () => {
          if (!enabled) return {};
          if (ariaRole === undefined || ariaRole === false) return {};
          return { role: ariaRole };
        },
      },
    };
  };
}
