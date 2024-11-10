<script lang="ts">
  import { width } from '@dvcol/svelte-utils/transition';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    icon,

    // States
    href,
    loading,
    loadingMode = 'spinner',
    skeleton,
    disabled,
    empty: only,
    toggle,
    readonly,
    checked = $bindable(false),

    // Styles
    class: classNames,
    start,
    text,
    flat,
    glass,
    shallow,
    rounded,
    reverse,
    coalesce,
    pulse,

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

  const rotate = $derived(['border', 'both'].includes(loadingMode) && loading);
  const spinner = $derived(['spinner', 'both'].includes(loadingMode) && loading);

  let timeout: ReturnType<typeof setTimeout>;
  const onActive = () => {
    clearTimeout(timeout);
    active = true;
    timeout = setTimeout(() => {
      active = false;
    }, 150);
  };

  const onClick = (e: MouseEvent) => {
    if (loading) return;
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
    if (loading) return;
    if (e.key === 'Enter') enter = true;
    onkeydown?.(e);
  };

  const onKeyUpEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') enter = false;
    if (loading) return;
    onkeyup?.(e);
  };

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  {href}
  role={href ? 'link' : undefined}
  tabindex={href && !disabled ? 0 : undefined}
  class={['neo-button', classNames].filter(Boolean).join(' ')}
  class:pulse
  class:coalesce
  class:pressed
  class:loading
  class:skeleton
  class:start
  class:glass
  class:text
  class:flat
  class:shallow
  class:rounded
  class:rotate
  class:empty
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
    {#if spinner || icon}
      <span class="icon" class:only={empty} transition:width={{ duration: 200 }}>
        {#if spinner}
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
    min-height: calc(var(--neo-btn-min-height, var(--line-height)) + 0.5rem);
    margin: 0.25rem;
    padding: 0.25rem 0.75rem;
    color: var(--neo-btn-text-color, inherit);
    text-decoration: inherit;
    background-color: var(--neo-btn-bg-color, transparent);
    border: var(--border-width, 1px) var(--neo-btn-border-color, transparent) solid;
    border-radius: var(--neo-btn-border-radius, var(--border-radius));
    box-shadow: var(--box-shadow-raised-2);
    cursor: pointer;
    transition:
      opacity 0.3s ease,
      color 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      backdrop-filter 0.3s ease,
      box-shadow 0.3s ease-out;

    &.empty {
      padding: 0.5rem;
    }

    &.loading {
      cursor: wait;
    }

    &.text {
      border-color: transparent;
    }

    &.flat,
    &.text,
    &.shallow {
      --coalesce-box-shadow: var(--box-shadow-raised-1);
      --pulse-box-shadow: var(--box-shadow-raised-1);
    }

    &.shallow {
      --coalesce-box-shadow-reverse: var(--box-shadow-inset-0);
      --pulse-box-shadow-reverse: var(--box-shadow-inset-0);
    }

    &.glass {
      background-color: var(--glass-background-color);
      box-shadow: var(--glass-box-shadow-raised-2);
      backdrop-filter: var(--blur-4);

      &:focus-visible {
        background-color: var(--glass-background-color-focus);
        box-shadow: var(--glass-box-shadow-raised-1);
      }

      &.pressed,
      &:active {
        box-shadow: var(--glass-box-shadow-inset-1);
        backdrop-filter: var(--blur-2);

        &.shallow {
          box-shadow: var(--glass-box-shadow-flat);
        }
      }

      &:not(:hover, :active, &.pressed, &.skeleton) {
        border-top-color: var(--glass-border-color);
        border-left-color: var(--glass-border-color);
      }

      &.loading:active:not(.pressed),
      &:hover:not(:active, &.pressed) {
        background-color: var(--glass-background-color-hover);
        border-color: var(--neo-btn-border-color-hover, var(--glass-border-color-hover));
        box-shadow: var(--box-shadow-flat);
        backdrop-filter: var(--blur-3);

        &.shallow {
          border-color: transparent;
          box-shadow: var(--glass-box-shadow-raised-1);
        }
      }
    }

    &[disabled]:not([disabled='false'], .skeleton) {
      color: var(--neo-btn-text-color-disabled, var(--text-color-disabled)) !important;
      cursor: not-allowed;
      opacity: var(--neo-btn-opacity-disabled, var(--opacity-disabled));

      &:not(.pressed) {
        box-shadow: var(--box-shadow-flat);
      }

      &:not(.text) {
        border-color: var(--neo-btn-border-color-disabled, var(--border-color-disabled)) !important;
      }
    }

    &.pressed,
    &:active {
      color: var(--neo-btn-text-color-active, var(--text-color-active));
      box-shadow: var(--box-shadow-inset-2);
      transition:
        opacity 0.3s ease,
        color 0.3s ease,
        background-color 0.3s ease,
        border-color 0.3s ease,
        backdrop-filter 0.3s ease,
        box-shadow 0.15s ease-out;

      &.shallow {
        box-shadow: var(--box-shadow-flat);

        &.flat,
        &.text {
          box-shadow: var(--box-shadow-inset-1);
        }

        &:not(.text, .flat, .glass, .loading) {
          border-color: var(--neo-btn-border-color, var(--border-color));
        }
      }
    }

    &:focus-visible {
      color: var(--neo-btn-text-color-focused, var(--text-color-focused));
      outline: none;
      box-shadow: var(--box-shadow-raised-1);

      &.pressed,
      &:active {
        color: var(--neo-btn-text-color-focused-active, var(--text-color-focused-active));
      }

      &.flat:not(:active, :hover, &.pressed) {
        border-color: var(--neo-btn-border-color-focused, var(--border-color-focused));
      }
    }

    &.start {
      @starting-style {
        box-shadow: var(--box-shadow-flat);

        &:not(.text, .glass) {
          border-color: var(--neo-btn-border-color, var(--border-color));
        }
      }
    }

    &.text:not(:active, &.pressed),
    &.flat:not(:active, &.pressed),
    &.loading:active:not(.pressed),
    &:hover:not(:active, &.pressed) {
      box-shadow: var(--box-shadow-flat);

      &:not(.text, .glass, .flat:hover, .flat:focus-visible, .shallow:not(.flat)) {
        border-color: var(--neo-btn-border-color-hover, var(--border-color));
      }

      &.shallow:not(.text, .flat, .glass) {
        box-shadow: var(--box-shadow-raised-1);
      }
    }

    &.text.loading:active:not(.pressed),
    &.flat.loading:active:not(.pressed),
    &.text:hover:not(:active, &.pressed),
    &.flat:hover:not(:active, &.pressed) {
      box-shadow: var(--box-shadow-inset-1);

      &.shallow {
        box-shadow: var(--box-shadow-inset-0);
      }
    }

    &.skeleton {
      box-shadow: var(--box-shadow-flat) !important;
      pointer-events: none;

      @include mixin.skeleton;

      &.glass {
        --skeleton-color: var(--glass-skeleton-color);
      }
    }

    &.rounded {
      border-radius: var(--neo-btn-border-radius-rounded, var(--border-radius-lg));
    }

    &.pulse {
      @include mixin.pulse;
    }

    &.coalesce {
      @include mixin.coalesce;
    }

    &.rotate {
      @include mixin.border-rotate;
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
