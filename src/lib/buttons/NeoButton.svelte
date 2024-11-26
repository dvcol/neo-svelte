<script lang="ts">
  import { width } from '@dvcol/svelte-utils/transition';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { enterDefaultTransition } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
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
    borderless,
    start,
    text,
    flat,
    glass,
    shallow,
    rounded,
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
  const empty = $derived(only || !children);

  let timeout: ReturnType<typeof setTimeout>;
  const onActive = () => {
    clearTimeout(timeout);
    active = true;
    timeout = setTimeout(() => {
      active = false;
    }, 150);
  };

  const onClick = (e: MouseEvent) => {
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

  const onKeydownEnter = (e: KeyboardEvent) => {
    if (loading || disabled) return;
    if (e.key === 'Enter') enter = true;
    onkeydown?.(e);
  };

  const onKeyUpEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') enter = false;
    if (loading || disabled) return;
    onkeyup?.(e);
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
  {href}
  {role}
  {tabindex}
  class:neo-button={true}
  class:pulse
  class:coalesce
  class:pressed
  class:loading
  class:skeleton
  class:start
  class:glass
  class:flat={flat || text}
  class:borderless={borderless || text}
  class:shallow
  class:rounded
  class:empty
  style:justify-content={justify}
  style:align-items={align}
  style:flex
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  onkeydown={onKeydownEnter}
  onkeyup={onKeyUpEnter}
  onclick={onClick}
  disabled={disabled || skeleton}
  {...rest}
>
  <span class="content" class:reverse>
    {#if loading || icon}
      <span class="icon" class:only={empty} transition:width={enterDefaultTransition}>
        {#if loading}
          <IconCircleLoading />
        {:else}
          {@render icon?.()}
        {/if}
      </span>
    {/if}
    {#if !empty}
      {@render children?.()}
    {/if}
  </span>
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-button {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-height: calc(var(--neo-btn-min-height, var(--neo-line-height)) + 0.5rem);
    margin: var(--neo-shadow-margin, 0.6rem);
    padding: 0.25rem 0.75rem;
    color: var(--neo-btn-text-color, inherit);
    font: inherit;
    text-decoration: inherit;
    background-color: var(--neo-btn-bg-color, transparent);
    border: var(--neo-border-width, 1px) var(--neo-btn-border-color, transparent) solid;
    border-radius: var(--neo-btn-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-box-shadow-raised-3);
    cursor: pointer;
    transition:
      opacity 0.3s ease,
      color 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      backdrop-filter 0.3s ease,
      border-radius 0.3s ease,
      box-shadow 0.3s ease-out;

    &.empty {
      padding: 0.5rem;
    }

    &.loading {
      cursor: wait;
    }

    &.borderless {
      border-color: transparent !important;
    }

    &.flat,
    &.shallow {
      --neo-coalesce-box-shadow: var(--neo-box-shadow-raised-2);
      --neo-pulse-box-shadow: var(--neo-box-shadow-raised-2);
    }

    &.shallow {
      --neo-coalesce-box-shadow-reverse: var(--neo-box-shadow-inset-1);
      --neo-pulse-box-shadow-reverse: var(--neo-box-shadow-inset-1);
    }

    &:hover {
      color: var(--neo-btn-text-color-hover, inherit);
    }

    &.glass {
      background-color: var(--neo-btn-bg-color, var(--neo-glass-background-color));
      box-shadow: var(--neo-glass-box-shadow-raised-3);
      backdrop-filter: var(--neo-blur-2) var(--neo-saturate-3);

      &:focus-visible {
        background-color: var(--neo-glass-background-color-focus);
        box-shadow: var(--neo-glass-box-shadow-raised-2);
        backdrop-filter: var(--neo-blur-1) var(--neo-saturate-3);
      }

      &.pressed,
      &:active {
        box-shadow: var(--neo-glass-box-shadow-inset-3);
        backdrop-filter: var(--neo-blur-0) var(--neo-saturate-2);

        &.shallow {
          box-shadow: var(--neo-glass-box-shadow-flat);
        }
      }

      &:disabled:not(.skeleton),
      &[disabled]:not([disabled='false'], .skeleton) {
        backdrop-filter: var(--neo-blur-1);
      }

      &:not(:hover, :active, &.pressed, &.skeleton) {
        border-color: var(
          --neo-btn-border-color,
          var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
            var(--neo-glass-left-border-color)
        );
      }

      &.loading:active:not(.pressed),
      &:hover:not(:active, &.pressed) {
        background-color: var(--neo-glass-background-color-hover);
        border-color: var(--neo-btn-border-color-hover, var(--neo-glass-border-color-hover));
        box-shadow: var(--neo-box-shadow-flat);
        backdrop-filter: var(--neo-blur-1) var(--neo-saturate-2);

        &.shallow {
          border-color: transparent;
          box-shadow: var(--neo-glass-box-shadow-raised-2);
        }
      }
    }

    &.pressed,
    &:active {
      color: var(--neo-btn-text-color-active, var(--neo-text-color-active));
      box-shadow: var(--neo-box-shadow-inset-3);
      transition:
        opacity 0.3s ease,
        color 0.3s ease,
        background-color 0.3s ease,
        border-color 0.3s ease,
        backdrop-filter 0.3s ease,
        border-radius 0.3s ease,
        box-shadow 0.15s ease-out;

      &.shallow {
        box-shadow: var(--neo-box-shadow-flat);

        &.flat {
          box-shadow: var(--neo-box-shadow-inset-2);
        }

        &:not(.flat, .glass, .loading) {
          border-color: var(--neo-btn-border-color, var(--neo-border-color));
        }
      }
    }

    &:focus-visible {
      color: var(--neo-btn-text-color-focused, var(--neo-text-color-focused));
      outline: none;
      transition:
        opacity 0.3s ease,
        color 0s,
        background-color 0.3s ease,
        border-color 0.3s ease,
        backdrop-filter 0.3s ease,
        border-radius 0.3s ease,
        box-shadow 0.15s ease-out;

      &:hover {
        color: var(--neo-btn-text-color-focused-hover, var(--neo-text-color-focused));
      }

      &.pressed,
      &:active {
        color: var(--neo-btn-text-color-focused-active, var(--neo-text-color-focused-active));
      }

      &:not(.pressed, :active, .glass) {
        box-shadow: var(--neo-box-shadow-raised-2);
      }
    }

    .flat:not(:active, :hover, &.pressed):focus-visible {
      border-color: var(--neo-btn-border-color-focused, var(--neo-border-color-focused));
    }

    &.start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.borderless, .glass) {
          border-color: var(--neo-btn-border-color, var(--neo-border-color));
        }
      }
    }

    &:disabled:not(.skeleton),
    &[disabled]:not([disabled='false'], .skeleton) {
      color: var(--neo-btn-text-color-disabled, var(--neo-text-color-disabled)) !important;
      cursor: not-allowed;
      opacity: var(--neo-btn-opacity-disabled, var(--neo-opacity-disabled));

      &:not(.pressed) {
        box-shadow: var(--neo-box-shadow-flat);
      }

      &:not(.borderless) {
        border-color: var(--neo-btn-border-color-disabled, var(--neo-border-color-disabled)) !important;
      }

      &::after,
      &::before {
        box-shadow: none;
        animation-play-state: paused;
      }
    }

    &.flat:not(:active, &.pressed),
    &.loading:active:not(.pressed),
    &:hover:not(:active, &.pressed) {
      box-shadow: var(--neo-box-shadow-flat);

      &:not(.glass, .borderless, .flat:hover, .flat:focus-visible, .shallow:not(.flat)) {
        border-color: var(--neo-btn-border-color-hover, var(--neo-border-color));
      }

      &.shallow:not(.flat, .glass) {
        box-shadow: var(--neo-box-shadow-raised-2);
      }
    }

    &.flat.loading:active:not(.pressed),
    &.flat:hover:not(:active, &.pressed) {
      box-shadow: var(--neo-box-shadow-inset-2);

      &.shallow {
        box-shadow: var(--neo-box-shadow-inset-1);
      }
    }

    &.skeleton {
      box-shadow: var(--neo-box-shadow-flat) !important;
      pointer-events: none;

      @include mixin.skeleton;

      &.glass {
        --neo-skeleton-color: var(--neo-glass-skeleton-color);
      }
    }

    &.rounded {
      border-radius: var(--neo-btn-border-radius-rounded, var(--neo-border-radius-lg));
    }

    &.pulse {
      @include mixin.pulse;
    }

    &.coalesce {
      @include mixin.coalesce;
    }

    .icon,
    .content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .content {
      height: 100%;

      .icon:not(.only) {
        margin-right: var(--neo-btn-icon-gap, 0.35rem);
        margin-left: var(--neo-btn-icon-offset, calc(0.25rem - var(--neo-btn-icon-gap, 0.35rem)));
      }

      &.reverse {
        flex-direction: row-reverse;

        .icon:not(.only) {
          margin-right: var(--neo-btn-icon-offset, calc(0.25rem - var(--neo-btn-icon-gap, 0.35rem)));
          margin-left: var(--neo-btn-icon-gap, 0.35rem);
        }
      }
    }
  }
</style>
