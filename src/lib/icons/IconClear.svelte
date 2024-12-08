<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props} style:scale={$$props.scale} scale={undefined}>
  <g
    fill="none"
    stroke="currentColor"
    stroke-dasharray="16"
    stroke-dashoffset="16"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={$$props.stroke ?? 1.5}
  >
    <path d="M7 7l10 10">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0" />
    </path>
    <path d="M17 7l-10 10">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" values="16;0" />
    </path>
  </g>
</svg>
