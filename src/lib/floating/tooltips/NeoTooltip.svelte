<script lang="ts">
  import { toStyle } from '@dvcol/common-utils/common/class';
  import { watch } from '@dvcol/svelte-utils/watch';
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

  import { innerHeight, innerWidth } from 'svelte/reactivity/window';
  import { scale } from 'svelte/transition';

  import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

  import { type NeoTooltipProps, NeoTooltipSizeStrategy, type NeoTooltipToggle } from '~/floating/tooltips/neo-tooltip.model.js';

  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { coerce, computeGlassFilter, computeShadowElevation, DefaultShadowElevation, PositiveMinMaxElevation } from '~/utils/shadow.utils.js';
  import { type SizeOption, toPixel, toSize } from '~/utils/style.utils.js';
  import { quickScaleProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    tooltip,
    children,

    // States
    role,
    tag = 'div',
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
    shadow = true,
    flex,
    width: inputWith,
    height: inputHeight,

    // Shadow
    elevation: _elevation = DefaultShadowElevation,
    blur: _blur,

    // Hover
    openOnHover = true,
    keepOpenOnHover = false,
    hoverDelay = 500,
    openDelay = 100,
    hoverOptions,

    // Focus
    openOnFocus = true,
    keepOpenOnFocus = false,
    focusOptions,

    // Dismiss
    closeOnDismiss = true,
    dismissOptions,

    // Events
    onChange,
    onOpen,
    onClose,

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

  const { tag: triggerTag = 'div', ...triggerRest } = $derived(triggerProps ?? {});

  const elevation = $derived(coerce(_elevation, PositiveMinMaxElevation));
  const blur = $derived(coerce(_blur ?? elevation));

  const tooltipBlur = $derived(computeGlassFilter(blur, true));
  const tooltipShadow = $derived(computeShadowElevation(elevation, { glass: true }, PositiveMinMaxElevation));

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
    get restMs() {
      return hoverDelay;
    },
    get delay() {
      return openDelay;
    },
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

  const toggle: NeoTooltipToggle = (state = !open) => {
    open = state;
    return open;
  };

  const addMethods = <T extends HTMLElement>(element?: T) => {
    if (!element) return;
    if (!Object.hasOwn(element, 'toggle')) {
      Object.assign(element, { toggle });
    }
    if (!Object.hasOwn(element, 'update')) {
      Object.assign(element, { update: () => floating.update() });
    }
  };

  $effect(() => addMethods(ref));
  $effect(() => addMethods(triggerRef));

  const computeSize = <T extends 'width' | 'height'>(value: NeoTooltipProps[T], dimension: T): SizeOption<T> | undefined => {
    if (!open) return;
    const tSize = dimension === 'width' ? triggerRef?.offsetWidth : triggerRef?.offsetHeight;
    if (value === NeoTooltipSizeStrategy.Match) return { absolute: toPixel(tSize) };
    if (value === NeoTooltipSizeStrategy.Min) return { min: toPixel(tSize) };
    if (value === NeoTooltipSizeStrategy.Max) return { max: toPixel(tSize) };
    if (value === NeoTooltipSizeStrategy.Available) return { max: toPixel(available[dimension]) };
    return toSize(value);
  };

  const width = $derived(computeSize(inputWith, 'width'));
  const height = $derived(computeSize(inputHeight, 'height'));

  watch(
    () => {
      if (!open) return;
      floating?.update();
    },
    () => [innerWidth.current, innerHeight.current],
  );

  watch(
    () => {
      onChange?.(open);
      if (open) onOpen?.();
      else onClose?.();
    },
    () => open,
    { skip: 1 },
  );
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
    {@render children?.(floating, toggle)}
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
    class:neo-shadow={shadow}
    class:neo-flat={!elevation}
    data-elevation={elevation}
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
    style:--neo-tooltip-elevation={elevation}
    style:flex
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    style={toStyle(tooltipStyle, rest.style)}
  >
    {#if typeof tooltip === 'function'}
      {@render tooltip?.(floating, toggle)}
    {:else}
      {tooltip}
    {/if}
  </svelte:element>
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-tooltip {
    @include mixin.floating;

    display: flex;
    flex: 1 0 fit-content;
    flex-direction: column;
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
      border-color: var(
        --neo-tooltip-border-color,
        var(--neo-floating-top-border-color) var(--neo-floating-right-border-color) var(--neo-floating-bottom-border-color)
          var(--neo-floating-left-border-color)
      );
    }

    &.neo-flat {
      border-color: var(--neo-tooltip-border-color, var(--neo-glass-border-color-flat));
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
