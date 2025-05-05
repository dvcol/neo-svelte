<svg
  xmlns="http://www.w3.org/2000/svg"
  width={$$props.size ?? '1em'}
  height={$$props.size ?? '1em'}
  viewBox="0 0 24 24"
  {...$$props}
  style:scale={$$props.scale}
  scale={undefined}
>
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={$$props.stroke ?? 2}>
    <path
      stroke-dasharray="64"
      stroke-dashoffset="64"
      d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1Z"
    >
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
    </path>
    <path stroke-dasharray="24" stroke-dashoffset="24" d="M3 6.5l9 5.5l9 -5.5">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="24;0" />
    </path>
  </g>
</svg>
