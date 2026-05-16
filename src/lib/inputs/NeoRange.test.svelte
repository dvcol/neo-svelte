<script lang="ts">
  import type { NeoRangeProps } from '~/inputs/neo-range.model.js';

  import NeoRange from '~/inputs/NeoRange.svelte';

  type RangeInstance = ReturnType<typeof NeoRange>;

  type HarnessProps = Partial<NeoRangeProps> & {
    instance?: RangeInstance;
    onInstance?: (instance: RangeInstance | undefined) => void;
  };

  let {
    ref = $bindable<HTMLElement | undefined>(undefined),
    value = $bindable<NeoRangeProps['value']>(0),
    instance = $bindable<RangeInstance | undefined>(undefined),
    onInstance,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoRange bind:this={instance} bind:ref bind:value {...(rest as NeoRangeProps)} />
