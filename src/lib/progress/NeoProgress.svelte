<script lang="ts">
  import { percent } from '@dvcol/common-utils';

  import { clamp } from '@dvcol/common-utils/common/math';

  import {
    type NeoProgressContext,
    NeoProgressDirection,
    type NeoProgressMethods,
    type NeoProgressProps,
    NeoProgressState,
  } from '~/progress/neo-progress.model.js';
  import { getColorVariable } from '~/utils/colors.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // State
    tag = 'div',
    ref = $bindable(),

    state = $bindable(), // active, finished, paused, indeterminate, idle

    value = $bindable(0),
    buffer = $bindable(0),
    min = 0,
    max = 100,
    indeterminate = false,
    step = 1,
    tick = 500,
    timeout,

    // Styles
    low, // threshold for tinting
    high, // threshold for tinting
    width,
    height,
    color,
    direction = NeoProgressDirection.Right,

    // Other Props
    ...rest
  }: NeoProgressProps = $props();
  /* eslint-enable prefer-const */

  // TODO: circular progress

  const buffered = $derived((buffer ?? 0) > value ? buffer : value);

  const valueProgress = $derived(value ? `${percent(clamp(value, min, max), 100)}%` : '-0.125rem');
  const bufferProgress = $derived(buffered ? `${percent(clamp(buffered, min, max), 100)}%` : '-0.125rem');

  const colorArray = $derived(Array.isArray(color) ? color.map(getColorVariable) : [getColorVariable(color)]);
  const background = $derived.by(() => {
    if (colorArray.length === 1) return colorArray[0];
    if (colorArray.length === 3) {
      if (value <= (low ?? min)) return colorArray[0];
      if (value >= (high ?? max)) return colorArray[2];
      return colorArray[1];
    }
    if (colorArray.length === 2 && low !== undefined) {
      if (value <= low) return colorArray[0];
      return colorArray[1];
    }
    if (colorArray.length === 2 && high !== undefined) {
      if (value >= high) return colorArray[1];
      return colorArray[0];
    }
  });

  const controlled = $derived(state && ([NeoProgressState.Active, NeoProgressState.Indeterminate] as string[]).includes(state));

  let intervalId: ReturnType<typeof setTimeout>;
  let timeoutId: ReturnType<typeof setTimeout>;
  const clear = () => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  };

  export const change: NeoProgressMethods['change'] = (newValue?: number, newBuffer = buffer) => {
    if (newValue === undefined && newBuffer === undefined) return;
    clear();
    if (newValue !== undefined) value = newValue;
    if (newBuffer !== undefined) buffer = newBuffer;
    state = NeoProgressState.Idle;
  };

  export const stop: NeoProgressMethods['stop'] = () => {
    clear();
    state = NeoProgressState.Paused;
  };

  export const complete: NeoProgressMethods['complete'] = (pending = indeterminate) => {
    clear();
    value = max ?? 100;
    buffer = max ?? 100;
    state = pending ? NeoProgressState.Indeterminate : NeoProgressState.Completed;
  };

  export const start: NeoProgressMethods['start'] = (pending = indeterminate, expire = timeout) => {
    state = NeoProgressState.Active;
    clear();
    intervalId = setInterval(() => {
      if (value < max) value += step;
      else complete(pending);
    }, tick);
    if (expire) timeoutId = setTimeout(() => complete(), expire);
  };

  export const reset: NeoProgressMethods['reset'] = (restart = state === NeoProgressState.Active) => {
    clear();
    value = min ?? 0;
    buffer = min ?? 0;
    if (restart) start();
    else state = NeoProgressState.Idle;
  };

  export const cancel: NeoProgressMethods['cancel'] = () => {
    clear();
    reset(false);
  };

  const context = $derived<NeoProgressContext>({
    state,

    value,
    buffer,
    min,
    max,
    indeterminate,

    step,
    tick,
    timeout,

    color,
    direction,
  });

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, {
      get context() {
        return context;
      },
      start,
      stop,
      reset,
      cancel,
      change,
      complete,
    });
  });
</script>

<svelte:element
  this={tag}
  role="progressbar"
  bind:this={ref}
  class:neo-progress={true}
  class:neo-indeterminate={indeterminate || state === NeoProgressState.Indeterminate}
  class:neo-controlled={controlled}
  data-direction={direction}
  data-indeterminate={indeterminate}
  data-state={state}
  data-min={min}
  data-max={max}
  data-low={low}
  data-high={high}
  data-value={value}
  style:width
  style:height
  style:--neo-progress-background={background}
  {...rest}
