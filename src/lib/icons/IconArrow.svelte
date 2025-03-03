<script lang="ts">
  import { watch } from '@dvcol/svelte-utils/watch';

  import { IconArrowDirection, type IconArrowProps } from '~/icons/icon.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    size = '1em',
    scale = 1,
    stroke = 2,

    expanded = false,
    enter = $bindable(true),
    direction = IconArrowDirection.Right,

    ...rest
  }: IconArrowProps = $props();
  /* eslint-enable prefer-const */

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

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style:scale {...rest}>
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={stroke}>
    <path
      stroke-dasharray="20"
      stroke-dashoffset="-20"
      d={line}
      class="neo-icon-arrow-line"
      class:neo-expanded={expanded}
      data-direction={direction}
    />
    <path
      stroke-dasharray="12"
      stroke-dashoffset={enter ? 12 : 0}
      d={chevron}
      class="neo-icon-arrow-chevron"
      class:neo-expanded={expanded}
      class:neo-enter={enter}
      data-direction={direction}
    >
      {#if enter}
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="12;0" />
      {/if}
    </path>
  </g>

  <style>
    .neo-icon-arrow-chevron {
      transition: translate 0.2s linear;
      transition-delay: 0.15s;

      &[data-direction='right'] {
        translate: -25%;
      }

      &[data-direction='left'] {
        translate: 25%;
      }

      &[data-direction='up'] {
        translate: 0 25%;
      }

      &[data-direction='down'] {
        translate: 0 -25%;
      }

      &.neo-expanded {
        translate: 0;
        transition-delay: 0s;
        stroke-dashoffset: 0;
      }
    }

    .neo-icon-arrow-line {
      transition: stroke-dashoffset 0.2s ease-out;
      stroke-dashoffset: -20;

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
        &[data-direction='right'] {
          translate: -15%;
        }

        &[data-direction='left'] {
          translate: 15%;
        }

        &[data-direction='up'] {
          translate: 0 15%;
        }

        &[data-direction='down'] {
          translate: 0 -15%;
        }
      }
    }
  </style>
</svg>
