<script lang="ts">
  import { getFocusableElement } from '@dvcol/common-utils/common/element';
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { fade as fadeFn, fly, scale } from 'svelte/transition';

  import type { NeoDialogContext, NeoDialogProps, NeoDialogHTMLElement } from '~/floating/dialog/neo-dialog.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import NeoHandle from '~/floating/common/NeoHandle.svelte';
  import { type NeoMovable, useMovable } from '~/floating/dialog/use-movable.svelte.js';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { coerce, computeGlassFilter, computeShadowElevation, PositiveMinMaxElevation } from '~/utils/shadow.utils.js';
  import { toPixel, toSize } from '~/utils/style.utils.js';
  import { defaultDuration, quickDuration, shortDuration } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    children,

    // States
    id = `neo-dialog-${getUUID()}`,
    ref = $bindable(),
    open = $bindable(false),
    modal = $bindable(true),
    moved = $bindable({ x: 0, y: 0 }),
    returnValue = $bindable(),
    disableBodyScroll = modal,
    closedby,
    closeOnClickOutside = closedby === undefined,
    unmountOnClose = true,
    tag = unmountOnClose ? 'div' : 'dialog',

    // Position
    placement = $bindable('center'),
    movable: _movable = true,
    outside = $bindable(false),

    // Style
    elevation: _elevation,
    blur: _blur,
    fade: _fade,
    slide: _slide,
    color,
    filled,
    tinted,
    rounded = false,
    backdrop = true,
    borderless,

    // Sizing
    flex,
    align,
    justify,
    width: _width,
    height: _height,
    padding,

    // Events
    oncancel,
    onclose,
    onclick,

    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Other Props
    backdropProps,
    handleProps,
    ...rest
  }: NeoDialogProps = $props();
  /* eslint-enable prefer-const */

  const getMovablePlacement = () => {
    if (placement?.startsWith('top')) return 'bottom';
    if (placement?.startsWith('right')) return 'left';
    if (placement?.startsWith('left')) return 'right';
    return 'top';
  };

  const movable = $derived.by((): NeoMovable<true> => {
    const parsed: NeoMovable = typeof _movable === 'object' ? _movable : { enabled: !!_movable };
    return {
      placement: getMovablePlacement(),
      ...parsed,
      handle: typeof parsed.handle === 'boolean' ? { visible: !!parsed.handle } : parsed.handle,
      snap: typeof movable.snap === 'object' ? movable.snap : { enabled: !!movable.snap, corner: movable.snap === 'corner' },
    };
  });

  const isNative = $derived(tag === 'dialog');
  const ariaProps = $derived(isNative ? {} : { role: 'dialog', 'aria-modal': modal });

  const elevation = $derived(coerce(_elevation!, PositiveMinMaxElevation));
  const blur = $derived(coerce(_blur ?? _elevation!, PositiveMinMaxElevation));

  const backdropFilter = $derived(_blur !== undefined ? `var(--neo-blur-${blur})` : undefined);
  const cardFilter = $derived(computeGlassFilter(blur, true));
  const cardShadow = $derived(computeShadowElevation(elevation, { glass: true }, PositiveMinMaxElevation));

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  const onCancel: NeoDialogProps['oncancel'] = e => {
    if (!ref) return;
    if (isNative && !ref.open) return;
    if (ref.requestClose) return ref.requestClose();
    ref.close();
    oncancel?.(e);
  };

  const onClick: NeoDialogProps['onclick'] = e => {
    if (!closeOnClickOutside || !open || !isNative) return onclick?.(e);
    // Close dialog if clicked on the backdrop (only if modal)
    if (modal && e.target === ref) onCancel(e);
    return onclick?.(e);
  };

  const onWindowClick = async (e: SvelteEvent<PointerEvent>) => {
    if (!closeOnClickOutside || !open) return;
    if (!(e.target instanceof HTMLElement)) return;
    if (e.target?.closest(`#${id}`)) return;
    onCancel(e);
  };

  const onWindowKeydown = async (e: SvelteEvent<KeyboardEvent>) => {
    if (isNative || e.key !== 'Escape') return;
    onCancel(e);
  };

  const moving = useMovable({
    get offset() {
      return moved;
    },
    set offset(val) {
      moved = val;
    },
    get outside() {
      return outside;
    },
    set outside(val) {
      outside = val;
    },
    get placement() {
      return placement;
    },
    set placement(val) {
      placement = val;
    },
    get movable() {
      if (modal) return movable;
      // If non modal disable snap
      return { ...movable, snap: false };
    },
    get element() {
      return ref;
    },
    get handlers() {
      return {
        onpointerdown: handleProps?.onpointerdown,
        onkeydown: handleProps?.onkeydown,
        onkeyup: handleProps?.onkeyup,
        onblur: handleProps?.onblur,
      };
    },
  });

  let timeout: ReturnType<typeof setTimeout>;
  $effect(() => {
    if (!open) return;
    timeout = setTimeout(() => {
      window.addEventListener('pointerdown', onWindowClick, { passive: true });
      window.addEventListener('keydown', onWindowKeydown, { passive: true });
    }, 0);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('pointerdown', onWindowClick);
      window.removeEventListener('keydown', onWindowKeydown);
    };
  });

  // Capture close dialog from external sources (esc key for example)
  const onClose = (e: SvelteEvent) => {
    if (open) open = false;
    return onclose?.(e);
  };

  // Sync dialog state with component state
  $effect(() => {
    if (!ref || ref.open === open || !isNative) return;
    if (open && modal) return ref.showModal();
    if (open) return ref.show();
    if (ref.requestClose) return ref.requestClose();
    ref.close();
  });

  const trapFocus = (e: SvelteEvent<FocusEvent>) => {
    if (!open || !modal) return;
    if (!(e.target instanceof HTMLElement)) return;
    if (ref?.contains(e.target)) return;
    e.preventDefault();
    getFocusableElement(ref)?.focus();
  };

  $effect(() => {
    if (!ref || !open || isNative || !modal) return;

    getFocusableElement(ref)?.focus();
    window.addEventListener('focusin', trapFocus);
    return () => window.removeEventListener('focusin', trapFocus);
  });

  $effect.pre(() => {
    if (!ref) return;
    Object.defineProperty(ref, 'returnValue', {
      get() {
        return returnValue;
      },
      set(val?: any) {
        returnValue = val;
      },
      configurable: true,
    });
    // Monkey patch dialog methods to sync inner states
    const { close, requestClose, show, showModal, dispatchEvent } = ref;
    ref.show = () => {
      modal = false;
      open = true;
      return show?.call(ref);
    };
    ref.showModal = () => {
      modal = true;
      open = true;
      return showModal?.call(ref);
    };
    ref.close = (returnVal?: any) => {
      if (returnVal !== undefined) returnValue = returnVal;
      open = false;
      if (!close) return dispatchEvent.call(ref, new Event('close', { bubbles: false, cancelable: true }));
      return close?.call(ref, returnVal);
    };
    if (!requestClose) {
      ref.requestClose = (returnVal?: any) => {
        if (returnVal !== undefined) returnValue = returnVal;
        open = false;
        dispatchEvent.call(ref, new Event('cancel', { bubbles: false, cancelable: true }));
        if (!close) return dispatchEvent.call(ref, new Event('close', { bubbles: false, cancelable: true }));
        return close?.call(ref, returnVal);
      };
    } else {
      ref.requestClose = (returnVal?: any) => {
        if (returnVal !== undefined) returnValue = returnVal;
        open = false;
        return requestClose.call(ref, returnVal);
      };
    }
  });

  const context = $derived<NeoDialogContext>({
    ref,
    open,
    modal,
    returnValue,
    closedby,
    disableBodyScroll,
    closeOnClickOutside,
    placement,
    outside,
    moved,
    movable,
    unmountOnClose,
    tag,
  });

  // TODO - resizable containers
  // TODO : drawers handle (& swipe) => dedicated component
  // TODO : snap (grid)
  // TODO : close/snap on swipe (mobile mostly)
  // TODO : FUll modal handle

  const fade = $derived(_fade ?? (!modal || placement === 'center'));
  const slide = $derived(_slide ?? (modal && placement !== 'center'));

  const transition = $derived.by(() => {
    if (transitionAction) return transitionAction;
    if (slide && placement?.startsWith('bottom')) return { use: fly, props: { duration: defaultDuration, y: '100%' } };
    if (slide && placement?.startsWith('top')) return { use: fly, props: { duration: defaultDuration, y: '-100%' } };
    if (slide && placement?.startsWith('right')) return { use: fly, props: { duration: defaultDuration, x: '100%' } };
    if (slide && placement?.startsWith('left')) return { use: fly, props: { duration: defaultDuration, x: '-100%' } };
    return { use: scale, props: { duration: shortDuration, start: 1.05 } };
  });

  const inFn = $derived(toTransition(inAction ?? transition));
  const inProps = $derived(toTransitionProps(inAction ?? transition));
  const outFn = $derived(toTransition(outAction ?? transition));
  const outProps = $derived(toTransitionProps(outAction ?? transition));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

