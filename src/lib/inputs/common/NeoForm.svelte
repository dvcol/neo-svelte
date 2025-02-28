<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';

  import type { NeoFormProps } from '~/inputs/common/neo-form.model.js';

  import NeoFieldSet from '~/inputs/common/NeoFieldSet.svelte';
  import { setNeoFormContext } from '~/inputs/common/neo-form-context.svelte.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    ref = $bindable(),
    id = `neo-form-${getUUID()}`,
    context: ctx = $bindable(),

    // Legend
    legend,
    legendId = legend ? `neo-form-legend-${getUUID()}` : undefined,
    legendProps,
    fieldsetProps,

    // Styles
    borderless,

    // Other props
    ...rest
  }: NeoFormProps = $props();
  /* eslint-enable prefer-const */

  const context = setNeoFormContext(id);

  $effect(() => {
    if (!ref) return;
    ctx = context;
    Object.assign(ref, {
      get context() {
        return context;
      },
    });
  });
</script>

<form bind:this={ref} {id} class:neo-form={true} aria-labelledby={legendId} {...rest}>
  {#if legend !== undefined}
    <NeoFieldSet id={legendId} {legend} {borderless} {legendProps} {...fieldsetProps}>
      {@render children?.(context)}
    </NeoFieldSet>
  {:else}
    {@render children?.(context)}
  {/if}
</form>
