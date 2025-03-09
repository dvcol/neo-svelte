<script lang="ts">
  import { scale } from 'svelte/transition';

  import type { NeoCursorPointerProps } from '~/cursor/neo-cursor-pointer.model.js';

  const {
    children,

    hidden,
    cursor,
    position,
    transition,
    snap,

    ...rest
  }: NeoCursorPointerProps = $props();
</script>

<span
  {hidden}
  class="neo-cursor"
  style:--neo-cursor-y="{position?.y}px"
  style:--neo-cursor-x="{position?.x}px"
  style:--neo-cursor-width="{position?.width ?? 0}px"
  style:--neo-cursor-height="{position?.height ?? 0}px"
  style:--neo-cursor-radius={position?.radius ?? 0}
  data-style={cursor}
  data-transition={transition}
  data-snap={snap}
  {...rest}
  transition:scale={{ delay: 10 }}
>
  {@render children?.({ hidden, cursor, position, transition, snap })}
</span>

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
  }
</style>
