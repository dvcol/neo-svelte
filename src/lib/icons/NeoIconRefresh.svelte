<script lang="ts">
  import type { NeoIconProps } from '~/icons/neo-icon.model.js';

  const { size = '1em', scale = 1, stroke = 2, ...rest }: NeoIconProps = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style:scale {...rest}>
  <g
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={stroke}
    transform="rotate(45 12 12)"
  >
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="45 12 12"
      to="0 12 12"
      begin="0.2s"
      dur="0.8s"
      fill="freeze"
    />
    <path stroke-dasharray="32" stroke-dashoffset="32" d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="32;0" />
    </path>
    <path stroke-dasharray="16" stroke-dashoffset="16" d="M3 3v5h5">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="16;0" />
    </path>
    <path stroke-dasharray="32" stroke-dashoffset="32" d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="32;0" />
    </path>
    <path stroke-dasharray="16" stroke-dashoffset="16" d="M16 16h5v5">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="16;0" />
    </path>
  </g>
</svg>
