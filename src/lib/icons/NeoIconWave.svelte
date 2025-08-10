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
    <path stroke-dasharray="24" stroke-dashoffset="24" d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="24;0" />
    </path>
    <path stroke-dasharray="24" stroke-dashoffset="24" d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.6s" values="24;0" />
    </path>
    <path stroke-dasharray="24" stroke-dashoffset="24" d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.6s" values="24;0" />
    </path>
  </g>
</svg>
