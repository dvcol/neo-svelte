<script lang="ts">
  import type { NeoNotificationItemProps } from '~/floating/notification/neo-notification-item.model.js';

  import { flyFrom } from '@dvcol/svelte-utils';
  import { focusin } from '@dvcol/svelte-utils/focusin';
  import { hovering } from '@dvcol/svelte-utils/hovering';

  import { NeoNotificationStatus } from '~/floating/notification/neo-notification.model.js';

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
    draggable = true,

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
    if (!expand) return `0 ${(reverse ? 0 : -(ref?.offsetHeight ?? 0)) + 6 * (visible - index) * (reverse ? -1 : 1)}px`;

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

// TODO restart on touch
// TODO : dismiss on drag
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
  style:--neo-notification-z-index={index}
  style:scale
  style:translate
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
  in:flyFrom={{
    y: last && !first ? 0 : `${reverse ? '-' : ''}150%`,
    duration: 600,
    scale: 1,
    delay: last && !first ? 300 : 10,
    opacity: last && !first ? 0 : 1,
  }}
  out:flyFrom={{
    y: `${reverse ? '-' : ''}${!visible ? '1' : ''}50%`,
    // x: reverse ? '50%' : '-50%',
    duration: 600,
    scale: !visible ? 1 : 0.95,
    opacity: !visible ? 1 : 0,
  }}
>
  {#if children}
    {@render children?.(item)}
  {:else}
    <div class="neo-notification" onclick={() => item.cancel(NeoNotificationStatus.Dismissed)}>
      Item: {new Date(item.added).toLocaleTimeString()}
    </div>
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-notification-stack-item {
    position: absolute;
    z-index: calc(var(--neo-z-index-layer-top, 1000) + var(--neo-notification-z-index, 1));
    transition: translate 0.6s ease, width 0.3s ease, height 0.3s ease, scale 0.3s ease;
    pointer-events: auto;
    will-change: transform, opacity, scale, translate;

    &[inert] {
      z-index: var(--neo-z-index-layer-top, 1000);
    }

    &.neo-draggable {
      cursor: grab;
    }
  }

  .neo-notification {
    width: 100%;
    height: 100%;
    background: black;
    border-radius: var(--neo-border-radius, 0.5rem);
  }
</style>
