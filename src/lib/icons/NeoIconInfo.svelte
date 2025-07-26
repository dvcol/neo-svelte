<script lang="ts">
  import type { NeoIconProps } from '~/icons/neo-icon.model.js';

  const { size = '1em', scale = 1, stroke = 1.5, ...rest }: NeoIconProps = $props();
  const pulse = $derived(Number(stroke) + 0.5);
  const highlight = $derived(Number(stroke) * 2);
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
    <path stroke-dasharray="64" stroke-dashoffset="64" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
    </path>
    <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 11v5" stroke-width={pulse}>
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="-8;0" />
      <animate attributeName="stroke-width" begin="1.8s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="{pulse};{highlight};{highlight};{pulse};{pulse}" />
    </path>
    <path stroke-dasharray="2" stroke-dashoffset="2" d="M12 7.5v0.01" stroke-width={pulse}>
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0" />
      <animate attributeName="stroke-width" begin="2.1s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="{pulse};{highlight};{highlight};{pulse};{pulse}" />
    </path>
  </g>
</svg>
