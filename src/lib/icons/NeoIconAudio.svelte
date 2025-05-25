<script lang="ts">
  import type { NeoIconAudioProps } from '~/icons/neo-icon.model.js';

  const { size = '1em', scale = 0.75, stroke = 1.5, speed = 0.5, animated = true, repeat = 'indefinite', ...rest }: NeoIconAudioProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  style:scale
  {...rest}
>
  <g
    fill="none"
    stroke="currentColor"
    stroke-width={stroke}
    stroke-linecap="round"
    stroke-linejoin="round"
    class="audio-lines-icon animate"
  >
    <path d="M2 10v3">
      <animate
        attributeName="d"
        values="M2 10v3;M2 11v1;M2 10v3"
        dur={`${2 / speed}s`}
        repeatCount={repeat}
        begin={animated ? '0s' : 'indefinite'}
      />
    </path>

    <path d="M6 6v11">
      <animate
        attributeName="d"
        values="M6 6v11;M6 10v3;M6 6v11"
        dur={`${1.5 / speed}s`}
        repeatCount={repeat}
        begin={animated ? '0.1s' : 'indefinite'}
      />
    </path>

    <path d="M10 3v18">
      <animate
        attributeName="d"
        values="M10 3v18;M10 9v5;M10 3v18"
        dur={`${1 / speed}s`}
        repeatCount={repeat}
        begin={animated ? '0.2s' : 'indefinite'}
      />
    </path>

    <path d="M14 8v7">
      <animate
        attributeName="d"
        values="M14 8v7;M14 6v11;M14 8v7"
        dur={`${0.8 / speed}s`}
        repeatCount={repeat}
        begin={animated ? '0.3s' : 'indefinite'}
      />
    </path>

    <path d="M18 5v13">
      <animate
        attributeName="d"
        values="M18 5v13;M18 7v9;M18 5v13"
        dur={`${1.2 / speed}s`}
        repeatCount={repeat}
        begin={animated ? '0.4s' : 'indefinite'}
      />
    </path>

    <path d="M22 10v3">
      <animate
        attributeName="d"
        values="M22 10v3;M22 11v1;M22 10v3"
        dur={`${2.2 / speed}s`}
        repeatCount={repeat}
        begin={animated ? '0.5s' : 'indefinite'}
      />
    </path>
  </g>
</svg>
