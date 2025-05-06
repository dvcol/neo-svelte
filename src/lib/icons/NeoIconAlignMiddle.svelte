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
    <path stroke-dasharray="20" stroke-dashoffset="20" d="M3 12l18 0">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0" />
    </path>
    <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 2l0 6.5M12 22l0 -6.5">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.2s" values="8;0" />
    </path>
    <path stroke-dasharray="6" stroke-dashoffset="6" d="M12 9l3 -3M12 15l3 3M12 9l-3 -3M12 15l-3 3">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="6;0" />
    </path>
  </g>
</svg>
