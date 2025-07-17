<script lang="ts">
  import type { NeoNotificationItemProps } from '~/floating/notification/neo-notification-item.model.js';

  import { flyFrom } from '@dvcol/svelte-utils';

  let {
    children,

    ref = $bindable(),
    tag = 'li',

    index,
    item,

    posinset,
    setsize,

    reverse,

  }: NeoNotificationItemProps = $props();

  const translate = $derived.by(() => {
    if (posinset === setsize && reverse) return;
    const parent = ref?.parentElement;
    const array = parent?.querySelectorAll<HTMLElement>('.neo-notification-stack-item:not([inert])');
    if (!array?.length) return;
    const heightMap = Array.from(array).map((el: HTMLElement) => el.offsetHeight);
    if (!heightMap?.length) return;
    const bottom = reverse ? index + 1 : index;
    const offset = heightMap.slice(bottom, heightMap.length).reduce((acc, h) => acc + h, 0);
    const position = heightMap.length - 1 - index;
    const gap = parent ? Number.parseFloat(getComputedStyle(parent).gap) || 0 : 0;
    return `0 ${reverse ? '' : '-'}${offset + gap * position}px`;
  });

</script>

<svelte:element
  {...item.containerProps}
  bind:this={ref}
  this={tag}
  data-id={item.id}
  data-index={index}
  aria-setsize={setsize}
  aria-posinset={posinset}
  class:neo-notification-stack-item={true}
  style:--neo-notification-z-index={index}
  style:translate
  in:flyFrom={{
    y: reverse ? '-150%' : '150%',
    duration: 600,
    scale: 1,
    delay: 100,
  }}
  out:flyFrom={{
    y: reverse ? '100%' : '-100%',
    duration: 800,
    scale: 0.95,
  }}
>
  {#if children}
    {@render children?.(item)}
  {:else}
    <div class="neo-notification">
      Item {index}: - {item.id} - {new Date(item.added).toLocaleTimeString()}
    </div>
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-notification-stack-item {
      position: absolute;
      z-index: calc(var(--neo-z-index-layer-top, 1000) + var(--neo-notification-z-index, 1));
      transition: translate 0.6s ease;
      pointer-events: auto;
      will-change: transform, opacity, scale, translate;

      &[inert] {
        z-index: var(--neo-z-index-layer-top, 1000);
      }
    }

  .neo-notification {
    width: 100%;
    height: 100%;
    background: black;
    border-radius: var(--neo-border-radius, 0.5rem);
  }
</style>
