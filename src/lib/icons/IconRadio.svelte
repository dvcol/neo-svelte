<script lang="ts">
  const { scale = 1, size = '1em', checked = false, circle = false, enter = true, ...rest } = $props();

  const circlePath = 'M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z';
  const squarePath = 'M4 12v-7c0 -0.55 0.45 -1 1 -1h14c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1Z';
</script>

{#key [checked, circle, enter]}
  <svg xmlns="http://www.w3.org/2000/svg" width={size ?? '1em'} height={size ?? '1em'} viewBox="0 0 24 24" style:scale {...rest}>
    <g stroke="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
      <path fill="currentColor" fill-opacity="0" stroke-dasharray="64" d={circle ? circlePath : squarePath}>
        <animate fill="freeze" attributeName="fill-opacity" dur={enter ? '0.2s' : 0} values={checked || !enter ? '0;1' : '1;0'} />
      </path>
    </g>
  </svg>
{/key}
