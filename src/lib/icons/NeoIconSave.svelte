<script lang="ts">
  import type { NeoIconProps } from '~/icons/neo-icon.model.js';

  const { size = '1em', scale = 1, stroke = 2, ...rest }: NeoIconProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  style:scale {...rest}
>
  <g
    fill="none"
    stroke="currentColor"
    stroke-width={stroke}
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      stroke-dasharray="70"
      stroke-dashoffset="70"
    >
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="70;0" />
    </path>
    <path d="M7 3v4a1 1 0 0 0 1 1h7" stroke-dasharray="16" stroke-dashoffset="16">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.4s" values="16;0" />
    </path>
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" stroke-dasharray="32" stroke-dashoffset="32">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.5s" values="32;0" />
    </path>
  </g>
</svg>
