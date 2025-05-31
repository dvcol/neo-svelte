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

    <path d="m22 7-8.5 8.5-5-5L2 17" stroke-dasharray="30" stroke-dashoffset="-30">
      <animate
        attributeName="stroke-dashoffset"
        from="-30"
        to="0"
        dur="0.6s"
        begin="0s"
        fill="freeze"
      />
    </path>

    <path d="M16 7h6v6" stroke-dasharray="12" stroke-dashoffset="12">
      <animate
        attributeName="stroke-dashoffset"
        from="12"
        to="0"
        dur="0.3s"
        begin="0.6s"
        fill="freeze"
      />
    </path>
  </g>
</svg>
