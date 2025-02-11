<script lang="ts">
  import { width } from '@dvcol/svelte-utils/transition';

  import { type NeoButtonProps, NeoTextButton } from '~/buttons/neo-button.model.js';

  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import {
    coerce,
    computeGlassFilter,
    computeHoverShadowElevation,
    computeShadowElevation,
    DefaultShadowActiveElevation,
    DefaultShadowElevation,
    DefaultShadowHoverElevation,
    isShadowFlat,
    type ShadowElevation,
  } from '~/utils/shadow.utils.js';
  import { quickDurationProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    label,
    icon,

    // States
    ref = $bindable(),
    tag,
    href,
    loading,
    skeleton = false,
    disabled,
    empty: only,
    toggle,
    readonly,
    checked = $bindable(false),

    // Styles
    start,
    color,
    text,
    ghost,
    glass,
    tinted,
    rounded,
    borderless = text || ghost,
    reverse,
    coalesce,
    pulse,
    scale = !ghost,

    // Flex
    justify,
    align,
    flex,

    // Events
    onchecked,
    onclick,
    onkeydown,
    onkeyup,
    onblur,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Other props
    ..._rest
  }: NeoButtonProps = $props();
  /* eslint-enable prefer-const */

  const {
    elevation: _elevation = DefaultShadowElevation,
    hover: _hover = DefaultShadowHoverElevation,
    active: _active = DefaultShadowActiveElevation,
    pressed: _pressed,
    blur: _blur,
    ...rest
  } = $derived.by(() => {
    if (text || ghost) return { ...NeoTextButton, ..._rest };
    return _rest;
  });

  const elevation = $derived(coerce(_elevation));
  const hover = $derived(coerce(_hover));
  const active = $derived(coerce(_active));
  const activePressed = $derived(_pressed ?? elevation + hover > 0);

  const blur = $derived(coerce<ShadowElevation>(_blur ?? elevation));
  const filter = $derived(computeGlassFilter(blur, glass));

  const boxShadow = $derived(computeShadowElevation(elevation, { glass }));
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass }) ?? boxShadow);
  const activeShadow = $derived(
    computeShadowElevation(active, { glass, pressed: !glass && activePressed, active: glass && activePressed }) ?? boxShadow,
  );

  const activeFlat = $derived(isShadowFlat(activeShadow));
  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));

  let enter = $state(false);
  let clicked = $state(false);
  const pressed = $derived(enter || clicked || checked);
  const empty = $derived(only || (!children && !label));

  let timeout: ReturnType<typeof setTimeout>;
  const onActive = () => {
    clearTimeout(timeout);
    clicked = true;
    timeout = setTimeout(() => {
      clicked = false;
    }, 150);
  };

  const onClick: NeoButtonProps['onclick'] = e => {
    if (loading || disabled) return;
    if (toggle) {
      if (!readonly) checked = !checked;
      onchecked?.(checked);
      onclick?.(e, checked);
      return;
    }

    onclick?.(e);
    onActive();
  };

  const onKeydownEnter: NeoButtonProps['onkeydown'] = e => {
    if (loading || disabled) return;
    if (e.key === 'Enter') enter = true;
    onkeydown?.(e);
  };

  const onKeyUpEnter: NeoButtonProps['onkeydown'] = e => {
    if (e.key === 'Enter') enter = false;
    if (loading || disabled) return;
    onkeyup?.(e);
  };

  const onBlur: NeoButtonProps['onblur'] = e => {
    enter = false;
    onblur?.(e);
  };

  const element = $derived(tag ?? (href ? 'a' : 'button'));
  const role = $derived(!['button', 'a'].includes(element) ? 'button' : undefined);
  const tabindex = $derived(!disabled && role ? 0 : undefined);

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<svelte:element
  this={element}
  bind:this={ref}
  href={loading || disabled ? undefined : href}
  {role}
  {tabindex}
  class:neo-button={true}
  class:neo-pulse={pulse}
  class:neo-coalesce={coalesce}
  class:neo-pressed={pressed}
  class:neo-toggle={toggle}
  class:neo-loading={loading}
  class:neo-skeleton={skeleton}
  class:neo-start={start}
  class:neo-glass={glass}
  class:neo-scale={scale}
  class:neo-tinted={tinted}
  class:neo-flat={!elevation}
  class:neo-hover={hover}
  class:neo-hover-flat={hoverFlat}
  class:neo-flat-hover={flatHover}
  class:neo-flat-active={activeFlat}
  class:neo-ghost={ghost}
  class:neo-borderless={borderless}
  class:neo-inset={elevation < 0}
  class:neo-inset-hover={elevation + hover < 0}
  class:neo-rounded={rounded}
  class:neo-empty={empty}
  style:--neo-btn-text-color={getColorVariable(color)}
  style:--neo-btn-backdrop-filter={filter}
  style:--neo-btn-box-shadow={boxShadow}
  style:--neo-btn-box-shadow-hover={hoverShadow}
  style:--neo-btn-box-shadow-active={activeShadow}
  style:justify-content={justify}
  style:align-items={align}
  style:flex
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  onkeydown={onKeydownEnter}
  onkeyup={onKeyUpEnter}
  onclick={onClick}
  onblur={onBlur}
  {disabled}
  {...rest}
