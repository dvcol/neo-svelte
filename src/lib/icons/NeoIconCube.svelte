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
  <g
    fill="none" stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={stroke}
  >
    <path stroke-dasharray="64" stroke-dashoffset="64" d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
    </path>
    <path stroke-dasharray="24" stroke-dashoffset="24" d="m3.3 7 8.7 5 8.7-5">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.3s" values="24;0" />
    </path>
    <path stroke-dasharray="24" stroke-dashoffset="-24" d="M12 22V12">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.3s" values="-24;0" />
    </path>
  </g>
</svg>
