<script lang="ts">
  import { circOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  import type { NeoHandlePlacement, NeoHandleProps } from '~/floating/common/neo-handle.model.js';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import { defaultDuration } from '~/utils/transition.utils.js';

  const {
    // Snippets
    children,
    handle = true,

    // State
    refs = $bindable([]),
    enabled = true,
    placement = 'top',
    position = 'inside',
    axis,

    // Other Props
    dividerProps,
    ...rest
  }: NeoHandleProps = $props();

  const width = $state<number[]>([]);
  const height = $state<number[]>([]);

  $effect(() => {
    if (!refs.length) return;
    refs?.at(0)?.focus();
    console.info('re-focus');
  });
</script>

{#snippet handleButton(_placement: NeoHandlePlacement, index = 0)}
  {#key placement}
    <button
      bind:this={refs[index]}
      bind:offsetWidth={width[index]}
      bind:offsetHeight={height[index]}
      class:neo-handle={true}
      data-placement={_placement}
      data-position={position}
      data-axis={axis}
      aria-label="Drag handle ({_placement})"
      title="Draggable"
      transition:scale={{ duration: defaultDuration, start: 0.8, easing: circOut }}
      style:--neo-handler-offset-width="{width[index]}px"
      style:--neo-handler-offset-height="{height[index]}px"
      {...rest}
    >
      {#if typeof handle === 'function'}
        {@render handle(_placement)}
      {:else if handle !== false}
        <NeoDivider role="presentation" vertical={['right', 'left'].includes(_placement)} {...dividerProps} />
      {/if}

      {@render children?.({ enabled, placement: _placement, axis })}
    </button>
  {/key}
{/snippet}

{#if enabled}
  {#if typeof placement === 'string'}
    {@render handleButton(placement)}
  {:else}
    {#each placement as _placement, index (_placement)}
      {@render handleButton(_placement, index)}
    {/each}
  {/if}
{/if}

<style lang="scss">
  .neo-handle {
    --neo-divider-height: 0.25rem;
    --neo-divider-width: clamp(2rem, 10%, 50%);

    position: absolute;
    display: flex;
    width: var(--neo-handler-width, 100%);
    height: var(--neo-handler-height, fit-content);
    margin: 0;
    padding: var(--neo-handle-padding, var(--neo-gap-xs));
    color: inherit;
    background: none;
    border: none;
    outline: none;
    cursor: move;
    transition: opacity 0.3s ease-in;
    appearance: none;

    :global(> .neo-divider) {
      margin-inline: auto;
    }

    &:focus-visible :global(> .neo-divider) {
      outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
      outline-offset: 1px;
    }

    &[data-axis='x'] {
      cursor: ew-resize;
    }

    &[data-axis='y'] {
      cursor: ns-resize;
    }

    &[data-placement^='right'],
    &[data-placement^='left'] {
      --neo-divider-height: clamp(2rem, 10%, 50%);
      --neo-divider-width: 0.25rem;

      align-items: center;
      justify-content: center;
      width: var(--neo-handler-width, fit-content);
      height: var(--neo-handler-height, 100%);
    }

    &:not([data-position='outside']) {
      inset-inline: 0;
      inset-block: 0;

      &[data-placement^='bottom'] {
        inset-block: auto 0;
      }

      &[data-placement^='right'] {
        inset-inline: auto 0;
      }

      &[data-placement^='left'] {
        inset-inline: 0 auto;
      }
    }

    &[data-position='outside'] {
      $height: calc(0% - var(--neo-border-width, 1px) - var(--neo-handler-offset-height, 1rem));
      $width: calc(0% - var(--neo-border-width, 1px) - var(--neo-handler-offset-width, 1rem));

      inset-inline: 0;
      inset-block: 0;

      &[data-placement^='top'] {
        inset-block: var(--neo-handler-height, $height) auto;
      }

      &[data-placement^='bottom'] {
        inset-block: auto var(--neo-handler-height, $height);
      }

      &[data-placement^='right'] {
        inset-inline: auto var(--neo-handler-width, $width);
      }

      &[data-placement^='left'] {
        inset-inline: var(--neo-handler-width, $width) auto;
      }
    }
  }
</style>
