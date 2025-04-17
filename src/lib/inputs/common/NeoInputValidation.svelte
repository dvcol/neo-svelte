<script lang="ts" generics="T extends HTMLElement, V extends any">
  import type { NeoInputValidationProps } from '~/inputs/common/neo-input-validation.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';
  import { untrack } from 'svelte';

  import { getNeoFormContext } from '~/form/neo-form-context.svelte.js';
  import NeoValidation from '~/inputs/common/NeoValidation.svelte';

  let {
    // Snippets
    children,
    error,
    message,

    // States
    ref = $bindable(),
    visible = $bindable(false),

    valid,
    validation,
    validationMessage,

    input,
    register,

    // Other props
    messageProps,
    messageId = $bindable(messageProps?.id ?? `neo-validation-message-${getUUID()}`),
    ...rest
  }: NeoInputValidationProps<T, V> = $props();

  const errorMessage = $derived.by(() => {
    if (!validation || validation === 'success' || valid !== false) return;
    return error ?? validationMessage;
  });

  const disabled = $derived(!validation && !(message || errorMessage));

  $effect(() => {
    visible = !disabled;
  });

  const form = getNeoFormContext();
  $effect.pre(() => {
    if (!form || !input?.id || register === false) return;
    untrack(() => form.register({ ...input, error: errorMessage, message }));
    return () => form?.remove(input.id);
  });
</script>

<NeoValidation bind:ref bind:messageId {disabled} error={errorMessage} {message} {messageProps} {children} {...rest} />
