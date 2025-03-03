<script lang="ts">
  import { watch } from '@dvcol/svelte-utils/watch';

  import type { IconAddressProps } from '~/icons/icon.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    size = '1em',
    scale = 1,
    stroke = 2,
    dot = 'white',

    filled = false,
    repeat = 'indefinite',
    enter = $bindable(true),

    ...rest
  }: IconAddressProps = $props();
  /* eslint-enable prefer-const */

  watch(
    () => {
      enter = false;
    },
    () => filled,
    { skip: 1 },
  );

  const collapsed = 'M12 18c0 0 0 0 0 0c0 0 0 0 0 0l0 0c0 0 0 0 0 0c0 0 0 0 0 0c0 0 0 0 0 0c0 0 0 0 0 0l0 0c0 0 0 0 0 0c0 0 0 0 0 0Z';
  const expanded =
    'M12 21C15.3 21 18 19.9 18 18.5C18 17.8 17.3 17.2 16.2 16.7L16.8 15.8C18.8 16.6 20 17.7 20 19C20 21.2 16.4 23 12 23C7.6 23 4 21.2 4 19C4 17.7 5.2 16.6 7.1 15.8L7.7 16.7C6.7 17.2 6 17.8 6 18.5C6 19.9 8.7 21 12 21z';
</script>

{#key [filled, enter]}
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style:scale {...rest}>
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
      <path
        fill="currentColor"
        fill-opacity="0"
        stroke-dasharray="40"
        stroke-dashoffset={enter ? 40 : 0}
        d="M12 18c0 0 -5.14 -6 -5.14 -9.86c0 -2.84 2.3 -5.14 5.14 -5.14c2.84 0 5.14 2.3 5.14 5.14c0 3.86 -5.14 9.86 -5.14 9.86Z"
      >
        {#if enter}
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="40;0" />
        {/if}

        {#if !enter || filled}
          <animate fill="freeze" attributeName="fill-opacity" begin="{enter ? 0.6 : 0}s" dur="0.3s" values={filled ? '0;1' : '1;0'} />
        {/if}

        <animateTransform
          attributeName="transform"
          begin="1.1s"
          dur="3s"
          keyTimes="0;0.3;0.4;0.54;0.6;0.68;0.7;1"
          repeatCount={repeat}
          type="rotate"
          values="0 12 20.5;0 12 20.5;-8 12 20.5;0 12 20.5;5 12 20.5;-2 12 20.5;0 12 20.5;0 12 20.5"
        />
      </path>

      <circle cx="12" cy="8.143" r="2.5" fill={filled ? dot : 'currentColor'} fill-opacity="0" stroke="none">
        <animate fill="freeze" attributeName="fill-opacity" begin="{enter ? 0.6 : 0}s" dur="0.3s" values="0;1" />
      </circle>

      <path fill="currentColor" stroke="none" d={collapsed}>
        {#if !enter || filled}
          <animate
            fill="freeze"
            attributeName="d"
            begin="{enter ? 0.8 : 0}s"
            dur="0.2s"
            values={filled ? `${collapsed};${expanded}` : `${expanded};${collapsed}`}
          />
        {/if}
      </path>
    </g>
  </svg>
{/key}
