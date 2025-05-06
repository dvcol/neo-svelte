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
    fill="none"
    stroke="currentColor"
    stroke-dasharray="16"
    stroke-dashoffset="16"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={stroke}
  >
    <path d="M7 7l10 10">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0" />
    </path>
    <path d="M17 7l-10 10">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" values="16;0" />
    </path>
  </g>
</svg>
