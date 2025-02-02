<script lang="ts">
  import { width } from '@dvcol/svelte-utils/transition';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { enterTransitionProps } from '~/utils/transition.utils.js';

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
    skeleton,
    disabled,
    empty: only,
    toggle,
    readonly,
    checked = $bindable(false),

    // Styles
    start,
    color,
    ghost,
    text,
    flat,
    glass,
    rounded,
    inset,
    shallow,
    reverse,
    coalesce,
    pulse,

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
    ...rest
  }: NeoButtonProps = $props();
  /* eslint-enable prefer-const */

  let enter = $state(false);
  let active = $state(false);
  const pressed = $derived(enter || active || checked);
  const empty = $derived(only || (!children && !label));

  let timeout: ReturnType<typeof setTimeout>;
  const onActive = () => {
    clearTimeout(timeout);
    active = true;
    timeout = setTimeout(() => {
      active = false;
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
  class:neo-flat={flat || text || ghost}
  class:neo-ghost={ghost}
  class:neo-borderless={text || ghost}
  class:neo-inset={inset}
  class:neo-shallow={shallow}
  class:neo-rounded={rounded}
  class:neo-empty={empty}
  style:--neo-btn-text-color={getColorVariable(color)}
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
      <span class="neo-icon" class:neo-only={empty} transition:width={enterTransitionProps}>
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
    text-decoration: inherit;
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

    &.neo-empty {
      padding: var(--neo-btn-padding-empty, 0.5rem);
    }

    &.neo-loading {
      cursor: wait;
    }

    &.neo-inset {
      --neo-btn-box-shadow-active: var(--neo-box-shadow-inset-1);
      --neo-btn-box-shadow-focus-active: var(--neo-box-shadow-inset-1);
    }

    &.neo-shallow {
      --neo-btn-box-shadow-active: var(--neo-box-shadow-pressed-1);
      --neo-btn-box-shadow-focus-active: var(--neo-box-shadow-pressed-1);
      --neo-btn-box-shadow-active-flat: var(--neo-box-shadow-inset-2);
      --neo-btn-box-shadow-active-flat-toggle: var(--neo-box-shadow-inset-2);
      --neo-btn-scale-pressed: 1;
    }

    .neo-content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
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
      padding: var(--neo-btn-padding, 0);
      border: none;

      .neo-content {
        justify-content: unset;
        text-align: start;
      }
    }

    &:hover {
      box-shadow: var(--neo-btn-box-shadow-hover, var(--neo-box-shadow-raised-2));
    }

    &:hover .neo-content {
      color: var(--neo-btn-text-color-hover, var(--neo-text-color-hover));
    }

    &:focus-visible .neo-content {
      color: var(--neo-btn-text-color-focused, var(--neo-text-color-focused));
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

      .neo-content {
        scale: var(--neo-btn-scale-pressed, 0.98);
        color: var(--neo-btn-text-color-active, var(--neo-text-color-active));
      }
    }

    &:disabled:disabled .neo-content,
    &[disabled]:not([disabled='false']) .neo-content {
      color: var(--neo-btn-text-color-disabled, var(--neo-text-color-disabled));
      scale: 1;
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--neo-btn-box-shadow-focus, var(--neo-box-shadow-raised-2));
      transition:
        opacity 0.3s ease,
        color 0.3s ease,
        background-color 0.3s ease,
        border-color 0.3s ease,
        backdrop-filter 0.3s ease,
        border-radius 0.3s ease,
        box-shadow 0.15s ease-out;

      &:not(:hover) .neo-content {
        transition:
          color 0s ease,
          scale 0.3s ease;
      }

      &:hover .neo-content {
        color: var(--neo-btn-text-color-focused-hover, var(--neo-text-color-focused));
      }

      &.neo-pressed,
      &:active:not(.neo-loading) {
        box-shadow: var(--neo-btn-box-shadow-focus-active, var(--neo-box-shadow-pressed-2));

        .neo-content {
          color: var(--neo-btn-text-color-focused-active, var(--neo-text-color-focused-active));
        }
      }
    }

    &.neo-borderless {
      border-color: transparent !important;
    }

    &.neo-flat {
      --neo-coalesce-box-shadow: var(--neo-box-shadow-raised-2);
      --neo-pulse-box-shadow: var(--neo-box-shadow-raised-2);

      margin: var(--neo-btn-margin, 0);
      border-color: var(--neo-btn-border-color, var(--neo-border-color));
      box-shadow: var(--neo-box-shadow-flat);

      &:focus-visible,
      &:hover {
        border-color: transparent;
        box-shadow: var(--neo-btn-box-shadow-hover-flat, var(--neo-box-shadow-inset-1));
      }

      &.neo-pressed,
      &:active:not(.neo-loading) {
        border-color: transparent;
        box-shadow: var(--neo-btn-box-shadow-active-flat, var(--neo-box-shadow-inset-3));

        &.neo-toggle {
          box-shadow: var(--neo-btn-box-shadow-active-flat-toggle, var(--neo-box-shadow-inset-3));
        }
      }
    }

    &.neo-glass {
      @include mixin.glass;

      background-color: var(--neo-btn-bg-color, var(--neo-glass-background-color));
      border-color: var(
        --neo-btn-border-color,
        var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color) var(--neo-glass-left-border-color)
      );
      backdrop-filter: var(--neo-btn-backdrop-filter, var(--neo-blur-2) var(--neo-saturate-3));

      &:focus-visible {
        background-color: var(--neo-btn-bg-color, var(--neo-glass-background-color-focus));
        backdrop-filter: var(--neo-btn-backdrop-filter-focus, var(--neo-blur-1) var(--neo-saturate-3));
      }

      &:hover {
        background-color: var(--neo-btn-bg-color, var(--neo-glass-background-color-hover));
        backdrop-filter: var(--neo-btn-backdrop-filter-hover, var(--neo-blur-1) var(--neo-saturate-2));
      }

      &.neo-pressed,
      &:active:not(.neo-loading) {
        backdrop-filter: var(--neo-btn-backdrop-filter-active, var(--neo-blur-0) var(--neo-saturate-2));
      }

      &:disabled,
      &[disabled]:not([disabled='false']) {
        backdrop-filter: var(--neo-btn-backdrop-filter-disabled, var(--neo-blur-1));
      }

      &.neo-inset {
        &:hover:not(&.neo-pressed, &:active:not(.neo-loading), &:disabled, &[disabled]:not([disabled='false'])) {
          border-color: var(--neo-btn-border-color-hover, var(--neo-glass-border-color-hover));
          box-shadow: var(--neo-box-shadow-flat);
        }

        &.neo-pressed,
        &:active:not(.neo-loading) {
          border-color: transparent;
        }
      }

      &.neo-flat:not(.neo-pressed, :active:not(.neo-loading)) {
        border-color: var(--neo-btn-border-color, var(--neo-glass-border-color-flat));

        &:hover {
          border-color: transparent;
        }
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
