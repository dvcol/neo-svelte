<script lang="ts">
  import type { NeoCursorPointerProps } from '~/cursor/neo-cursor-pointer.model.js';
  import type { NeoCursorContact } from '~/cursor/neo-cursor.model.js';

  import { scale } from 'svelte/transition';

  import { NeoCursorPointerType } from '~/cursor/neo-cursor.model.js';
  import { toPixel } from '~/utils/style.utils.js';

  const {
    children,

    show,
    cursor,
    pointer,
    position,
    transition,
    snapping,
    touching,
    contact,

    pressure = pointer === NeoCursorPointerType.Pen,
    tilt = pointer === NeoCursorPointerType.Pen,

    ...rest
  }: NeoCursorPointerProps = $props();

  const getSize = (dimension: 'width' | 'height') => {
    if (snapping && position?.[dimension]) return toPixel(position[dimension]);
    if (!contact?.size[dimension] || contact?.size[dimension] <= 1) return;
    return toPixel(contact.size[dimension]);
  };

  const width = $derived(getSize('width'));
  const height = $derived(getSize('height'));

  const getScale = (dimension: 'width' | 'height') => {
    if (!contact?.size[dimension] || contact.size[dimension] === 1) return touching ? 0.75 : undefined;
    if (contact?.size[dimension] > 1) return;
    return contact.size[dimension];
  };

  const scaleX = $derived(getScale('width'));
  const scaleY = $derived(getScale('height'));

  const rotate = $derived(contact?.twist ? `${contact.twist}deg` : undefined);
  const offset = $derived(toPixel(((contact?.pressure?.point ?? 0) * 10) ** 1.75));

  const getTilt = (angle?: NeoCursorContact['angle'], radius = 100, threshold = 5) => {
    if (!angle) return;
    // Convert altitude angle (0° = max tilt, 90° = no tilt) to radius
    const altitude = (1 - (angle.altitude * (180 / Math.PI)) / 90) * radius;
    // Below the threshold, the tilt is not visible
    if (altitude < threshold) return;
    return {
      // The radius represents the tilt in pixels
      radius: toPixel(altitude),
      // The azimuth is the direction in degrees (converted from radians)
      angle: `${angle.azimuth * (180 / Math.PI) + 90}deg`,
    };
  };
  const tilting = $derived(tilt ? getTilt(contact?.angle) : undefined);
</script>

{#if show}
  <span
    hidden={!show}
    class:neo-cursor={true}
    class:neo-pressure={pressure && touching && contact?.pressure?.point}
    class:neo-tilt={tilt && touching && tilting?.radius}
    style:--neo-cursor-y={toPixel(position?.y)}
    style:--neo-cursor-x={toPixel(position?.x)}
    style:--neo-cursor-width={width}
    style:--neo-cursor-height={height}
    style:--neo-cursor-radius={position?.radius ?? 0}
    style:--neo-cursor-scale-x={scaleX}
    style:--neo-cursor-scale-y={scaleY}
    style:--neo-cursor-rotate={rotate}
    style:--neo-cursor-offset={offset}
    style:--neo-cursor-tilt-angle={tilting?.angle}
    style:--neo-cursor-tilt-radius={tilting?.radius}
    data-cursor={cursor}
    data-transition={transition}
    data-snapping={snapping}
    {...rest}
    transition:scale={{ delay: 10 }}
  >
    {@render children?.({ show, cursor, position, transition, snapping })}
  </span>
{/if}

<style lang="scss">
  .neo-cursor {
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--neo-z-index-layer-max, 2147483647);
    width: var(--neo-cursor-width, 1.125rem);
    height: var(--neo-cursor-height, 1.125rem);
    background-color: var(--neo-cursor-bg-color, var(--neo-text-highlight-color, oklch(from currentcolor calc(l + 0.3) c h / 20%)));
    border-radius: 50%;
    outline: var(--neo-outline-width, var(--neo-border-width-md)) var(--neo-cursor-outline-color, transparent) solid;
    transform-origin: center;
    transition:
      outline-offset 200ms ease,
      outline-color 200ms ease,
      rotate 200ms ease,
      scale 200ms ease,
      width 200ms ease,
      height 200ms ease,
      border-radius 200ms ease,
      background-color 200ms ease,
      opacity 200ms ease,
      translate 0ms;
    pointer-events: none;
    will-change: width, height, border-radius, translate, opacity;
    translate: calc(var(--neo-cursor-x) - 50%) calc(var(--neo-cursor-y) - 50%);
    scale: calc(var(--neo-cursor-scale-x, 1)) calc(var(--neo-cursor-scale-y, 1));
    rotate: var(--neo-cursor-rotate, 0);

    &::before {
      position: absolute;
      border-radius: inherit;
      outline: var(--neo-outline-width, var(--neo-border-width)) transparent dashed;
      transition:
        outline-offset 200ms ease,
        outline-color 200ms ease;
      content: '';
      inset: 0;
      pointer-events: none;
    }

    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 100%;
      background-color: transparent;
      transition:
        height 200ms ease,
        background-color 200ms ease;
      content: '';
      pointer-events: none;
      translate: -50% -50%;
    }

    &.neo-pressure {
      outline-color: var(--neo-cursor-pressure-color, oklch(from currentcolor l c h / 50%));
      outline-offset: var(--neo-cursor-offset, 0);
    }

    &.neo-tilt::before {
      outline-color: var(--neo-cursor-tilt-color, oklch(from currentcolor l c h / 60%));
      outline-offset: calc(var(--neo-cursor-offset, 0) + var(--neo-cursor-tilt-radius, 0));
    }

    &.neo-tilt::after {
      height: calc(100% + (var(--neo-cursor-offset, 0) + var(--neo-cursor-tilt-radius, 0)) * 2);
      rotate: var(--neo-cursor-tilt-angle, 0);
      background-color: var(--neo-cursor-tilt-color, oklch(from currentcolor l c h / 60%));
    }

    &[data-cursor='text'] {
      width: 0.1875rem;
      height: 1.375rem;
      border-radius: 0.25rem;
      scale: 1;
      outline-color: transparent;

      &::before {
        outline-color: transparent;
      }
    }

    &[data-cursor='not-allowed'],
    &[data-cursor='disabled'] {
      background-color: var(
        --neo-cursor-bg-color-disabled,
        color-mix(in srgb, var(--neo-text-highlight-color, oklch(from currentcolor calc(l + 0.3) c h / 20%)), var(--neo-color-error, red) 5%)
      );
    }

    &[data-snapping='true']:not([data-cursor='text']) {
      border-radius: var(--neo-cursor-radius);
      translate: calc(var(--neo-cursor-x)) calc(var(--neo-cursor-y));
      scale: 1;
    }

    &[data-transition='in']:not([data-cursor='text']) {
      transition:
        outline-color 300ms ease,
        rotate 300ms ease,
        scale 300ms ease,
        width 300ms ease,
        height 300ms ease,
        border-radius 300ms ease,
        opacity 50ms ease,
        translate 300ms ease;
    }

    &[data-transition='out']:not([data-cursor='text']) {
      transition:
        outline-color 100ms ease,
        rotate 100ms ease-out,
        scale 100ms ease-out,
        width 100ms ease-out,
        height 100ms ease-out,
        border-radius 100ms ease-out,
        opacity 50ms ease 100ms,
        translate 100ms ease-out;
    }
  }
</style>
