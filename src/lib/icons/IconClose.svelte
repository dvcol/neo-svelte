<script lang="ts">
  import type { IconProps } from '~/icons/icon.model.js';

  const { size = '1em', scale = 1, stroke = 1.5, ...rest }: IconProps = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style:scale {...rest}>
  <path
    fill="none"
    stroke="currentColor"
    stroke-dasharray="12"
    stroke-dashoffset="12"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={stroke}
    d="M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7"
  >
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="12;0" />
  </path>
</svg>
