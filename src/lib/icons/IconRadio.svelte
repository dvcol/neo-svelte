<script lang="ts">
  import type { IconRadioProps } from '~/icons/icon.model.js';

  const { scale = 1, size = '1em', checked = false, circle = false, enter = true, stroke = 2, ...rest }: IconRadioProps = $props();

  const circlePath = 'M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z';
  const squarePath = 'm 3 12 v -4 c 0 -3 1 -5 4 -5 H 16 c 3 0 5 2 5 5 V 16 C 21 19 19 21 16 21 h -8 C 5 21 3 19 3 16 Z';
</script>

{#key [checked, circle, enter]}
  <svg xmlns="http://www.w3.org/2000/svg" width={size ?? '1em'} height={size ?? '1em'} viewBox="0 0 24 24" style:scale {...rest}>
    <g stroke="none" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
      <path fill="currentColor" fill-opacity={!enter && checked ? 1 : 0} stroke-dasharray="64" d={circle ? circlePath : squarePath}>
        {#if enter}
          <animate fill="freeze" attributeName="fill-opacity" dur="0.2s" values={checked ? '0;1' : '1;0'} />
        {/if}
      </path>
    </g>
  </svg>
{/key}
