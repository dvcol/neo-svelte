<script lang="ts">
  import { width } from '@dvcol/svelte-utils/transition';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import { emptyFn } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    icon,

    // States
    loading,
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
    in: inFn,
    inProps,
    out: outFn,
    outProps,
    transition: transitionFn,
    transitionProps,

    // Other props
    ...rest
  }: NeoButtonProps = $props();
  /* eslint-enable prefer-const */

  let enter = $state(false);
  let active = $state(false);
  const pressed = $derived(enter || active || checked);
  const empty = $derived(only || !children);

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

  const _inFn = $derived(inFn ?? transitionFn ?? emptyFn);
  const _outFn = $derived(outFn ?? transitionFn ?? emptyFn);
</script>

<button
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
  class:rounded
  class:empty
  out:_outFn={outProps ?? transitionProps}
  in:_inFn={inProps ?? transitionProps}
  onkeydown={onKeydownEnter}
  onkeyup={onKeyUpEnter}
  onclick={onClick}
  disabled={disabled || skeleton}
  {...rest}
>
  <span class="content" class:reverse>
    {#if loading || icon}
      <span class="icon" class:only={empty} transition:width={{ duration: 200 }}>
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
</button>

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
    background-color: var(--neo-btn-bg-color, var(--background-color));
    border: 1px var(--neo-btn-border-color, transparent) solid;
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
    &.text {
      --coalesce-box-shadow: var(--box-shadow-raised-1);
      --pulse-box-shadow: var(--box-shadow-raised-1);
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

    &:focus-visible {
      color: var(--neo-btn-text-color-focused, var(--text-color-focused));
      outline: none;
      box-shadow: var(--box-shadow-raised-1);

      &.flat:not(:active, :hover, &.pressed) {
        border-color: var(--neo-btn-border-color-focused, var(--border-color-focused));
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

      &:focus-visible {
        color: var(--neo-btn-text-color-focused-active, var(--text-color-focused-active));
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

      &:not(.text, .glass, .flat:hover, .flat:focus-visible) {
        border-color: var(--neo-btn-border-color-hover, var(--border-color));
      }
    }

    &.text.loading:active:not(.pressed),
    &.flat.loading:active:not(.pressed),
    &.text:hover:not(:active, &.pressed),
    &.flat:hover:not(:active, &.pressed) {
      box-shadow: var(--box-shadow-inset-1);
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
