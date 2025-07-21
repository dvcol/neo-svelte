<script lang="ts">
  import type { NeoNotificationItemProps } from '~/floating/notification/neo-notification-item.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { flyFrom } from '@dvcol/svelte-utils';
  import { focusin } from '@dvcol/svelte-utils/focusin';
  import { hovering } from '@dvcol/svelte-utils/hovering';

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
    placement,
    threshold = 3,

    onChange: onStateChange,

    ...rest
  }: NeoNotificationItemProps = $props();

  const first = $derived(index === visible - 1);
  const last = $derived(index === 0);

  function getNotifications() {
    const parent = ref?.parentElement;
    const array = parent?.querySelectorAll<HTMLElement>('.neo-notification-stack-item:not([inert])');
    return { parent, array };
  }

  const translate = $derived.by(() => {
    if ((posinset === setsize) && reverse) return;
    if (!expand) return `0 ${(reverse ? 0 : -(ref?.offsetHeight ?? 0)) + 6 * (visible - 1 - index) * (reverse ? -1 : 1)}px`;

    const { parent, array } = getNotifications();
    if (!array?.length) return;
    const heights = Array.from(array).map((el: HTMLElement) => el.offsetHeight);
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

  const onChange = () => onStateChange?.({ item, index, hovered, focused });

  let initial: { x: number; y: number } | false = $state(false);
  let offset: { x: number; y: number } = $state({ x: 0, y: 0 });

  const transform = $derived.by(() => {
    if (!draggable || !initial) return;
    return `translate(${offset.x}px, ${offset.y}px)`;
  });

  const onDrap = (e: SvelteEvent<PointerEvent>) => {
    if (!draggable || !initial) return;
    offset = { x: e.movementX + offset.x, y: e.movementY + offset.y };
  };

  const cancelDrap = () => {
    if (!ref) return false;
    if (placement?.startsWith('top') && (offset.y < -ref.clientHeight / threshold)) return true;
    if (placement?.startsWith('bottom') && (offset.y > ref.clientHeight / threshold)) return true;
    if (placement?.endsWith('end') && (offset.x > ref.clientWidth / threshold)) return true;
    return placement?.endsWith('start') && (offset.x < -ref.clientWidth / threshold);
  };

  const endDrap = () => {
    if (cancelDrap()) item.cancel();
    window.removeEventListener('pointermove', onDrap);
    window.removeEventListener('pointerup', endDrap);
    window.removeEventListener('pointercancel', endDrap);
    window.removeEventListener('pointerleave', endDrap);
    initial = false;
    setTimeout(() => {
      offset = { x: 0, y: 0 };
    });
  };

  const startDrag = (e: SvelteEvent<PointerEvent>) => {
    if (!draggable) return;
    initial = { x: e.clientX, y: e.clientY };
    e.preventDefault();
    window.addEventListener('pointermove', onDrap);
    window.addEventListener('pointerup', endDrap);
    window.addEventListener('pointercancel', endDrap);
    window.addEventListener('pointerleave', endDrap);
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
    let y: string | number = `${reverse ? '-' : ''}50%`;

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

// TODO restart on touch
  // TODO drag stack on placement change
  // TODO : dimiss on click ?
  // TODO : dimiss on side scroll ?
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
  onpointerdown={startDrag}
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
    position: absolute;
    z-index: calc(var(--neo-z-index-layer-top, 1000) + var(--neo-notification-z-index, 1));
    transition: transform 0.6s ease, translate 0.6s ease, width 0.3s ease, height 0.3s ease, scale 0.3s ease;
    pointer-events: auto;
    will-change: transform, opacity, scale, translate;

    &[inert] {
      z-index: var(--neo-z-index-layer-top, 1000);
    }

    &.neo-draggable {
      cursor: grab;
    }

    &.neo-dragging {
      transition: none;
    }
  }

  .neo-notification {
    width: 100%;
    height: 100%;
    background: black;
    border-radius: var(--neo-border-radius, 0.5rem);
  }
</style>
