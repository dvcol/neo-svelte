<svg xmlns="http://www.w3.org/2000/svg" width={$$props.size ?? '1em'} height={$$props.size ?? '1em'} viewBox="0 0 24 24" {...$$props}>
  <path
    class="neo-icon-double-chevron"
    fill="none"
    stroke="currentColor"
    stroke-dasharray="10"
    stroke-dashoffset="10"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M12 9l-5 5M12 9l5 5"
    style:translate="0 -{$$props.space ?? 7}px"
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
    stroke-width="2"
    d="M12 15l-5 -5M12 15l5 -5"
    style:translate="0 {$$props.space ?? 7}px"
  >
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0" />
  </path>
</svg>

<style lang="scss">
  .neo-icon-double-chevron {
    transition: translate 0.3s ease;
  }
</style>
