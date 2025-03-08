<script lang="ts">
  import { tick } from 'svelte';
  import { scale } from 'svelte/transition';

  import { type NeoCursorProps } from '~/cursor/neo-cursor.model.js';
  import { getClickableAncestor, getCursorState } from '~/cursor/neo-cursor.util.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    ref = $bindable(),
    children,
    target,

    snap: snapAble = true,
  }: NeoCursorProps = $props();
  /* eslint-enable prefer-const */

  const boundary = $derived(target ?? ref);

  type CursorState = {
    cursor: { x: number; y: number };
    style?: string;
    clickable?: Element | null;
  };

  let cursorState = $state<CursorState>();

  const onPointerMove = async (e: PointerEvent) => {
    const cursor = getCursorState(e);
    const element = e.target;
    if (!element) return;
    const clickable = getClickableAncestor(element as Element, boundary);
    requestAnimationFrame(() => {
      cursorState = {
        // get the cursor position
        cursor: { x: e.clientX, y: e.clientY },
        // get the cursor style
        style: cursor,
        // check if the element is clickable
        clickable,
      };
    });
  };

  const onPointerLeave = async () => {
    requestAnimationFrame(() => {
      cursorState = undefined;
    });
  };

  type SnapPosition = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radius?: string;
  };

  let transition = $state<'in' | 'out' | false>(false);
  let snap = $state(false);
  let position = $state<SnapPosition>();
  let timeout: ReturnType<typeof setTimeout>;

  const onSnap = async () => {
    clearTimeout(timeout);
    transition = 'in';
    await tick();
    snap = true;
  };

  const onSnapOff = async () => {
    transition = 'out';
    await tick();
    snap = false;
    timeout = setTimeout(() => {
      transition = false;
    }, 100);
  };

  const onScroll = () => {
    if (!snapAble) return;
    snap = false;
    transition = false;
    cursorState = undefined;
  };

  $effect(() => {
    if (!cursorState?.cursor) return;
    if (!cursorState?.clickable || cursorState?.style === 'text' || !snapAble) {
      if (snap) onSnapOff();
      position = cursorState.cursor;
      return;
    }
    const { top, left, width, height } = cursorState.clickable.getBoundingClientRect();
    if (!snap) onSnap();
    position = {
      get x() {
        return snap ? left : (cursorState?.cursor.x ?? 0);
      },
      get y() {
        return snap ? top : (cursorState?.cursor.y ?? 0);
      },
      width,
      height,
      radius: getComputedStyle(cursorState.clickable).borderRadius,
    };
  });

  // TODO - toggle expanded cursor (remove translate if false)
  // TODO - only for pen or pointer or touch, etc.
  // TODO - custom cursor with context
  // TODO - pressure/height for pen
  // TODO - tilt for pen

  $effect(() => {
    if (!boundary) return;
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    boundary.addEventListener('pointermove', onPointerMove, { passive: true });
    boundary.addEventListener('pointerleave', onPointerLeave, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      boundary.removeEventListener('pointermove', onPointerMove);
      boundary.removeEventListener('pointerleave', onPointerLeave);
    };
  });
</script>

{#if target}
  // TODO
{:else if children}
  <div bind:this={ref} class="neo-cursor-container">
    {@render children()}
  </div>
{/if}

{#if cursorState?.cursor}
  <span
    hidden={!cursorState}
    class="neo-cursor"
    style:--neo-cursor-y="{position?.y}px"
    style:--neo-cursor-x="{position?.x}px"
    style:--neo-cursor-width="{position?.width ?? 0}px"
    style:--neo-cursor-height="{position?.height ?? 0}px"
    style:--neo-cursor-radius={position?.radius ?? 0}
    data-style={cursorState?.style}
    data-transition={transition}
    data-snap={snap}
    transition:scale={{ delay: 10 }}
  >
    <!-- cursor placeholder -->
  </span>
{/if}

<style lang="scss">
  .neo-cursor {
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--neo-z-index-layer-max, 2147483647);
    width: 1.125rem;
    height: 1.125rem;
    background-color: var(--neo-text-highlight-color, oklch(from currentcolor calc(l + 0.3) c h / 20%));
    border-radius: 50%;
    transform-origin: center;
    transition:
      width 200ms ease,
      height 200ms ease,
      border-radius 200ms ease,
      background-color 200ms ease,
      opacity 200ms ease,
      translate 0ms;
    pointer-events: none;
    will-change: width, height, border-radius, translate, opacity;
    translate: calc(var(--neo-cursor-x) - 50%) calc(var(--neo-cursor-y) - 50%);

    &[data-style='text'] {
      width: 0.1875rem;
      height: 1.375rem;
      border-radius: 0.25rem;
    }

    &[data-style='not-allowed'],
    &[data-style='disabled'] {
      background-color: color-mix(
        in srgb,
        var(--neo-text-highlight-color, oklch(from currentcolor calc(l + 0.3) c h / 20%)),
        var(--neo-color-error, red) 5%
      );
    }

    &[data-snap='true']:not([data-style='text']) {
      width: var(--neo-cursor-width);
      height: var(--neo-cursor-height);
      border-radius: var(--neo-cursor-radius);
      translate: calc(var(--neo-cursor-x)) calc(var(--neo-cursor-y));
    }

    &[data-transition='in']:not([data-style='text']) {
      transition:
        width 300ms ease,
        height 300ms ease,
        border-radius 300ms ease,
        opacity 50ms ease,
        translate 300ms ease;
    }

    &[data-transition='out']:not([data-style='text']) {
      transition:
        width 100ms ease-out,
        height 100ms ease-out,
        border-radius 100ms ease-out,
        opacity 50ms ease 100ms,
        translate 100ms ease-out;
    }

    &-container {
      display: contents;
    }
  }
</style>
