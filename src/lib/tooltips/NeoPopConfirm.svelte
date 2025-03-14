<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  import type { NeoPopConfirmProps } from '~/tooltips/neo-pop-confirm.model.js';
  import type { NeoTooltipContext, NeoTooltipToggle } from '~/tooltips/neo-tooltip.model.js';

  import NeoArrowButton from '~/buttons/NeoArrowButton.svelte';
  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconCancel from '~/icons/IconCancel.svelte';
  import IconClose from '~/icons/IconClose.svelte';
  import NeoTooltip from '~/tooltips/NeoTooltip.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children: trigger,
    tooltip: content,
    header,

    // States
    tag = 'div',
    loading = $bindable({
      cancel: false,
      confirm: false,
    }),
    disabled = $bindable({
      cancel: false,
      confirm: false,
    }),

    // Tooltip Props
    tooltipRef = $bindable(),
    triggerRef = $bindable(),
    open = $bindable(false),
    target,
    openDelay,
    hoverDelay,
    openOnFocus,
    openOnHover,
    closable = true,

    // Styles
    rounded = false,
    color,
    filled,
    tinted,
    elevation,
    flex,
    width,
    height,

    // Events
    onOpen,
    onClose,
    onCancel,
    onConfirm,

    // Other Props
    tooltipProps,
    controlsProps,
    headerProps,
    contentProps,
    closeProps,
    cancelProps,
    confirmProps,
    ...rest
  }: NeoPopConfirmProps = $props();
  /* eslint-enable prefer-const */

  const { tag: headerTag = 'h6', ...headerRest } = $derived(headerProps ?? {});
  const { tag: controlsTag = 'div', ...controlsRest } = $derived(controlsProps ?? {});
  const { tag: contentTag = 'div', ...contentRest } = $derived(contentProps ?? {});

  const onCloseButton: MouseEventHandler<HTMLButtonElement> = e => {
    open = false;
    closeProps?.onclick?.(e);
  };

  const handlePromise = async (result: unknown, button: 'cancel' | 'confirm') => {
    if (!(result instanceof Promise)) return;
    try {
      loading[button] = true;
      await result;
    } finally {
      loading[button] = false;
    }
  };

  const onCancelButton: MouseEventHandler<HTMLButtonElement> = async e => {
    cancelProps?.onclick?.(e);
    await handlePromise(onCancel?.(e), 'cancel');
    open = false;
  };

  const onConfirmButton: MouseEventHandler<HTMLButtonElement> = async e => {
    confirmProps?.onclick?.(e);
    await handlePromise(onConfirm?.(e), 'confirm');
    open = false;
  };
</script>

{#snippet iconClose()}
  <IconClose size="0.9375rem" />
{/snippet}

{#snippet closeButton()}
  <div class="neo-pop-confirm-close">
    <NeoButton
      rounded
      text
      class="neo-pop-confirm-control-close-button"
      aria-label="Close confirmation tooltip"
      title="Close"
      icon={iconClose}
      {...closeProps}
      onclick={onCloseButton}
    />
  </div>
{/snippet}

{#snippet iconCancel()}
  <IconCancel />
{/snippet}

{#snippet tooltip(floating: NeoTooltipContext, toggle: NeoTooltipToggle)}
  <svelte:element this={tag} class="neo-pop-confirm" class:neo-rounded={rounded} {...rest}>
    {#if header}
      <div class="neo-pop-confirm-header">
        <svelte:element this={headerTag} class="neo-pop-confirm-title" {...headerRest}>
          {#if typeof header === 'function'}
            {@render header?.(floating, toggle)}
          {:else}
            {header}
          {/if}
        </svelte:element>
        {#if closable}
          {@render closeButton()}
        {/if}
      </div>
    {/if}

    <svelte:element this={contentTag} class:neo-pop-confirm-content={true} {...contentRest}>
      {#if !header && closable}
        <div class="neo-pop-confirm-content-close">
          {@render closeButton()}
        </div>
      {/if}
      {#if typeof content === 'function'}
        {@render content?.(floating, toggle)}
      {:else}
        {content}
      {/if}
    </svelte:element>

    <svelte:element this={controlsTag} class:neo-pop-confirm-control={true} {...controlsRest}>
      <NeoButton
        {rounded}
        loading={loading.cancel}
        checked={loading.cancel}
        disabled={typeof disabled === 'object' ? disabled.cancel : disabled}
        elevation="0"
        label="Cancel"
        color="error"
        class="neo-pop-confirm-control-cancel-button"
        aria-label="Cancel confirmation tooltip"
        title="Confirm"
        icon={iconCancel}
        {...cancelProps}
        onclick={onCancelButton}
      />
      <NeoArrowButton
        {rounded}
        loading={loading.confirm}
        checked={loading.confirm}
        disabled={typeof disabled === 'object' ? disabled.confirm : disabled}
        elevation="0"
        label="Confirm"
        color="success"
        reverse
        class="neo-pop-confirm-control-success-button"
        aria-label="Confirm confirmation tooltip"
        title="Close"
        direction="right"
        {...confirmProps}
        onclick={onConfirmButton}
      />
    </svelte:element>
  </svelte:element>
{/snippet}

<NeoTooltip
  bind:ref={tooltipRef}
  bind:triggerRef
  bind:open
  keepOpenOnFocus
  closeOnDismiss={closable}
  {tooltip}
  {target}
  {rounded}
  {flex}
  {width}
  {height}
  {color}
  {filled}
  {tinted}
  {elevation}
  {openDelay}
  {hoverDelay}
  {openOnFocus}
  {openOnHover}
  {onOpen}
  {onClose}
  {...tooltipProps}
>
  {#snippet children(floating: NeoTooltipContext, toggle: NeoTooltipToggle)}
    {@render trigger?.(floating, toggle)}
  {/snippet}
</NeoTooltip>

<style lang="scss">
  .neo-pop-confirm {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    padding: var(--neo-pop-confirm-padding, var(--neo-gap-xxs));

    &-content {
      flex: 1 1 auto;

      &:has(> .neo-pop-confirm-content-close) {
        margin-top: 0.75rem;
      }

      &-close {
        float: right;
        margin-top: -0.875rem;
      }
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .neo-pop-confirm-title {
        flex: 1 1 auto;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
      }
    }

    &-close {
      --neo-btn-text-color-hover: var(--neo-close-color-hover, rgb(255 0 0 / 75%));
      --neo-btn-text-color-active: var(--neo-close-color, rgb(255 0 0));
      --neo-btn-padding-empty: 0.375rem;
      --neo-btn-margin: 0;

      opacity: 0.8;
      transition: opacity 0.3s ease;

      :global(> .neo-pop-confirm-control-close-button) {
        align-self: flex-start;
      }
    }

    &-control {
      display: flex;
      gap: var(--neo-gap-sm);
      justify-content: flex-end;
      margin-top: var(--neo-gap-xxs);
      padding: var(--neo-gap-xxs) var(--neo-gap-xs) var(--neo-gap-tiny);
      opacity: 0.8;
      transition: opacity 0.3s ease;

      --neo-btn-margin: 0;
    }

    &:focus-within,
    &:focus,
    &:hover {
      .neo-pop-confirm-control,
      .neo-pop-confirm-close {
        opacity: 1;
      }
    }

    &.neo-rounded {
      .neo-pop-confirm-content-close {
        margin-right: -0.25rem;
      }
    }
  }
</style>
