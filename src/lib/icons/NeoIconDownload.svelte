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
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
    <path stroke-dasharray="20" stroke-dashoffset="20" d="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5">
      <animate
        attributeName="d"
        begin="0.5s"
        dur="1.5s"
        repeatCount="indefinite"
        values="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5;M12 4h2v3h2.5l-4.5 4.5M12 4h-2v3h-2.5l4.5 4.5;M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5"
      />
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0" />
    </path>
    <path stroke-dasharray="14" stroke-dashoffset="14" d="M6 19h12">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="-14;0" />
    </path>
  </g>
</svg>
