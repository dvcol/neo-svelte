<script lang="ts">
  import type { NeoFormProps } from '~/form/neo-form.model.js';

  import NeoForm from '~/form/NeoForm.svelte';

  type FormInstance = ReturnType<typeof NeoForm>;

  interface HarnessProps extends Partial<NeoFormProps> {
    childrenText?: string;
    instance?: FormInstance;
    onInstance?: (instance: FormInstance | undefined) => void;
  }

  let {
    childrenText,
    legend,
    ref = $bindable<HTMLFormElement | undefined>(undefined),
    instance = $bindable<FormInstance | undefined>(undefined),
    onInstance,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoForm bind:this={instance} bind:ref {...rest} {legend}>
  <span data-testid="form-content">{childrenText}</span>
</NeoForm>
