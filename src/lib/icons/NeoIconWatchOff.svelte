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
  <mask id="lineMdWatchOffLoop0">
    <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
      <circle cx="12" cy="12" r={enter ? 0 : 3} fill="#fff" stroke="none">
        {#if enter}
          <animate attributeName="r" dur="6s" keyTimes="0;0.03;0.97;1" repeatCount="indefinite" values="0;3;3;0" />
        {/if}
      </circle>
      <path d={enter ? closed : open}>
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
      <path stroke="#000" stroke-dasharray="28" stroke-dashoffset={enter ? 28 : 0} d="M0 11h24" transform="rotate(45 12 12)">
        {#if enter}
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="28;0" />
        {/if}
      </path>
      <path stroke-dasharray="28" stroke-dashoffset={enter ? 28 : 0} d="M-1 13h24" transform="rotate(45 12 12)">
        {#if enter}
          <animate attributeName="d" dur="6s" repeatCount="indefinite" values="M-1 13h24;M1 13h24;M-1 13h24" />
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="28;0" />
        {/if}
      </path>
    </g>
  </mask>
  <rect width="24" height="24" fill="currentColor" mask="url(#lineMdWatchOffLoop0)" />
</svg>
