<script lang="ts">
  import type { NeoTransitionContainerProps } from '~/containers/neo-transition-container.model.js';

  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';

  const {
    // Snippets
    children,

    // States
    tag = 'div',
    key,

    // Styles
    overflow,
    overflowX,
    overflowY,

    // Size
    ratio,
    width,
    height,
    reverse,

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
  class:neo-reverse={reverse}
  style:overflow
  style:overflow-x={overflowX}
  style:overflow-y={overflowY}
  style:width
  style:height
  style:aspect-ratio={ratio}
  out:outFn={outProps}
  in:inFn={inProps}
  {...rest}
>
  {#if key !== undefined}
    {#key key}
      {@render children?.()}
    {/key}
  {:else}
    {@render children?.()}
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-transition-container {
    @include mixin.transition-container;

    &.neo-reverse {
      justify-content: flex-end;
      text-align: end;
    }
  }
</style>
