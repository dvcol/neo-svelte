<script lang="ts">
  import type { NeoPinProps } from '~/inputs/neo-pin.model.js';

  import NeoPin from '~/inputs/NeoPin.svelte';

  type PinInstance = ReturnType<typeof NeoPin>;

  type HarnessProps = Partial<NeoPinProps> & {
    instance?: PinInstance;
    onInstance?: (instance: PinInstance | undefined) => void;
  };

  let {
    ref = $bindable(),
    value = $bindable(''),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    instance = $bindable<PinInstance | undefined>(undefined),
    onInstance,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoPin
  bind:this={instance}
  bind:ref
  bind:value
  bind:valid
  bind:dirty
  bind:touched
  {...rest}
/>
