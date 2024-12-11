<script lang="ts" generics="T extends HTMLElement, V extends any">
  import type { NeoInputValidationProps } from '~/inputs/common/neo-input-validation.model.js';

  import NeoValidation from '~/inputs/common/NeoValidation.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    error,

    // States
    visible = $bindable(false),
    validation,
    validationMessage,

    message,
    valid,

    // Other props
    messageProps,
    messageId = $bindable(messageProps?.id ?? `neo-validation-message-${crypto.randomUUID()}`),
    ...rest
  }: NeoInputValidationProps<T, V> = $props();
  /* eslint-enable prefer-const */

  const errorMessage = $derived.by(() => {
    if (valid !== false) return;
    if (error) return error;
    if (!validation) return;
    return validationMessage;
  });

  const showMessage = $derived(message || errorMessage || error || validation);

  $effect(() => {
    visible = !!showMessage;
  });
</script>

{#if showMessage}
  <NeoValidation bind:messageId error={errorMessage} {message} {messageProps} {children} {...rest} />
{:else}
  {@render children?.({ messageId, message, error })}
{/if}
