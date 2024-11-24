<script lang="ts">
  import { fade } from 'svelte/transition';

  import type { NeoValidationContext, NeoValidationProps } from '~/input/neo-validation.model.js';

  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { enterDefaultTransition, leaveDefaultTransition } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    message,
    error,

    // States
    tag = 'div',
    context,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    messageProps,
    messageTag = 'div',
    messageId = messageProps?.id ?? `neo-validation-message-${crypto.randomUUID()}`,
    ...rest
  }: NeoValidationProps = $props();
  /* eslint-enable prefer-const */

  const innerContext = $derived<NeoValidationContext>({
    messageId,
    message,
    error,
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));
</script>

<svelte:element this={tag} class:neo-validation-group-wrapper={true} out:outFn={outProps} in:inFn={inProps} {...rest}>
  {@render children?.(innerContext)}
  <div class="neo-validation-message" class:rounded={context?.rounded}>
    {#if error}
      <svelte:element
        this={messageTag}
        id={messageId}
        class:neo-validation-error={true}
        in:fade={enterDefaultTransition}
        out:fade={leaveDefaultTransition}
        {...messageProps}
      >
        {#if typeof error === 'string'}{error}{:else}{@render error(context)}{/if}
      </svelte:element>
    {:else if message}
      <svelte:element
        this={messageTag}
        id={messageId}
        class:neo-validation-description={true}
        in:fade={enterDefaultTransition}
        out:fade={leaveDefaultTransition}
        {...messageProps}
      >
        {#if typeof message === 'string'}{message}{:else}{@render message(context)}{/if}
      </svelte:element>
    {/if}
  </div>
</svelte:element>

<style lang="scss">
  .neo-validation-group-wrapper {
    display: flex;
    flex-direction: column;

    .neo-validation-message {
      min-height: var(--neo-line-height-sm, 1.25rem);
      margin: 0.25rem var(--neo-shadow-margin, 0.6rem) var(--neo-shadow-margin, 0.6rem);
      font-size: var(--neo-font-size-sm, 0.875rem);
      line-height: var(--neo-line-height-xs, 1rem);
      transition:
        color 0.3s ease,
        padding 0.3s ease,
        margin 0.3s ease;

      .neo-validation-error {
        color: var(--neo-validation-error-color, var(--neo-color-error));
      }

      .neo-validation-error,
      .neo-validation-description {
        padding: 0 0.75rem;
      }

      &.rounded {
        margin: 0.25rem var(--neo-shadow-margin-lg, 1.125rem) var(--neo-shadow-margin-lg, 1.125rem);

        .neo-validation-error,
        .neo-validation-description {
          padding: 0 1rem;
        }
      }
    }
  }
</style>
