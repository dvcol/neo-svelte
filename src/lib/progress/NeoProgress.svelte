<script lang="ts">
  import type {
    NeoProgressChange,
    NeoProgressComplete,
    NeoProgressContext,
    NeoProgressProps,
    NeoProgressStart,
    NeoProgressStatuses,
  } from '~/progress/neo-progress.model.js';

  import { percent } from '@dvcol/common-utils';
  import { clamp } from '@dvcol/common-utils/common/math';

  import { NeoProgressDirection, NeoProgressStatus } from '~/progress/neo-progress.model.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { toSize } from '~/utils/style.utils.js';

  let {
    // Snippets
    children,

    // State
    tag = 'div',
    ref = $bindable(),

    status = $bindable(), // active, finished, paused, indeterminate, idle

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
    flex,
    width: _width,
    height: _height,
    track = true,
    color,
    direction = NeoProgressDirection.Right,
    immediate = $bindable(false),

    // Other Props
    ...rest
  }: NeoProgressProps = $props();

  // TODO: circular progress
  const isIndeterminate = $derived(indeterminate || status === NeoProgressStatus.Indeterminate);

  const buffered = $derived((buffer ?? 0) > value ? buffer : value);

  const valueProgress = $derived.by(() => {
    if (isIndeterminate) return '100%';
    return value ? `${percent(clamp(value, min, max), 100)}%` : '-0.125rem';
  });
  const bufferProgress = $derived.by(() => {
    if (isIndeterminate) return '100%';
    return buffered ? `${percent(clamp(buffered, min, max), 100)}%` : '-0.125rem';
  });

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

  const controlled = $derived(status === NeoProgressStatus.Active || status === NeoProgressStatus.Indeterminate);

  /** Method to execute on the next animation iteration. */
  let nextIteration = $state<() => void>();
  /** Deferred function to be called on the next animation iteration. */
  async function deferIteration<T extends () => Promise<undefined | NeoProgressStatuses>>(fn: T, defer = true) {
    if (!defer || nextIteration) return fn();
    const { promise, resolve } = Promise.withResolvers<undefined | NeoProgressStatuses>();
    nextIteration = async () => resolve(await fn());
    return promise;
  };
  /** Triggered when the animation iteration ends to gracefully transition the progress bar out of the indeterminate state. */
  async function onIteration() {
    if (!nextIteration) return;
    await nextIteration();
    nextIteration = undefined;
  };

  let intervalId: ReturnType<typeof setTimeout>;
  let timeoutId: ReturnType<typeof setTimeout>;
  const clear = () => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  };

  export function change({ value: newValue, buffer: newBuffer, state }: NeoProgressChange = {}): undefined | NeoProgressStatuses {
    if (newValue === undefined && newBuffer === undefined) return status;
    clear();
    if (newValue !== undefined) value = newValue;
    if (newBuffer !== undefined) buffer = newBuffer;
    status = state ?? (value >= (min ?? 0) ? NeoProgressStatus.Paused : NeoProgressStatus.Idle);
    return status;
  }

  function deferComplete(opts: NeoProgressComplete) {
    const _immediate = immediate;
    immediate = true;
    change({ value: min, buffer: min });
    const { promise, resolve } = Promise.withResolvers<undefined | NeoProgressStatuses>();
    setTimeout(async () => {
      immediate = _immediate;
      const status = await complete({ ...opts, defer: false });
      resolve(status);
    }, 0);
    return promise;
  }

  export function complete({ pending = indeterminate, state, defer = true }: NeoProgressComplete = {}): undefined | NeoProgressStatuses | Promise<undefined | NeoProgressStatuses> {
    if (status === NeoProgressStatus.Indeterminate) return deferIteration(() => deferComplete({ pending, state }), defer);
    clear();
    value = max ?? 100;
    buffer = max ?? 100;
    status = state ?? (pending ? NeoProgressStatus.Indeterminate : NeoProgressStatus.Completed);
    return status;
  }

  function deferCancel() {
    const _immediate = immediate;
    immediate = true;
    clear();
    change({ value: min, buffer: min, state: NeoProgressStatus.Cancelled });
    const { promise, resolve } = Promise.withResolvers<undefined | NeoProgressStatuses>();
    setTimeout(() => {
      immediate = _immediate;
      resolve(status);
    }, 0);
    return promise;
  }

  export function cancel(defer = true): undefined | NeoProgressStatuses | Promise<undefined | NeoProgressStatuses> {
    if (status === NeoProgressStatus.Indeterminate) return deferIteration(deferCancel, defer);
    clear();
    change({ value: min, buffer: min, state: NeoProgressStatus.Cancelled });
    return status;
  }

  export function start({ pending = indeterminate, expire = timeout, indeterminate: startIndeterminate, ...seed }: NeoProgressStart = {}): undefined | NeoProgressStatuses {
    clear();
    if (startIndeterminate) {
      change({ value: min, buffer: min, state: NeoProgressStatus.Indeterminate });
    } else {
      change(seed);
      status = NeoProgressStatus.Active;
      intervalId = setInterval(() => {
        if (value < max) value += step;
        else complete({ pending });
      }, tick);
    }
    if (expire) timeoutId = setTimeout(() => complete(), expire);
    return status;
  }

  export function stop(): undefined | NeoProgressStatuses {
    clear();
    status = NeoProgressStatus.Paused;
    return status;
  };

  export function reset(restart = status === NeoProgressStatus.Active, _start?: NeoProgressStart): undefined | NeoProgressStatuses {
    clear();
    if (restart) return start({ value: min, buffer: min, ..._start });
    return change({ value: min, buffer: min });
  }

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  const context = $derived<NeoProgressContext>({
    status,

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
      start,
      stop,
      reset,
      cancel,
      change,
      complete,
      get status() {
        return status;
      },
      get value() {
        return value;
      },
      get buffer() {
        return buffer;
      },
    });
  });
