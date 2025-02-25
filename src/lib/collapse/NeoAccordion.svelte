<script lang="ts">
  import type { NeoAccordionProps } from '~/collapse/neo-accordion.model.js';

  import NeoCollapseGroup from '~/collapse/NeoCollapseGroup.svelte';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { coerce, computeGlassFilter, computeHoverShadowElevation, computeShadowElevation, isShadowFlat, parseBlur } from '~/utils/shadow.utils.js';

  const {
    // Snippets
    children,

    // States
    tag = 'div',
    disabled,
    readonly,
    horizontal,

    // Shadow
    elevation: _elevation = 0,
    hover: _hover = 0,
    blur: _blur,

    // Style
    borderless,
    segmented = true,
    rounded,
    pressed,
    tinted,
    glass,
    color,
    start,

    // Other props
    group,
    ...rest
  }: NeoAccordionProps = $props();

  const elevation = $derived(coerce(_elevation));
  const hover = $derived(coerce(_hover));
  const hoverElevation = $derived(elevation + hover);

  const blur = $derived(parseBlur(_blur, elevation));
  const filter = $derived(computeGlassFilter(blur, glass));

  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed }));
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass, pressed }) ?? boxShadow);

  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));
</script>

<svelte:element
  this={tag}
  class:neo-accordion={true}
  class:neo-borderless={borderless}
  class:neo-horizontal={horizontal}
  class:neo-segmented={segmented}
  class:neo-rounded={rounded}
  class:neo-tinted={tinted}
  class:neo-flat={!elevation}
  class:neo-hover-flat={hoverFlat}
  class:neo-flat-hover={flatHover}
  class:neo-inset={elevation < 0}
  class:neo-inset-hover={hoverElevation < 0}
  class:neo-glass={glass}
  class:neo-start={start}
  style:--neo-accordion-box-shadow-hover={hoverShadow}
  style:--neo-accordion-box-shadow={boxShadow}
  style:--neo-accordion-glass-blur={filter}
  style:--neo-accordion-color={getColorVariable(color)}
  {...rest}
>
  {#if group}
    <NeoCollapseGroup {disabled} {readonly} {...group} {children} />
  {:else}
    {@render children?.({ disabled, readonly })}
  {/if}
</svelte:element>

<style lang="scss">
  .neo-accordion {
    margin: 0;
    color: var(--neo-accordion-color, inherit);
    background-color: var(--neo-accordion-background-color, transparent);
    border: var(--neo-border-width, 1px) solid var(--neo-accordion-border-color, transparent);
    border-radius: var(--neo-accordion-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-accordion-box-shadow, var(--neo-box-shadow-flat));
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease,
      border-radius 0.3s ease,
      backdrop-filter 0.3s ease,
      box-shadow 0.3s ease-out;

    &:not(.neo-horizontal) {
      width: 100%;
      padding-block: var(--neo-gap-xxs, 0.5rem);
      padding-inline: var(--neo-gap-md, 1.25rem);

      &.neo-segmented :global(> .neo-collapse:not(:last-child, :only-child)) {
        border-bottom: var(--neo-border-width, 1px) solid var(--neo-accordion-border-color, var(--neo-border-color));
      }
    }

    &.neo-horizontal {
      display: inline-flex;
      padding-block: var(--neo-gap-md, 1.25rem);
      padding-inline: var(--neo-gap-xxs, 0.5rem);

      &.neo-segmented :global(> .neo-collapse:not(:last-child, :only-child)) {
        border-right: var(--neo-border-width, 1px) solid var(--neo-accordion-border-color, var(--neo-border-color));
      }
    }

    &:focus-within,
    &:hover {
      box-shadow: var(--neo-accordion-box-shadow-hover, var(--neo-accordion-box-shadow));
    }

    &.neo-rounded {
      border-radius: var(--neo-accordion-border-radius, var(--neo-border-radius-lg));
    }

    &.neo-flat-hover:hover:not(.neo-borderless),
    &.neo-flat-hover:focus-within:not(.neo-borderless),
    &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat:focus-within) {
      border-color: var(--neo-accordion-border-color, var(--neo-border-color));

      &:focus-within,
      &:hover {
        border-color: var(--neo-accordion-border-color-hover, var(--neo-border-color-highlight));

        &.neo-segmented :global(> .neo-collapse:not(:last-child, :only-child)) {
          border-color: var(--neo-accordion-border-color-hover, var(--neo-border-color-highlight));
        }
      }
    }

    &.neo-glass {
      --neo-background-color-tinted: var(--neo-glass-background-color-tinted);
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
      --neo-border-color: var(--neo-glass-border-color);

      background-color: var(--neo-accordion-bg-color, var(--neo-glass-background-color));
      backdrop-filter: var(--neo-accordion-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));

      &.neo-inset,
      &.neo-inset-hover:hover {
        border-color: var(--neo-accordion-border-color, transparent);
      }

      &:not(.neo-inset, .neo-inset-hover:hover, .neo-borderless, .neo-hover-flat:hover, .neo-hover-flat:focus-within) {
        border-color: var(
          --neo-accordion-border-color,
          var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
            var(--neo-glass-left-border-color)
        );
      }

      &.neo-flat-hover:hover:not(.neo-borderless),
      &.neo-flat-hover:focus-within:not(.neo-borderless),
      &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat.neo-hovered, .neo-hover-flat:focus-within) {
        border-color: var(--neo-accordion-border-color, var(--neo-glass-border-color-flat));

        &:focus-within,
        &:hover {
          border-color: var(--neo-accordion-border-color-hover, var(--neo-border-color-flat-highlight));
        }
      }

      &:not(.neo-horizontal) {
        &.neo-segmented :global(> .neo-collapse:not(:last-child, :only-child)) {
          border-bottom: var(--neo-border-width, 1px) solid var(--neo-accordion-border-color, var(--neo-glass-border-color-flat));
        }
      }

      &.neo-horizontal {
        &.neo-segmented :global(> .neo-collapse:not(:last-child, :only-child)) {
          border-right: var(--neo-border-width, 1px) solid var(--neo-accordion-border-color, var(--neo-glass-border-color-flat));
        }
      }
    }

    &.neo-tinted {
      background-color: var(--neo-accordion-bg-color, var(--neo-background-color-tinted));
    }

    &.neo-start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);
      }
    }
  }
</style>
