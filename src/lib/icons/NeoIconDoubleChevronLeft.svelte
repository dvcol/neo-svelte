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
    stroke-dasharray="10"
    stroke-dashoffset="10"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={$$props.stroke ?? 1.5}
  >
    <path d="M12 12l5 -5M12 12l5 5">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0" />
    </path>
    <path d="M6 12l5 -5M6 12l5 5">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" values="10;0" />
    </path>
  </g>
</svg>
