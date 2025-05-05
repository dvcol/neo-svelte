<script lang="ts">
  import type { NeoIconFilledProps } from '~/icons/neo-icon.model.js';

  import { watch } from '@dvcol/svelte-utils/watch';

  let {
    size = '1em',
    scale = 1,
    stroke = 1.5,

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
      fill-opacity="0"
      stroke="currentColor"
      stroke-dasharray="28"
      stroke-dashoffset={enter ? 28 : 0}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={stroke}
    >
      <path d="M4 21v-1c0 -3.31 2.69 -6 6 -6h4c3.31 0 6 2.69 6 6v1">
        {#if enter}
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="28;0" />
        {/if}
        {#if !enter || filled}
          <animate fill="freeze" attributeName="fill-opacity" begin="{enter ? 0.6 : 0}s" dur="0.5s" values={filled ? '0;1' : '1;0'} />
        {/if}
      </path>
      <path d="M12 11c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4Z">
        {#if enter}
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="28;0" />
        {/if}
        {#if !enter || filled}
          <animate fill="freeze" attributeName="fill-opacity" begin="{enter ? 0.6 : 0}s" dur="0.5s" values={filled ? '0;1' : '1;0'} />
        {/if}
      </path>
    </g>
  </svg>
{/key}
