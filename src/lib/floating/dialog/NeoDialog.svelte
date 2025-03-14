<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';

  import type { NeoDialogContext, NeoDialogProps } from '~/floating/dialog/neo-dialog.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { coerce, PositiveMinMaxElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    children,

    // Style
    blur: _blur,
    fade = true,

    // States
    id = `neo-dialog-${getUUID()}`,
    ref = $bindable(),
    open = $bindable(false),
    modal = $bindable(true),
    closedby,
    returnValue = $bindable(),
    disableBodyScroll = modal,
    closeOnClickOutside = closedby === undefined,

    // Events
    oncancel,
    onclick,

    ...rest
  }: NeoDialogProps = $props();
  /* eslint-enable prefer-const */

  const blur = $derived(coerce(_blur!, PositiveMinMaxElevation));
  const filter = $derived(_blur !== undefined ? `var(--neo-blur-${blur})` : undefined);

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
    ref.close();
  });

  $effect(() => {
    if (!ref) return;

    // Monkey patch dialog methods to sync modal, open and returnValue
    const { close, requestClose, show, showModal } = ref;
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
    if (!requestClose) return;
    ref.requestClose = (returnVal?: any) => {
      if (returnVal !== undefined) returnValue = returnVal;
      open = false;
      return requestClose.call(ref, returnVal);
    };
    Object.defineProperty(ref, 'returnValue', {
      get() {
        return returnValue;
      },
      set(val?: any) {
        returnValue = val;
      },
    });
  });

  const context = $derived<NeoDialogContext>({ ref, open, modal, returnValue, closedby, disableBodyScroll, closeOnClickOutside });
</script>

<dialog
  bind:this={ref}
  data-modal={modal}
  data-clicked-outside={closedby ?? closeOnClickOutside}
  class:neo-dialog={true}
  class:neo-scroll-disabled={!disableBodyScroll}
  class:neo-fade={fade}
  style:--neo-dialog-backdrop-filter={filter}
  {id}
  {closedby}
  {...rest}
  {oncancel}
  onclick={onClick}
>
  {@render children?.(context)}
</dialog>

<style lang="scss">
  .neo-dialog {
    margin: auto;
    padding: 0;
    color: inherit;
    background: transparent;
    border: none;
    outline: none;

    &::backdrop {
      background: var(--neo-dialog-backdrop-color, var(--neo-background-color-backdrop));
      backdrop-filter: var(--neo-dialog-backdrop-filter, blur(2px));
    }

    &.neo-fade {
      opacity: 0;
      transition: opacity, scale, display, overlay;
      transition-timing-function: ease;
      transition-duration: 0.2s;
      transition-behavior: allow-discrete;
      scale: 0.95;

      &[data-modal='true'] {
        position: fixed;
        inset: 0;
      }

      &::backdrop {
        background: transparent;
        backdrop-filter: blur(0);
        transition:
          background 0.4s,
          backdrop-filter 0.4s,
          display 0.2s,
          overlay 0.2s;
        transition-timing-function: ease;
        transition-behavior: allow-discrete;
      }

      &[open] {
        display: block;
        opacity: 1;
        transition-timing-function: ease-out;
        transition-duration: 0.3s;
        scale: 1;

        &::backdrop {
          background: var(--neo-dialog-backdrop-color, var(--neo-background-color-backdrop));
          backdrop-filter: var(--neo-dialog-backdrop-filter, blur(2px));
          transition:
            background 0.4s,
            backdrop-filter 0.4s,
            display 0.3s,
            overlay 0.3s;
          transition-timing-function: ease-out;
        }
      }

      @starting-style {
        &[open] {
          opacity: 0;
          scale: 0.95;

          &::backdrop {
            background: transparent;
            backdrop-filter: blur(0);
          }
        }
      }
    }
  }

  :global(body:has(.neo-dialog.neo-scroll-disabled[open])) {
    overflow: hidden;
  }
</style>
