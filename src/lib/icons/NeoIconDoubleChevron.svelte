<script lang="ts">
  import type { NeoIconDoubleChevronProps } from '~/icons/neo-icon.model.js';

  const { size = '1em', scale = 1, stroke = 2, space = 7, ...rest }: NeoIconDoubleChevronProps = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style:scale {...rest}>
  <path
    class="neo-icon-double-chevron"
    fill="none"
    stroke="currentColor"
    stroke-dasharray="10"
    stroke-dashoffset="10"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={stroke}
    d="M12 9l-5 5M12 9l5 5"
    style:translate="0 -{space}px"
  >
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0" />
  </path>
  <path
    class="neo-icon-double-chevron"
    fill="none"
    stroke="currentColor"
    stroke-dasharray="10"
    stroke-dashoffset="10"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={stroke}
    d="M12 15l-5 -5M12 15l5 -5"
    style:translate="0 {space}px"
  >
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0" />
  </path>
</svg>

<style lang="scss">
  .neo-icon-double-chevron {
    transition: translate 0.5s var(--neo-easing-overshoot-smooth, ease);
  }
</style>
