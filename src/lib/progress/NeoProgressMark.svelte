<script lang="ts">
  import { clamp } from '@dvcol/common-utils/common/math';

  import type { NeoProgressMarkProps } from '~/progress/neo-progress-mark.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import { coerce, MaxShallowShadowElevation, MinShallowShadowElevation, type ShadowElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding */
  let { ref = $bindable(), index, position = 0, context, elevation: _elevation, color: _color, ...rest }: NeoProgressMarkProps = $props();
  /* eslint-enable prefer-const */

  const value = $derived(context?.value ?? 0);
  const checked = $derived(position <= value);
  const color = $derived(checked ? (_color ?? context?.color) : 'var(--neo-text-color-disabled)');

  const elevation = $derived(
    clamp(coerce<ShadowElevation>(_elevation ?? context?.elevation ?? 0), MinShallowShadowElevation, MaxShallowShadowElevation) as ShadowElevation,
  );
  const active = $derived.by(() => {
    if (!elevation) return 0;
    if (elevation < 0) return -2;
    if (elevation > 0) return -1;
  });
</script>

<NeoButton
  bind:ref
  rounded
  filled
  scale
  hover="0"
  {elevation}
  {active}
  {color}
  {checked}
  label={index?.toString() ?? position?.toString()}
  aria-label="Progress marker{index !== undefined ? ` n°${index + 1}` : `at ${position}%`}"
  title={(index !== undefined ? index + 1 : position)?.toString()}
  {...rest}
/>
