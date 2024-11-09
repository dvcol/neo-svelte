<script lang="ts">
  import { height, width } from '@dvcol/svelte-utils/transition';

  import type { NeoTabProps } from '~/nav/neo-tab.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconClose from '~/icons/IconClose.svelte';
  import { getTabContext } from '~/nav/neo-tabs-context.svelte.js';

  const {
    // Snippets
    children,

    // States
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

  const onClick: NeoTabProps['onclick'] = (e: MouseEvent) => {
    context?.onChange(tabId);
    onclick?.(e);
  };

  $effect(() => {
    context?.register(tabId, value);
    return () => context?.remove(tabId);
  });

  const onClose = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onclose?.(tabId);
    context?.onClose(tabId);
  };
</script>

<div class="neo-tab" transition:transition={{ duration: 200, css: `overflow: hidden; white-space: nowrap` }} {...tabProps}>
  <NeoButton
    role="tab"
    data-tab-id={tabId}
    data-active={active}
    toggle
    readonly
    checked={active}
    onclick={onClick}
    empty={!children}
    {...rest}
    {disabled}
  >
    {@render children?.({ active, tabId, value })}
    {#if closeable}
      <button class="neo-tab-close" class:reverse={rest.reverse} class:disabled transition:width={{ duration: 200 }} onclick={onClose}>
        <IconClose class="icon-close" />
      </button>
    {/if}
  </NeoButton>
</div>

<style lang="scss">
  .neo-tab {
    :global(.neo-button:active),
    :global(.neo-button.pressed),
    :global(.neo-button:focus-visible),
    :global(.neo-button:hover) {
      :global(.icon-close) {
        opacity: 1;
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
    }

    &:focus-visible :global(.icon-close) {
      color: rgb(255 0 0 / 75%);
      background-color: rgb(255 0 0 / 5%);
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
