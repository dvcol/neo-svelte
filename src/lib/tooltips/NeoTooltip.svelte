<script lang="ts">
  import { toStyle } from '@dvcol/common-utils/common/class';
  import { clamp } from '@dvcol/common-utils/common/math';
  import {
    autoPlacement,
    flip,
    offset,
    size,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
  } from '@skeletonlabs/floating-ui-svelte';

  import { scale } from 'svelte/transition';

  import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

  import { type NeoTooltipProps, NeoTooltipSizeStrategy } from '~/tooltips/neo-tooltip.model.js';

  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { coerce, DefaultShadowShallowElevation, MaxShadowElevation } from '~/utils/shadow.utils.js';
  import { type SizeOption, toPixel, toSize } from '~/utils/style.utils.js';
  import { quickScaleProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
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
    color,
    filled,
    tinted,
    padding,
    rounded,
    width: inputWith,
    height: inputHeight,

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
    transition: transitionAction = { use: scale, props: quickScaleProps },

    // Actions
    use,

    // Other props
    triggerRef = $bindable(),
    triggerProps,

    ...rest
  }: NeoTooltipProps = $props();
  /* eslint-enable prefer-const */

  const { tag: triggerTag = 'span', ...triggerRest } = $derived(triggerProps ?? {});

  const elevation = $derived(coerce(rest?.elevation ?? DefaultShadowShallowElevation));
  const blur = $derived(coerce(rest?.blur ?? elevation));

  const host = $derived.by(() => {
    if (!target) return;
    if (typeof target === 'function') return target();
    return target;
  });

  const available = $state<{ width?: number; height?: number }>({});

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
    get middleware() {
      const middleware = [
        offset(spacing),
        size({
          apply({ availableWidth, availableHeight }) {
            available.width = availableWidth - 8;
            available.height = availableHeight - 8;
          },
        }),
      ];
      if (placement === 'auto') middleware.push(autoPlacement());
      else
        middleware.push(
          flip({
            fallbackAxisSideDirection: 'end',
          }),
        );
      return middleware;
    },
    get placement() {
      if (placement === 'auto') return undefined;
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

  const tooltipShadow = $derived(`var(--neo-glass-box-shadow-raised-${clamp(elevation, 1, MaxShadowElevation)})`);
  const tooltipBlur = $derived(`var(--neo-blur-${clamp(blur, 1, MaxShadowElevation)})`);

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

  const computeSize = <T extends 'width' | 'height'>(value: NeoTooltipProps[T], dimension: T): SizeOption<T> | undefined => {
    if (!open) return;
    const tSize = dimension === 'width' ? triggerRef?.offsetWidth : triggerRef?.offsetHeight;
    if (value === NeoTooltipSizeStrategy.Match) return { absolute: toPixel(tSize) };
    if (value === NeoTooltipSizeStrategy.Min) return { max: toPixel(available[dimension]), min: toPixel(tSize) };
    if (value === NeoTooltipSizeStrategy.Max) return { max: toPixel(tSize) };
    const iSize = toSize(value);
    return { max: iSize?.absolute ? undefined : toPixel(available[dimension]), ...iSize };
  };

  const width = $derived(computeSize(inputWith, 'width'));
  const height = $derived(computeSize(inputHeight, 'height'));
</script>

{#if !target}
  <svelte:element
    this={triggerTag}
    bind:this={triggerRef}
    class:neo-tooltip-trigger={true}
    onfocusin={triggerHandler?.onfocus}
    onfocusout={triggerHandler?.onblur}
    {...triggerHandler}
    {...triggerRest}
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
    class:neo-tinted={tinted}
    class:neo-filled={filled}
    style:--neo-tooltip-text-color={getColorVariable(color)}
    style:--neo-tooltip-box-shadow={tooltipShadow}
    style:--neo-tooltip-backdrop-filter={tooltipBlur}
    in:inFn={inProps}
    out:outFn={outProps}
    use:useFn={useProps}
    {...tooltipHandler}
    {...rest}
    style:transform-origin={tooltipOrigin}
    style:--neo-tooltip-padding={padding}
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
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

    color: var(--neo-tooltip-text-color, inherit);

    :global(> .neo-list:only-child) {
      width: inherit;
      min-width: inherit;
      max-width: inherit;
      height: inherit;
      min-height: inherit;
      max-height: inherit;
    }

    &.neo-tinted {
      background-color: var(--neo-tooltip-bg-color, var(--neo-glass-background-color-tinted));
    }

    &.neo-filled {
      background-color: var(--neo-tooltip-bg-color, var(--neo-background-color));

      &:not(.neo-tinted) {
        border-color: var(
          --neo-tooltip-border-color,
          var(--neo-floating-top-border-color) var(--neo-floating-right-border-color) var(--neo-floating-bottom-border-color)
            var(--neo-floating-left-border-color)
        );
      }
    }

    &.neo-rounded {
      --neo-tooltip-border-radius: var(--neo-tooltip-border-radius-lg, var(--neo-border-radius-lg));
      --neo-tooltip-padding: 0.625rem 1rem;

      :global(> .neo-list:only-child) {
        --neo-list-scrollbar-padding: 0.75rem;

        clip-path: inset(0 round var(--neo-tooltip-border-radius, var(--neo-border-radius)));
      }
    }
  }
</style>
