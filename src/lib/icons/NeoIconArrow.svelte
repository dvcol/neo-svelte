<script lang="ts">
  import type { NeoIconArrowProps } from '~/icons/neo-icon.model.js';

  import { watch } from '@dvcol/svelte-utils/watch';

  import { NeoIconArrowDirection } from '~/icons/neo-icon.model.js';

  let {
    size = '1em',
    scale = 1,
    stroke = 2,

    expanded = false,
    enter = $bindable(true),
    direction = NeoIconArrowDirection.Right,
    chevron: noLine = false,
    delay,
    start,
    end,

    ...rest
  }: NeoIconArrowProps = $props();

  watch(
    () => {
      enter = false;
    },
    () => expanded,
    { skip: 1 },
  );

  const line = $derived.by(() => {
    if (direction === 'right') return 'M3 12h17.5';
    if (direction === 'left') return 'M21 12h-17.5';
    if (direction === 'up') return 'M12 21l0 -17.5';
    if (direction === 'down') return 'M12 3l0 17.5';
  });
  const chevron = $derived.by(() => {
    if (direction === 'right') return 'M21 12l-7 7M21 12l-7 -7';
    if (direction === 'left') return 'M3 12l7 7M3 12l7 -7';
    if (direction === 'up') return 'M12 3l7 7M12 3l-7 7';
    if (direction === 'down') return 'M12 21l7 -7M12 21l-7 -7';
  });
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  style:scale
  style:--neo-arrow-offset-start={start}
  style:--neo-arrow-offset-end={end}
  style:--neo-arrow-delay={delay}
  {...rest}
>
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
    <path
      stroke-dasharray="20"
      stroke-dashoffset="-20"
      d={line}
      class="neo-icon-arrow-line"
      class:neo-expanded={expanded}
      class:neo-chevron={noLine}
      data-direction={direction}
    />
    <path
      stroke-dasharray="12"
      stroke-dashoffset={enter ? 12 : 0}
      d={chevron}
      class="neo-icon-arrow-chevron"
      class:neo-expanded={expanded}
      class:neo-enter={enter}
      class:neo-chevron={noLine}
      data-direction={direction}
    >
      {#if enter}
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="12;0" />
      {/if}
    </path>
  </g>

  <style lang="scss">
    @mixin offset($x: 25%, $custom: --neo-arrow-offset) {
      &[data-direction='right'] {
        translate: calc(0% - var($custom, $x));
      }

      &[data-direction='left'] {
        translate: var($custom, $x);
      }

      &[data-direction='up'] {
        translate: 0 var($custom, $x);
      }

      &[data-direction='down'] {
        translate: 0 calc(0% - var($custom, $x));
      }
    }

    .neo-icon-arrow-chevron {
      @include offset(25%, --neo-arrow-offset-start);

      transition: translate 0.2s linear;
      transition-delay: var(--neo-arrow-delay, 0.15s);

      &.neo-expanded {
        translate: 0;
        transition-delay: 0s;
        stroke-dashoffset: 0;

        &.neo-chevron {
          @include offset(15%, --neo-arrow-offset-end);
        }
      }
    }

    .neo-icon-arrow-line {
      transition: stroke-dashoffset 0.2s ease-out;
      stroke-dashoffset: -20;

      &.neo-chevron {
        display: none;
      }

      &.neo-expanded {
        transition-delay: 0.06s;
        transition-timing-function: ease-in;
        stroke-dashoffset: 0;

        &[data-direction='right'],
        &[data-direction='left'] {
          transition-duration: 0.25s;
        }
      }
    }

    @media (hover: none) and (pointer: coarse) {
      .neo-icon-arrow-line {
        display: none;
      }

      .neo-icon-arrow-chevron.neo-expanded {
        @include offset(15%, --neo-arrow-offset-end);
      }
    }
  </style>
</svg>
