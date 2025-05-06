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
  <path fill="currentColor" d="M12 18l4 0h-2.5v0h-3v0h-2.5z">
    <animate fill="freeze" attributeName="d" begin="0.8s" dur="0.2s" values="M12 18l4 0h-2.5v0h-3v0h-2.5z;M12 11l4 4h-2.5v3h-3v-3h-2.5Z" />
  </path>
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
    <path
      stroke-dasharray="64"
      stroke-dashoffset="64"
      d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z"
    >
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
    </path>
    <path d="M14.5 3.5l2.25 2.25l2.25 2.25z" opacity="0">
      <animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M14.5 3.5l2.25 2.25l2.25 2.25z;M14.5 3.5l0 4.5l4.5 0z" />
      <set fill="freeze" attributeName="opacity" begin="0.6s" to="1" />
    </path>
  </g>
</svg>
