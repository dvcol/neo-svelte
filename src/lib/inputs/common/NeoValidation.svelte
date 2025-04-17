<script lang="ts" generics="T extends HTMLElement, V extends any">
  import type { NeoValidationContext, NeoValidationProps } from '~/inputs/common/neo-validation.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';
  import { fly } from 'svelte/transition';

  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { toSize } from '~/utils/style.utils.js';
  import { defaultDuration } from '~/utils/transition.utils.js';

  let {
    // Snippets
    children,
    message,
    error,

    // States
    ref = $bindable(),
    tag = 'div',
    context,
    disabled,

    // Size
    flex,
    width: _width,
    height: _height,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    messageProps,
    messageId = $bindable(messageProps?.id ?? `neo-validation-message-${getUUID()}`),
    ...rest
  }: NeoValidationProps<T, V> = $props();

  const { tag: messageTag = 'div', ...messageRest } = $derived(messageProps ?? {});

  const innerContext = $derived<NeoValidationContext<T, V>>({
    disabled,
    messageId,
    message,
    error,
  });

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));
</script>

{#if disabled}
  {@render children?.(innerContext)}
{:else}
  <svelte:element
    this={tag}
    bind:this={ref}
    class:neo-validation-group-wrapper={true}
    style:flex
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    out:outFn={outProps}
    in:inFn={inProps}
    {...rest}
  >
    {@render children?.(innerContext)}
    <div class="neo-validation-message">
      {#if error}
        <svelte:element
          this={messageTag}
          id={messageId}
          class:neo-validation-error={true}
          in:fly={{ duration: defaultDuration, delay: message ? defaultDuration / 2 : 0, y: '-50%' }}
          out:fly={{ duration: defaultDuration, y: message ? '50%' : '-50%' }}
          {...messageRest}
        >
          {#if typeof error === 'function'}
            {@render error(context)}
          {:else}
            {error}
          {/if}
        </svelte:element>
      {:else if message}
        <svelte:element
          this={messageTag}
          id={messageId}
          class:neo-validation-description={true}
          in:fly={{ duration: defaultDuration, delay: defaultDuration / 2, y: '-50%' }}
          out:fly={{ duration: defaultDuration, y: '50%' }}
          {...messageRest}
        >
          {#if typeof message === 'function'}
            {@render message(context)}
          {:else}
            {message}
          {/if}
        </svelte:element>
      {/if}
    </div>
  </svelte:element>
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-validation-group-wrapper {
    display: flex;
    flex-direction: column;

    .neo-validation-message {
      z-index: var(--neo-validation-z-index, var(--neo-z-index-behind, -1));
      min-height: var(--neo-line-height-sm, 1.25rem);
      margin: var(--neo-validation-margin, 0.25rem var(--neo-shadow-margin, 0.625rem) var(--neo-shadow-margin, 0.625rem));
      font-size: var(--neo-font-size-sm, 0.875rem);
      line-height: var(--neo-line-height-xs, 1rem);
      transition:
        color 0.15s ease,
        padding 0.3s ease,
        margin 0.3s ease;

      .neo-validation-error {
        color: var(--neo-validation-error-color, var(--neo-color-error));
      }

      .neo-validation-error,
      .neo-validation-description {
        padding: var(--neo-validation-padding, 0 0.75rem);
      }

      @include mixin.transition-container;
    }
  }
</style>
