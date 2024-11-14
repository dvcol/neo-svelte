<script lang="ts">
  import type { NeoCardProps } from '~/cards/neo-card.model.js';

  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    ref = $bindable(),
    tag = 'div',

    // Styles
    elevation = 2,
    borderless,
    glass,
    rounded,
    hover,
    start,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Flex
    justify,
    align,
    flex,

    // Actions
    use,

    // Other props
    ...rest
  }: NeoCardProps = $props();
  /* eslint-enable prefer-const */

  const filter = $derived.by(() => {
    if (!glass) return;
    return `var(--neo-blur-${Math.abs(Math.trunc(elevation) + 2)})`;
  });

  const getShadow = (level: number) => {
    let shadow = `var(--neo-${glass ? 'glass-' : ''}box-shadow-`;
    if (!level) return `${shadow}flat`;
    shadow += level < 0 ? 'inset' : 'raised';
    return `${shadow}-${Math.trunc(Math.abs(level))}`;
  };

  const boxShadow = $derived.by(() => getShadow(elevation));
  const hoverShadow = $derived.by(() => {
    if (!hover) return boxShadow;
    let level = elevation + hover;
    if (level < -4) level = -4;
    if (level > 4) level = 4;
    return getShadow(level);
  });

  const hoverFlat = $derived(boxShadow.endsWith('flat') && !hoverShadow.endsWith('flat'));
  const flatHover = $derived(hoverShadow.endsWith('flat') && !boxShadow.endsWith('flat'));

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<svelte:element
  this={tag}
  bind:this={ref}
  class:neo-card={true}
  class:borderless
  class:rounded
  class:hover
  class:start
  class:hover-flat={hoverFlat}
  class:flat-hover={flatHover}
  class:glass
  class:flat={!elevation}
  style:--neo-hover-shadow-level={hoverShadow}
  style:--neo-card-box-shadow={boxShadow}
  style:--neo-glass-blur={filter}
  style:justify-content={justify}
  style:align-items={align}
  style:flex
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  .neo-card {
    display: flex;
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

    &.hover:hover.flat-hover,
    &.flat:not(.borderless, .hover-flat:hover) {
      border-color: var(--neo-card-border-color, var(--neo-border-color));
    }

    &.hover:hover {
      box-shadow: var(--neo-hover-shadow-level, var(--neo-card-box-shadow));
    }

    &.rounded {
      border-radius: var(--neo-card-border-radius, var(--neo-border-radius-lg));
    }

    &.glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);

      background-color: var(--neo-card-bg-color, var(--neo-glass-background-color));
      border-color: var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
        var(--neo-glass-left-border-color);
      backdrop-filter: var(--neo-glass-blur, var(--neo-blur-4));
    }

    &.start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.borderless) {
          border-color: var(--neo-btn-border-color, var(--neo-border-color));
        }
      }
    }
  }
</style>
