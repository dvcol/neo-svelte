import type { Middleware, Placement } from '@floating-ui/dom';

/**
 * Reason a popover's open state changed. Mirrors the kept subset of skeleton's
 * `OpenChangeReason` (FloatingTree-related reasons dropped — see plan).
 */
export type OpenChangeReason
  = | 'outside-press'
    | 'escape-key'
    | 'click'
    | 'hover'
    | 'focus';

/**
 * Listener bag indexed by event name — values are typed event handlers. The
 * `Popover` reference/floating attachments register every entry via
 * `addEventListener`, in the registration order interactions appear in
 * `interactions: [...]`.
 */
export type ListenerMap = {
  [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K]) => void;
};

/**
 * ARIA-attribute callback. Returns the desired attribute set; `undefined`
 * values are treated as "remove this attribute (if Popover authored it)".
 * Called inside `$effect.pre` so reactive reads (e.g. `ctx.popover.open`)
 * re-trigger writes without re-attaching listeners.
 */
export type AriaFn = () => Record<string, string | undefined>;

/**
 * Per-element descriptor produced by an interaction. `Popover` merges every
 * interaction's reference/floating descriptors into the merged attachments.
 */
export interface InteractionDescriptor {
  reference?: { listeners?: ListenerMap; aria?: AriaFn };
  floating?: { listeners?: ListenerMap; aria?: AriaFn };
}

/**
 * Context passed to interaction factories. Three fields, no scratchpad:
 * cross-interaction coordination state lives as typed reactive fields on
 * `Popover` itself (e.g. `popover.openEvent`).
 */
export interface PopoverContext {
  popover: import('./popover.svelte.js').Popover;
  onOpenChange: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
  floatingId: string;
}

/**
 * Interaction factory. The factory is a thin one-liner that instantiates an
 * interaction class — this matches `@floating-ui/dom`'s middleware shape so
 * call-sites read uniformly: `interactions: [role(...), hover(...), …]`.
 */
export type Interaction = (ctx: PopoverContext) => InteractionDescriptor;

/**
 * Options for `new Popover(...)`. Reactivity is opt-in per field via getters:
 * `{ open: false }` is static, `{ get open() { return open; } }` tracks the
 * signal. The `interactions` list is read **once** at construction; conditional
 * enabling at runtime should pass a getter for `enabled` on the interaction
 * itself, not a conditional array entry.
 */
export interface PopoverOptions {
  /** Open/close state. @default true */
  open?: boolean;
  /** Open-state change callback. */
  onOpenChange?: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
  /** Where to place the floating element relative to its reference. @default 'bottom' */
  placement?: Placement;
  /** User middleware. `size()` is always prepended internally. @default [] */
  middleware?: (Middleware | undefined | null | false)[];
  /** Interaction factories — read once at construction. @default [] */
  interactions?: Interaction[];
  /** Remote trigger element. Wraps in a getter to react. */
  target?: Element | null;
  /**
   * AutoUpdate behavior. `true` (default) attaches `@floating-ui/dom`'s
   * `autoUpdate(reference, floating, update)` while `(open && both refs)`,
   * `false` opts out, an object forwards options.
   * @default true
   */
  autoUpdate?: boolean | AutoUpdateOptionsLike;
}

/** Subset of @floating-ui/dom autoUpdate options we forward. */
export interface AutoUpdateOptionsLike {
  ancestorScroll?: boolean;
  ancestorResize?: boolean;
  elementResize?: boolean;
  layoutShift?: boolean;
  animationFrame?: boolean;
}

export interface HoverOptions {
  /** Whether the hook is enabled. @default true */
  enabled?: boolean;
  /** Time in ms the pointer must rest before opening. @default 0 */
  restMs?: number;
  /** Delay before opening/closing. Number applies to both, or `{ open, close }`. @default 0 */
  delay?: number | { open?: number; close?: number };
  /** Whether mousemove over the reference triggers open. @default true */
  move?: boolean;
}

export interface FocusOptions {
  /** Whether the hook is enabled. @default true */
  enabled?: boolean;
  /**
   * Use bubbling `focusin` / `focusout` instead of non-bubbling `focus` /
   * `blur`. Required when the reference is a wrapper containing a focusable
   * child (skeleton PR #164). Reactive — pass via getter to flip at runtime;
   * both event-pair listeners stay bound, the inactive pair gates out before
   * doing any work.
   * @default false
   */
  focusWithin?: boolean;
}

export interface ClickOptions {
  /** Whether the hook is enabled. @default true */
  enabled?: boolean;
  /** Mouse event used to determine a "click". @default 'click' */
  event?: 'click' | 'mousedown';
  /** Whether repeated clicks toggle the open state. @default true */
  toggle?: boolean;
  /** Skip mouse-input logic (useful when also using `hover()`). @default false */
  ignoreMouse?: boolean;
  /** Add Enter/Space handlers for non-button references. @default true */
  keyboardHandlers?: boolean;
}

export interface DismissOptions {
  /** Whether the hook is enabled. @default true */
  enabled?: boolean;
}

export type AriaRole
  = | 'tooltip'
    | 'dialog'
    | 'alertdialog'
    | 'menu'
    | 'listbox'
    | 'grid'
    | 'tree';

export type ComponentRole = 'select' | 'label' | 'combobox';

export interface RoleOptions {
  /** Whether the hook is enabled. @default true */
  enabled?: boolean;
  /** The role of the floating element. No default — unset means no-op. */
  role?: AriaRole | ComponentRole;
}
