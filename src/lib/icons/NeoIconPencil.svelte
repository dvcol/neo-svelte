<svg
  xmlns="http://www.w3.org/2000/svg"
  width={$$props.size ?? '1em'}
  height={$$props.size ?? '1em'}
  viewBox="0 0 24 24"
  {...$$props}
  style:scale={$$props.scale}
  scale={undefined}
>
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={$$props.stroke ?? 1.5}>
    <path stroke-dasharray="56" stroke-dashoffset="56" d="M3 21l2 -6l11 -11c1 -1 3 -1 4 0c1 1 1 3 0 4l-11 11l-6 2">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="56;0" />
    </path>
    <path stroke-dasharray="8" stroke-dashoffset="8" d="M15 5l4 4">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0" />
    </path>
    <path stroke-dasharray="6" stroke-dashoffset="6" stroke-width="1" d="M6 15l3 3">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="6;0" />
    </path>
  </g>
</svg>
