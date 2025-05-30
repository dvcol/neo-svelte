<script lang="ts">
  import type { NeoPillContext, NeoPillProps } from '~/pill/neo-pill.model.js';

  import { width } from '@dvcol/svelte-utils/transition';

  import NeoAffix from '~/inputs/common/NeoAffix.svelte';
  import NeoImage from '~/media/NeoImage.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeBorderRadius } from '~/utils/border.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import {
    coerce,
    computeGlassFilter,
    computeHoverShadowElevation,
    computeShadowElevation,
    DefaultShallowMinMaxElevation,
    isShadowFlat,
    parseBlur,
  } from '~/utils/shadow.utils.js';
  import { quickDurationProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    label,
    icon,

    // States
    tag = 'div',
    close,
    color,
    text,
    loading,
    disabled,
    skeleton = false,
    reverse,
    size,

    // Styles
    borderless = text,
    rounded = true,
    pressed,
    glass,
    tinted,
    filled,
    start,

    // Shadow
    elevation: _elevation = text ? 0 : (pressed ? -1 : 1),
    hover: _hover = 0,
    blur: _blur,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Events
    onClose,

    // Other props
    affixProps,
    imageProps,
    ...rest
  }: NeoPillProps = $props();
  /* eslint-enable prefer-const */

  const elevation = $derived(coerce(_elevation));
  const hover = $derived(coerce(_hover));

  const blur = $derived(parseBlur(_blur, elevation));
  const filter = $derived(computeGlassFilter(blur, glass));

  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed }, DefaultShallowMinMaxElevation));
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass, pressed }, DefaultShallowMinMaxElevation) ?? boxShadow);

  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));

  const empty = $derived((!children && (label === undefined || label === null)));

  const context = $derived<NeoPillContext>({
    close,
    color,
    loading,
    disabled,
    skeleton,
    elevation,

    borderless,
    rounded,
    pressed,
    glass,
    tinted,
    filled,
    start,
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<svelte:element
  this={tag}
  class:neo-pill={true}
  data-type={size}
  class:neo-borderless={borderless}
  class:neo-rounded={rounded}
  class:neo-disabled={disabled}
  class:neo-skeleton={skeleton}
  class:neo-pressed={pressed}
  class:neo-reverse={reverse}
  class:neo-glass={glass}
  class:neo-tinted={tinted}
  class:neo-filled={filled}
  class:neo-start={start}
  class:neo-empty={empty}
  class:neo-hover={hover}
  class:neo-hover-flat={hoverFlat}
  class:neo-flat-hover={flatHover}
  class:neo-flat={!elevation}
  class:neo-inset={elevation < 0}
  class:neo-inset-hover={elevation + hover < 0}
  style:--neo-pill-glass-blur={filter}
  style:--neo-pill-box-shadow={boxShadow}
  style:--neo-pill-box-shadow-hover={hoverShadow}
  style:--neo-pill-text-color={getColorVariable(color)}
  style:--neo-pill-border-radius={computeBorderRadius(rounded)}
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  {...rest}
>
  {#if icon}
    <span class="neo-icon" class:neo-only={empty} transition:width={quickDurationProps}>
      {#if typeof icon === 'function'}
        {@render icon?.(context)}
      {:else if typeof icon === 'string'}
        <NeoImage src={icon} ratio="1/1" {...imageProps} />
      {/if}
    </span>
  {/if}
  {#if typeof label === 'function'}
    {@render label?.(context)}
  {:else if label !== undefined}
    {label}
  {/if}
  {@render children?.(context)}
  {#if (close && !disabled) || loading}
    <NeoAffix
      {loading}
      {skeleton}
      {disabled}
      {close}
      transition={{ use: width, props: quickDurationProps }}
      {...affixProps}
      closeProps={{
        'aria-label': 'close',
        'onclick': onClose,
        ...affixProps?.closeProps,
      }}
      class={['neo-pill-affix', affixProps?.class]}
    />
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-pill {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: fit-content;
    margin: var(--neo-pill-margin, 0);
    padding: var(--neo-pill-padding, 0.125rem 0.5rem);
    color: var(--neo-pill-text-color, inherit);
    background-clip: padding-box;
    border: var(--neo-pill-border-width, var(--neo-border-width, 1px)) var(--neo-pill-border-color, transparent) solid;
    border-radius: var(--neo-pill-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-pill-box-shadow, var(--neo-box-shadow-flat));
    transition:
      color 0.15s ease,
      padding 0.3s ease,
      border-color 0.3s ease,
      border-radius 0.3s ease,
      backdrop-filter 0.3s ease,
      background-color 0.3s ease,
      box-shadow 0.3s ease-out;

    &.neo-empty {
      padding: var(--neo-pill-padding-empty, 0.375rem);
    }

    .neo-icon{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;

      :global(.neo-image) {
        --neo-image-border-radius: 0;

        min-height: 1rem;
      }

      &:not(.neo-only) {
        margin-right: var(--neo-pill-icon-gap, var(--neo-gap-4xs, 0.25rem));
        margin-left: var(--neo-pill-icon-offset, calc(0% - var(--neo-pill-icon-gap, var(--neo-gap-5xs, 0.125rem))));
      }
    }

    &.neo-reverse {
      flex-direction: row-reverse;

      .neo-icon:not(.neo-only) {
        margin-right: var(--neo-pill-icon-offset, calc(0% - var(--neo-pill-icon-gap, var(--neo-gap-5xs, 0.125rem))));
        margin-left: var(--neo-pill-icon-gap, var(--neo-gap-4xs, 0.25rem));
      }

      :global(> .neo-pill-affix) {
        --neo-pill-affix-margin-inline: -0.125rem 0.3125rem;
      }
    }

    &[medium],
    &[data-type='medium'] {
      min-width: 1.5rem;
      font-size: var(--neo-pill-font-size-medium, var(--neo-font-size-sm));
      line-height: var(--neo-pill-line-height-medium, var(--neo-line-height-sm));
      padding-block: 0.0625rem;
      padding-inline: 0.4375rem;

      :global(> .neo-pill-affix) {
        --neo-affix-size: 0.875rem;
        --neo-pill-affix-margin-inline: 0.25rem -0.125rem;
      }

      &.neo-reverse :global(> .neo-pill-affix) {
        --neo-pill-affix-margin-inline: -0.125rem 0.25rem;
      }
    }

    &[small],
    &[data-type='small'] {
      min-width: 1.25rem;
      font-size: var(--neo-pill-font-size-small, var(--neo-font-size-xs));
      line-height: var(--neo-pill-line-height-small, var(--neo-line-height-xs));
      padding-block: 0.0625rem;
      padding-inline: 0.3125rem;

      :global(> .neo-pill-affix) {
        --neo-affix-size: 0.75rem;
        --neo-pill-affix-margin-inline: 0.1875rem -0.0625rem;
      }

      &.neo-reverse :global(> .neo-pill-affix) {
        --neo-pill-affix-margin-inline: -0.0625rem 0.1875rem;
      }
    }

    &:focus-within,
    &.neo-hover:hover {
      box-shadow: var(--neo-pill-box-shadow-hover, var(--neo-box-shadow-flat));
    }

    :global(> .neo-pill-affix) {
      --neo-affix-size: 1.125rem;
      --neo-pill-affix-margin-inline: 0.3125rem -0.125rem;

      padding: 0;
      margin-inline: var(--neo-pill-affix-margin-inline);
    }

    &.neo-hover.neo-flat-hover:hover,
    &.neo-hover.neo-flat-hover:focus-within,
    &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat:focus-within) {
      border-color: var(--neo-pill-border-color, var(--neo-border-color));

      &:focus-within,
      &:hover {
        border-color: var(--neo-pill-border-color-hover, var(--neo-border-color-highlight));
      }
    }

    &.neo-disabled {
      box-shadow: var(--neo-box-shadow-flat);
      opacity: var(--neo-pill-opacity-disabled, var(--neo-opacity-disabled));

      &:not(.neo-borderless) {
        border-color: var(--neo-pill-border-color-disabled, var(--neo-border-color-disabled));
      }
    }

    &.neo-borderless {
      border-color: transparent;
    }

    &.neo-rounded {
      border-radius: var(--neo-pill-border-radius, var(--neo-border-radius-xxl));
    }

    &.neo-glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
      --neo-border-color: var(--neo-glass-border-color);
      --neo-background-color-tinted: var(--neo-glass-background-color-tinted);

      background-color: var(--neo-pill-bg-color, var(--neo-glass-background-color));
      backdrop-filter: var(--neo-pill-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));

      &.neo-inset-hover:hover,
      &.neo-inset {
        border-color: var(--neo-pill-border-color, transparent);
      }

      &:not(.neo-inset, .neo-inset-hover:hover, .neo-borderless, .neo-flat, .neo-disabled, .neo-filled) {
        border-color: var(
          --neo-pill-border-color,
          var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
            var(--neo-glass-left-border-color)
        );
      }

      &.neo-hover.neo-flat-hover.neo-hovered,
      &.neo-hover.neo-flat-hover:hover,
      &.neo-flat:not(.neo-borderless) {
        border-color: var(--neo-pill-border-color, var(--neo-glass-border-color-flat));

        &:focus-within,
        &:hover {
          border-color: var(--neo-pill-border-color-hover, var(--neo-glass-border-color-flat-highlight));
        }
      }
    }

    &.neo-start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);
      }
    }

    &.neo-tinted {
      background-color: var(--neo-pill-bg-color, var(--neo-background-color-tinted));
    }

    &.neo-filled {
      --neo-affix-clear-color: var(--neo-pill-affix-color-filled, var(--neo-text-color));

      color: var(--neo-pill-text-color-filled, var(--neo-text-color-inverse));
      background-color: var(--neo-pill-text-color, var(--neo-text-color));

      &.neo-glass {
        background-color: color-mix(in srgb, var(--neo-pill-text-color, var(--neo-text-color)), transparent 40%);
      }
    }

    &.neo-skeleton {
      box-shadow: var(--neo-box-shadow-flat);
      pointer-events: none;

      @include mixin.skeleton($text: transparent);
    }
  }
</style>
