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
  <mask id="lineMdYoutubeFilled0">
    <g fill="none" fill-opacity="0" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
      <path fill="#fff" stroke-dasharray="64" stroke-dashoffset="64" d="M12 5c9 0 9 0 9 7c0 7 0 7 -9 7c-9 0 -9 0 -9 -7c0 -7 0 -7 9 -7Z">
        <animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.5s" values="0;1" />
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
      </path>
      <path fill="#000" stroke="none" d="M12 11L12 12L12 13z">
        <animate fill="freeze" attributeName="d" begin="1.1s" dur="0.2s" values="M12 11L12 12L12 13z;M10 8.5L16 12L10 15.5z" />
        <set fill="freeze" attributeName="fill-opacity" begin="1.1s" to="1" />
      </path>
    </g>
  </mask>
  <rect width="24" height="24" fill="currentColor" mask="url(#lineMdYoutubeFilled0)" />
</svg>
