<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';

  import type { NeoDialogProps } from '~/dialog/neo-dialog.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { coerce, PositiveMinMaxElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    children,

    // Style
    blur: _blur,

    // States
    id = `neo-dialog-${getUUID()}`,
    ref = $bindable(),
    open = $bindable(false),
    modal = true,
    fade = true,
    closedby,
    returnValue = $bindable(),
    disableBodyScroll = modal,
    closeOnClickedOutside = closedby === undefined,

    // Events
    oncancel,
    onclick,
    ontoggle,

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
    if (!closeOnClickedOutside || !open) return onclick?.(e);
    // Close dialog if clicked on the backdrop (only if modal)
    if (modal && e.target === ref) onCancel(e);
    return onclick?.(e);
  };

  const onWindowClick = async (e: SvelteEvent<MouseEvent>) => {
    if (!closeOnClickedOutside || !open) return;
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

  const onToggle: NeoDialogProps['ontoggle'] = e => {
    if (e.newState === 'open' && !open) open = true;
    if (e.newState === 'closed' && open) open = false;
    if (ref) returnValue = ref.returnValue;
    ontoggle?.(e);
  };

  $effect(() => {
    if (!ref || ref.open === open) return;
    if (open && modal) return ref.showModal();
    if (open) return ref.show();
    ref.close();
  });
</script>

<dialog
  bind:this={ref}
  class:neo-dialog={true}
  class:neo-scroll-disabled={!disableBodyScroll}
  class:neo-fade={fade}
  style:--neo-dialog-backdrop-filter={filter}
  {id}
  {closedby}
  {...rest}
  {oncancel}
  onclick={onClick}
  ontoggle={onToggle}
>
  {@render children?.()}
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
      transition:
        opacity 0.5s,
        scale 0.5s,
        display 0.5s,
        overlay 0.5s;
      transition-behavior: allow-discrete;
      scale: 0.95;

      &::backdrop {
        background: transparent;
        backdrop-filter: blur(0);
        transition:
          background 0.5s ease,
          backdrop-filter 0.5s ease,
          display 0.5s,
          overlay 0.5s;
        transition-behavior: allow-discrete;
      }

      &[open] {
        display: block;
        opacity: 1;
        scale: 1;

        &::backdrop {
          background: var(--neo-dialog-backdrop-color, var(--neo-background-color-backdrop));
          backdrop-filter: var(--neo-dialog-backdrop-filter, blur(2px));
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
