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

  export const context = setNeoFormContext(id);

  const onReset: FormEventHandler<HTMLFormElement> = (e) => {
    context.validate();
    onreset?.(e);
  };

  const onSubmit: EventHandler<SubmitEvent, HTMLFormElement> = (e) => {
    context.validate();
    onsubmit?.(e);
  };

  $effect(() => {
    if (!ref) return;
    ctx = context;
    Object.assign(ref, {
      get context() {
        return context;
      },
      validate() {
        return context.validate();
      },
    });
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
  .neo-form {
    display: contents;
  }
</style>
