<script lang="ts">
  import type { NeoCardContext, NeoCardProps } from '~/cards/neo-card.model.js';

  import { focusin } from '@dvcol/svelte-utils/focusin';
  import { hovering } from '@dvcol/svelte-utils/hovering';

  import NeoCloseButton from '~/buttons/NeoCloseButton.svelte';
  import NeoDivider from '~/divider/NeoDivider.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import {
    coerce,
    computeGlassFilter,
    computeHoverShadowElevation,
    computeShadowElevation,
    getDefaultElevation,
    isShadowFlat,
    parseBlur,
  } from '~/utils/shadow.utils.js';
  import { toSize } from '~/utils/style.utils.js';

  let {
    // Snippets
    children: content,
    header,
    action,
    footer,
    media,

    // States
    ref = $bindable(),
    hovered = $bindable(false),
    focused = $bindable(false),
    tag = 'div',
    close,
    disabled,

    // Styles
    pressed,
    convex,
    spacing,
    borderless,
    rounded,
    color,
    glass,
    tinted,
    segmented,
    cover,
    start,
    skeleton = false,
    horizontal,
    scrollbar,

    // Shadow
    elevation: _elevation = getDefaultElevation(pressed),
    hover: _hover = 0,
    blur: _blur,

    // Flex
    justify,
    align,
    flex,

    // Size
    width: _width,
    height: _height,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Events
    onClose,
    onfocusin,
    onfocusout,
    onpointerenter,
    onpointerleave,

    // Other props
    contentProps,
    headerProps,
    footerProps,
    actionProps,
    mediaProps,
    dividerProps,
    closeProps,
    ...rest
  }: NeoCardProps = $props();

  const { tag: contentTag = 'div', ...contentRest } = $derived(contentProps ?? {});
  const { tag: headerTag = 'div', ...headerRest } = $derived(headerProps ?? {});
  const { tag: footerTag = 'div', ...footerRest } = $derived(footerProps ?? {});
  const { tag: actionTag = 'div', ...actionRest } = $derived(actionProps ?? {});
  const { tag: mediaTag = 'div', ...mediaRest } = $derived(mediaProps ?? {});

  const elevation = $derived(coerce(_elevation));
  const hover = $derived(coerce(_hover));
  const hoverElevation = $derived(elevation + hover);

  const blur = $derived(parseBlur(_blur, elevation));
  const filter = $derived(computeGlassFilter(blur, glass));

  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed, convex }));
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass, pressed, convex }) ?? boxShadow);

  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));

  const segments = $derived([content, header, action, footer, media, close].filter(Boolean).length > 1);

  const context = $derived<NeoCardContext>({
    elevation,
    hover,
    hovered,
    disabled,
    borderless,
    rounded,
    glass,
    tinted,
    segmented,
    cover,
    start,
    color,
    convex,
    pressed,
    focused,
    spacing,
    skeleton,
    horizontal,
    close,
    onClose,
  });

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

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
      <NeoCloseButton aria-label="Close card" rounded text onclick={onClose} {...closeProps} iconProps={{ size: '1rem', ...closeProps?.iconProps }} />
    </div>
  {/if}
{/snippet}

