<script lang="ts">
  import type { NeoIconProps } from '~/icons/neo-icon.model.js';

  const { size = '1em', scale = 1, stroke = 1.5, enter = true, ...rest }: NeoIconProps = $props();

  const closed = 'M4 12c1.38 -0.77 4.42 -1.3 8 -1.3c3.58 0 6.62 0.53 8 1.3c-1.38 0.77 -4.42 1.3 -8 1.3c-3.58 0 -6.62 -0.53 -8 -1.3Z';
  const open = 'M2 12c1.72 -3.83 5.53 -6.5 10 -6.5c4.47 0 8.28 2.67 10 6.5c-1.72 3.83 -5.53 6.5 -10 6.5c-4.47 0 -8.28 -2.67 -10 -6.5Z';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  style:scale
  {...rest}
>
  <circle cx="12" cy="12" r={enter ? 0 : 3} fill="currentColor">
    {#if enter}
      <animate attributeName="r" dur="6s" keyTimes="0;0.03;0.97;1" repeatCount="indefinite" values="0;3;3;0" />
    {/if}
  </circle>
  <path
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={stroke}
    d={enter ? closed : open}
  >
    {#if enter}
      <animate
        attributeName="d"
        dur="6s"
        keyTimes="0;0.03;0.97;1"
        repeatCount="indefinite"
        values="{closed};{open};{open};{closed}"
      />
    {/if}
  </path>
</svg>
