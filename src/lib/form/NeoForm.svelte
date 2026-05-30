<script lang="ts">
  import type { EventHandler, FormEventHandler } from 'svelte/elements';

  import type { NeoFormProps } from '~/form/neo-form.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';

  import { setNeoFormContext } from '~/form/neo-form-context.svelte.js';
  import NeoFieldSet from '~/form/NeoFieldSet.svelte';

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

    // Events
    onreset,
    onsubmit,

    // Other props
    ...rest
  }: NeoFormProps = $props();

  /** Form context identity is intentionally bound to the initial `id`; consumers cache the reference and a re-init would orphan them. */
  // svelte-ignore state_referenced_locally
  export const context = setNeoFormContext(id);

  export const validate = () => context.validate();

  const onReset: FormEventHandler<HTMLFormElement> = (e) => {
    context.validate();
    onreset?.(e);
  };

  const onSubmit: EventHandler<SubmitEvent, HTMLFormElement> = (e) => {
    context.validate();
    onsubmit?.(e);
  };

  $effect(() => {
    ctx = context;
  });
</script>

<form bind:this={ref} {id} class:neo-form={true} aria-labelledby={legendId} {...rest} onreset={onReset} onsubmit={onSubmit}>
  {#if legend !== undefined}
    <NeoFieldSet id={legendId} {legend} {borderless} {legendProps} {...fieldsetProps}>
      {@render children?.(context)}
    </NeoFieldSet>
  {:else}
    {@render children?.(context)}
  {/if}
</form>

<style lang="scss">
  @use 'src/lib/styles/layers' as layers;

  @include layers.neo-components {
    .neo-form {
      display: contents;
    }

  }
</style>