</script>

<svelte:element
  this={tag}
  role="progressbar"
  bind:this={ref}
  class:neo-progress={true}
  class:neo-indeterminate={isIndeterminate}
  class:neo-controlled={controlled}
  class:neo-track={track}
  class:neo-immediate={immediate}
  data-direction={direction}
  data-indeterminate={indeterminate}
  data-status={status}
  data-min={min}
  data-max={max}
  data-low={low}
  data-high={high}
  data-value={value}
  style:flex
  style:width={width?.absolute}
  style:min-width={width?.min}
  style:max-width={width?.max}
  style:height={height?.absolute}
  style:min-height={height?.min}
  style:max-height={height?.max}
  style:--neo-progress-background={background}
  {...rest}
>
  <span class="neo-progress-value" style:--neo-progress-value={valueProgress} onanimationiteration={onIteration}></span>
  <span class="neo-progress-buffer" style:--neo-progress-buffer={bufferProgress} onanimationiteration={onIteration}></span>
  {@render children?.(context)}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/animation' as animation;

  .neo-progress {
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    border: var(--neo-border-width, 1px) solid transparent;
    border-radius: inherit;
    transition: background-color 1s ease;
    appearance: none;

    &.neo-track {
      background: var(--neo-progress-track-background, var(--neo-background-color-secondary));
    }

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
        transition: translate 1s linear, background-color 1.5s ease;
      }
    }

    &.neo-immediate {
      .neo-progress-buffer,
      .neo-progress-value {
        transition: none;
      }
    }

    &[data-status='completed'],
    &[data-status='error'],
    &[data-status='success'],
    &[data-status='warning'] {
      .neo-progress-value,
      .neo-progress-buffer {
        transition: translate 0.5s linear, background-color 0.1s ease;
      }
    }

    &[data-status='error'] {
      .neo-progress-value {
        background: var(--neo-progress-background, var(--neo-color-error));
      }

      .neo-progress-buffer {
        background: var(--neo-progress-buffer-background, color-mix(in srgb, var(--neo-progress-background, var(--neo-color-error)), transparent 85%));
      }
    }

    &[data-status='success'] {
      .neo-progress-value {
        background: var(--neo-progress-background, var(--neo-color-success));
      }

      .neo-progress-buffer {
        background: var(--neo-progress-buffer-background, color-mix(in srgb, var(--neo-progress-background, var(--neo-color-success)), transparent 85%));
      }
    }

    &[data-status='warning'] {
      .neo-progress-value {
        background: var(--neo-progress-background, var(--neo-color-warning));
      }

      .neo-progress-buffer {
        background: var(--neo-progress-buffer-background, color-mix(in srgb, var(--neo-progress-background, var(--neo-color-warning)), transparent 85%));
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
