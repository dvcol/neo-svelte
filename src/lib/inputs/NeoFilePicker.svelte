<script lang="ts">
  import { tick } from 'svelte';

  import NeoButton from '../buttons/NeoButton.svelte';

  import type { DragEventHandler, FormEventHandler } from 'svelte/elements';
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoFilePickerProps } from '~/inputs/neo-file-picker.model.js';

  import IconDownload from '~/icons/IconDownload.svelte';
  import IconFileUpload from '~/icons/IconFileUpload.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import { type SvelteEvent } from '~/utils/html-element.utils.js';
  import { computeButtonShadows, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    ref = $bindable(),
    files = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    placeholder = 'Choose a file',
    append,

    validation, // TODO - wrap validation

    multiple,
    expanded = $bindable(false),
    dragging = $bindable(false),
    drop = true,

    // Events
    oninput,
    onchange,

    // Other props
    labelRef = $bindable(),
    buttonProps,
    containerTag = 'div',
    containerProps,
    ...rest
  }: NeoFilePickerProps = $props();
  /* eslint-enable prefer-const */

  const onclick: NeoButtonProps['onclick'] = e => {
    ref?.focus?.();
    ref?.click?.();
    buttonProps?.onclick?.(e);
  };

  const elevation = $derived(rest?.elevation ?? getDefaultElevation(rest?.pressed));
  const text = $derived(elevation >= 0 || !rest.pressed);
  const style = $derived(computeButtonShadows(elevation, text));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle picker',
    title: 'Toggle picker',
    skeleton: rest.skeleton,
    disabled: rest.disabled,
    rounded: rest.rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    ...buttonProps,
    onclick,
  });

  type FileEvent = SvelteEvent<InputEvent, HTMLInputElement>;
  const getValue = (e: FileEvent): null | FileList | File => {
    if (!e?.currentTarget?.files) return null;
    if (multiple) return e.currentTarget.files;
    return e.currentTarget.files[0];
  };

  const mirror = (e: FileEvent, cb?: NeoFilePickerProps['oninput'] | NeoFilePickerProps['onchange']) => cb?.(e, getValue(e));
  const mirrorInput: FormEventHandler<HTMLInputElement> = e => mirror(e as FileEvent, oninput);
  const mirrorChange: FormEventHandler<HTMLInputElement> = e => mirror(e as FileEvent, onchange);

  const mergeLists = (left?: FileList, right?: FileList): FileList | undefined => {
    if (!left?.length && !right?.length) return;
    if (!left?.length) return right;
    if (!right?.length) return left;
    const transfer = new DataTransfer();
    for (let i = 0; i < left.length; i += 1) {
      transfer.items.add(left[i]);
    }
    for (let i = 0; i < right.length; i += 1) {
      transfer.items.add(right[i]);
    }
    return transfer.files;
  };

  const onDrop: DragEventHandler<HTMLDivElement> = async e => {
    dragging = false;
    e.preventDefault();
    if (!e.dataTransfer?.files?.length) return;
    if (multiple && append) {
      files = mergeLists(files, e.dataTransfer.files);
    } else if (multiple) {
      files = e.dataTransfer.files;
    } else {
      const list = new DataTransfer();
      list.items.add(e.dataTransfer.files[0]);
      files = list.files;
    }
    await tick();
    if (!ref) return;
    const init: InputEventInit = {
      bubbles: true,
      cancelable: false,
      data: multiple ? `${files?.length ?? 0} Files` : files?.[0]?.name,
      inputType: 'insertFromDrop',
    };
    ref.dispatchEvent(new InputEvent('input', init));
    ref.dispatchEvent(new InputEvent('change', init));
  };

  let dragRef = $state<HTMLDivElement>();
  let dragWith = $state<string>();
  let dragHeight = $state<string>();

  let overlayRef = $state<HTMLDivElement>();
  let inputMargin = $state<{ top?: string; left?: string; right?: string; bottom?: string }>({});

  const onDragOver: DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
  };

  const onDragEnter: DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    dragWith = dragRef?.clientWidth ? `${dragRef?.clientWidth}px` : undefined;
    dragHeight = dragRef?.clientHeight ? `${dragRef?.clientHeight}px` : undefined;
    if (overlayRef?.nextElementSibling) {
      const { marginTop, marginLeft, marginRight, marginBottom } = getComputedStyle(overlayRef.nextElementSibling);
      inputMargin = { top: marginTop, left: marginLeft, right: marginRight, bottom: marginBottom };
    }
    dragging = true;
    console.info('onDragEnter', e);
  };

  const onDragLeave: DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    dragging = false;
    console.info('onDragLeave', e);
  };

  // TODO expanded
  // TODO animated idle drag over/select
  // TODO show accepted file types
