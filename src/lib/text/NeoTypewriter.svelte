<script lang="ts">
  import type { NeoTypewriterProps } from '~/text/neo-typewriter.model.js';
  import type { TypeWriterLine, TypewriterOptions } from '~/text/typewriter.utils.js';

  import { untrack } from 'svelte';

  import { typewriter } from '~/text/typewriter.utils.js';
  import { Logger } from '~/utils/logger.utils.js';

  let {
    // State
    ref = $bindable(),
    tag = 'div',
    value = $bindable(''),
    display = $bindable(''),

    // Speed
    speed,

    // Flow
    typo = false,
    pause = false,
    iterations = 1,
    mode = 'write',

    // Style
    caret = true,

    // Events
    onTypo,
    onStart,
    onAbort,
    onComplete,

    // Other props
    ...rest
  }: NeoTypewriterProps = $props();

  const lines = $derived.by<(string | TypeWriterLine)[]>(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  });

  let blink = $state(false);

  const onPause: NeoTypewriterProps['onPause'] = (ctx) => {
    blink = true;
    rest.onPause?.(ctx);
  };

  const onEnd: NeoTypewriterProps['onEnd'] = (ctx) => {
    blink = true;
    rest.onEnd?.(ctx);
  };

  const onType: NeoTypewriterProps['onType'] = (ctx) => {
    display = ctx.display ?? '';
    blink = false;
    rest.onType?.(ctx);
  };

  let writing = $state(false);
  let promise: Promise<string | undefined>;
  let controller: AbortController;
  export function write(options: TypewriterOptions, signal: AbortSignal) {
    return untrack(async () => {
      writing = true;
      try {
        promise = typewriter(options);
        await promise;
      } catch (error) {
        Logger.error('NeoTypewriter: Typewriter error', error);
      } finally {
        writing = false;
        if (!signal.aborted) onComplete?.();
      }
    });
  }

  export function abort() {
    controller?.abort();
    display = '';
  }

  $effect(() => {
    if (!lines?.length) return;
    controller = new AbortController();
    write(
      {
        lines,
        mode,
        speed,
        iterations,
        controller,
        typo,
        pause,

        onType,
        onTypo,
        onPause,
        onAbort,
        onStart,
        onEnd,
      },
      controller.signal,
    );
    return abort;
  });

</script>

<svelte:element
  this={tag}
  bind:this={ref}
  data-writing={writing}
  class:neo-typewriter={true}
  class:neo-caret={caret}
  class:neo-blink={blink}
  {...rest}
>
  {display}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/layers' as layers;

  /* Keyframes stay outside the cascade — see src/lib/styles/AGENTS.md. */
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }
  }

  @include layers.neo-components {
    .neo-typewriter {
      display: inline-block;
      min-height: 1lh;
      white-space: pre;

      &.neo-caret::after {
        display: inline-block;
        width: 0.05ch;
        height: 1.1em;
        vertical-align: text-bottom;
        background: currentcolor;
        content: '';
      }

      &.neo-blink::after {
        animation: blink 1s step-end infinite;
      }
    }
  }
</style>
