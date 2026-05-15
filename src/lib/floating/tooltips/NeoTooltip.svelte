<script lang="ts">
  import type { NeoTooltipHTMLElement, NeoTooltipProps } from '~/floating/tooltips/neo-tooltip.model.js';
  import type { SizeOption } from '~/utils/style.utils.js';

  import { watch } from '@dvcol/svelte-utils/watch';
  import { innerHeight, innerWidth } from 'svelte/reactivity/window';
  import { scale } from 'svelte/transition';

  import {
    autoPlacement,
    click,
    dismiss,
    flip,
    focus as focusInteraction,
    hover,
    offset,
    Popover,
    role as roleInteraction,
    size,
  } from '~/floating/common/popover/index.js';
  import NeoPortal from '~/floating/portal/NeoPortal.svelte';
  import { isOffsetFunction, NeoTooltipSizeStrategy } from '~/floating/tooltips/neo-tooltip.model.js';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeBorderRadius } from '~/utils/border.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { coerce, computeGlassFilter, computeShadowElevation, DefaultShadowElevation, PositiveMinMaxElevation } from '~/utils/shadow.utils.js';
  import { isSizeOption, toPixel, toSize } from '~/utils/style.utils.js';
  import { quickScaleOpacityProps, quickScaleProps } from '~/utils/transition.utils.js';

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
    position = $bindable(),
    target,
    options,
    portal,

    // Styles
    color,
    filled,
    tinted,
    rounded,
    borderless,

    // Sizing
    flex,
    align,
    justify,
    padding,
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

    // Click
    openOnClick = false,
    keepOpenOnClick = false,
    clickOptions,

    // Dismiss
    closeOnDismiss = true,
    dismissOptions,

    // Mounting
    unmountOnClose = true,
    fade = !unmountOnClose,

    // Events
    onChange,
    onOpen,
    onClose,

    // Actions
    transition: transitionAction,
    in: inAction = transitionAction ? undefined : { use: scale, props: quickScaleOpacityProps },
    out: outAction = transitionAction ? undefined : { use: scale, props: quickScaleProps },

    // Actions
    use,

    // Other props
    triggerRef = $bindable(),
    triggerProps,
    portalProps,
    ...rest
  }: NeoTooltipProps = $props();

  const { tag: triggerTag = 'div', ...triggerRest } = $derived(triggerProps ?? {});

  const elevation = $derived(coerce(_elevation, PositiveMinMaxElevation));
  const blur = $derived(coerce(_blur ?? elevation));

  const tooltipBlur = $derived(computeGlassFilter(blur, true));
  const tooltipShadow = $derived(computeShadowElevation(elevation, { glass: true }, PositiveMinMaxElevation));

  let wrapperRef = $state<HTMLElement>();
  const host = $derived.by(() => {
    if (!target) return;
    if (typeof target === 'function') return target();
    return target;
  });

  const available = $state<{ width?: number; height?: number }>({});

  let focusActive = $state(false);
  export const floating: Popover = new Popover({
    get open() {
      return open;
    },
    onOpenChange(_open, _event, _reason) {
      if (_reason === 'focus' && _open) focusActive = true;
      if (_reason === 'focus' && !_open) {
        if (keepOpenOnFocus) return;
        focusActive = _open;
      }
      if (_reason === 'hover' && !_open && (keepOpenOnHover || focusActive)) return;
      if (_reason === 'click' && _open && keepOpenOnClick) return;
      if (_reason !== 'click') open = _open;
    },
    get middleware() {
      const middleware = [
        offset((isOffsetFunction(spacing) ? spacing(position ?? placement) : spacing) ?? 6),
        size({
          apply({ availableWidth, availableHeight }) {
            available.width = availableWidth - 8;
            available.height = availableHeight - 8;
          },
        }),
      ];
      if (placement === 'auto') middleware.push(autoPlacement());
      else middleware.push(flip({ fallbackAxisSideDirection: 'end' }));
      return middleware;
    },
    get placement() {
      if (placement === 'auto') return undefined;
      return placement;
    },
    interactions: [
      roleInteraction({
        get role() {
          return role ?? 'tooltip';
        },
      }),
      hover({
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
      }),
      focusInteraction({
        get enabled() {
          return openOnFocus;
        },
        // PR #164: bubbling focusin/focusout so a focusable child of a
        // wrapper trigger opens the tooltip via tab navigation.
        focusWithin: true,
        ...focusOptions,
      }),
      click({
        get enabled() {
          return openOnClick;
        },
        ...clickOptions,
      }),
      dismiss({
        get enabled() {
          return closeOnDismiss;
        },
        ...dismissOptions,
      }),
    ],
    ...options,
  });

  // Reflect final position
  watch(
    () => {
      position = floating.placement;
    },
    () => floating.placement,
  );

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));

  // Remote-trigger wiring: invoke popover.reference imperatively on the
  // external host node. Reuses the exact same attachment code path as
  // {@attach popover.reference} on the local wrapper case — listeners,
  // ARIA writes, and cleanup all behave identically.
  $effect(() => {
    if (!host) return;
    triggerRef = host;
    return floating.reference(host);
  });

  export function toggle(state = !open) {
    open = state;
    return open;
  }

  export function update() {
    return floating.update();
  }

  const addMethods = <T extends HTMLElement>(element?: T | null): NeoTooltipHTMLElement<T> | undefined => {
    if (!element) return;
    if (!Object.hasOwn(element, 'toggle')) Object.assign(element, { toggle });
    if (!Object.hasOwn(element, 'update')) Object.assign(element, { update });
    return element;
  };

  $effect(() => {
    addMethods(ref);
  });
  $effect(() => {
    triggerRef = addMethods(floating.referenceEl as HTMLElement);
  });

  const computeSize = <T extends 'width' | 'height'>(value: NeoTooltipProps[T], dimension: T): SizeOption<T> | undefined => {
    const tSize = dimension === 'width' ? triggerRef?.offsetWidth : triggerRef?.offsetHeight;
    if (isSizeOption(value)) {
      const sizes: SizeOption<T> = toSize(value) ?? {};
      if (value.absolute === NeoTooltipSizeStrategy.Available) sizes.absolute = toPixel(available[dimension]);
      if (value.min === NeoTooltipSizeStrategy.Available) sizes.min = toPixel(available[dimension]);
      else if (value.min === NeoTooltipSizeStrategy.Match) sizes.min = toPixel(tSize);
      if (value.max === NeoTooltipSizeStrategy.Available) sizes.max = toPixel(available[dimension]);
      else if (value.max === NeoTooltipSizeStrategy.Match) sizes.max = toPixel(tSize);
      return sizes;
    }
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
      if (!unmountOnClose && open) floating.update();
    },
    () => open,
    { skip: 1 },
  );

  const onpointerenter: NeoTooltipProps['onpointerenter'] = (e) => {
    if (!openOnHover) return rest.onpointerenter?.(e);
    open = true;
    rest.onpointerenter?.(e);
  };

  const onfocusin: NeoTooltipProps['onfocusin'] = (e) => {
    if (!openOnFocus) return rest.onfocusin?.(e);
    open = true;
    rest.onfocusin?.(e);
  };
