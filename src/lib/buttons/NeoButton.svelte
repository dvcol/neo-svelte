<script lang="ts">
  import { hovering } from '@dvcol/svelte-utils/hovering';
  import { width } from '@dvcol/svelte-utils/transition';

  import type { KeyboardEventHandler, MouseEventHandler } from 'svelte/elements';

  import { type NeoButtonContext, type NeoButtonProps, NeoTextButton } from '~/buttons/neo-button.model.js';

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
    getDefaultElevation,
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
    hovered = $bindable(false),
    focused = $bindable(false),

    // Styles
    start,
    color,
    text,
    ghost,
    glass,
    filled,
    tinted,
    rounded,
    borderless = text || ghost,
    reverse,
    coalesce,
    pulse,
    scale = !ghost,
    ratio,

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
    return { ..._rest, elevation: _rest.elevation ?? getDefaultElevation(_rest.pressed) };
  });

  const elevation = $derived(coerce(_elevation));
  const hover = $derived(coerce(_hover));
  const active = $derived(coerce(_active));

  const hoverElevation = $derived(elevation + hover);
  const activePressed = $derived(_pressed ?? hoverElevation > 0);

  const blur = $derived(parseBlur(_blur, elevation));
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
  const empty = $derived(only || (!children && label === undefined));

  let timeout: ReturnType<typeof setTimeout>;
  const onActive = () => {
    clearTimeout(timeout);
    clicked = true;
    timeout = setTimeout(() => {
      clicked = false;
    }, 150);
  };

  const onClick: MouseEventHandler<HTMLButtonElement> = e => {
    if (loading || disabled) return;
    if (readonly) return onActive();
    if (toggle) {
      checked = !checked;
      onchecked?.(checked);
      onclick?.(e, checked);
      return;
    }

    onclick?.(e);
    onActive();
  };

  const onKeydownEnter: KeyboardEventHandler<HTMLButtonElement> = e => {
    if (loading || disabled || readonly) return;
    if (e.key === 'Enter') enter = true;
    onkeydown?.(e);
  };

  const onKeyUpEnter: KeyboardEventHandler<HTMLButtonElement> = e => {
    if (e.key === 'Enter') enter = false;
    if (loading || disabled || readonly) return;
    onkeyup?.(e);
  };

  const onBlur: NeoButtonProps['onblur'] = e => {
    enter = false;
    onblur?.(e);
  };

  const element = $derived(tag ?? (href ? 'a' : 'button'));
  const role = $derived(!['button', 'a'].includes(element) ? 'button' : undefined);
  const type = $derived(element === 'button' ? 'button' : undefined);
  const tabindex = $derived.by(() => {
    if (readonly) return -1;
    if (!disabled && role) return 0;
  });

  const context = $derived<NeoButtonContext>({
    ref,
    href,

    loading,
    disabled,
    readonly,
    skeleton,
    hovered,
    focused,

    empty,
    toggle,

    checked,
    pressed,
  });

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
  bind:focused
  href={loading || disabled || readonly ? undefined : href}
  aria-disabled={readonly && !disabled}
  {type}
  {role}
  {tabindex}
  class:neo-button={true}
  class:neo-readonly={readonly}
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
  class:neo-filled={filled}
  class:neo-flat={!elevation}
  class:neo-hover={hover}
  class:neo-hover-flat={hoverFlat}
  class:neo-flat-hover={flatHover}
  class:neo-flat-active={activeFlat}
  class:neo-ghost={ghost}
  class:neo-borderless={borderless}
  class:neo-inset={elevation < 0}
  class:neo-inset-hover={hoverElevation < 0}
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
  style:aspect-ratio={ratio}
  onkeydown={onKeydownEnter}
  onkeyup={onKeyUpEnter}
  onclick={onClick}
  onblur={onBlur}
  {disabled}
  {...rest}
  in:inFn={inProps}
  out:outFn={outProps}
  use:useFn={useProps}
  use:hovering={{
    get hovered() {
      return hovered;
    },
    set hovered(_value) {
      hovered = _value;
    },
  }}
