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
  <path
    fill="none"
    stroke="currentColor"
    stroke-dasharray="16"
    stroke-dashoffset="16"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={stroke}
    d="M5 12h14"
  >
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0" />
  </path>
</svg>
