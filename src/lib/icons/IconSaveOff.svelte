<svg
  xmlns="http://www.w3.org/2000/svg"
  width={$$props.size ?? '1em'}
  height={$$props.size ?? '1em'}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={$$props.stroke ?? 2}
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M9 3h6.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15" stroke-dasharray="32" stroke-dashoffset="32">
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="32;0" />
  </path>
  <path d="M20.41 20.41A2 2 0 0 1 19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 .59-1.41" stroke-dasharray="40" stroke-dashoffset="40">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.4s" values="40;0" />
  </path>

  <path d="m2 2 20 20" stroke-dasharray="32" stroke-dashoffset="32">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.4s" values="32;0" />
  </path>

  <path d="M14 8h1" stroke-dasharray="8" stroke-dashoffset="8">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.4s" values="8;0" />
  </path>
  <path d="M17 21v-4" stroke-dasharray="8" stroke-dashoffset="8">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.1s" dur="0.4s" values="8;0" />
  </path>
  <path d="M13 13H8a1 1 0 0 0-1 1v7" stroke-dasharray="16" stroke-dashoffset="16">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.4s" values="16;0" />
  </path>
</svg>