>
  <span class="neo-progress-value" style:--neo-progress-value={valueProgress}></span>
  <span class="neo-progress-buffer" style:--neo-progress-buffer={bufferProgress}></span>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/animation' as animation;

  .neo-progress {
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    background: var(--neo-progress-track-background, var(--neo-background-color-secondary));
    border: var(--neo-border-width, 1px) solid transparent;
    border-radius: inherit;
    transition: background-color 1s ease;
    appearance: none;

    &-buffer,
    &-value {
      position: absolute;
      border-radius: inherit;
      transition:
        translate 1s ease,
        background-color 1.5s ease;
      inset: 0;
    }

    &-value {
      background: var(--neo-progress-background, currentColor);
    }

    &-buffer {
      background: var(--neo-progress-buffer-background, color-mix(in srgb, var(--neo-progress-background, currentColor), transparent 85%));
    }

    &.neo-controlled {
      .neo-progress-buffer,
      .neo-progress-value {
        transition:
          translate 1s linear,
          background-color 1.5s ease;
      }
    }

    &[data-direction='right'],
    &[data-direction='left'] {
      width: 100%;
      height: 0.375rem;
    }

    &[data-direction='right'] {
      .neo-progress-buffer,
      .neo-progress-value {
        transform-origin: 0 50%;
      }

      .neo-progress-value {
        translate: calc(var(--neo-progress-value, 0%) - 100%);
      }

      .neo-progress-buffer {
        translate: calc(var(--neo-progress-buffer, 0%) - 100%);
      }
    }

    &[data-direction='left'] {
      .neo-progress-buffer,
      .neo-progress-value {
        transform-origin: 100% 50%;
      }

      .neo-progress-value {
        translate: calc(100% - var(--neo-progress-value, 0%));
      }

      .neo-progress-buffer {
        translate: calc(100% - var(--neo-progress-buffer, 0%));
      }
    }

    &[data-direction='top'],
    &[data-direction='bottom'] {
      width: 0.375rem;
      height: 100%;
    }

    &[data-direction='top'] {
      .neo-progress-buffer,
      .neo-progress-value {
        transform-origin: 50% 100%;
      }

      .neo-progress-value {
        translate: 0 calc(100% - var(--neo-progress-value, 0%));
      }

      .neo-progress-buffer {
        translate: 0 calc(100% - var(--neo-progress-buffer, 0%));
      }
    }

    &[data-direction='bottom'] {
      .neo-progress-buffer,
      .neo-progress-value {
        transform-origin: 50% 0;
      }

      .neo-progress-value {
        translate: 0 calc(var(--neo-progress-value, 0%) - 100%);
      }

      .neo-progress-buffer {
        translate: 0 calc(var(--neo-progress-buffer, 0%) - 100%);
      }
    }

    &.neo-indeterminate {
      .neo-progress-buffer,
      .neo-progress-value {
        background-color: var(--neo-progress-indeterminate-background, var(--neo-progress-background, currentColor));
        animation-duration: var(--neo-progress-indeterminate-duration, 3s);
        animation-timing-function: var(--neo-progress-indeterminate-timing, linear);
        animation-iteration-count: var(--neo-progress-indeterminate-iteration, infinite);
        translate: 0;
      }

      &[data-direction='right'] {
        .neo-progress-buffer {
          animation-name: indeterminate-fast-right;

          @include animation.indeterminate-fast(right, X);
        }

        .neo-progress-value {
          animation-name: indeterminate-slow-right;

          @include animation.indeterminate-slow(right, X);
        }
      }

      &[data-direction='left'] {
        .neo-progress-buffer {
          animation-name: indeterminate-fast-left;

          @include animation.indeterminate-fast(left, X, negative);
        }

        .neo-progress-value {
          animation-name: indeterminate-slow-left;

          @include animation.indeterminate-slow(left, X, negative);
        }
      }

      &[data-direction='top'] {
        .neo-progress-buffer {
          animation-name: indeterminate-fast-top;

          @include animation.indeterminate-fast(top, Y, negative);
        }

        .neo-progress-value {
          animation-name: indeterminate-slow-top;

          @include animation.indeterminate-slow(top, Y, negative);
        }
      }

      &[data-direction='bottom'] {
        .neo-progress-buffer {
          animation-name: indeterminate-fast-bottom;

          @include animation.indeterminate-fast(bottom, Y);
        }

        .neo-progress-value {
          animation-name: indeterminate-slow-bottom;

          @include animation.indeterminate-slow(bottom, Y);
        }
      }
    }
  }
</style>
