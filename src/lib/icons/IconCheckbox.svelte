<script lang="ts">
  const {
    box = 1.25,
    check = 2,
    size = '1em',
    scale = 1.6,
    border = false,
    circle = false,
    draw = false,
    enter = true,
    checked = false,
    indeterminate = false,
    ...rest
  }: {
    /**
     * The stroke width of the border.
     */
    box?: number;
    /**
     * The stroke width of the checkmark.
     */
    check?: number;
    /**
     * The scale of the icon.
     */
    scale?: number;
    /**
     * The size (width and height) of the icon.
     */
    size?: string;
    /**
     * Whether to render the border.
     */
    border?: boolean;
    /**
     * Whether to render a square or circle checkbox.
     */
    circle?: boolean;
    /**
     * Whether to draw the border on enter.
     */
    draw?: boolean;
    /**
     * Whether to animate on enter.
     */
    enter?: boolean;
    /**
     * If the checkbox is checked.
     */
    checked?: boolean;
    /**
     * If the checkbox is indeterminate.
     */
    indeterminate?: boolean;
  } = $props();

  const circlePath = 'M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z';
  const squarePath = 'M4 12v-7c0 -0.55 0.45 -1 1 -1h14c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1Z';
</script>

{#key [checked, draw, enter, indeterminate, circle, border]}
  <svg xmlns="http://www.w3.org/2000/svg" width={size ?? '1em'} height={size ?? '1em'} viewBox="0 0 24 24" style:scale {...rest}>
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={box}>
      {#if border}
        <path stroke-opacity="0.5" stroke-dasharray="64" stroke-dashoffset={!checked || !draw ? 0 : 64} d={circle ? circlePath : squarePath}>
          {#if draw}
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin={checked || indeterminate ? 0 : '0.2s'}
              dur={enter && draw ? '0.6s' : 0}
              values={checked || indeterminate ? '64;0' : '0;64'}
            />
          {/if}
        </path>
      {/if}
      {#if indeterminate}
        <path stroke-dasharray="12" stroke-dashoffset="12" d="M7 12h10">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin={!draw || !border || !enter ? 0 : '0.6s'}
            dur={enter ? '0.2s' : 0}
            values={enter ? '12;0' : '0;12'}
          />
        </path>
      {:else}
        <path stroke-dasharray={!enter && checked ? 0 : 14} stroke-dashoffset="14" d="M8 12l3 3l5 -5" stroke-width={check}>
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin={!checked || !draw || !border || !enter ? 0 : '0.6s'}
            dur={enter ? '0.2s' : 0}
            values={checked || !enter ? '14;0' : '0;14'}
          />
        </path>
      {/if}
    </g>
  </svg>
{/key}
