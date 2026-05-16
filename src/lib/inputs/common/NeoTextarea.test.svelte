<script lang="ts">
  import type { NeoTextareaProps } from '~/inputs/common/neo-input.model.js';

  import NeoTextarea from '~/inputs/common/NeoTextarea.svelte';

  type TextareaInstance = ReturnType<typeof NeoTextarea>;

  type HarnessProps = Partial<NeoTextareaProps> & {
    instance?: TextareaInstance;
    onInstance?: (instance: TextareaInstance | undefined) => void;
  };

  let {
    ref = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    instance = $bindable<TextareaInstance | undefined>(undefined),
    onInstance,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoTextarea bind:this={instance} bind:ref bind:value bind:valid bind:dirty bind:touched {...rest} />
