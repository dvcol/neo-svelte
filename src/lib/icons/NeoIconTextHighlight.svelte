<script lang="ts">
  import type { NeoIconProps } from '~/icons/neo-icon.model.js';

  const { size = '1em', scale = 1, stroke = 2, ...rest }: NeoIconProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  style:scale
  {...rest}
>
  <g fill="none" stroke="currentColor" stroke-width={stroke} stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1" stroke-dasharray="16" stroke-dashoffset="16">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0" />
    </path>
    <path d="M9 7v10" stroke-dasharray="16" stroke-dashoffset="16">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.4s" values="16;0" />
    </path>
    <path d="M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5" stroke-dasharray="16" stroke-dashoffset="16">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="16;0" />
    </path>
    <path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" stroke-dasharray="16" stroke-dashoffset="16">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="16;0" />
    </path>
    <path d="M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7" stroke-dasharray="24" stroke-dashoffset="24">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" values="24;0" />
    </path>
  </g>
</svg>
