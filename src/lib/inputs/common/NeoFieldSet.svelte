<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';

  import type { NeoFieldsetProps } from '~/inputs/common/neo-fieldset.model.js';

  const {
    // Snippets
    children,
    legend,

    // state
    id = legend ? `neo-form-legend-${getUUID()}` : undefined,

    // Styles
    borderless,

    // Other props
    legendProps,
    ...rest
  }: NeoFieldsetProps = $props();
</script>

<fieldset class:neo-fieldset={true} class:neo-borderless={borderless} {...rest}>
  {#if legend !== undefined}
    <legend class:neo-fieldset-legend={true} {id} {...legendProps}>
      {#if typeof legend === 'function'}
        {@render legend()}
      {:else}
        {legend}
      {/if}
    </legend>

    {@render children?.()}
  {:else}
    {@render children?.()}
  {/if}
</fieldset>

<style lang="scss">
  .neo-fieldset {
    box-sizing: border-box;
    margin-inline: 0;
    padding-block: var(--neo-gap-sm, 0.75rem);
    padding-inline: var(--neo-gap, 1rem);
    color: var(--neo-fieldset-color, inherit);
    border: var(--neo-border-width, 1px) solid var(--neo-fieldset-border-color, transparent);
    min-inline-size: min-content;
    border-radius: var(--neo-border-radius);
    transition: border-color 0.3s ease;

    &-legend {
      float: inline-start;
      transition: color 0.3s ease;
    }

    &:not(.neo-borderless) {
      border-color: var(--neo-fieldset-border-color, var(--neo-border-color));
    }

    &:hover,
    &:focus-within {
      border-color: var(--neo-fieldset-border-color-hover, var(--neo-border-color-highlight));

      .neo-fieldset-legend {
        color: var(--neo-fieldset-legend-color-hover, var(--neo-text-color-highlight));
      }
    }
  }
</style>
