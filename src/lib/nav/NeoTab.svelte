<script lang="ts">
  import { height, width } from '@dvcol/svelte-utils/transition';

  import { tick, untrack } from 'svelte';

  import type { NeoTabProps } from '~/nav/neo-tab.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconClose from '~/icons/IconClose.svelte';
  import { getTabContext } from '~/nav/neo-tabs-context.svelte.js';
  import { toAction, toActionProps } from '~/utils/action.utils.js';
  import { defaultTransitionDuration, enterTransition } from '~/utils/transition.utils.js';

  const {
    // Snippets
    children,

    // States
    tag = 'div',
    tabId = crypto.randomUUID(),
    value,

    // styles
    close,

    // Events
    onclick,
    onclose,

    // Other props
    tabProps,
    ...rest
  }: NeoTabProps = $props();

  const context = getTabContext();
  const active = $derived(context?.active === tabId);
  const disabled = $derived(rest.disabled || (rest.disabled !== false && context?.disabled));
  const closeable = $derived(close || (close !== false && context?.closeable));
  const transition = $derived(context?.vertical ? height : width);
  const slide = $derived(context?.slide);

  const onClick: NeoTabProps['onclick'] = (e: MouseEvent) => {
    context?.onChange(tabId);
    onclick?.(e);
  };

  let skip = $state(true);
  // Skip enter transition on first render if closeable
  const waitForTick = async () => {
    await tick();
    skip = false;
  };

  let ref: HTMLDivElement | undefined;
  $effect(() => {
    waitForTick();
    if (!ref) return;
    untrack(() => context?.register(tabId, ref!, value));
    return () => context?.remove(tabId);
  });

  const onClose = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onclose?.(tabId, value, ref);
    context?.onClose(tabId, value, ref);
  };

  const useFn = $derived(toAction(tabProps?.use));
  const useProps = $derived(toActionProps(tabProps?.use));
</script>

<svelte:element
  this={tag}
  bind:this={ref}
  class="neo-tab"
  data-tab-id={tabId}
  data-active={active}
  class:active
  class:slide
  transition:transition={enterTransition}
  {...tabProps}
  use:useFn={useProps}
>
  <NeoButton role="tab" toggle readonly checked={active} onclick={onClick} empty={!children} {...rest} {disabled}>
    {@render children?.({ active, tabId, value })}
    {#if closeable}
      <button
        class="neo-tab-close"
        class:reverse={rest.reverse}
        class:disabled
        transition:width={{ duration: skip ? 0 : defaultTransitionDuration }}
        onclick={onClose}
      >
        <IconClose class="icon-close" />
      </button>
    {/if}
  </NeoButton>
</svelte:element>

<style lang="scss">
  .neo-tab {
    :global(.neo-button:active),
    :global(.neo-button.pressed),
    :global(.neo-button:focus-visible),
    :global(.neo-button:hover) {
      :global(.icon-close) {
        opacity: 1;
        pointer-events: auto;
      }
    }

    &.slide {
      :global(.neo-button:active .icon-close),
      :global(.neo-button.pressed .icon-close) {
        transition-delay: 0.3s;
      }
    }
  }

  .neo-tab-close {
    width: calc(1rem + var(--neo-tab-icon-gap, 0.3rem) + var(--neo-tab-icon-gap-offset, -0.2rem));
    padding: 0;
    color: inherit;
    font: inherit;
    background: none;
    border: none;
    outline: inherit;
    cursor: pointer;

    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
    }

    :global(.icon-close) {
      margin-right: var(--neo-tab-icon-gap-offset, -0.2rem);
      margin-left: var(--neo-tab-icon-gap, 0.3rem);
      padding: 0.1rem;
      border-radius: 50%;
      opacity: 0;
      transition:
        opacity 0.2s ease-in,
        color 0.5s ease,
        background-color 0.5s ease;
      pointer-events: none;
    }

    &:focus-visible :global(.icon-close) {
      color: rgb(255 0 0 / 75%);
      background-color: rgb(255 0 0 / 5%);
      opacity: 1;
    }

    &:hover :global(.icon-close) {
      color: red;
      background-color: rgb(255 0 0 / 10%);
      visibility: visible;
    }

    &.reverse :global(.icon-close) {
      margin-right: var(--neo-tab-icon-gap, 0.3rem);
      margin-left: var(--neo-tab-icon-gap-offset, -0.2rem);
    }
  }
</style>
