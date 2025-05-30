<script lang="ts">
  import type { NeoTabProps } from '~/nav/neo-tab.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';
  import { emptyTransition, height, width } from '@dvcol/svelte-utils/transition';
  import { watch } from '@dvcol/svelte-utils/watch';
  import { tick } from 'svelte';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoIconClose from '~/icons/NeoIconClose.svelte';
  import { getTabContext } from '~/nav/neo-tabs-context.svelte.js';
  import { toAction, toActionProps } from '~/utils/action.utils.js';
  import { shortDuration, shortFreezeTransition } from '~/utils/transition.utils.js';

  let {
    // Snippets
    children,

    // States
    ref = $bindable(),
    tag = 'div',
    tabId = `neo-tab-${getUUID()}`,
    value,
    register = true,

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
  const pane = $derived(context?.getPane(tabId)?.toString());
  const active = $derived(context?.active === tabId);
  const disabled = $derived(rest.disabled || (rest.disabled !== false && context?.state?.disabled));
  const closeable = $derived(close || (close !== false && context?.state?.close));
  const transition = $derived.by(() => {
    if (!closeable && !context?.state?.add) return emptyTransition;
    return context?.state?.vertical ? height : width;
  });
  const slide = $derived(context?.state?.slide);

  const onClick: NeoTabProps['onclick'] = (e) => {
    context?.onChange(tabId);
    onclick?.(e);
  };

  let skip = $state(true);
  // Skip enter transition on first render if closeable
  const waitForTick = async () => {
    if (!skip) return;
    await tick();
    skip = false;
  };

  $effect(() => {
    waitForTick();
  });

  watch(
    () => {
      if (!ref || !register) return;
      context?.register(tabId, { ref, value }, register === 'force');
      return () => register && context?.remove(tabId);
    },
    () => [ref, register],
  );

  const onClose = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onclose?.(tabId);
    context?.onClose(tabId);
  };

  const useFn = $derived(toAction(tabProps?.use));
  const useProps = $derived(toActionProps(tabProps?.use));
</script>

{#snippet innerChildren()}
  {@render children?.({ active, tabId, value })}
{/snippet}

<svelte:element
  this={tag}
  bind:this={ref}
  data-tab-id={tabId}
  data-active={active}
  class:neo-tab={true}
  class:neo-active={active}
  class:neo-slide={slide}
  class:neo-close={closeable}
  transition:transition={shortFreezeTransition}
  {...tabProps}
  use:useFn={useProps}
>
  <NeoButton
    id="neo-tab-{String(tabId)}"
    role="tab"
    aria-controls={pane}
    aria-selected={active}
    toggle
    checked={active}
    onclick={onClick}
    {...rest}
    {disabled}
    class={['neo-tab-button', rest.class]}
    children={children ? innerChildren : undefined}
  />
  {#if closeable}
    <button
      type="button"
      class="neo-tab-close"
      aria-label="Close tab"
      class:neo-disabled={disabled}
      transition:width={{ duration: skip ? 0 : shortDuration }}
      onclick={onClose}
    >
      <NeoIconClose class="neo-icon-close" size="1rem" />
    </button>
  {/if}
</svelte:element>

<style lang="scss">
  .neo-tab {
    --neo-btn-text-color-hover: var(--neo-tab-text-color-hover, var(--neo-text-color-highlight));
    --neo-btn-text-color-active: var(--neo-tab-text-color-active, var(--neo-text-color-highlight));

    display: flex;
    transition: opacity 0.2s linear;
    transition-delay: 0s;

    &.neo-active,
    &:hover,
    &:focus-within {
      .neo-tab-close :global(> .neo-icon-close) {
        opacity: 1;
        pointer-events: auto;
      }
    }

    :global(.neo-tab-button .neo-icon-close:focus-visible) {
      transition: none;
    }

    &.neo-close :global(> .neo-tab-button) {
      padding-right: 0.25rem;
    }
  }

  .neo-tab-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    margin-right: 0.5rem;
    padding: 0;
    color: inherit;
    font: inherit;
    background: none;
    border: none;
    outline: inherit;
    cursor: pointer;

    &.neo-disabled {
      cursor: not-allowed;
      pointer-events: none;
    }

    :global(> .neo-icon-close) {
      margin-bottom: 0.0625rem;
      padding: 0.1rem;
      border-radius: 50%;
      opacity: 0;
      transition:
        opacity 0.2s ease-in,
        color 0.3s ease,
        background-color 0.3s ease;
      pointer-events: none;
    }

    &:focus-visible :global(> .neo-icon-close) {
      color: var(--neo-close-color-focused, rgb(255 0 0 / 75%));
      background-color: var(--neo-close-bg-color-focused, rgb(255 0 0 / 5%));
      outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
      opacity: 1;
      transition: none;
    }

    &:hover :global(> .neo-icon-close) {
      color: var(--neo-close-color, rgb(255 0 0));
      background-color: var(--neo-close-bg-color-hover, rgb(255 0 0 / 10%));
      opacity: 1;
    }
  }
</style>