</script>

{#if !target}
  <svelte:element
    this={triggerTag}
    bind:this={wrapperRef}
    class:neo-tooltip-trigger={true}
    {@attach floating.reference}
    {...triggerRest}
  >
    {@render children?.(floating, toggle)}
  </svelte:element>
{/if}

<NeoPortal enabled={portal} {...portalProps}>
  {#if !unmountOnClose || floating.open}
    <svelte:element
      this={tag}
      bind:this={ref}
      hidden={!floating.open}
      data-elevation={elevation}
      data-position={position}
      data-unmount-on-close={unmountOnClose}
      class:neo-tooltip={true}
      class:neo-rounded={rounded}
      class:neo-tinted={tinted}
      class:neo-filled={filled}
      class:neo-borderless={borderless}
      class:neo-flat={!elevation}
      class:neo-fade={fade}
      in:inFn={inProps}
      out:outFn={outProps}
      use:useFn={useProps}
      {@attach floating.floating}
      {...rest}
      {onpointerenter}
      {onfocusin}
      style:justify-content={justify}
      style:align-items={align}
      style:flex
      style:width={width?.absolute}
      style:min-width={width?.min}
      style:max-width={width?.max}
      style:height={height?.absolute}
      style:min-height={height?.min}
      style:max-height={height?.max}
      style:--neo-tooltip-color={getColorVariable(color)}
      style:--neo-tooltip-box-shadow={tooltipShadow}
      style:--neo-tooltip-backdrop-filter={tooltipBlur}
      style:--neo-tooltip-padding={padding}
      style:--neo-tooltip-elevation={elevation}
      style:--neo-tooltip-border-radius={computeBorderRadius(rounded)}
      style={rest.style}
    >
      {#if typeof tooltip === 'function'}
        {@render tooltip?.(floating, toggle)}
      {:else}
        {tooltip}
      {/if}
    </svelte:element>
  {/if}
</NeoPortal>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-tooltip {
    @include mixin.floating(
      $padding: --neo-tooltip-padding,
      $color: --neo-tooltip-color,
      $background-color: --neo-tooltip-bg-color,
      $border-color: --neo-tooltip-border-color,
      $border-radius: --neo-tooltip-border-radius,
      $border-radius-rounded: --neo-tooltip-border-radius-rounded,
      $box-shadow: --neo-tooltip-box-shadow,
      $backdrop-filter: --neo-tooltip-backdrop-filter,
      $z-index: --neo-tooltip-z-index,
      $elevation: --neo-tooltip-elevation,
      $borderless: true,
      $tinted: true,
      $filled: true
    );

    display: flex;
    flex: 1 0 fit-content;
    flex-direction: column;
    overflow: hidden;

    :global(> .neo-list:only-child) {
      width: inherit;
      min-width: inherit;
      max-width: inherit;
      height: inherit;
      min-height: inherit;
      max-height: inherit;
    }

    &.neo-rounded {
      :global(> .neo-list:only-child) {
        --neo-list-scrollbar-padding: 0.75rem;

        clip-path: inset(0 round var(--neo-tooltip-border-radius, var(--neo-border-radius)));
      }
    }

    &[hidden] {
      display: none;
    }

    &.neo-fade {
      --neo-tooltip-fade-enter-duration: 0.2s;
      --neo-tooltip-fade-exit-duration: 0.15s;
      --neo-tooltip-fade-enter-timing: ease-out;

      @include mixin.fade-in(
        $toggle: ':not([hidden])',

        $enter-duration: --neo-tooltip-fade-enter-duration,
        $exit-duration: --neo-tooltip-fade-exit-duration,
        $enter-timing: --neo-tooltip-fade-enter-timing,
        $exit-timing: --neo-tooltip-fade-exit-timing
      );
    }
  }
</style>
