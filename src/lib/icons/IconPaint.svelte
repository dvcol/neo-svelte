<svg
  xmlns="http://www.w3.org/2000/svg"
  width={$$props.size ?? '1em'}
  height={$$props.size ?? '1em'}
  viewBox="0 0 24 24"
  {...$$props}
  style:scale={$$props.scale}
  scale={undefined}
>
  <path
    fill="currentColor"
    fill-opacity="0"
    stroke="currentColor"
    stroke-dasharray="28"
    stroke-dashoffset="28"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={$$props.stroke ?? 1.5}
    d="M12 3c0 0 7 6 7 12c0 2 -1 6 -7 6M12 3c0 0 -7 6 -7 12c0 2 1 6 7 6"
  >
    <animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.15s" values="0;0.3" />
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="28;0" />
  </path>
  <path fill="currentColor" fill-opacity="0" d="M12 3C12 3 15.27 5.81 17.34 9.5L6 18.41C5.21 17.24 5 15.91 5 15C5 9 12 3 12 3Z">
    <animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.5s" values="0;1" />
  </path>
</svg>
