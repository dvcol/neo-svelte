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
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
    <path
      stroke-dasharray="64"
      stroke-dashoffset="64"
      d="M5.64 5.64c3.51 -3.51 9.21 -3.51 12.73 0c3.51 3.51 3.51 9.21 0 12.73c-3.51 3.51 -9.21 3.51 -12.73 0c-3.51 -3.51 -3.51 -9.21 -0 -12.73Z"
    >
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
    </path>
    <path stroke-dasharray="20" stroke-dashoffset="20" d="M6 6l12 12">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="20;0" />
    </path>
  </g>
</svg>
