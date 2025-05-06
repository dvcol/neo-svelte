<script lang="ts">
  import type { NeoIconProps } from '~/icons/neo-icon.model.js';

  const { size = '1em', scale = 1, stroke = 1.5, ...rest }: NeoIconProps = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style:scale {...rest}>
  <circle cx="12" cy="12" r="0" fill="currentColor">
    <animate fill="freeze" attributeName="r" begin="0.8s" dur="0.2s" values="0;2" />
  </circle>
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
    <path stroke-dasharray="48" stroke-dashoffset="48" d="M4.25 14c0.89 3.45 4.02 6 7.75 6c4.42 0 8 -3.58 8 -8c0 -4.42 -3.58 -8 -8 -8c-2.39 0 -4.53 1.05 -6 2.71l-2 2.29">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0" />
    </path>
    <path fill="currentColor" stroke-width="1" d="M5.63 7.38l0 0l0 0l0 0z" opacity="0">
      <animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M5.63 7.38l0 0l0 0l0 0z;M5.63 7.38L3.5 5.25L3.5 9.5L7.75 9.5z" />
      <set fill="freeze" attributeName="opacity" begin="0.6s" to="1" />
    </path>
  </g>
</svg>
