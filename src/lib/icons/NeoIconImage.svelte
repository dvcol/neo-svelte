<script lang="ts">
  import type { NeoIconImageProps } from '~/icons/neo-icon.model.js';

  const { size = '1em', scale = 1, stroke = 1.5, delay = 0, enter = true, ...rest }: NeoIconImageProps = $props();
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
    <path stroke-dasharray="72" stroke-dashoffset={enter ? 72 : 0} d="M3 14v-9h18v14h-18v-5">
      {#if enter}
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="{delay + 0}s" dur="0.6s" values="72;0" />
      {/if}
    </path>
    <path stroke-dasharray="24" stroke-dashoffset={enter ? 24 : 0} stroke-width="1" d="M3 16l4 -3l3 2l6 -5l5 4">
      {#if enter}
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="{delay + 0.6}s" dur="0.4s" values="24;0" />
      {/if}
    </path>
  </g>
  <g fill="currentColor" fill-opacity={enter ? 0 : 1}>
    <circle cx="7.5" cy="9.5" r="1.5">
      {#if enter}
        <animate fill="freeze" attributeName="fill-opacity" begin="{delay + 1}s" dur="0.2s" values="0;1" />
      {/if}
    </circle>
    <path d="M3 16l4 -3l3 2l6 -5l5 4V19H3Z">
      {#if enter}
        <animate fill="freeze" attributeName="fill-opacity" begin="{delay + 1.3}s" dur="0.5s" values="0;1" />
      {/if}
    </path>
  </g>
</svg>