>
  <div class="neo-content" class:neo-reverse={reverse}>
    {#if loading || icon}
      <span class="neo-icon" class:neo-only={empty} transition:width={quickDurationProps}>
        {#if loading}
          <IconCircleLoading />
        {:else}
          {@render icon?.()}
        {/if}
      </span>
    {/if}
    {#if !empty}
      {#if typeof label === 'string'}
        <span class="neo-label">{label}</span>
      {:else}
        {@render label?.()}
      {/if}
      {@render children?.()}
    {/if}
  </div>
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: var(--neo-btn-min-width);
    min-height: var(--neo-btn-min-height, var(--neo-line-height));
    margin: var(--neo-btn-margin, var(--neo-shadow-margin, 0.625rem));
    padding: var(--neo-btn-padding, 0.25rem 0.75rem);
    color: var(--neo-btn-text-color, inherit);
    font: inherit;
    text-decoration: none;
    background-color: var(--neo-btn-bg-color, transparent);
    border: var(--neo-border-width, 1px) var(--neo-btn-border-color, transparent) solid;
    border-radius: var(--neo-btn-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-btn-box-shadow, var(--neo-box-shadow-raised-3));
    cursor: pointer;
    transition:
      opacity 0.3s ease,
      color 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      backdrop-filter 0.3s ease,
      border-radius 0.3s ease,
      box-shadow 0.3s ease-out;
    appearance: none;

    &.neo-empty {
      padding: var(--neo-btn-padding-empty, 0.5rem);
    }

    &.neo-loading {
      cursor: wait;
    }

    .neo-icon,
    .neo-content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .neo-content {
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      transition:
        color 0.3s ease,
        scale 0.3s ease;
      scale: 1;

      .neo-icon:not(.neo-only) {
        margin-right: var(--neo-btn-icon-gap, 0.35rem);
        margin-left: var(--neo-btn-icon-offset, calc(0.25rem - var(--neo-btn-icon-gap, 0.5rem)));
      }

      &.neo-reverse {
        flex-direction: row-reverse;

        .neo-icon:not(.neo-only) {
          margin-right: var(--neo-btn-icon-offset, calc(0.25rem - var(--neo-btn-icon-gap, 0.5rem)));
          margin-left: var(--neo-btn-icon-gap, 0.35rem);
        }
      }
    }

    &.neo-ghost {
      justify-content: unset;
      margin: var(--neo-btn-margin, 0);
      padding: var(--neo-btn-padding, 0);

      .neo-content {
        justify-content: unset;
        text-align: start;
      }
    }

    &:focus-visible {
      outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
    }

    &:focus-visible,
    &:hover {
      box-shadow: var(--neo-btn-box-shadow-hover, var(--neo-box-shadow-raised-2));
    }

    &:focus-visible .neo-content,
    &:hover .neo-content {
      color: var(--neo-btn-text-color-hover, var(--neo-text-color-hover));
    }

    &:disabled .neo-content,
    &[disabled]:not([disabled='false']) .neo-content {
      color: var(--neo-btn-text-color-disabled, var(--neo-text-color-disabled));
      scale: 1;
    }

    &.neo-pressed,
    &:active:not(.neo-loading) {
      box-shadow: var(--neo-btn-box-shadow-active, var(--neo-box-shadow-pressed-2));
      transition:
        opacity 0.3s ease,
        color 0.3s ease,
        background-color 0.3s ease,
        border-color 0.3s ease,
        backdrop-filter 0.3s ease,
        border-radius 0.3s ease,
        box-shadow 0.15s ease-out;

      &.neo-scale .neo-content {
        color: var(--neo-btn-text-color-active, var(--neo-text-color-active));
        scale: var(--neo-btn-scale-pressed, 0.98);
      }
    }

    &.neo-borderless {
      border-color: transparent !important;
    }

    &.neo-hover.neo-flat-hover.neo-hovered,
    &.neo-hover.neo-flat-hover:focus-visible:not(:active, .neo-pressed),
    &.neo-hover.neo-flat-hover:hover:not(:active, .neo-pressed),
    &.neo-flat-active.neo-pressed,
    &.neo-flat-active:active,
    &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat:focus-visible, .neo-hover-flat.neo-hovered, .neo-pressed, :active) {
      border-color: var(--neo-btn-border-color, var(--neo-border-color));
    }

    &.neo-glass {
      --neo-background-color-tinted: var(--neo-glass-background-color-tinted);
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
      --neo-border-color: var(--neo-glass-border-color);

      background-color: var(--neo-btn-bg-color, var(--neo-glass-background-color));
      backdrop-filter: var(--neo-btn-backdrop-filter, var(--neo-blur-2) var(--neo-saturate-3));

      &:not(
          .neo-inset,
          .neo-inset-hover:hover,
          .neo-inset-hover:focus-visible,
          .neo-borderless,
          .neo-hover-flat:hover,
          .neo-hover-flat:focus-visible,
          .neo-hover-flat.neo-hovered,
          .neo-pressed,
          :active
        ) {
        border-color: var(
          --neo-btn-border-color,
          var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
            var(--neo-glass-left-border-color)
        );
      }

      &.neo-hover.neo-flat-hover.neo-hovered,
      &.neo-hover.neo-flat-hover:focus-visible:not(:active, .neo-pressed),
      &.neo-hover.neo-flat-hover:hover:not(:active, .neo-pressed),
      &.neo-flat-active.neo-pressed,
      &.neo-flat-active:active,
      &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat:focus-visible, .neo-hover-flat.neo-hovered, .neo-pressed, :active) {
        border-color: var(--neo-btn-border-color, var(--neo-glass-border-color-flat));
      }
    }

    &.neo-start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.neo-borderless, .neo-glass) {
          border-color: var(--neo-btn-border-color, var(--neo-border-color));
        }
      }
    }

    &.neo-tinted {
      background-color: var(--neo-btn-bg-color, var(--neo-background-color-tinted));
    }

    &:disabled:disabled,
    &[disabled]:not([disabled='false']) {
      cursor: not-allowed;
      opacity: var(--neo-btn-opacity-disabled, var(--neo-opacity-disabled));

      &:not(.neo-pressed) {
        border-color: var(--neo-btn-border-color-disabled, var(--neo-border-color-disabled));
        box-shadow: var(--neo-box-shadow-flat);
      }

      &::after,
      &::before {
        box-shadow: none;
        animation-play-state: paused;
      }
    }

    &.neo-skeleton {
      box-shadow: var(--neo-box-shadow-flat) !important;
      pointer-events: none;

      @include mixin.skeleton;
    }

    &.neo-rounded {
      border-radius: var(--neo-btn-border-radius-rounded, var(--neo-border-radius-lg));
    }

    &.neo-pulse {
      @include mixin.pulse;
    }

    &.neo-coalesce {
      @include mixin.coalesce;
    }
  }
</style>
