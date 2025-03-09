<script lang="ts">
  import { tick } from 'svelte';

  import type { NeoCursorContext, NeoCursorPosition, NeoCursorProps, NeoCursorState } from '~/cursor/neo-cursor.model.js';

  import NeoCursorPointer from '~/cursor/NeoCursorPointer.svelte';
  import { getClosestClickable, getFirstDataNeoCursor } from '~/cursor/neo-cursor.model.js';

  import { getCursorState } from '~/cursor/neo-cursor.util.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    children,
    cursor,

    tag = 'div',
    ref = $bindable(),
    target = children ? undefined : document.body,
    pointer,
    snap: snapAble = true,
    raw = false,

    ...rest
  }: NeoCursorProps = $props();
  /* eslint-enable prefer-const */

  const boundary = $derived(target ?? ref);

  let cursorState = $state<NeoCursorState>();

  const setState = (state?: NeoCursorState) =>
    requestAnimationFrame(() => {
      cursorState = state;
    });

  const onPointerMove = async (e: PointerEvent) => {
    if (pointer && e.pointerType !== pointer) return;
    const cursorStyle = getCursorState(e);
    const element = e.target as Element;
    if (!element) return;
    const clickable = getClosestClickable(element, boundary);
    const data = getFirstDataNeoCursor(element);
    if (data === 'none' || data === 'false') return setState();
    return setState({
      // get the cursor position
      cursor: { x: e.clientX, y: e.clientY },
      // get the cursor style
      style: data && ['text', 'snap', 'auto'].includes(data) ? data : cursorStyle,
      // check if the element is clickable
      clickable,
    });
  };

  const onPointerLeave = async () => setState();

  let transition = $state<'in' | 'out' | false>(false);
  let snap = $state(false);
  let position = $state<NeoCursorPosition>();
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
    setState();
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

  // TODO - pressure/height for pen
  // TODO - tilt for pen

  const eventUpdateType = $derived(raw && 'onpointerrawupdate' in window ? 'pointerrawupdate' : 'pointermove');
  $effect(() => {
    if (!boundary) return;
    // TODO - remove casting when pointerrawupdate is added to types
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    boundary.addEventListener(eventUpdateType, onPointerMove as any, { passive: true });
    boundary.addEventListener('pointerleave', onPointerLeave, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      boundary.removeEventListener(eventUpdateType as any, onPointerMove);
      boundary.removeEventListener('pointerleave', onPointerLeave);
    };
  });

  const context = $derived<NeoCursorContext>({ hidden: !cursorState, cursor: cursorState?.style, position, transition, snap });
</script>

{#if target}
  {@render children?.(context)}
{:else if children}
  <svelte:element this={tag} bind:this={ref} class:neo-cursor-container={true} {...rest}>
    {@render children(context)}
  </svelte:element>
{/if}

{#if cursorState?.cursor}
  {#if cursor}
    {@render cursor(context)}
  {:else}
    <NeoCursorPointer {...context} />
  {/if}
{/if}

<style lang="scss">
  .neo-cursor {
    &-container {
      display: contents;
    }
  }
</style>
