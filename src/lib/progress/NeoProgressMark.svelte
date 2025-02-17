<script lang="ts">
  import type { NeoProgressMarkProps } from '~/progress/neo-progress-mark.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import { coerce, type ShadowElevation } from '~/utils/shadow.utils.js';

  const { position = 0, context, elevation: _elevation, color: _color, ...rest }: NeoProgressMarkProps = $props();

  const value = $derived(context?.value ?? 0);
  const color = $derived(_color ?? context?.color);
  const checked = $derived(position <= value);

  const elevation = $derived(Math.max(-1, coerce<ShadowElevation>(_elevation ?? context?.elevation ?? 0)) as ShadowElevation);
  const active = $derived.by(() => {
    if (!elevation) return 0;
    if (elevation < 0) return -2;
    if (elevation > 0) return -1;
  });
</script>

<NeoButton
  rounded
  filled
  hover="0"
  {elevation}
  {active}
  {color}
  {checked}
  label={position?.toString()}
  aria-label="Progress marker at {position}%"
  title={position?.toString()}
  {...rest}
/>
