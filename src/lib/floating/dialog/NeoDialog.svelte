<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';

  import type { NeoDialogContext, NeoDialogProps } from '~/floating/dialog/neo-dialog.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { getColorVariable } from '~/utils/colors.utils.js';
  import { coerce, computeGlassFilter, computeShadowElevation, PositiveMinMaxElevation } from '~/utils/shadow.utils.js';
  import { toSize } from '~/utils/style.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    children,

    // States
    id = `neo-dialog-${getUUID()}`,
    ref = $bindable(),
    open = $bindable(false),
    modal = $bindable(true),
    closedby,
    returnValue = $bindable(),
    disableBodyScroll = modal,
    closeOnClickOutside = closedby === undefined,
    unmountOnClose,

    // Position
    placement = 'center',

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
    onclick,

    ...rest
  }: NeoDialogProps = $props();
  /* eslint-enable prefer-const */

  const elevation = $derived(coerce(_elevation!, PositiveMinMaxElevation));
  const blur = $derived(coerce(_blur ?? _elevation!, PositiveMinMaxElevation));

  const backdropFilter = $derived(_blur !== undefined ? `var(--neo-blur-${blur})` : undefined);
  const cardFilter = $derived(computeGlassFilter(blur, true));
  const cardShadow = $derived(computeShadowElevation(elevation, { glass: true }, PositiveMinMaxElevation));

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  const fade = $derived(_fade ?? (!modal || placement === 'center'));
  const slide = $derived(_slide ?? (modal && placement !== 'center'));

  const onCancel: NeoDialogProps['oncancel'] = e => {
    if (!ref || !ref.open) return;
    if (ref.requestClose) return ref.requestClose();
    ref.close();
    oncancel?.(e);
  };

  const onClick: NeoDialogProps['onclick'] = e => {
    if (!closeOnClickOutside || !open) return onclick?.(e);
    // Close dialog if clicked on the backdrop (only if modal)
    if (modal && e.target === ref) onCancel(e);
    return onclick?.(e);
  };

  const onWindowClick = async (e: SvelteEvent<MouseEvent>) => {
    if (!closeOnClickOutside || !open) return;
    if (!(e.target instanceof HTMLElement)) return;
    if (e.target?.closest(`#${id}`)) return;
    onCancel(e);
  };

  let timeout: ReturnType<typeof setTimeout>;
  $effect(() => {
    if (!open) return;
    timeout = setTimeout(() => window.addEventListener('click', onWindowClick), 0);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('click', onWindowClick);
    };
  });

  // Sync dialog state with component state
  $effect(() => {
    if (!ref || ref.open === open) return;
    if (open && modal) return ref.showModal();
    if (open) return ref.show();
    if (ref.requestClose) return ref.requestClose();
    ref.close();
  });

  $effect(() => {
    if (!ref) return;
    Object.defineProperty(ref, 'returnValue', {
      get() {
        return returnValue;
      },
      set(val?: any) {
        returnValue = val;
      },
    });
    // Monkey patch dialog methods to sync modal, open and returnValue
    const { close, requestClose, show, showModal, dispatchEvent } = ref;
    ref.show = () => {
      modal = false;
      open = true;
      return show.call(ref);
    };
    ref.showModal = () => {
      modal = true;
      open = true;
      return showModal.call(ref);
    };
    ref.close = (returnVal?: any) => {
      if (returnVal !== undefined) returnValue = returnVal;
      open = false;
      return close.call(ref, returnVal);
    };
    if (!requestClose) {
      ref.requestClose = (returnVal?: any) => {
        if (returnVal !== undefined) returnValue = returnVal;
        open = false;
        dispatchEvent.call(ref, new Event('cancel', { bubbles: false, cancelable: true }));
        return close.call(ref, returnVal);
      };
    } else {
      ref.requestClose = (returnVal?: any) => {
        if (returnVal !== undefined) returnValue = returnVal;
        open = false;
        return requestClose.call(ref, returnVal);
      };
    }
  });

  const context = $derived<NeoDialogContext>({ ref, open, modal, returnValue, closedby, disableBodyScroll, closeOnClickOutside, placement });

  // TODO : drawers handle (& swipe) => dedicated component
  // TODO : support not using dialog component for enter/exit transitions
</script>

<dialog
  bind:this={ref}
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
  class:neo-fade={fade}
  class:neo-slide={slide}
  class:neo-scroll-disabled={!disableBodyScroll}
  {id}
  {closedby}
  {...rest}
  {oncancel}
  onclick={onClick}
  style:justify-content={justify}
  style:align-items={align}
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
>
  {#if !unmountOnClose || open}
    {@render children?.(context)}
  {/if}
</dialog>

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
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    padding: var(--neo-dialog-padding, var(--neo-gap-xs) var(--neo-gap));
    outline: none;

    &.neo-backdrop:not([data-elevation], [data-modal='false']) {
      background: transparent;
      border: none;
      backdrop-filter: none;
    }

    &::backdrop {
      background: var(--neo-dialog-backdrop-color, var(--neo-background-color-backdrop));
      backdrop-filter: var(--neo-dialog-backdrop-filter, blur(2px));
    }

    &:not(.neo-backdrop) {
      &::backdrop {
        display: none;
      }
    }

    &[data-modal='true'] {
      position: fixed;
      inset-block: 0;
      inset-inline: 0;

      &[data-placement^='bottom'],
      &[data-placement^='top'] {
        margin-block: 0;
      }

      &[data-placement^='bottom'] {
        inset-block: auto 0;
      }

      &[data-placement^='right'],
      &[data-placement^='left'] {
        margin-inline: 0;
      }

      &[data-placement^='right'] {
        inset-inline: auto 0;
      }

      &[data-placement='bottom-start'],
      &[data-placement='top-start'] {
        margin-inline-start: 0;
      }

      &[data-placement='bottom-end'],
      &[data-placement='top-end'] {
        margin-inline-end: 0;
      }

      &[data-placement='right-start'],
      &[data-placement='left-start'] {
        margin-block-start: 0;
      }

      &[data-placement='right-end'],
      &[data-placement='left-end'] {
        margin-block-end: 0;
      }

      &.neo-slide {
        @include mixin.slide-in;
        @include mixin.fade-backdrop;
      }
    }

    &.neo-fade {
      @include mixin.fade-in;
      @include mixin.fade-backdrop;
    }
  }

  :global(body:has(.neo-dialog.neo-scroll-disabled[open])) {
    overflow: hidden;
  }
</style>
