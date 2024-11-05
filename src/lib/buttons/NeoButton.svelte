<script lang="ts">
  import { width } from '@dvcol/svelte-utils/transition';

  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';

  const {
    // Snippets
    children,
    icon,
    // States
    loading,
    skeleton, // todo
    // Styles
    class: classNames,
    text,
    flat,
    glass, // todo
    rounded,
    reverse,
    coalesce,
    pulse,
    // Events
    onclick,
    onkeydown,
    onkeyup,
    // other button props
    ...rest
  }: {
    // Snippets
    children: Snippet;
    icon?: Snippet;
    // States
    loading?: boolean;
    skeleton?: boolean;
    // Styles
    text?: boolean;
    flat?: boolean;
    glass?: boolean;
    rounded?: boolean;
    reverse?: boolean;
    coalesce?: boolean;
    pulse?: boolean;
    // Events
    onclick?: (e: MouseEvent | KeyboardEvent) => unknown;
    onkeydown?: (e: KeyboardEvent) => unknown;
    onkeyup?: (e: KeyboardEvent) => unknown;
  } & Partial<Omit<HTMLButtonAttributes, 'onclick' | 'onkeydown' | 'onkeyup'>> = $props();

  let enter = $state(false);
  let active = $state(false);
  const pressed = $derived(enter || active);

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
    }, 100);
  };

  const onClick = (e: MouseEvent) => {
    if (loading) return;
    onclick?.(e);
    onActive();
  };
</script>

<button
  class={['neo-button', classNames].filter(Boolean).join(' ')}
  class:pulse
  class:coalesce
  class:pressed
  class:loading
  class:text
  class:flat
  class:rounded
  onkeydown={onKeydownEnter}
  onkeyup={onKeyUpEnter}
  onclick={onClick}
  {...rest}
>
  <span class="content" class:reverse>
    {#if loading || icon}
      <span class="icon" transition:width={{ duration: 200 }}>
        {#if loading}
          <IconCircleLoading />
        {:else}
          {@render icon?.()}
        {/if}
      </span>
    {/if}
    {@render children?.()}
  </span>
</button>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;
  @use 'src/lib/styles/common/flex' as flex;

  .neo-button {
    position: relative;
    display: flex;
    box-sizing: border-box;
    margin: 0.25rem;
    padding: 0.25rem 0.5rem;
    color: var(--neo-btn-text-color, inherit);
    background-color: var(--neo-btn-bg-color, inherit);
    border: 1px var(--neo-btn-border-color, transparent) solid;
    border-radius: var(--neo-btn-border-radius, var(--border-radius));
    box-shadow: var(--box-shadow-raised-2);
    cursor: pointer;
    transition:
      opacity 0.4s ease,
      color 0.4s ease,
      background-color 0.4s ease,
      border-color 0.4s ease,
      box-shadow 0.2s ease-in;

    &:focus-visible {
      color: var(--neo-btn-text-color-focused, var(--text-color-focused));
      outline: none;
      box-shadow: var(--box-shadow-raised-1);
    }

    &.pressed,
    &:active {
      box-shadow: var(--box-shadow-inset-2);
      transition: all 0.1s ease-out;
    }

    &.loading {
      cursor: wait;
    }

    &.text {
      border: none;
    }

    &.flat,
    &.text {
      --coalesce-box-shadow: var(--box-shadow-raised-1);
      --pulse-box-shadow: var(--box-shadow-raised-1);
    }

    &.text:hover,
    &.flat:hover {
      color: var(--neo-btn-text-color-hover, var(--text-color-hover));
    }

    &.text:not(:active, &.pressed),
    &.flat:not(:active, &.pressed),
    &.loading:active,
    &:hover:not(:active, &.pressed) {
      border-color: var(--neo-btn-border-color-hover, var(--border-color));
      box-shadow: var(--box-shadow-flat);
    }

    &.flat {
      &:focus-visible:not(:active, &.pressed) {
        border-color: var(--neo-btn-border-color-focused, var(--border-color-focused));
      }

      &.loading:active,
      &:hover:not(:active, &.pressed) {
        border-color: var(--neo-btn-border-color-hover, var(--border-color-hover));
      }
    }

    &[disabled]:not([disabled='false']) {
      color: var(--neo-btn-text-color-disabled, var(--text-color-disabled)) !important;
      border-color: var(--neo-btn-border-color-disabled, var(--border-color-disabled)) !important;
      box-shadow: var(--box-shadow-flat);
      cursor: not-allowed;
      opacity: var(--neo-btn-opacity-disabled, var(--opacity-disabled));
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
      gap: var(--neo-btn-icon-gap, 0.35rem);
      height: 100%;

      &.reverse {
        flex-direction: row-reverse;
      }
    }

    &.rounded {
      border-radius: var(--neo-btn-border-radius-rounded, var(--border-radius-lg));
    }
  }
</style>
