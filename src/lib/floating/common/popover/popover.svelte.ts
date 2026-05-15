import type { Middleware, Placement } from '@floating-ui/dom';
import type { Attachment } from 'svelte/attachments';

import type { AutoUpdateOptionsLike, InteractionDescriptor, ListenerMap, OpenChangeReason, PopoverContext, PopoverOptions } from './popover.types.js';

import { autoUpdate, computePosition, size } from '@floating-ui/dom';

import { getDevicePixelRatio, roundByDevicePixelRatio } from './utils/device-pixel-ratio.js';

let idCounter = 0;
function nextFloatingId(): string {
  idCounter += 1;
  return `neo-popover-${Math.random().toString(36).slice(2, 8)}-${idCounter}`;
}

/**
 * Lazy respect-existing ARIA write. If the attribute is already on the node
 * and Popover did not author it (`written` does not track the key), the
 * consumer owns it — skip. Otherwise write and record so teardown removes
 * only Popover-authored writes.
 */
function writeAttribute(
  node: HTMLElement,
  written: Set<string>,
  key: string,
  value: string | undefined,
): void {
  if (value === undefined) {
    if (written.has(key)) {
      node.removeAttribute(key);
      written.delete(key);
    }
    return;
  }
  if (!written.has(key) && node.getAttribute(key) !== null) return;
  node.setAttribute(key, value);
  written.add(key);
}

const ORIGIN_BY_PLACEMENT: Record<Placement, string> = {
  'top': 'bottom',
  'top-start': 'bottom left',
  'top-end': 'bottom right',
  'bottom': 'top',
  'bottom-start': 'top left',
  'bottom-end': 'top right',
  'left': 'right',
  'left-start': 'right top',
  'left-end': 'right bottom',
  'right': 'left',
  'right-start': 'left top',
  'right-end': 'left bottom',
};

/**
 * `Popover` is the class-based replacement for `useFloating()`. It owns the
 * position pipeline, attachment lifecycle, ARIA writes, and interaction
 * composition. Construction must run inside a Svelte component context — its
 * internal `$effect`s register on the surrounding effect root.
 *
 * Reactivity is opt-in per option field via getters:
 *
 * ```ts
 * new Popover({ get open() { return open; }, placement: 'top' });
 * ```
 *
 * The plain-shorthand form (`new Popover({ open })`) freezes `open` at
 * construction — the class can't detect this, so prefer getters or a static
 * value.
 *
 * **Why arrow-field attachments, not methods**: Svelte invokes attachments by
 * reading the value off the host (`let fn = popover.reference; fn(node)`).
 * With a regular method that read detaches `this`. Arrow fields capture `this`
 * at construction so the attachment is callable in any context. Do not "clean
 * up" by switching to methods — it is a correctness contract.
 */
export class Popover {
  readonly #options: PopoverOptions;

  readonly #refs = $state<{ reference?: Element; floating?: Element }>({});

