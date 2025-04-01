<script lang="ts">
  import type { NeoTypewriterProps } from '~/text/neo-typewriter.model.js';

  import { typewriter, type TypeWriterLine } from '~/text/typewriter.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    tag = 'div',
    value,
    display = $bindable(''),

    // Speed
    speed,

    // Flow
    typo = false,
    pause = false,
    iterations = 1,
    mode = 'loop',

    // Style
    caret = true,

    // Events
    onTypo,
    onStart,
    onAbort,

    // Other props
    ...rest
  }: NeoTypewriterProps = $props();
  /* eslint-enable prefer-const */

  const lines = $derived.by<(string | TypeWriterLine)[]>(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  });

  let blink = $state(false);

  const onPause: NeoTypewriterProps['onPause'] = ctx => {
    blink = true;
    rest.onPause?.(ctx);
  };

  const onEnd: NeoTypewriterProps['onEnd'] = ctx => {
    blink = true;
    rest.onEnd?.(ctx);
  };

  const onType: NeoTypewriterProps['onType'] = ctx => {
    display = ctx.display ?? '';
    blink = false;
    rest.onType?.(ctx);
  };

  let controller: AbortController;
  $effect(() => {
    if (!lines?.length) return;
    controller = new AbortController();
    typewriter({
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
    });
    return () => {
      controller.abort();
      display = '';
    };
  });
</script>

<svelte:element this={tag} class:neo-typewriter={true} class:neo-caret={caret} class:neo-blink={blink} {...rest}>
  {display}
</svelte:element>

<style lang="scss">
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

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }
  }
</style>
