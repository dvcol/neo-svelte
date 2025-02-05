<script lang="ts">
  import type { NeoTransitionContainerProps } from '~/containers/neo-transition-container.model.js';

  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';

  const {
    // Snippets
    children,

    // States
    tag = 'div',

    // Styles
    overflow,
    overflowX,
    overflowY,
    width,
    height,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    ...rest
  }: NeoTransitionContainerProps = $props();

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));
</script>

<svelte:element
  this={tag}
  class:neo-transition-container={true}
  style:overflow
  style:overflow-x={overflowX}
  style:overflow-y={overflowY}
  style:width
  style:height
  out:outFn={outProps}
  in:inFn={inProps}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-transition-container {
    @include mixin.transition-container;
  }
</style>
