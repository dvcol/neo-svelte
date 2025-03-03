<script lang="ts">
  import type { IconCircleLoadingProps } from '~/icons/icon.model.js';

  export const { size = '1em', scale, stroke = 1.5, animate = true, speed = 1.2, ...rest }: IconCircleLoadingProps = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style:scale {...rest}>
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
    <path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="{speed / 4}s" values="16;0" />
      <animateTransform attributeName="transform" dur="{speed * 1.25}s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
    </path>
    <path
      stroke-dasharray="64"
      stroke-dashoffset="64"
      stroke-opacity="0.3"
      d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
    >
      <animate fill="freeze" attributeName="stroke-dashoffset" dur={animate ? `${speed}s` : 0} values={animate ? '64;0' : '0;64'} />
    </path>
  </g>
</svg>