</script>

{#snippet after()}
  <NeoButton {...afterProps}>
    {#snippet icon()}
      {#if drop && dragging}
        <IconDownload width="1.25rem" height="1.25rem" scale="1.5" />
      {:else}
        <IconFileUpload width="1.25rem" height="1.25rem" scale="1.125" />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

{#snippet input()}
  <NeoInput
    bind:ref
    bind:labelRef
    bind:files
    bind:valid
    bind:dirty
    bind:touched
    bind:hovered
    bind:focused
    type="file"
    {placeholder}
    {multiple}
    {after}
    {...rest}
    oninput={mirrorInput}
    onchange={mirrorChange}
  />
{/snippet}

<svelte:element this={containerTag} class:neo-file-picker={true} {...containerProps}>
  {#if drop}
    <!-- Drag & drop -->
    <div
      bind:this={dragRef}
      role={drop ? 'region' : undefined}
      class="neo-drop-container"
      class:neo-dragging={dragging}
      ondrop={onDrop}
      ondragover={onDragOver}
      ondragenter={onDragEnter}
      ondragleave={onDragLeave}
      style:min-width={dragWith}
      style:min-height={dragHeight}
    >
      <div
        bind:this={overlayRef}
        class="neo-drop-overlay"
        style:--neo-input-drag-margin-top={inputMargin.top}
        style:--neo-input-drag-margin-left={inputMargin.left}
        style:--neo-input-drag-margin-right={inputMargin.right}
        style:--neo-input-drag-margin-bottom={inputMargin.bottom}
      >
        Drop Files here
      </div>
      {@render input()}
    </div>
  {:else}
    <!-- No drop support -->
    {@render input()}
  {/if}
</svelte:element>

<style lang="scss">
  .neo-file-picker {
    --neo-input-cursor: pointer;

    :global(.neo-input::file-selector-button) {
      align-items: center;
      align-self: center;
      width: 0;
      height: 100%;
      margin: 0;
      padding: 0;
      border: none;
      visibility: hidden;
    }

    .neo-drop-container {
      --neo-card-spacing: 0;

      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      .neo-drop-overlay {
        position: absolute;
        display: inline-flex;
        align-items: center;
        margin: calc(0.25rem + var(--neo-input-drag-margin-top)) calc(0.25rem + var(--neo-input-drag-margin-right))
          calc(0.25rem + var(--neo-input-drag-margin-bottom)) calc(0.25rem + var(--neo-input-drag-margin-left));
        padding: 0.75rem 1rem;
        border-radius: var(--neo-border-radius-sm);
        box-shadow: var(--neo-box-shadow-flat);
        opacity: 0;
        transition:
          opacity 0.3s ease,
          box-shadow 0.3s ease;
        pointer-events: none;
        inset: 0;
      }

      &.neo-dragging {
        .neo-drop-overlay {
          box-shadow: var(--neo-box-shadow-inset-1);
          opacity: 1;
        }

        :global(> *) {
          pointer-events: none;
        }

        :global(> *.neo-input-group > *:not(.neo-input-after)) {
          opacity: 0;
        }
      }
    }
  }
</style>
