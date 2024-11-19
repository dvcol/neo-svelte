<script lang="ts">
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import IconMinus from '~/icons/IconMinus.svelte';
  import { DefaultShadowElevation, MaxShadowElevation, MinShadowElevation } from '~/utils/shadow.utils';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    label = 'Elevation',
    reset = DefaultShadowElevation,
    min = MinShadowElevation,
    max = MaxShadowElevation,
    step = 1,
    elevation = $bindable(reset),
    onElevation,
    onReset,
  }: {
    label?: string;
    elevation?: number;
    reset?: number;
    min?: number;
    max?: number;
    step?: number;
    onElevation?: (value: number, current: number) => void;
    onReset?: () => void;
  } = $props();
  /* eslint-enable prefer-const */

  const setElevation = (value: number, current: number = elevation) => {
    elevation += value * step;
    onElevation?.(value * step, current);
  };

  const resetElevation = () => {
    elevation = reset;
    onReset?.();
  };
</script>

<span class="label">{label}</span>
<NeoButtonGroup rounded>
  <NeoButton disabled={elevation <= min} onclick={() => setElevation?.(-1)}>
    {#snippet icon()}
      <IconMinus />
    {/snippet}
  </NeoButton>
  <NeoButton onclick={resetElevation}>{elevation}</NeoButton>
  <NeoButton disabled={elevation >= max} onclick={() => setElevation?.(1)}>
    {#snippet icon()}
      <IconAdd />
    {/snippet}
  </NeoButton>
</NeoButtonGroup>
