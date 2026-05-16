<script lang="ts">
  import type { NeoProgressProps } from '~/progress/neo-progress.model.js';

  import NeoProgress from '~/progress/NeoProgress.svelte';

  type ProgressInstance = ReturnType<typeof NeoProgress>;

  type HarnessProps = Partial<NeoProgressProps> & {
    instance?: ProgressInstance;
    onInstance?: (instance: ProgressInstance | undefined) => void;
  };

  let {
    ref = $bindable<HTMLDivElement | undefined>(undefined),
    instance = $bindable<ProgressInstance | undefined>(undefined),
    onInstance,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoProgress bind:this={instance} bind:ref {...rest} />
