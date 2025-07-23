<script lang="ts">
  import type { NeoNotificationItemProps } from '~/floating/notification/neo-notification-item.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { flyFrom } from '@dvcol/svelte-utils';
  import { focusin } from '@dvcol/svelte-utils/focusin';
  import { hovering } from '@dvcol/svelte-utils/hovering';

  import { NeoNotificationPlacements } from '~/floating/common/neo-placement.model.js';

  let {
    children,

    ref = $bindable(),
    hovered = $bindable(false),
    focused = $bindable(false),

    tag = 'li',

    index,
    item,
    posinset,
    setsize,
    visible = 0,

    expand,
    reverse,
    draggable,
    swipeable,
    placement = NeoNotificationPlacements.BottomEnd,
    threshold = { x: 3, y: 2 },
    stagger = 16,

    onChange: onStateChange,
    onDrag,

    ...rest
  }: NeoNotificationItemProps = $props();

  const first = $derived(index === visible - 1);
  const last = $derived(index === 0);

  function getNotifications() {
    const parent = ref?.parentElement;
    const array = parent?.querySelectorAll<HTMLElement>('.neo-notification-stack-item:not([inert])');
    return { parent, array };
  }

  function getTotalHeight(el?: HTMLElement): number {
    if (!el) return 0;
    const styles = getComputedStyle(el);
    return el.offsetHeight + (Number.parseFloat(styles.marginTop) || 0) + (Number.parseFloat(styles.marginBottom) || 0);
  }

  const translate = $derived.by(() => {
    if ((posinset === setsize) && reverse) return;
    if (!expand) return `0 ${(reverse ? 0 : -getTotalHeight(ref)) + stagger * (visible - 1 - index) * (reverse ? 1 : -1)}px`;

    const { parent, array } = getNotifications();
    if (!array?.length) return;
    const heights = Array.from(array).map(getTotalHeight);
    if (!heights?.length) return;
    const bottom = reverse ? index + 1 : index;
    const offset = heights.slice(bottom, heights.length).reduce((acc, h) => acc + h, 0);
    const position = heights.length - 1 - index;
    const gap = parent ? Number.parseFloat(getComputedStyle(parent).gap) || 0 : 0;
    return `0 ${reverse ? '' : '-'}${offset + gap * position}px`;
  });

  const scale = $derived.by(() => {
    if (expand) return;
    return 1 - (visible - 1 - index) * 0.05;
  });

  let initial: Record<'x' | 'y', number> | false = $state(false);
  let offset: Record<'x' | 'y', number> = $state({ x: 0, y: 0 });

  const transform = $derived.by(() => {
    if (!draggable || !initial) return;
    return `translate(${offset.x}px, ${offset.y}px)`;
  });

  const onDragMove = (event: PointerEvent) => {
    if (!draggable || !initial) return;
    offset = { x: event.movementX + offset.x, y: event.movementY + offset.y };
    onDrag?.({ item, index, event, offset, initial });
  };

  const cancelDrag = ({
    top = placement?.startsWith('top'),
    bottom = placement?.startsWith('bottom'),
    start = placement?.endsWith('start'),
    end = placement?.endsWith('end'),
    fraction = threshold,
  } = {}) => {
    if (!ref) return false;
    const { x, y } = typeof fraction === 'number' ? { x: fraction, y: fraction } : fraction;
    if (top && (offset.y < -ref.clientHeight / y)) return true;
    if (bottom && (offset.y > ref.clientHeight / y)) return true;
    if (end && (offset.x > ref.clientWidth / x)) return true;
    return start && (offset.x < -ref.clientWidth / x);
  };

  const onDragEnd = (event: PointerEvent) => {
    if (cancelDrag()) item.cancel();
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragEnd);
    window.removeEventListener('pointercancel', onDragEnd);
    window.removeEventListener('pointerleave', onDragEnd);
    initial = false;
    onDrag?.({ item, index, event, offset, initial });
    setTimeout(() => {
      offset = { x: 0, y: 0 };
    });
  };

  const onDragStart = (event: PointerEvent) => {
    if (!draggable) return;
    initial = { x: event.clientX, y: event.clientY };
    event.preventDefault();
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragEnd);
    window.addEventListener('pointercancel', onDragEnd);
    window.addEventListener('pointerleave', onDragEnd);
    onDrag?.({ item, index, event, offset, initial });
  };

  const onWheelEnd = debounce(() => {
    if (cancelDrag()) item.cancel();
    initial = false;
    setTimeout(() => {
      offset = { x: 0, y: 0 };
    });
  }, 100);

  const onWheel = (event: SvelteEvent<WheelEvent>) => {
    if (!swipeable) return;
    event.preventDefault();
    const axis = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? 'x' : 'y';
    const off = axis === 'x' ? 'y' : 'x';
    if (['top', 'bottom'].includes(placement) && axis === 'x') return;
    if (placement?.endsWith('start') && axis === 'x' && (event.deltaX < 0)) return;
    if (placement?.endsWith('end') && axis === 'x' && (event.deltaX > 0)) return;
    if (placement?.startsWith('top') && axis === 'y' && (event.deltaY < 0)) return;
    if (placement?.startsWith('bottom') && axis === 'y' && (event.deltaY > 0)) return;
    onWheelEnd.cancel();
    const delta = axis === 'x' ? event.deltaX : event.deltaY;
    if (!initial) initial = ({ [axis]: delta, [off]: 0 } as Record<'x' | 'y', number>);
    offset[axis] -= delta;
    onWheelEnd();
  };

  const onLeave = debounce(() => {
    window?.removeEventListener('wheel', onWheel);
    ref?.removeEventListener('pointerleave', onLeave);
    onWheelEnd();
  }, 300);

  const onEnter = () => {
    if (!swipeable || !ref) return;
    onLeave.cancel();
    window.addEventListener('wheel', onWheel, { passive: false });
    ref.addEventListener('pointerleave', onLeave);
  };

  const inParams = $derived({
    y: last && !first ? 0 : `${reverse ? '-' : ''}150%`,
    duration: 600,
    scale: 1,
    delay: last && !first ? 300 : 10,
    opacity: last && !first ? 0 : 1,
  });

  const outParams = $derived.by(() => {
    let x: string | number = 0;
    let y: string | number = last && !first && !expand ? 0 : `${reverse ? '-' : ''}50%`;

    // If moving left/right
    if (Math.abs(offset.y) < Math.abs(offset.x)) {
      if (placement?.endsWith('start')) {
        x = '-50%';
        y = 0;
      } else if (placement?.endsWith('end')) {
        x = '50%';
        y = 0;
      }
    }

    return {
      x,
      y,
      duration: 600,
      scale: 0.95,
      opacity: 0,
    };
  });

  const onChange = debounce((_, event: PointerEvent | FocusEvent) => {
    if (Math.abs(offset.x) > 16 || Math.abs(offset.y) > 16) return;
    onStateChange?.({ item, index, hovered, focused, event });
  }, 100);

  $effect(() => {
    if (!ref) return;
    ref.addEventListener('pointerdown', onDragStart);
    ref.addEventListener('pointerenter', onEnter);
    return () => {
      if (!ref) return;
      ref.removeEventListener('pointerdown', onDragStart);
      ref.removeEventListener('pointerenter', onEnter);
    };
  });

