<script lang="ts">
  /* eslint-disable prefer-const -- necessary for binding checked */

  import { toStyle } from '@dvcol/common-utils/common/class';
  import { flip, offset, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole } from '@skeletonlabs/floating-ui-svelte';

  import type { NeoTooltipProps } from '~/tooltips/neo-tooltip.model.js';

  import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { DefaultShadowTooltipElevation, MaxShadowElevation } from '~/utils/shadow.utils.js';
  import { scaleTransition } from '~/utils/transition.utils.js';

  let {
    // Snippets
    tooltip,
    children,

    // States
    role,
    tag = 'span',
    ref = $bindable(),
    open = $bindable(false),
    offset: spacing = 6,
    placement,
    target,
    options,

    // Styles
    rounded,
    elevation = DefaultShadowTooltipElevation,
    blur,

    // Hover
    openOnHover = true,
    keepOpenOnHover = false,
    hoverOptions,

    // Focus
    openOnFocus = true,
    keepOpenOnFocus = false,
    focusOptions,

    // Dismiss
    closeOnDismiss = true,
    dismissOptions,

    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction = scaleTransition,

    // Actions
    use,

    // Other props
    triggerRef = $bindable(),
    triggerTag = 'span',
    triggerProps,

    ...rest
  }: NeoTooltipProps = $props();
  /* eslint-enable prefer-const */

  const host = $derived.by(() => {
    if (!target) return;
    if (typeof target === 'function') return target();
    return target;
  });

  let focus = $state(false);
  const floating = useFloating({
    get elements() {
      return {
        floating: ref,
        reference: host ?? triggerRef,
      };
    },
    get open() {
      return open;
    },
    onOpenChange(_open, _event, _reason) {
      if (_reason === 'focus' && _open) focus = true;
      if (_reason === 'focus' && !_open) {
        if (keepOpenOnFocus) return;
        focus = _open;
      }
      if (_reason === 'hover' && !_open && (keepOpenOnHover || focus)) return;

      open = _open;
    },
    middleware: [flip(), offset(spacing)],
    get placement() {
      return placement;
    },
    ...options,
  });

  const _role = useRole(floating.context, {
    get role() {
      return role ?? 'tooltip';
    },
  });
  const _hover = useHover(floating.context, {
    get enabled() {
      return openOnHover;
    },
    move: false,
    delay: 100,
    ...hoverOptions,
  });
  const _focus = useFocus(floating.context, {
    get enabled() {
      return openOnFocus;
    },
    ...focusOptions,
  });
  const _dismiss = useDismiss(floating.context, {
    get enabled() {
      return closeOnDismiss;
    },
    ...dismissOptions,
  });
  const interactions = useInteractions([_role, _hover, _focus, _dismiss]);

  const triggerHandler = $derived<HTMLNeoBaseElement>(interactions.getReferenceProps());
  const tooltipHandler = $derived<HTMLNeoBaseElement>(interactions.getFloatingProps());

  const tooltipStyle = $derived(floating?.floatingStyles?.replace(/transform:\s*translate\(\s*([^,)]+)\s*,\s*([^)]+)\s*\)/, 'translate: $1 $2'));
  const tooltipOrigin = $derived.by(() => {
    if (rest?.style?.includes('transform-origin')) return;
    if (floating.placement.startsWith('top')) return floating.placement.replace('top', 'bottom');
    if (floating.placement.startsWith('bottom')) return floating.placement.replace('bottom', 'top');
    if (floating.placement.startsWith('left')) return floating.placement.replace('left', 'right');
    if (floating.placement.startsWith('right')) return floating.placement.replace('right', 'left');
    return floating.placement;
  });

  const tooltipShadow = $derived(`var(--neo-glass-box-shadow-raised-${Math.max(0, Math.min(elevation, MaxShadowElevation))})`);
  const tooltipBlur = $derived(`var(--neo-blur-${Math.max(0, Math.min(blur ?? elevation, MaxShadowElevation))})`);

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));

  $effect(() => {
    if (!host) return;
    triggerRef = host;
    const listener: [string, EventListener][] = [
      ...Object.entries(triggerHandler),
      ['onfocusin', triggerHandler.onfocus],
      ['onfocusout', triggerHandler.onblur],
    ];
    listener.forEach(([key, value]) => {
      if (!triggerRef || typeof value !== 'function') return;
      triggerRef.addEventListener(key.substring(2).toLowerCase(), value);
    });
    return () => {
      if (!host) return;
      listener.forEach(([key, value]) => {
        if (!triggerRef || typeof value !== 'function') return;
        triggerRef.removeEventListener(key.substring(2).toLowerCase(), value);
      });
    };
  });

  $effect(() => {
    if (!host || !triggerRef) return;
    const aria = triggerHandler['aria-describedby'];
    if (aria) triggerRef.setAttribute('aria-describedby', aria);
    return () => triggerRef?.removeAttribute('aria-describedby');
  });

  const addMethods = <T extends HTMLElement>(element?: T) => {
    if (!element) return;
    if (!Object.hasOwn(element, 'toggle')) {
      Object.assign(element, {
        toggle: (state = !open) => {
          open = state;
          return open;
        },
      });
    }
    if (!Object.hasOwn(element, 'update')) {
      Object.assign(element, {
        update: () => floating.update(),
      });
    }
  };

  $effect(() => addMethods(ref));
  $effect(() => addMethods(triggerRef));
</script>

{#if !target}
  <svelte:element
    this={triggerTag}
    bind:this={triggerRef}
    class:neo-tooltip-trigger={true}
    onfocusin={triggerHandler?.onfocus}
    onfocusout={triggerHandler?.onblur}
    {...triggerHandler}
    {...triggerProps}
  >
    {@render children?.(floating)}
  </svelte:element>
{/if}

{#if floating.open}
  <svelte:element
    this={tag}
    bind:this={ref}
    class:neo-tooltip={true}
    class:neo-rounded={rounded}
    style:--neo-tooltip-box-shadow={tooltipShadow}
    style:--neo-tooltip-backdrop-filter={tooltipBlur}
    in:inFn={inProps}
    out:outFn={outProps}
    use:useFn={useProps}
    {...tooltipHandler}
    {...rest}
    style:transform-origin={tooltipOrigin}
    style={toStyle(tooltipStyle, rest.style)}
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

    &.neo-rounded {
      --neo-tooltip-border-radius: var(--neo-tooltip-border-radius-lg, var(--neo-border-radius-lg));

      padding: 0.5rem 1rem;
    }
  }
</style>
