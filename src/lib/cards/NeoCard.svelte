<script lang="ts">
  import type { NeoCardProps } from '~/cards/neo-card.model.js';

  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';

  const {
    // Snippets
    children,

    // States
    tag = 'div',

    // Styles
    elevation = 2,
    borderless,
    glass,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Other props
    ...rest
  }: NeoCardProps = $props();

  const style = $derived.by(() => {
    const level = Math.abs(elevation) > 0.5 ? Math.abs(elevation) : 0;
    let shadow = `--neo-card-box-shadow: var(--neo-${glass ? 'glass-' : ''}box-shadow-`;
    const filter = `--neo-glass-blur: var(--neo-blur-${level + 2})`;
    if (!elevation) shadow += 'flat';
    else if (elevation < 0) shadow += 'inset';
    else shadow += 'raised';
    shadow += `-${level})`;
    return [shadow, filter, rest.style].filter(Boolean).join('; ');
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<svelte:element
  this={tag}
  class="neo-card"
  class:borderless
  class:glass
  class:flat={!elevation}
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  {...rest}
  {style}
>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  .neo-card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: calc(100% - var(--neo-shadow-margin, 0.25rem) * 2);
    margin: var(--neo-shadow-margin, 0.25rem);
    padding: 2rem;
    color: var(--neo-card-text-color, inherit);
    background-color: var(--neo-card-bg-color, transparent);
    border: var(--neo-border-width, 1px) var(--neo-card-border-color, transparent) solid;
    border-radius: var(--neo-card-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-card-box-shadow, var(--neo-box-shadow-flat));
    transition:
      color 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      box-shadow 0.3s ease-out;

    &.flat:not(.borderless) {
      border-color: var(--neo-card-border-color, var(--neo-border-color));
    }

    &.glass {
      background-color: var(--neo-glass-background-color);
      backdrop-filter: var(--neo-glass-blur);
    }
  }
</style>
