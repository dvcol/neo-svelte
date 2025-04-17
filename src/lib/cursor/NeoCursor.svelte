<script lang="ts">
  import type { NeoCursorContext, NeoCursorProps, NeoCursorState } from '~/cursor/neo-cursor.model.js';

  import { getCursorState } from '@dvcol/common-utils/common/cursor';
  import { tick } from 'svelte';

  import {
    getClosestClickable,
    getFirstDataNeoCursor,

    NeoCursorPointerType,

    NeoCursorType,
  } from '~/cursor/neo-cursor.model.js';
  import NeoCursorPointer from '~/cursor/NeoCursorPointer.svelte';

  let {
    // Snippets

    children,
    custom,

    // Bindings

    ref = $bindable(),
    cursor = $bindable(),
    pointer = $bindable(),
    contact = $bindable(),
    position = $bindable(),
    snapTarget = $bindable(),
    snapping = $bindable(false),
    touching = $bindable(false),

    // States

    tag = 'div',
    target = children ? undefined : document.body,
    watch,
    snap: canSnap = true,
    delay: snapDelay = 10,
    raw = false,
    tilt,
    pressure,
    disabled,

    // Other Props
    pointerProps,
    ...rest
  }: NeoCursorProps = $props();

  const boundary = $derived(target ?? ref);
  let innerState = $state<NeoCursorState>();

  const setState = (state?: NeoCursorState) =>
    requestAnimationFrame(() => {
      innerState = state;
      cursor = state?.cursor;
      pointer = state?.pointer;
      contact = state?.contact;
      snapTarget = state?.target;
    });

  const onPointerMove = async (e: PointerEvent) => {
    if (watch && e.pointerType !== watch) return;
    const cursorStyle = getCursorState(e);
    const element = e.target as Element;
    if (!element) return;
    const clickable = getClosestClickable(element, boundary);
    const data = getFirstDataNeoCursor(element);
    if (data === NeoCursorType.None || data === 'false') return setState();
    return setState({
      // get the cursor position
      coordinates: { x: e.clientX, y: e.clientY },
      // get the pointer type
      pointer: e.pointerType,
      // get the cursor type
      cursor: data && ['text', 'snap', 'auto'].includes(data) ? data : cursorStyle,
      // possible snap target
      target: clickable,
      // pen state when on the screen
      contact: {
        size: { width: e.width, height: e.height },
        tilt: { x: e.tiltX, y: e.tiltY },
        twist: e.twist,
        angle: { azimuth: e.azimuthAngle, altitude: e.altitudeAngle },
        pressure: { point: e.pressure, tangential: e.tangentialPressure },
      },
    });
  };

  const onPointerDown = () => {
    touching = true;
  };

  const onPointerUp = () => {
    touching = false;
  };

  const onPointerLeave = async () => {
    onPointerUp();
    return setState();
  };

  let transition = $state<'in' | 'out' | false>(false);
  let timeout: ReturnType<typeof setTimeout>;

  const onSnapOff = async () => {
    clearTimeout(timeout);
    if (!snapping) return;
    transition = 'out';
    await tick();
    snapping = false;
    timeout = setTimeout(() => {
      transition = false;
    }, 100);
  };

  const onSnap = async () => {
    clearTimeout(timeout);
    if (snapping) return;
    if (touching) return onSnapOff();
    timeout = setTimeout(async () => {
      if (snapping) return;
      transition = 'in';
      await tick();
      snapping = true;
    }, snapDelay);
  };

  const onScroll = () => {
    if (!canSnap) return;
    snapping = false;
    transition = false;
    setState();
  };

  $effect(() => {
    if (!innerState?.coordinates) return;
    if (!innerState?.target || innerState?.cursor === NeoCursorType.Text || !canSnap) {
      if (snapping) onSnapOff();
      position = { ...innerState.coordinates };
      return;
    }
    const { top, left, width, height } = innerState.target.getBoundingClientRect();
    if (!snapping) onSnap();
    position = {
      get x() {
        return snapping ? left : (innerState?.coordinates.x ?? 0);
      },
      get y() {
        return snapping ? top : (innerState?.coordinates.y ?? 0);
      },
      width,
      height,
      radius: getComputedStyle(innerState.target).borderRadius,
    };
  });

  const eventUpdateType = $derived(raw && 'onpointerrawupdate' in window ? 'pointerrawupdate' : 'pointermove');
  $effect(() => {
    if (!boundary) return;
    // TODO - remove casting when pointerrawupdate is added to types
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    boundary.addEventListener(eventUpdateType, onPointerMove as any, { passive: true });
    boundary.addEventListener('pointerleave', onPointerLeave, { passive: true });
    boundary.addEventListener('pointerdown', onPointerDown, { passive: true });
    boundary.addEventListener('pointerup', onPointerUp, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      boundary.removeEventListener(eventUpdateType as any, onPointerMove);
      boundary.removeEventListener('pointerleave', onPointerLeave);
      boundary.removeEventListener('pointerdown', onPointerDown);
      boundary.removeEventListener('pointerup', onPointerUp);
    };
  });

  const context = $derived<NeoCursorContext>({
    show: !disabled && !!innerState?.coordinates,
    cursor,
    pointer,
    position,
    target: snapTarget,
    transition,
    contact,
    snapping,
    touching,
    pressure: pressure ?? pointer === NeoCursorPointerType.Pen,
    tilt: tilt ?? pointer === NeoCursorPointerType.Pen,
  });
</script>

{#if target}
  {@render children?.(context)}
{:else if children}
  <svelte:element this={tag} bind:this={ref} class:neo-cursor-container={true} {...rest}>
    {@render children(context)}
  </svelte:element>
{/if}

{#if custom}
  {@render custom(context)}
{:else}
  <NeoCursorPointer {...context} {...pointerProps} />
{/if}

<style lang="scss">
  .neo-cursor {
    &-container {
      display: contents;
    }
  }
</style>
