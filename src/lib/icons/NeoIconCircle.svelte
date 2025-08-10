<script lang="ts">
  import type { NeoIconProps } from '~/icons/neo-icon.model.js';

  const { size = '1em', scale = 1, stroke = 1.5, ...rest }: NeoIconProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  style:scale
  {...rest}
>
  <circle cx="12" cy="12" r="0" fill="currentColor" stroke-width={stroke}>
    <animate fill="freeze" attributeName="r" begin="0.2s" dur="0.3s" values="0;9" />
  </circle>
</svg>
