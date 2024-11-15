<script lang="ts">
  import type { NeoCardContext, NeoCardProps } from '~/cards/neo-card.model.js';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeShadowElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children: content,
    header,
    action,
    footer,
    media,

    // States
    ref = $bindable(),
    tag = 'div',
    close, // TODO: Implement close button

    // Styles
    elevation = 2,
    hover = 0,
    borderless,
    rounded,
    glass,
    segmented,
    cover,
    start,
    horizontal,

    // Flex
    justify,
    align,
    flex,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Events
    onClose, // TODO: Implement close button

    // Other props
    headerTag = 'div',
    headerProps,
    footerTag = 'div',
    footerProps,
    actionTag = 'div',
    actionProps,
    mediaTag = 'div',
    mediaProps,
    ...rest
  }: NeoCardProps = $props();
  /* eslint-enable prefer-const */

  const filter = $derived.by(() => {
    if (!glass) return;
    return `var(--neo-blur-${Math.abs(Math.trunc(elevation) + 2)})`;
  });

  const hoverElevation = $derived(elevation + hover);
  const boxShadow = $derived.by(() => computeShadowElevation(elevation, glass));
  const hoverShadow = $derived.by(() => {
    if (!hover) return boxShadow;
    let level = hoverElevation;
    if (level < -4) level = -4;
    if (level > 4) level = 4;
    return computeShadowElevation(level, glass);
  });

  const hoverFlat = $derived(boxShadow.endsWith('flat') && !hoverShadow.endsWith('flat'));
  const flatHover = $derived(hoverShadow.endsWith('flat') && !boxShadow.endsWith('flat'));

  const segments = $derived([content, header, action, footer, media].filter(Boolean).length > 1);

  const context: NeoCardContext = $derived({
    elevation,
    hover,
    borderless,
    rounded,
    glass,
    segmented,
    cover,
    start,
    horizontal,
    onClose,
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

{#snippet divider()}
  {#if segments && typeof segmented === 'number'}
    <div class="neo-card-divider">
      <NeoDivider vertical={horizontal} elevation={segmented} />
    </div>
  {/if}
{/snippet}

<svelte:element
  this={tag}
  bind:this={ref}
  class:neo-card={true}
  class:horizontal
  class:borderless
  class:segmented={segmented === true}
  class:segments
  class:image={media && !segments}
  class:rounded
  class:hover
  class:start
  class:hover-flat={hoverFlat}
  class:flat-hover={flatHover}
  class:glass
  class:flat={!elevation}
  style:--neo-hover-shadow-level={hoverShadow}
  style:--neo-card-box-shadow={boxShadow}
  style:--neo-glass-blur={filter}
  style:justify-content={justify}
  style:align-items={align}
  style:flex
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  {...rest}
>
  {#if media}
    <svelte:element
      this={mediaTag}
      class="neo-card-segment neo-card-media"
      class:cover
      class:inset={elevation < 0 || hoverElevation < 0}
      {...mediaProps}
    >
      {@render media?.(context)}
    </svelte:element>
  {/if}
  {#if header}
    <svelte:element this={headerTag} class="neo-card-segment neo-card-header" {...headerProps}>
      {@render header?.(context)}
    </svelte:element>
  {/if}
  {#if segments}
    {@render divider()}
    <div class="neo-card-segment neo-card-content">
      {@render content?.(context)}
    </div>
  {:else}
    {@render content?.(context)}
  {/if}
  {#if footer}
    {@render divider()}
    <svelte:element this={footerTag} class="neo-card-segment neo-card-footer" {...footerProps}>
      {@render footer?.(context)}
    </svelte:element>
  {/if}
  {#if action}
    {@render divider()}
    <svelte:element this={actionTag} class="neo-card-segment neo-card-action" {...actionProps}>
      {@render action?.(context)}
    </svelte:element>
  {/if}
</svelte:element>

<style lang="scss">
  .neo-card {
    --neo-card-full-spacing: var(--neo-card-spacing, 1.5rem);
    --neo-card-half-spacing: calc(var(--neo-card-spacing, 1.5rem) / 2);

    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin: var(--neo-shadow-margin, 0.25rem);
    padding: var(--neo-card-full-spacing);
    color: var(--neo-card-text-color, inherit);
    background-color: var(--neo-card-bg-color, transparent);
    border: var(--neo-border-width, 1px) var(--neo-card-border-color, transparent) solid;
    border-radius: var(--neo-card-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-card-box-shadow, var(--neo-box-shadow-flat));
    transition:
      color 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      border-radius 0.3s ease,
      box-shadow 0.3s ease-out;

    &.hover:hover.flat-hover,
    &.flat:not(.borderless, .hover-flat:hover) {
      border-color: var(--neo-card-border-color, var(--neo-border-color));
    }

    &.hover:hover {
      box-shadow: var(--neo-hover-shadow-level, var(--neo-card-box-shadow));
    }

    .neo-card-divider {
      margin: 0.5rem calc(var(--neo-card-full-spacing) - 0.25rem);
    }

    .neo-card-segment {
      transition: border-radius 0.3s ease;

      &:not(.neo-card-media) {
        padding: var(--neo-card-half-spacing) var(--neo-card-full-spacing);

        &:first-child {
          padding: var(--neo-card-full-spacing) var(--neo-card-full-spacing) var(--neo-card-half-spacing);
          border-radius: var(--neo-card-border-radius, var(--neo-border-radius)) var(--neo-card-border-radius, var(--neo-border-radius)) 0 0;
        }

        &:last-child {
          padding: var(--neo-card-half-spacing) var(--neo-card-full-spacing) var(--neo-card-full-spacing);
          border-radius: 0 0 var(--neo-card-border-radius, var(--neo-border-radius)) var(--neo-card-border-radius, var(--neo-border-radius));
        }
      }
    }

    .neo-card-media {
      margin: var(--neo-card-full-spacing);
      overflow: hidden;
      border-radius: var(--neo-card-border-radius, var(--neo-border-radius));

      &.cover:not(.inset) {
        padding: 0;

        &:not(:only-child) {
          margin: 0 0 var(--neo-card-full-spacing);
          border-radius: var(--neo-card-border-radius, var(--neo-border-radius)) var(--neo-card-border-radius, var(--neo-border-radius)) 0 0;
        }

        :global(.neo-skeleton-media) {
          border-radius: 0;
        }
      }
    }

    &.image {
      padding: 0;

      .neo-card-media.cover:not(.inset) {
        margin: 0;
      }
    }

    &.segments {
      padding: 0;
    }

    &.segmented {
      .neo-card-segment:not(.neo-card-media) {
        padding: var(--neo-card-full-spacing);
      }

      .neo-card-segment:not(.neo-card-media, :last-child) {
        border-bottom: var(--neo-border-width, 1px) solid var(--neo-card-border-color, var(--neo-border-color));
      }
    }

    &.glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);

      background-color: var(--neo-card-bg-color, var(--neo-glass-background-color));
      border-color: var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
        var(--neo-glass-left-border-color);
      backdrop-filter: var(--neo-glass-blur, var(--neo-blur-4));
    }

    &.start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.borderless) {
          border-color: var(--neo-btn-border-color, var(--neo-border-color));
        }
      }
    }

    &.horizontal {
      flex-direction: row;

      .neo-card-media.cover:not(.inset, :only-child) {
        margin: 0 var(--neo-card-full-spacing) 0 0;
        border-radius: var(--neo-card-border-radius, var(--neo-border-radius)) 0 0 var(--neo-card-border-radius, var(--neo-border-radius));
      }

      .neo-card-segment:not(.neo-card-media) {
        padding: var(--neo-card-full-spacing) var(--neo-card-half-spacing);

        &:first-child {
          padding: var(--neo-card-full-spacing) var(--neo-card-half-spacing) var(--neo-card-full-spacing) var(--neo-card-full-spacing);
          border-radius: var(--neo-card-border-radius, var(--neo-border-radius)) 0 0 var(--neo-card-border-radius, var(--neo-border-radius));
        }

        &:last-child {
          padding: var(--neo-card-full-spacing) var(--neo-card-full-spacing) var(--neo-card-full-spacing) var(--neo-card-half-spacing);
          border-radius: 0 var(--neo-card-border-radius, var(--neo-border-radius)) var(--neo-card-border-radius, var(--neo-border-radius)) 0;
        }
      }
    }

    &.rounded {
      border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg));

      .neo-card-media {
        border-radius: var(--neo-card-border-radius, var(--neo-border-radius-md));

        &.cover:not(.inset) {
          border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg));

          &:not(:only-child) {
            border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg)) var(--neo-card-border-radius, var(--neo-border-radius-lg)) 0 0;
          }
        }
      }

      .neo-card-segment:not(.neo-card-media) {
        &:first-child {
          border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg)) var(--neo-card-border-radius, var(--neo-border-radius-lg)) 0 0;
        }

        &:last-child {
          border-radius: 0 0 var(--neo-card-border-radius, var(--neo-border-radius-lg)) var(--neo-card-border-radius, var(--neo-border-radius-lg));
        }
      }

      &.horizontal {
        .neo-card-segment:not(.neo-card-media) {
          &:first-child {
            border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg)) 0 0 var(--neo-card-border-radius, var(--neo-border-radius-lg));
          }

          &:last-child {
            border-radius: 0 var(--neo-card-border-radius, var(--neo-border-radius-lg)) var(--neo-card-border-radius, var(--neo-border-radius-lg)) 0;
          }
        }

        .neo-card-media.cover:not(.inset, :only-child) {
          border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg)) 0 0 var(--neo-card-border-radius, var(--neo-border-radius-lg));
        }
      }
    }
  }
</style>
