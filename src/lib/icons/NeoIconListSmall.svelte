<script lang="ts">
  import type { NeoIconFilledProps } from '~/icons/neo-icon.model.js';

  import { watch } from '@dvcol/svelte-utils/watch';

  let {
    size = '1em',
    scale = 1,
    stroke = 1,

    filled = false,
    enter = $bindable(true),

    ...rest
  }: NeoIconFilledProps = $props();

  watch(
    () => {
      enter = false;
    },
    () => filled,
    { skip: 1 },
  );
</script>

{#key [filled, enter]}
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style:scale {...rest}>
    <g
      fill="currentColor"
      fill-opacity={!enter && !filled ? 1 : 0}
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={stroke}
    >
      <path
        stroke-dasharray="12"
        stroke-dashoffset={enter ? 12 : 0}
        d="M3.5 5c0 -0.83 0.67 -1.5 1.5 -1.5c0.83 0 1.5 0.67 1.5 1.5c0 0.83 -0.67 1.5 -1.5 1.5c-0.83 0 -1.5 -0.67 -1.5 -1.5Z"
      >
        {#if enter}
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="12;0" />
        {/if}
        {#if !enter || filled}
          <animate fill="freeze" attributeName="fill-opacity" begin="{enter ? 1.7 : 0}s" dur="0.3s" values={filled ? '0;1' : '1;0'} />
        {/if}
      </path>
      <path
        stroke-dasharray="28"
        stroke-dashoffset={enter ? 28 : 0}
        d="M9.5 5c0 -0.83 0.67 -1.5 1.5 -1.5h8c0.83 0 1.5 0.67 1.5 1.5c0 0.83 -0.67 1.5 -1.5 1.5h-8c-0.83 0 -1.5 -0.67 -1.5 -1.5Z"
      >
        {#if enter}
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.4s" values="28;0" />
        {/if}
        {#if !enter || filled}
          <animate fill="freeze" attributeName="fill-opacity" begin="{enter ? 1.8 : 0.1}s" dur="0.3s" values={filled ? '0;1' : '1;0'} />
        {/if}
      </path>
      <path
        stroke-dasharray="12"
        stroke-dashoffset={enter ? 12 : 0}
        d="M3.5 12c0 -0.83 0.67 -1.5 1.5 -1.5c0.83 0 1.5 0.67 1.5 1.5c0 0.83 -0.67 1.5 -1.5 1.5c-0.83 0 -1.5 -0.67 -1.5 -1.5Z"
      >
        {#if enter}
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="12;0" />
        {/if}
        {#if !enter || filled}
          <animate fill="freeze" attributeName="fill-opacity" begin="{enter ? 2 : 0.3}s" dur="0.3s" values={filled ? '0;1' : '1;0'} />
        {/if}
      </path>
      <path
        stroke-dasharray="28"
        stroke-dashoffset={enter ? 28 : 0}
        d="M9.5 12c0 -0.83 0.67 -1.5 1.5 -1.5h8c0.83 0 1.5 0.67 1.5 1.5c0 0.83 -0.67 1.5 -1.5 1.5h-8c-0.83 0 -1.5 -0.67 -1.5 -1.5Z"
      >
        {#if enter}
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.4s" values="28;0" />
        {/if}
        {#if !enter || filled}
          <animate fill="freeze" attributeName="fill-opacity" begin="{enter ? 2.1 : 0.4}s" dur="0.3s" values={filled ? '0;1' : '1;0'} />
        {/if}
      </path>
      <path
        stroke-dasharray="12"
        stroke-dashoffset={enter ? 12 : 0}
        d="M3.5 19c0 -0.83 0.67 -1.5 1.5 -1.5c0.83 0 1.5 0.67 1.5 1.5c0 0.83 -0.67 1.5 -1.5 1.5c-0.83 0 -1.5 -0.67 -1.5 -1.5Z"
      >
        {#if enter}
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" values="12;0" />
        {/if}
        {#if !enter || filled}
          <animate fill="freeze" attributeName="fill-opacity" begin="{enter ? 2.2 : 0.5}s" dur="0.3s" values={filled ? '0;1' : '1;0'} />
        {/if}
      </path>
      <path
        stroke-dasharray="28"
        stroke-dashoffset={enter ? 28 : 0}
        d="M9.5 19c0 -0.83 0.67 -1.5 1.5 -1.5h8c0.83 0 1.5 0.67 1.5 1.5c0 0.83 -0.67 1.5 -1.5 1.5h-8c-0.83 0 -1.5 -0.67 -1.5 -1.5Z"
      >
        {#if enter}
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.4s" dur="0.4s" values="28;0" />
        {/if}
        {#if !enter || filled}
          <animate fill="freeze" attributeName="fill-opacity" begin="{enter ? 2.3 : 0.6}s" dur="0.3s" values={filled ? '0;1' : '1;0'} />
        {/if}
      </path>
    </g>
  </svg>
{/key}
