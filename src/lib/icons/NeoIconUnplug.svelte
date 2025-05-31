<script lang="ts">
  import type { NeoIconUnplugProps } from '~/icons/neo-icon.model.js';

  const { size = '1em', scale = 1, stroke = 2, plug = false, ...rest }: NeoIconUnplugProps = $props();

</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  style:scale
  {...rest}
>
  <g
    stroke="currentColor"
    stroke-width={stroke}
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path class="line-1" stroke-dasharray="16" stroke-dashoffset={plug ? 0 : 8} d="M17 7l5 -5">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values={plug ? '8;0' : '0;8'} />
    </path>
    <path class="line-2" stroke-dasharray="16" stroke-dashoffset={plug ? 16 : 8} d="m2 22 6-6">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values={plug ? '0;8' : '8;0'} />
    </path>
    <path
      class="socket"
      transform="translate({plug ? '3px, -3px' : '0, 0'})"
      d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"
    >
      <animateTransform attributeName="transform" type="translate" from={plug ? '0 0' : '3 -3'} to={plug ? '3 -3' : '0 0'} dur="0.3s" fill="freeze" />
    </path>
    <path
      class="spark-1"
      stroke-dasharray="8"
      stroke-dashoffset={plug ? -8 : 0}
      transform="translate({plug ? '3px, -3px' : '0, 0'})"
      d="M7.5 13.5l2.5 -2.5"
    >
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values={plug ? '0;8' : '8;0'} />
      <animateTransform attributeName="transform" type="translate" from={plug ? '0 0' : '3 -3'} to={plug ? '3 -3' : '0 0'} dur="0.3s" fill="freeze" />
    </path>
    <path
      class="spark-2"
      stroke-dasharray="8"
      stroke-dashoffset="-8"
      transform="translate({plug ? '3px, -3px' : '0, 0'})"
      d="M10.5 16.5l2.5 -2.5"
    >
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values={plug ? '0;8' : '8;0'} />
      <animateTransform attributeName="transform" type="translate" from={plug ? '0 0' : '3 -3'} to={plug ? '3 -3' : '0 0'} dur="0.3s" fill="freeze" />
    </path>
    <path
      class="plug"
      transform="translate({plug ? '-3px, 3px' : '0, 0'})"
      d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z"
    >
      <animateTransform attributeName="transform" type="translate" from={plug ? '0 0' : '-3 3'} to={plug ? '-3 3' : '0 0'} dur="0.3s" fill="freeze" />
    </path>
  </g>
</svg>