{#if !isNative && backdrop && modal && open}
  <div
    class:neo-dialog-backdrop={true}
    style:--neo-dialog-backdrop-filter={backdropFilter}
    transition:fadeFn={{ duration: quickDuration }}
    {...backdropProps}
  >
    <!--  Backdrop for non native dialog  -->
  </div>
{/if}

{#if !unmountOnClose || open}
  <svelte:element
    this={tag}
    bind:this={ref as NeoDialogHTMLElement}
    data-open={open}
    data-modal={modal}
    data-placement={placement}
    data-elevation={elevation}
    data-unmount-on-close={unmountOnClose}
    data-clicked-outside={closedby ?? closeOnClickOutside}
    class:neo-dialog={true}
    class:neo-borderless={borderless}
    class:neo-backdrop={backdrop}
    class:neo-rounded={rounded}
    class:neo-tinted={tinted}
    class:neo-filled={filled}
    class:neo-flat={!elevation}
    class:neo-fade={fade && !unmountOnClose}
    class:neo-slide={slide && !unmountOnClose}
    class:neo-movable={movable.enabled}
    class:neo-scroll-disabled={disableBodyScroll}
    {id}
    {closedby}
    in:inFn={inProps}
    out:outFn={outProps}
    use:useFn={useProps}
    {...ariaProps}
    {...rest}
    {oncancel}
    onclose={onClose}
    onclick={onClick}
    style:justify-content={justify}
    style:align-items={align}
    style:translate={moving.translate}
    style:flex
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    style:--neo-dialog-backdrop-filter={backdropFilter}
    style:--neo-dialog-color={getColorVariable(color)}
    style:--neo-dialog-box-shadow={cardShadow}
    style:--neo-dialog-content-filter={cardFilter}
    style:--neo-dialog-padding={padding}
    style:--neo-dialog-elevation={elevation}
    style:--neo-dialog-safe-margin={toPixel(movable.margin)}
  >
    <NeoHandle
      enabled={movable.enabled}
      placement={movable.placement}
      axis={movable.axis}
      {outside}
      {...movable.handle}
      {...moving.handlers}
      {...handleProps}
    >
      {@render children?.(context)}
    </NeoHandle>
  </svelte:element>
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-dialog {
    @include mixin.floating(
      $padding: --neo-dialog-padding,
      $color: --neo-dialog-color,
      $background-color: --neo-dialog-bg-color,
      $border-color: --neo-dialog-border-color,
      $border-radius: --neo-dialog-border-radius,
      $box-shadow: --neo-dialog-box-shadow,
      $backdrop-filter: --neo-dialog-content-filter,
      $z-index: --neo-dialog-z-index,
      $elevation: --neo-dialog-elevation,
      $borderless: true,
      $tinted: true,
      $filled: true
    );

    box-sizing: border-box;
    width: fit-content;
    max-width: 100%;
    height: fit-content;
    max-height: 100%;
    margin: var(--neo-dialog-margin, 0);
    padding: var(--neo-dialog-padding, var(--neo-gap-xs) var(--neo-gap));
    overflow: auto;
    outline: none;

    &.neo-movable {
      will-change: translate;
    }

    &:not(:is(dialog)) {
      z-index: var(--neo-dialog-z-index, var(--neo-z-index-layer-top));
    }

    &:not([data-open='true']) {
      display: none;
    }

    &.neo-backdrop:not([data-elevation], [data-modal='false']) {
      background: transparent;
      border: none;
      backdrop-filter: none;
    }

    &:global(:has(> .neo-handle-group)) {
      padding: var(--neo-dialog-padding, 0);
    }

    :global(> .neo-handle-group .neo-handle) {
      opacity: 0.6;

      &:focus-visible,
      &:hover,
      &:active {
        opacity: 1;
      }
    }

    &:focus-within,
    &:focus,
    &:hover {
      :global(.neo-handle:not(:focus-visible, :hover, :active)) {
        opacity: 0.8;
      }
    }

    &-backdrop {
      position: fixed;
      z-index: calc(var(--neo-dialog-z-index, var(--neo-z-index-layer-top)) - 1);
      inset-block: 0;
      inset-inline: 0;
    }

    &-backdrop,
    &::backdrop {
      background: var(--neo-dialog-backdrop-color, var(--neo-background-color-backdrop));
      backdrop-filter: var(--neo-dialog-backdrop-filter, var(--neo-blur-1));
      will-change: backdrop-filter, background, opacity, display;
    }

    &:not(.neo-backdrop) {
      &::backdrop {
        display: none;
      }
    }

    &:not(:is(dialog), [data-modal='true']) {
      position: absolute;
    }

    &[data-modal='true'] {
      position: fixed;

      &[data-placement='center'] {
        inset: 0;
        margin: var(--neo-dialog-margin, auto);
      }

      &[data-placement^='top'],
      &[data-placement='right-start'],
      &[data-placement='left-start'] {
        top: 0;
        bottom: auto;
        margin-top: var(--neo-dialog-safe-margin, var(--neo-gap));
      }

      &[data-placement^='bottom'],
      &[data-placement='right-end'],
      &[data-placement='left-end'] {
        top: auto;
        bottom: 0;
        margin-bottom: var(--neo-dialog-safe-margin, var(--neo-gap));
      }

      &[data-placement^='left'],
      &[data-placement='bottom-start'],
      &[data-placement='top-start'] {
        right: auto;
        left: 0;
        margin-left: var(--neo-dialog-safe-margin, var(--neo-gap));
      }

      &[data-placement^='right'],
      &[data-placement='bottom-end'],
      &[data-placement='top-end'] {
        right: 0;
        left: auto;
        margin-right: var(--neo-dialog-safe-margin, var(--neo-gap));
      }

      &[data-placement='right'],
      &[data-placement='left'] {
        top: 0;
        bottom: 0;
        margin-top: var(--neo-dialog-margin-top, auto);
        margin-bottom: var(--neo-dialog-margin-bottom, auto);
      }

      &.neo-slide {
        @include mixin.slide-in;
        @include mixin.fade-backdrop($filter-end: --neo-dialog-backdrop-filter, $color-end: --neo-dialog-backdrop-color);
      }
    }

    &.neo-fade {
      --neo-fade-scale-start: 1.05;

      @include mixin.fade-in;
      @include mixin.fade-backdrop($filter-end: --neo-dialog-backdrop-filter, $color-end: --neo-dialog-backdrop-color);
    }
  }

  :global(body:has(.neo-dialog.neo-scroll-disabled[data-open='true'])) {
    overflow: hidden;
  }
</style>