{#snippet divider()}
  {#if segments && typeof segmented === 'number'}
    <div class="neo-card-divider">
      <NeoDivider vertical={horizontal} elevation={segmented} {rounded} {glass} {skeleton} {...dividerProps} />
    </div>
  {/if}
{/snippet}

<svelte:element
  this={tag}
  role="none"
  bind:this={ref}
  class:neo-card={true}
  class:neo-scroll={scrollbar}
  class:neo-horizontal={horizontal}
  class:neo-borderless={borderless}
  class:neo-segmented={segmented === true}
  class:neo-segments={segments}
  class:neo-image={media && !segments}
  class:neo-rounded={rounded}
  class:neo-disabled={disabled}
  class:neo-skeleton={skeleton}
  class:neo-pressed={pressed}
  class:neo-convex={convex}
  class:neo-hover={hover}
  class:neo-hovered={hovered}
  class:neo-start={start}
  class:neo-raised={elevation > 3 || hoverElevation > 3}
  class:neo-inset={elevation < 0}
  class:neo-inset-hover={hoverElevation < 0}
  class:neo-deep={elevation < -3 || hoverElevation < -3}
  class:neo-flat={!elevation}
  class:neo-hover-flat={hoverFlat}
  class:neo-flat-hover={flatHover}
  class:neo-glass={glass}
  class:neo-tinted={tinted}
  style:--neo-card-text-color={getColorVariable(color)}
  style:--neo-card-box-shadow-hover={hoverShadow}
  style:--neo-card-box-shadow={boxShadow}
  style:--neo-card-glass-blur={filter}
  style:--neo-card-spacing={spacing}
  style:justify-content={justify}
  style:align-items={align}
  style:flex
  style:width={width?.absolute}
  style:min-width={width?.min}
  style:max-width={width?.max}
  style:height={height?.absolute}
  style:min-height={height?.min}
  style:max-height={height?.max}
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  use:focusin={{
    get focusin() {
      return focused;
    },
    set focusin(value) {
      focused = value;
    },
  }}
  use:hovering={{
    get hovered() {
      return hovered;
    },
    set hovered(value) {
      hovered = value;
    },
  }}
  {...rest}
>
  {#if media}
    <svelte:element
      this={mediaTag}
      class:neo-card-segment={true}
      class:neo-card-media={true}
      class:neo-scroll={scrollbar}
      class:neo-cover={cover}
      class:neo-inset={elevation < 0 || hoverElevation < 0}
      {...mediaRest}
    >
      {@render media?.(context)}
    </svelte:element>
  {/if}
  {#if header}
    <svelte:element this={headerTag} class:neo-card-segment={true} class:neo-card-header={true} class:neo-scroll={scrollbar} {...headerRest}>
      {@render header?.(context)}
      {#if !horizontal}
        {@render closeBtn()}
      {/if}
    </svelte:element>
  {/if}
  {#if segments || scrollbar}
    {@render divider()}
    {#if content}
      <svelte:element this={contentTag} class:neo-card-segment={true} class:neo-card-content={true} class:neo-scroll={scrollbar} {...contentRest}>
        {#if (horizontal && !action) || (!horizontal && !header)}
          {@render closeBtn()}
        {/if}
        {@render content?.(context)}
      </svelte:element>
    {/if}
  {:else}
    {@render content?.(context)}
  {/if}
  {#if footer}
    {@render divider()}
    <svelte:element this={footerTag} class:neo-card-segment={true} class:neo-card-footer={true} class:neo-scroll={scrollbar} {...footerRest}>
      {@render footer?.(context)}
    </svelte:element>
  {/if}
  {#if action}
    {@render divider()}
    <svelte:element this={actionTag} class:neo-card-segment={true} class:neo-card-action={true} class:neo-scroll={scrollbar} {...actionRest}>
      {#if horizontal}
        {@render closeBtn()}
      {/if}
      {@render action?.(context)}
    </svelte:element>
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  $full-spacing: var(--neo-card-spacing, 1.5rem);
  $half-spacing: calc(var(--neo-card-spacing, 1.5rem) / 2);

  .neo-card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: fit-content;
    margin: var(--neo-card-margin, var(--neo-shadow-margin, 0.625rem));
    padding: var(--neo-card-padding, $full-spacing);
    color: var(--neo-card-text-color, inherit);
    background-color: var(--neo-card-bg-color, transparent);
    background-clip: padding-box;
    border: var(--neo-card-border-width, var(--neo-border-width, 1px)) var(--neo-card-border-color, transparent) solid;
    border-radius: var(--neo-card-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-card-box-shadow, var(--neo-box-shadow-flat));
    transition:
      margin 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      border-radius 0.3s ease,
      backdrop-filter 0.3s ease,
      box-shadow 0.3s ease-out;

    &-content {
      flex: 1 1 auto;
      overflow: auto;

      .neo-card-close {
        margin: calc(0% - var(--neo-card-spacing, 1.5rem) / 2);

        --neo-btn-margin: 0.5rem;
      }
    }

    &.neo-borderless {
      border-color: transparent !important;
    }

    &.neo-disabled {
      box-shadow: var(--neo-box-shadow-flat) !important;
      opacity: var(--neo-card-opacity-disabled, var(--neo-opacity-disabled));

      &:not(.neo-borderless) {
        border-color: var(--neo-card-border-color-disabled, var(--neo-border-color-disabled)) !important;
      }
    }

    &.neo-deep.neo-pressed,
    &.neo-raised:not(.neo-convex) {
      margin: var(--neo-shadow-margin-lg, 1.125rem);
    }

    &.neo-hover.neo-flat-hover.neo-hovered,
    &.neo-hover.neo-flat-hover:hover,
    &.neo-hover.neo-flat-hover:focus-within,
    &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat.neo-hovered, .neo-hover-flat:focus-within) {
      border-color: var(--neo-card-border-color, var(--neo-border-color));

      &:focus-within,
      &:hover {
        border-color: var(--neo-card-border-color-hover, var(--neo-border-color-highlight));
      }
    }

    &:focus-within,
    &.neo-hover:hover,
    &.neo-hover.neo-hovered {
      box-shadow: var(--neo-card-box-shadow-hover, var(--neo-card-box-shadow));
    }

    .neo-card-divider {
      margin: 0.5rem calc(#{$full-spacing} - 0.25rem);
    }

    .neo-card-segment {
      &:only-child {
        border-radius: inherit;
      }

      &:not(.neo-card-media, :only-child) {
        padding: $half-spacing $full-spacing;

        &:first-child {
          padding: $full-spacing $full-spacing $half-spacing;
          border-radius: var(--neo-card-border-radius, var(--neo-border-radius)) var(--neo-card-border-radius, var(--neo-border-radius)) 0 0;
        }

        &:last-child {
          padding: $half-spacing $full-spacing $full-spacing;
          border-radius: 0 0 var(--neo-card-border-radius, var(--neo-border-radius)) var(--neo-card-border-radius, var(--neo-border-radius));
        }
      }

      &:only-child:not(.neo-card-media) {
        padding: $full-spacing;
      }
    }

    .neo-card-media {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: var(--neo-card-border-radius, var(--neo-border-radius));
      scrollbar-gutter: auto;

      &:not(:only-child) {
        margin: $full-spacing $full-spacing $half-spacing;
      }

      &.neo-cover:not(.neo-inset) {
        padding: 0;

        &:not(:only-child) {
          margin: 0 0 $half-spacing;
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
      display: flex;
      flex: 0 0 auto;
      align-self: flex-start;
      justify-content: flex-end;
      margin-left: auto;
      opacity: 0;
      transition: opacity 0.3s ease-out 0.15s;

      --neo-btn-margin: 0.25rem;
    }

    &:focus-within,
    &:focus,
    &:hover {
      .neo-card-close {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }

    &.neo-scroll,
    &.neo-segments {
      padding: 0;
    }

    &.neo-segmented {
      .neo-card-segment:not(.neo-card-media) {
        padding: $full-spacing;
      }

      .neo-card-media.neo-cover {
        &:not(.neo-inset, :only-child) {
          margin: 0;
        }

        &.neo-inset:not(:only-child) {
          margin: $full-spacing $full-spacing 0;
        }
      }

      .neo-card-segment:not(.neo-card-media, :last-child, :only-child) {
        border-bottom: var(--neo-border-width, 1px) solid var(--neo-card-border-color, var(--neo-border-color));
      }
    }

    &.neo-glass {
      --neo-background-color-tinted: var(--neo-glass-background-color-tinted);
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
      --neo-border-color: var(--neo-glass-border-color);

      background-color: var(--neo-card-bg-color, var(--neo-glass-background-color));
      backdrop-filter: var(--neo-card-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));

      &.neo-convex,
      &.neo-inset,
      &.neo-inset-hover:hover {
        border-color: var(--neo-card-border-color, transparent);
      }

      &:not(
          .neo-inset,
          .neo-inset-hover:hover,
          .neo-convex,
          .neo-borderless,
          .neo-hover-flat:hover,
          .neo-hover-flat.neo-hovered,
          .neo-hover-flat:focus-within
        ) {
        border-color: var(
          --neo-card-border-color,
          var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
            var(--neo-glass-left-border-color)
        );
      }

      &.neo-hover.neo-flat-hover.neo-hovered,
      &.neo-hover.neo-flat-hover:hover,
      &.neo-hover.neo-flat-hover:focus-within,
      &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat.neo-hovered, .neo-hover-flat:focus-within) {
        border-color: var(--neo-card-border-color, var(--neo-glass-border-color-flat));

        &:focus-within,
        &:hover {
          border-color: var(--neo-card-border-color-hover, var(--neo-glass-border-color-flat-highlight));
        }
      }
    }

    &.neo-start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);
      }
    }

    &.neo-tinted {
      background-color: var(--neo-card-bg-color, var(--neo-background-color-tinted));
    }

    &.neo-horizontal {
      flex-direction: row;

      .neo-card-content,
      .neo-card-header,
      .neo-card-action {
        flex-direction: column;
      }

      .neo-card-divider {
        margin: calc(#{$full-spacing} - 0.25rem) 0.5rem;
      }

      .neo-card-close {
        align-self: flex-end;
        margin-bottom: auto;
      }

      .neo-card-segment.neo-card-media:not(:only-child) {
        margin: $full-spacing $half-spacing $full-spacing $full-spacing;
      }

      .neo-card-media.neo-cover:not(.neo-inset, :only-child) {
        margin: 0 $half-spacing 0 0;
        border-radius: var(--neo-card-border-radius, var(--neo-border-radius)) 0 0 var(--neo-card-border-radius, var(--neo-border-radius));
      }

      .neo-card-segment:not(.neo-card-media, :only-child) {
        padding: $full-spacing $half-spacing;

        &:first-child {
          padding: $full-spacing $half-spacing $full-spacing $full-spacing;
          border-radius: var(--neo-card-border-radius, var(--neo-border-radius)) 0 0 var(--neo-card-border-radius, var(--neo-border-radius));
        }

        &:last-child {
          padding: $full-spacing $full-spacing $full-spacing $half-spacing;
          border-radius: 0 var(--neo-card-border-radius, var(--neo-border-radius)) var(--neo-card-border-radius, var(--neo-border-radius)) 0;
        }
      }
    }

    &.neo-rounded {
      border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg));

      .neo-card-media {
        border-radius: var(--neo-card-border-radius, var(--neo-border-radius-md));

        &.neo-cover:not(.neo-inset) {
          border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg));

          &:not(:only-child) {
            border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg)) var(--neo-card-border-radius, var(--neo-border-radius-lg)) 0 0;
          }
        }
      }

      .neo-card-segment:not(.neo-card-media, :only-child) {
        &:first-child {
          border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg)) var(--neo-card-border-radius, var(--neo-border-radius-lg)) 0 0;
        }

        &:last-child {
          border-radius: 0 0 var(--neo-card-border-radius, var(--neo-border-radius-lg)) var(--neo-card-border-radius, var(--neo-border-radius-lg));
        }
      }

      &.neo-horizontal {
        .neo-card-segment:not(.neo-card-media, :only-child) {
          &:first-child {
            border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg)) 0 0 var(--neo-card-border-radius, var(--neo-border-radius-lg));
          }

          &:last-child {
            border-radius: 0 var(--neo-card-border-radius, var(--neo-border-radius-lg)) var(--neo-card-border-radius, var(--neo-border-radius-lg)) 0;
          }
        }

        .neo-card-media.neo-cover:not(.neo-inset, :only-child) {
          border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg)) 0 0 var(--neo-card-border-radius, var(--neo-border-radius-lg));
        }
      }
    }

    &.neo-skeleton {
      box-shadow: var(--neo-box-shadow-flat);
      pointer-events: none;

      @include mixin.skeleton;
    }
  }

  .neo-card-content.neo-scroll {
    @include mixin.fade-scroll;
    @include mixin.scrollbar($gutter: auto, $padding: none, $transition: border-radius 0.3s ease);
  }
</style>
