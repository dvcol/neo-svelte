<svg xmlns="http://www.w3.org/2000/svg" width={$$props.size ?? '1em'} height={$$props.size ?? '1em'} viewBox="0 0 24 24" {...$$props}>
  <path
    fill="none"
    stroke="currentColor"
    stroke-dasharray="10"
    stroke-dashoffset="10"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M12 9l-5 5M12 9l5 5"
    transform="translate(0 -{$$props.space ?? 7})"
  >
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0" />
  </path>
  <path
    fill="none"
    stroke="currentColor"
    stroke-dasharray="10"
    stroke-dashoffset="10"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M12 15l-5 -5M12 15l5 -5"
    transform="translate(0 {$$props.space ?? 7})"
  >
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0" />
  </path>
</svg>
