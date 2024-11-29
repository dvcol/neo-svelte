<script lang="ts">
  import type { NeoCardContext, NeoCardProps } from '~/cards/neo-card.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoDivider from '~/divider/NeoDivider.svelte';
  import IconClose from '~/icons/IconClose.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import {
    computeGlassFilter,
    computeHoverShadowElevation,
    computeShadowElevation,
    getDefaultElevation,
    isShadowFlat,
  } from '~/utils/shadow.utils.js';

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
    close,

    // Styles
    pressed,
    convex,
    elevation = getDefaultElevation(pressed),
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
    onClose,

    // Other props
    contentTag = 'div',
    contentProps,
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

  const filter = $derived(computeGlassFilter(elevation, glass));

  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed, convex }));
  const hoverElevation = $derived(elevation + hover);
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass, pressed, convex }) ?? boxShadow);

  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));

  const segments = $derived([content, header, action, footer, media, close].filter(Boolean).length > 1);

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
    close,
    onClose,
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

{#snippet closeBtn()}
  {#if close}
    <div class="neo-card-close">
      <NeoButton aria-label="Close card" rounded text onclick={onClose}>
        {#snippet icon()}
          <IconClose />
        {/snippet}
      </NeoButton>
    </div>
  {/if}
{/snippet}

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
  class:pressed
  class:convex
  class:hover
  class:start
  class:raised={elevation > 3 || hoverElevation > 3}
  class:inset={elevation < -3 || hoverElevation < -3}
  class:flat={!elevation}
  class:hover-flat={hoverFlat}
  class:flat-hover={flatHover}
  class:glass
  style:--neo-card-hover-shadow={hoverShadow}
  style:--neo-card-box-shadow={boxShadow}
  style:--neo-card-glass-blur={filter}
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
      class:neo-card-segment={true}
      class:neo-card-media={true}
      class:cover
      class:inset={elevation < 0 || hoverElevation < 0}
      {...mediaProps}
    >
      {@render media?.(context)}
    </svelte:element>
  {/if}
  {#if header || (!horizontal && close)}
    <svelte:element this={headerTag} class:neo-card-segment={true} class:neo-card-header={true} {...headerProps}>
      {@render header?.(context)}
      {#if !horizontal}
        {@render closeBtn()}
      {/if}
    </svelte:element>
  {/if}
  {#if segments}
    {@render divider()}
    {#if content}
      <svelte:element this={contentTag} class:neo-card-segment={true} class:neo-card-content={true} {...contentProps}>
        {@render content?.(context)}
      </svelte:element>
    {/if}
  {:else}
    {@render content?.(context)}
  {/if}
  {#if footer}
    {@render divider()}
    <svelte:element this={footerTag} class:neo-card-segment={true} class:neo-card-footer={true} {...footerProps}>
      {@render footer?.(context)}
    </svelte:element>
  {/if}
  {#if action || (horizontal && close)}
    {@render divider()}
    <svelte:element this={actionTag} class:neo-card-segment={true} class:neo-card-action={true} {...actionProps}>
      {#if horizontal}
        {@render closeBtn()}
      {/if}
      {@render action?.(context)}
    </svelte:element>
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-card {
    --neo-card-full-spacing: var(--neo-card-spacing, 1.5rem);
    --neo-card-half-spacing: calc(var(--neo-card-spacing, 1.5rem) / 2);

    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: fit-content;
    margin: var(--neo-shadow-margin, 0.6rem);
    padding: var(--neo-card-full-spacing);
    color: var(--neo-card-text-color, inherit);
    background-color: var(--neo-card-bg-color, transparent);
    border: var(--neo-card-border-width, var(--neo-border-width, 1px)) var(--neo-card-border-color, transparent) solid;
    border-radius: var(--neo-card-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-card-box-shadow, var(--neo-box-shadow-flat));
    transition:
      margin 0.3s ease,
      color 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      border-radius 0.3s ease,
      backdrop-filter 0.3s ease,
      box-shadow 0.3s ease-out;

    &.borderless {
      border-color: transparent !important;
    }

    &.inset.pressed,
    &.raised:not(.convex) {
      margin: var(--neo-shadow-margin-lg, 1.125rem);
    }

    &.hover.flat-hover:hover,
    &.flat:not(.borderless, .hover-flat:hover) {
      border-color: var(--neo-card-border-color, var(--neo-border-color));
    }

    &.hover:hover {
      box-shadow: var(--neo-card-hover-shadow, var(--neo-card-box-shadow));
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
      scrollbar-gutter: auto;

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

    .neo-card-action,
    .neo-card-header {
      display: flex;
      align-items: center;
    }

    .neo-card-close {
      align-self: flex-start;
      margin-left: auto;
      opacity: 0;
      transition: opacity 0.3s ease;

      --neo-btn-text-color-focused: var(--neo-close-color-focused, rgb(255 0 0 / 50%));
      --neo-btn-text-color-focused-hover: var(--neo-close-color-hover, rgb(255 0 0 / 75%));
      --neo-text-color-focused-active: var(--neo-close-color, rgb(255 0 0));
      --neo-btn-text-color-hover: var(--neo-close-color-hover, rgb(255 0 0 / 75%));
      --neo-btn-text-color-active: var(--neo-close-color, rgb(255 0 0));
    }

    &:focus-within,
    &:focus,
    &:hover {
      .neo-card-close {
        opacity: 1;
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
      --neo-border-color: var(--neo-glass-border-color);

      background-color: var(--neo-card-bg-color, var(--neo-glass-background-color));
      border-color: var(
        --neo-card-border-color,
        var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color) var(--neo-glass-left-border-color)
      );
      backdrop-filter: var(--neo-card-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));
    }

    &.start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.borderless) {
          border-color: var(--neo-card-border-color, var(--neo-border-color));
        }
      }
    }

    &.horizontal {
      flex-direction: row;

      .neo-card-action {
        flex-direction: column;
      }

      .neo-card-close {
        align-self: flex-end;
        margin-bottom: auto;
      }

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

  .neo-card,
  .neo-card-media,
  .neo-card-header,
  .neo-card-content,
  .neo-card-action,
  .neo-card-footer {
    @include mixin.scrollbar;
  }
</style>
