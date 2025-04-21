<script lang="ts">
  import type { NeoPortalContainerProps } from '~/floating/portal/neo-portail-container.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';

  import { setNeoPortalContext } from '~/floating/portal/neo-portal-context.svelte.js';

  let {
    // Snippets
    children,

    // State
    ref = $bindable(),
    tag = 'div',
    id = `neo-portal-container-${getUUID()}`,
    scale = true,

    // Flex
    justify,
    align,
    flex,

    // Other Props
    ...rest
  }: NeoPortalContainerProps = $props();

  const context = setNeoPortalContext(id);

  const open = $derived(context.open);
  const placement = $derived(context.placement);

  $effect(() => {
    if (!ref) return;
    context.updateRef(ref);
    return () => context.updateRef(undefined);
  });
</script>

<svelte:element
  this={tag}
  bind:this={ref}
  data-open={open}
  data-placement={placement}
  class:neo-portal-container={true}
  class:neo-scale={scale}
  class:neo-open={open}
  style:flex
  style:align-items={align}
  style:justify-content={justify}
  {id}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  .neo-portal-container {
    &:not(.neo-scale) {
      display: contents;
    }

    &.neo-scale {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      transition-timing-function: var(--neo-portail-container-exit-timing, ease);
      transition-duration: var(--neo-portail-container-exit-duration, 0.4s);
      transition-property: scale, translate;

      &[data-placement^='center'] {
        transform-origin: center;
        transition-duration: var(--neo-portail-container-enter-duration, 0.3s);
      }

      &[data-placement^='top'] {
        transform-origin: center bottom;

        --neo-portail-container-enter-translate: 0 calc(0% - env(safe-area-inset-bottom) - 1rem);
      }

      &[data-placement^='bottom'] {
        transform-origin: center top;

        --neo-portail-container-enter-translate: 0 calc(env(safe-area-inset-top) + 1rem);
      }

      &[data-placement^='left'] {
        transform-origin: center right;

        --neo-portail-container-enter-translate: calc(0% - env(safe-area-inset-right) - 1rem);
      }

      &[data-placement^='right'] {
        transform-origin: center left;

        --neo-portail-container-enter-translate: calc(env(safe-area-inset-left) + 1rem);
      }

      &.neo-open {
        transition-timing-function: var(--neo-portail-container-enter-timing, ease);
        transition-duration: var(--neo-portail-container-enter-duration, 0.4s);
        scale: var(--neo-portail-container-enter-scale, 0.98);
        translate: var(--neo-portail-container-enter-translate, 0);
      }
    }
  }
</style>
