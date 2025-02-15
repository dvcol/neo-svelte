<script lang="ts">
  import { watch } from '@dvcol/svelte-utils';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    size = '1em',
    scale = 1,
    stroke = 2,

    state = 'play', // 'pause',
    enter = $bindable(true),

    ...rest
  } = $props();
  /* eslint-enable prefer-const */

  watch(
    () => {
      enter = false;
    },
    () => state,
    { skip: 1 },
  );
</script>

{#key [state, enter]}
  <svg xmlns="http://www.w3.org/2000/svg" width={size ?? '1em'} height={size ?? '1em'} viewBox="0 0 24 24" style:scale {...rest}>
    {#if state === 'play' && enter}
      <path
        fill="currentColor"
        fill-opacity="0"
        stroke="currentColor"
        stroke-dasharray="40"
        stroke-dashoffset="40"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={stroke}
        d="M8 6l10 6l-10 6Z"
      >
        <animate fill="freeze" attributeName="fill-opacity" begin="0.5s" dur="0.5s" values="0;1" />
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="40;0" />
      </path>
    {:else if state === 'pause' && enter}
      <g
        fill="none"
        stroke="currentColor"
        stroke-dasharray="32"
        stroke-dashoffset="32"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={stroke}
      >
        <path d="M7 6h2v12h-2Z">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="32;0" />
        </path>
        <path d="M15 6h2v12h-2Z">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="32;0" />
        </path>
      </g>
    {:else if state === 'play'}
      <path
        fill="currentColor"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={stroke}
        d="M9 18L7 18L7 6L9 6L9 18M15 6L17 6L17 18L15 18L15 6"
      >
        <animate
          fill="freeze"
          attributeName="d"
          dur="0.6s"
          keyTimes="0;0.66;1"
          values="M9 18L7 18L7 6L9 6L9 18M15 6L17 6L17 18L15 18L15 6;M13 15L8 18L8 6L13 9L13 15M13 9L18 12L18 12L13 15L13 9;M13 15L8 18L8 6L13 9L13 9M13 9L18 12L18 12L13 15L13 15"
        />
      </path>
    {:else if state === 'pause'}
      <path
        fill="currentColor"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={stroke}
        d="M13 15L8 18L8 6L13 9L13 9M13 9L18 12L18 12L13 15L13 15"
      >
        <animate
          fill="freeze"
          attributeName="d"
          dur="0.6s"
          keyTimes="0;0.33;1"
          values="M13 15L8 18L8 6L13 9L13 9M13 9L18 12L18 12L13 15L13 15;M13 15L8 18L8 6L13 9L13 15M13 9L18 12L18 12L13 15L13 9;M9 18L7 18L7 6L9 6L9 18M15 6L17 6L17 18L15 18L15 6"
        />
      </path>
    {/if}
  </svg>
{/key}