  readonly #position = $state<{ x: number; y: number; placement: Placement }>({
    x: 0,
    y: 0,
    placement: 'bottom',
  });

  /** Stable ID assigned to the floating element via the `id` attribute. */
  readonly floatingId: string = nextFloatingId();

  /** Resolved placement (after middleware). */
  get placement(): Placement {
    return this.#position.placement;
  }

  /** Resolved open state. */
  readonly open: boolean = $derived.by(() => this.#options.open ?? true);

  /** Resolved input placement (before middleware), used to seed the position state. */
  readonly #inputPlacement: Placement = $derived.by(() => this.#options.placement ?? 'bottom');

  readonly #userMiddleware = $derived.by(() => this.#options.middleware ?? []);

  /**
   * Internal `size()` middleware — captures the reference dims and the
   * available (floor-of-the-viewport) box so we can publish them as CSS vars.
   * Always prepended to user middleware so consumers can drive layout from
   * CSS without re-implementing the size dance.
   */
  readonly #sizeData = $state<{ referenceWidth: number; referenceHeight: number; availableWidth: number; availableHeight: number }>({
    referenceWidth: 0,
    referenceHeight: 0,
    availableWidth: 0,
    availableHeight: 0,
  });

  readonly #sizeMiddleware: Middleware = size({
    apply: ({ availableWidth, availableHeight, rects }) => {
      this.#sizeData.referenceWidth = rects.reference.width;
      this.#sizeData.referenceHeight = rects.reference.height;
      this.#sizeData.availableWidth = availableWidth;
      this.#sizeData.availableHeight = availableHeight;
    },
  });

  readonly #middleware = $derived.by(() => [
    this.#sizeMiddleware,
    ...this.#userMiddleware,
  ]);

  readonly #autoUpdateOption = $derived.by(() => this.#options.autoUpdate ?? true);

  /** The last `Event` that triggered an open transition. Read by hover/click. */
  openEvent: Event | undefined = $state(undefined);

  /** Interactions (read-once at construction, see plan §"interactions list is read-once"). */
  readonly #interactions: InteractionDescriptor[] = [];

  constructor(options: PopoverOptions = {}) {
    this.#options = options;

    // Read-once interaction dispatch.
    const ctx: PopoverContext = {
      popover: this,
      onOpenChange: (open, event, reason) => {
        if (open) this.openEvent = event;
        options.onOpenChange?.(open, event, reason);
      },
      floatingId: this.floatingId,
    };
    for (const factory of options.interactions ?? []) {
      this.#interactions.push(factory(ctx));
    }

    // Paint-critical position write — must land on the same frame the floating
    // mounts/opens, otherwise the floating renders at (0, 0) for one frame.
    $effect.pre(() => {
      const reference = this.#refs.reference;
      const floating = this.#refs.floating;
      if (!reference || !floating || !this.open) return;
      // Track input placement / middleware so the effect re-runs on signal change.
      void this.#inputPlacement;
      void this.#middleware;
      void this.update();
    });

    // AutoUpdate subscription — gated by (open && both refs). Lifecycle is
    // tied to the gate; flipping any condition tears the subscription down.
    $effect(() => {
      const reference = this.#refs.reference;
      const floating = this.#refs.floating;
      if (!reference || !floating || !this.open) return;
      const opt = this.#autoUpdateOption;
      if (opt === false) return;
      if (!(floating instanceof HTMLElement)) return;
      const updateOpts: AutoUpdateOptionsLike | undefined
        = typeof opt === 'object' ? opt : undefined;
      const cleanup = autoUpdate(reference, floating, this.update, updateOpts);
      return () => cleanup();
    });
  }

  /** Read-only access to the resolved reference element. */
  get referenceEl(): Element | undefined {
    return this.#refs.reference;
  }

  /** Read-only access to the resolved floating element. */
  get floatingEl(): Element | undefined {
    return this.#refs.floating;
  }

  /**
   * Reference attachment. Capture `popover.reference` onto whichever node
   * should be treated as the trigger. Listeners and ARIA writes from
   * registered interactions are composed onto the node here.
   */
  readonly reference: Attachment = (node) => {
    this.#refs.reference = node;
    const listenerCleanups: Array<() => void> = [];
    for (const desc of this.#interactions) {
      const map = desc.reference?.listeners;
      if (!map) continue;
      for (const key of Object.keys(map) as (keyof ListenerMap)[]) {
        const handler = map[key] as EventListener | undefined;
        if (!handler) continue;
        node.addEventListener(key, handler);
        listenerCleanups.push(() => node.removeEventListener(key, handler));
      }
    }
    let written: Set<string> | undefined;
    let ariaRoot: (() => void) | undefined;
    if (node instanceof HTMLElement) {
      written = new Set<string>();
      const tracked = written;
      ariaRoot = $effect.root(() => {
        $effect(() => {
          for (const desc of this.#interactions) {
            const ariaFn = desc.reference?.aria;
            if (!ariaFn) continue;
            const desired = ariaFn();
            for (const [key, value] of Object.entries(desired)) {
              writeAttribute(node, tracked, key, value);
            }
          }
        });
      });
    }
    return () => {
      ariaRoot?.();
      for (const fn of listenerCleanups) fn();
      if (written) {
        for (const key of written) node.removeAttribute(key);
        written.clear();
      }
      if (this.#refs.reference === node) this.#refs.reference = undefined;
    };
  };

  /**
   * Floating attachment. Owns positioning styles end-to-end — writes
   * `translate` and `transform-origin` directly to the node via the
   * `var(--neo-popover-translate-override, …)` fallback pattern.
   *
   * ARIA attributes already present on the node are treated as consumer-owned
   * (lazy respect-existing): if the consumer set the attribute before
   * `Popover` would write it, `Popover` skips the write and leaves the
   * attribute untouched on teardown. This applies per-key, including the
   * reserved `id` slot used to wire `aria-describedby` from the reference.
   */
  readonly floating: Attachment = (node) => {
    this.#refs.floating = node;
    // Foundation positioning — `translate` is meaningless without absolute
    // positioning + a `(0, 0)` anchor, otherwise the floating element
    // translates from its natural flow position. Mirrors skeleton's
    // `floatingStyles = "position: absolute; left: 0; top: 0; translate: …"`
    // baseline.
    if (node instanceof HTMLElement) {
      node.style.position = 'absolute';
      node.style.left = '0px';
      node.style.top = '0px';
      // hi-DPI hint: skeleton's floatingStyles set `will-change: transform`
      // when DPR ≥ 1.5 to keep the floating on its own compositor layer (avoids
      // sub-pixel-snap blurring during scroll/resize). PR #165 swapped the
      // moved property to `translate`, so the hint follows it.
      if (getDevicePixelRatio(node) >= 1.5) node.style.willChange = 'translate';
    }
    const listenerCleanups: Array<() => void> = [];
    for (const desc of this.#interactions) {
      const map = desc.floating?.listeners;
      if (!map) continue;
      for (const key of Object.keys(map) as (keyof ListenerMap)[]) {
        const handler = map[key] as EventListener | undefined;
        if (!handler) continue;
        node.addEventListener(key, handler);
        listenerCleanups.push(() => node.removeEventListener(key, handler));
      }
    }
    let written: Set<string> | undefined;
    let ariaRoot: (() => void) | undefined;
    if (node instanceof HTMLElement) {
      written = new Set<string>();
      const tracked = written;
      writeAttribute(node, tracked, 'id', this.floatingId);
      ariaRoot = $effect.root(() => {
        $effect(() => {
          for (const desc of this.#interactions) {
            const ariaFn = desc.floating?.aria;
            if (!ariaFn) continue;
            const desired = ariaFn();
            for (const [key, value] of Object.entries(desired)) {
              writeAttribute(node, tracked, key, value);
            }
          }
        });
      });
    }
    return () => {
      ariaRoot?.();
      for (const fn of listenerCleanups) fn();
      if (written) {
        for (const key of written) node.removeAttribute(key);
        written.clear();
      }
      if (this.#refs.floating === node) this.#refs.floating = undefined;
    };
  };

  /**
   * Manually trigger a position recompute. Resolves after `computePosition`
   * completes (matching `@floating-ui/dom`'s shape). The DOM write lands on
   * Svelte's next effect flush — callers needing post-DOM-write timing
   * should follow with `await tick()`.
   */
  readonly update = async (): Promise<void> => {
    const reference = this.#refs.reference;
    const floating = this.#refs.floating;
    if (!reference || !floating || !this.open) return;
    if (!(floating instanceof HTMLElement)) return;

    const { x, y, placement } = await computePosition(reference, floating, {
      placement: this.#inputPlacement,
      middleware: this.#middleware,
    });

    const rx = roundByDevicePixelRatio(floating, x);
    const ry = roundByDevicePixelRatio(floating, y);
    this.#position.x = rx;
    this.#position.y = ry;
    this.#position.placement = placement;

    // Direct DOM write — paint-critical, so we don't wait for an effect flush.
    floating.style.translate = `var(--neo-popover-translate-override, ${rx}px ${ry}px)`;
    floating.style.transformOrigin = `var(--neo-popover-transform-origin-override, ${ORIGIN_BY_PLACEMENT[placement]})`;

    // Publish middleware-derived size data as CSS variables — consumers can
    // drive layout entirely from the stylesheet (no `style:` directives).
    const { referenceWidth, referenceHeight, availableWidth, availableHeight } = this.#sizeData;
    floating.style.setProperty('--neo-popover-reference-width', `${referenceWidth}px`);
    floating.style.setProperty('--neo-popover-reference-height', `${referenceHeight}px`);
    floating.style.setProperty('--neo-popover-available-width', `${availableWidth}px`);
    floating.style.setProperty('--neo-popover-available-height', `${availableHeight}px`);
  };

  /** Type-only re-export bridge (keeps OpenChangeReason in the dependency graph for tooling). */
  protected static readonly _reasonGuard: OpenChangeReason | undefined = undefined;
}
