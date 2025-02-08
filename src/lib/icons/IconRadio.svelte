<script lang="ts">
  const { scale = 1, size = '1em', checked = false, circle = false, enter = true, ...rest } = $props();

  const circlePath = 'M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z';
  const squarePath = 'M 4 12 V 8 C 4 5 5 4 8 4 h 9 c 3 0 4 1 4 4 V 17 C 21 20 20 21 17 21 h -9 C 5 21 4 20 4 17 Z';
</script>

{#key [checked, circle, enter]}
  <svg xmlns="http://www.w3.org/2000/svg" width={size ?? '1em'} height={size ?? '1em'} viewBox="0 0 24 24" style:scale {...rest}>
    <g stroke="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
      <path fill="currentColor" fill-opacity={!enter && checked ? 1 : 0} stroke-dasharray="64" d={circle ? circlePath : squarePath}>
        {#if enter}
          <animate fill="freeze" attributeName="fill-opacity" dur="0.2s" values={checked ? '0;1' : '1;0'} />
        {/if}
      </path>
    </g>
  </svg>
{/key}
