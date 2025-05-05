<svg
  xmlns="http://www.w3.org/2000/svg"
  width={$$props.size ?? '1em'}
  height={$$props.size ?? '1em'}
  viewBox="0 0 24 24"
  {...$$props}
  style:scale={$$props.scale}
  scale={undefined}
>
  <g
    fill="none"
    stroke="currentColor"
    stroke-dasharray="16"
    stroke-dashoffset="16"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={$$props.stroke ?? 1.5}
  >
    <path d="M5 12h14">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0" />
    </path>
    <path d="M12 5v14">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="16;0" />
    </path>
  </g>
</svg>
