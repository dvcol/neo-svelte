<script lang="ts">
  import type { NeoConfirmProps } from '~/floating/common/neo-confirm.model.js';

  import NeoArrowButton from '~/buttons/NeoArrowButton.svelte';
  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconCancel from '~/icons/IconCancel.svelte';
  import IconClose from '~/icons/IconClose.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
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

    // States
    closable = true,

    // Styles
    rounded = false,

    // Events
    onClose,
    onCancel,
    onConfirm,

    // Other Props
    controlsProps,
    headerProps,
    contentProps,
    closeProps,
    cancelProps,
    confirmProps,
    buttonProps,
    ...rest
  }: NeoConfirmProps = $props();
  /* eslint-enable prefer-const */

  const { tag: headerTag = 'h6', ...headerRest } = $derived(headerProps ?? {});
  const { tag: controlsTag = 'div', ...controlsRest } = $derived(controlsProps ?? {});
  const { tag: contentTag = 'div', ...contentRest } = $derived(contentProps ?? {});
</script>

{#snippet iconClose()}
  <IconClose size="0.9375rem" />
{/snippet}

{#snippet closeButton()}
  <div class="neo-confirm-close">
    <NeoButton
      rounded
      text
      class="neo-confirm-control-close-button"
      aria-label="Close confirmation tooltip"
      title="Close"
      icon={iconClose}
      {...buttonProps}
      {...closeProps}
      onclick={onClose}
    />
  </div>
{/snippet}

{#snippet iconCancel()}
  <IconCancel />
{/snippet}

<svelte:element this={tag} class="neo-confirm" class:neo-rounded={rounded} {...rest}>
  {#if header}
    <div class="neo-confirm-header">
      <svelte:element this={headerTag} class="neo-confirm-title" {...headerRest}>
        {#if typeof header === 'function'}
          {@render header?.()}
        {:else}
          {header}
        {/if}
      </svelte:element>
      {#if closable}
        {@render closeButton()}
      {/if}
    </div>
  {/if}

  <svelte:element this={contentTag} class:neo-confirm-content={true} {...contentRest}>
    {#if !header && closable}
      <div class="neo-confirm-content-close">
        {@render closeButton()}
      </div>
    {/if}
    {@render children?.()}
  </svelte:element>

  <svelte:element this={controlsTag} class:neo-confirm-control={true} {...controlsRest}>
    <NeoButton
      {rounded}
      loading={loading.cancel}
      checked={loading.cancel}
      disabled={typeof disabled === 'object' ? disabled.cancel : disabled}
      elevation="0"
      label="Cancel"
      color="error"
      class="neo-confirm-control-cancel-button"
      aria-label="Cancel confirmation tooltip"
      title="Confirm"
      icon={iconCancel}
      {...buttonProps}
      {...cancelProps}
      onclick={onCancel}
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
      class="neo-confirm-control-success-button"
      aria-label="Confirm confirmation tooltip"
      title="Close"
      direction="right"
      {...buttonProps}
      {...confirmProps}
      onclick={onConfirm}
    />
  </svelte:element>
</svelte:element>

<style lang="scss">
  .neo-confirm {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    padding: var(--neo-confirm-padding, var(--neo-gap-xxs));

    &-content {
      flex: 1 1 auto;

      &:has(> .neo-confirm-content-close) {
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

      .neo-confirm-title {
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

      :global(> .neo-confirm-control-close-button) {
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
      .neo-confirm-control,
      .neo-confirm-close {
        opacity: 1;
      }
    }

    &.neo-rounded {
      .neo-confirm-content-close {
        margin-right: -0.25rem;
      }
    }
  }
</style>
