<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';

  import type { MouseEventHandler } from 'svelte/elements';
  import type { NeoConfirmProps } from '~/floating/common/neo-confirm.model.js';

  import NeoArrowButton from '~/buttons/NeoArrowButton.svelte';
  import NeoCancelButton from '~/buttons/NeoCancelButton.svelte';
  import NeoCloseButton from '~/buttons/NeoCloseButton.svelte';
  import { Colors } from '~/utils/colors.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    header,

    // States
    id = `neo-floating-confirm-${getUUID()}`,
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

  const onCloseButton: MouseEventHandler<HTMLButtonElement> = e => {
    closeProps?.onclick?.(e);
    onClose?.(e);
  };

  const onCancelButton: MouseEventHandler<HTMLButtonElement> = e => {
    cancelProps?.onclick?.(e);
    onCancel?.(e);
  };

  const onConfirmButton: MouseEventHandler<HTMLButtonElement> = e => {
    confirmProps?.onclick?.(e);
    onConfirm?.(e);
  };
</script>

{#snippet closeButton()}
  <div class="neo-confirm-close">
    <NeoCloseButton
      rounded
      text
      aria-label="Close confirmation tooltip"
      title="Close"
      {...buttonProps}
      {...closeProps}
      onclick={onCloseButton}
      class={['neo-confirm-control-close-button', buttonProps?.class, closeProps?.class]}
    />
  </div>
{/snippet}

<svelte:element this={tag} {id} class:neo-confirm={true} class:neo-rounded={rounded} {...rest}>
  {#if header}
    <div class="neo-confirm-header" id={`${id}-header`}>
      <svelte:element this={headerTag} class:neo-confirm-title={true} {...headerRest}>
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

  <svelte:element this={contentTag} id={`${id}-content`} class:neo-confirm-content={true} {...contentRest}>
    {#if !header && closable}
      <div class="neo-confirm-content-close">
        {@render closeButton()}
      </div>
    {/if}
    {@render children?.()}
  </svelte:element>

  <svelte:element this={controlsTag} class:neo-confirm-control={true} {...controlsRest}>
    <NeoCancelButton
      {rounded}
      loading={loading.cancel}
      checked={loading.cancel}
      disabled={typeof disabled === 'object' ? disabled.cancel : disabled}
      elevation="0"
      label="Cancel"
      color={Colors.Error}
      aria-label="Cancel confirmation tooltip"
      title="Confirm"
      {...buttonProps}
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
      color={Colors.Success}
      reverse
      aria-label="Confirm confirmation tooltip"
      title="Close"
      direction="right"
      {...buttonProps}
      {...confirmProps}
      onclick={onConfirmButton}
    />
  </svelte:element>
</svelte:element>

<style lang="scss">
  .neo-confirm {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    margin: var(--neo-confirm-margin, var(--neo-gap-xxs));
    padding: var(--neo-confirm-padding, 0);

    &-content {
      flex: 1 1 auto;

      &:has(> .neo-confirm-content-close) {
        margin-top: 0.75rem;
      }

      &-close {
        float: right;
        margin-top: -0.75rem;
      }
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .neo-confirm-title {
        flex: 1 1 auto;
        margin-top: var(--neo-gap-xxxs);
        margin-bottom: 1rem;
      }
    }

    &-close {
      --neo-btn-padding-empty: var(--neo-gap-xxxs);
      --neo-btn-margin: 0;

      align-self: flex-start;
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
      margin-top: var(--neo-gap-sm);
      margin-bottom: var(--neo-gap-tiny);
      opacity: 0.8;
      transition: opacity 0.3s ease;
      padding-inline: var(--neo-gap-xxxs);

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

      .neo-confirm-control {
        margin-bottom: 0;
      }
    }
  }
</style>