>
  <div class="neo-content" class:neo-reverse={reverse}>
    {#if loading || icon}
      <span class="neo-icon" class:neo-only={empty} transition:width={quickDurationProps}>
        {#if loading}
          <IconCircleLoading />
        {:else}
          {@render icon?.(context)}
        {/if}
      </span>
    {/if}
    {#if !empty}
      {#if typeof label === 'function'}
        {@render label?.(context)}
      {:else if label !== undefined}
        {label}
      {/if}
      {@render children?.(context)}
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
    background-clip: padding-box;
    border: var(--neo-btn-border-with, var(--neo-border-width, 1px)) var(--neo-btn-border-color, transparent) solid;
    border-radius: var(--neo-btn-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-btn-box-shadow, var(--neo-box-shadow-raised-3));
    cursor: pointer;
    transition:
      opacity 0.3s ease,
      color 0.15s ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      backdrop-filter 0.3s ease,
      border-radius 0.3s ease,
      box-shadow 0.3s ease-out;
    appearance: none;

    &.neo-loading {
      cursor: wait;
    }

    .neo-icon,
    .neo-content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
    }

    .neo-content {
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      transition:
        color 0.15s ease,
        scale 0.3s ease;
      will-change: scale, color;
      scale: 1;

      .neo-icon:not(.neo-only) {
        margin-right: var(--neo-btn-icon-gap, 0.3125rem);
        margin-left: var(--neo-btn-icon-offset, calc(0% - var(--neo-btn-icon-gap, 0.3125rem)));
      }

      &.neo-reverse {
        flex-direction: row-reverse;

        .neo-icon:not(.neo-only) {
          margin-right: var(--neo-btn-icon-offset, calc(0% - var(--neo-btn-icon-gap, 0.3125rem)));
          margin-left: var(--neo-btn-icon-gap, 0.3125rem);
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
      outline-offset: var(--neo-outline-offset-width, -1px);
    }

    &:focus-visible,
    &:hover {
      box-shadow: var(--neo-btn-box-shadow-hover, var(--neo-box-shadow-raised-2));
      transition:
        opacity 0.3s ease,
        color 0.15s ease,
        background-color 0.3s ease,
        border-color 0.3s ease,
        backdrop-filter 0.3s ease,
        border-radius 0.3s ease,
        box-shadow 0.15s ease-out;
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
    &:active:not(.neo-loading, :disabled) {
      box-shadow: var(--neo-btn-box-shadow-active, var(--neo-box-shadow-pressed-2));
      transition:
        opacity 0.3s ease,
        color 0.15s ease,
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

    &:is(a):visited:not(:disabled, .neo-pressed, :active:not(.neo-loading, :disabled)) .neo-content {
      color: var(--neo-btn-text-color-visited, var(--neo-text-color-secondary));
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

      &:focus-visible,
      &:hover {
        border-color: var(--neo-btn-border-color-hover, var(--neo-border-color-highlight));
      }
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

        &:focus-visible,
        &:hover {
          border-color: var(--neo-btn-border-color-hover, var(--neo-glass-border-color-flat-highlight));
        }
      }
    }

    &.neo-start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);
      }
    }

    &.neo-filled {
      background-color: var(--neo-btn-bg-color, var(--neo-background-color));
    }

    &.neo-tinted {
      background-color: var(--neo-btn-bg-color, var(--neo-background-color-tinted));
    }

    &:disabled,
    &[disabled]:not([disabled='false']) {
      cursor: not-allowed;

      &:not(.neo-pressed, .neo-readonly) {
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
      padding: var(--neo-btn-padding, 0.3125rem 0.75rem);
      border-radius: var(--neo-btn-border-radius-rounded, var(--neo-border-radius-lg));
    }

    &.neo-empty {
      padding: var(--neo-btn-padding-empty, 0.5rem);

      &.neo-pressed.neo-pressed,
      &:active:not(.neo-loading, :disabled) {
        &.neo-scale .neo-content {
          scale: var(--neo-btn-scale-pressed-empty, var(--neo-btn-scale-pressed, 0.9));
        }
      }
    }

    &.neo-pulse {
      @include mixin.pulse($box-shadow: var(--neo-btn-box-shadow), $box-shadow-reverse: var(--neo-btn-box-shadow-active));
    }

    &.neo-coalesce {
      @include mixin.coalesce($box-shadow: var(--neo-btn-box-shadow), $box-shadow-reverse: var(--neo-btn-box-shadow-active));
    }
  }
</style>
