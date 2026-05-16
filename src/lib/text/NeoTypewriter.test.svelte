<script lang="ts">
  import type { NeoTypewriterProps } from '~/text/neo-typewriter.model.js';

  import NeoTypewriter from '~/text/NeoTypewriter.svelte';

  type TypewriterInstance = ReturnType<typeof NeoTypewriter>;

  type HarnessProps = Partial<NeoTypewriterProps> & {
    instance?: TypewriterInstance;
    onInstance?: (instance: TypewriterInstance | undefined) => void;
  };

  let {
    ref = $bindable<HTMLDivElement | undefined>(undefined),
    instance = $bindable<TypewriterInstance | undefined>(undefined),
    onInstance,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoTypewriter bind:this={instance} bind:ref {...rest} />
