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
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
    <path stroke-dasharray="2" stroke-dashoffset="2" d="M4 5h0.01">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.1s" values="2;0" />
    </path>
    <path stroke-dasharray="14" stroke-dashoffset="14" d="M8 5h12">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.2s" values="14;0" />
    </path>
    <path stroke-dasharray="2" stroke-dashoffset="2" d="M4 10h0.01">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.1s" values="2;0" />
    </path>
    <path stroke-dasharray="14" stroke-dashoffset="14" d="M8 10h12">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="14;0" />
    </path>
    <path stroke-dasharray="2" stroke-dashoffset="2" d="M4 15h0.01">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.1s" values="2;0" />
    </path>
    <path stroke-dasharray="14" stroke-dashoffset="14" d="M8 15h12">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="14;0" />
    </path>
    <path stroke-dasharray="2" stroke-dashoffset="2" d="M4 20h0.01">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.1s" values="2;0" />
    </path>
    <path stroke-dasharray="14" stroke-dashoffset="14" d="M8 20h12">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="14;0" />
    </path>
  </g>
</svg>
