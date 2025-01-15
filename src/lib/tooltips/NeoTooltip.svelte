<script lang="ts">
  /* eslint-disable prefer-const -- necessary for binding checked */

  import { toStyle } from '@dvcol/common-utils/common/class';
  import { flip, offset, useDismiss, useFloating, useHover, useInteractions, useRole } from '@skeletonlabs/floating-ui-svelte';

  import type { NeoTooltipProps } from '~/tooltips/neo-tooltip.model.js';

  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { enterDefaultFadeTransition } from '~/utils/transition.utils.js';

  let {
    // Snippets
    tooltip,
    children,

    // States

    role,
    tag = 'span',
    ref = $bindable(),
    open = $bindable(false),

    // Hover
    openOnHover = true,
    keepOpenOnHover = false,
    hoverOptions,

    // Dismiss
    closeOnDismiss = true,
    dismissOptions,

    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction = enterDefaultFadeTransition,

    // Actions
    use,

    // Other props
    triggerRef = $bindable(),
    triggerTag = 'span',
    triggerProps,

    ...rest
  }: NeoTooltipProps = $props();
  /* eslint-enable prefer-const */

  const floating = useFloating({
    get elements() {
      return {
        floating: ref,
        reference: triggerRef,
      };
    },
    get open() {
      return open;
    },
    onOpenChange(_open, _event, _reason) {
      if (_reason === 'hover' && keepOpenOnHover && !_open) return;
      open = _open;
    },
    middleware: [flip(), offset(4)],
  });

  const _role = useRole(floating.context, { role: role ?? 'tooltip' });
  const _hover = useHover(floating.context, { enabled: openOnHover, move: false, delay: 100, ...hoverOptions });
  const _dismiss = useDismiss(floating.context, { enabled: closeOnDismiss, ...dismissOptions });
  const interactions = useInteractions([_role, _hover, _dismiss]);

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<svelte:element this={triggerTag} bind:this={triggerRef} class:neo-tooltip-trigger={true} {...interactions.getReferenceProps()} {...triggerProps}>
  {@render children?.(floating)}
</svelte:element>

{#if floating.open}
  <svelte:element
    this={tag}
    bind:this={ref}
    class:neo-tooltip={true}
    in:inFn={inProps}
    out:outFn={outProps}
    use:useFn={useProps}
    {...interactions.getFloatingProps()}
    {...rest}
    style={toStyle(floating?.floatingStyles, rest.style)}
  >
    {#if typeof tooltip === 'string'}
      {tooltip}
    {:else}
      {@render tooltip?.(floating)}
    {/if}
  </svelte:element>
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-tooltip {
    @include mixin.tooltip;
  }
</style>