// TODO restart on touch
  // TODO : dimiss on click ?
  // TODO : dimiss on ESC if focused
</script>

<svelte:element
  {...rest}
  {...item.containerProps}
  bind:this={ref}
  this={tag}
  data-id={item.id}
  data-index={index}
  data-first={first}
  data-last={last}
  data-visible={visible}
  aria-setsize={setsize}
  aria-posinset={posinset}
  class:neo-notification-stack-item={true}
  class:neo-draggable={draggable}
  class:neo-dragging={transform}
  style:--neo-notification-z-index={index}
  style:scale
  style:translate
  style:transform
  use:focusin={{
    get focusin() {
      return focused;
    },
    set focusin(_value) {
      focused = _value;
    },
    onChange,
  }}
  use:hovering={{
    get hovered() {
      return hovered;
    },
    set hovered(_value) {
      hovered = _value;
    },
    onChange,
  }}
  in:flyFrom={inParams}
  out:flyFrom={outParams}
>
  {#if children}
    {@render children?.(item)}
  {:else}
    <div class="neo-notification">
      Item: {new Date(item.added).toLocaleTimeString()}
    </div>
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-notification-stack-item {
    @include mixin.floating(
            $padding: false,
            $color: --neo-notification-color,
            $background-color: --neo-notification-bg-color,
            $border-color: --neo-notification-border-color,
            $border-radius: --neo-notification-border-radius,
            $border-radius-rounded: --neo-notification-border-radius-rounded,
            $box-shadow: --neo-notification-box-shadow,
            $backdrop-filter: --neo-notification-content-filter,
            $z-index: --neo-z-index-layer-top,
            $elevation: --neo-notification-z-index,
            $transition: false,
            $borderless: true,
            $tinted: true,
            $filled: true
    );

    position: absolute;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    box-sizing: border-box;
    margin: var(--neo-notification-margin, var(--neo-gap-4xs));
    transition: transform 0.6s ease, translate 0.6s ease, width 0.3s ease, height 0.3s ease, scale 0.3s ease;
    pointer-events: auto;
    will-change: transform, opacity, scale, translate, backdrop-filter;

    &[inert] {
      z-index: var(--neo-z-index-layer-top, 2000000000);
    }

    &.neo-draggable {
      cursor: grab;
      touch-action: none;
    }

    &.neo-dragging {
      transition: none;
    }
  }

  .neo-notification {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
</style>
