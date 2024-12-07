<script lang="ts">
  import NeoButton from '../buttons/NeoButton.svelte';

  import type { DragEventHandler, FormEventHandler } from 'svelte/elements';
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoFilePickerProps } from '~/inputs/neo-file-picker.model.js';

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
  const getValue = (e: FileEvent): [FileEvent, null | FileList | File] => {
    if (!e?.currentTarget?.files) return [e, null];
    if (multiple) return [e, e.currentTarget.files];
    return [e, e.currentTarget.files[0]];
  };

  const mirrorInput: FormEventHandler<HTMLInputElement> = e => {
    oninput?.(...getValue(e as FileEvent));
  };

  const mirrorChange: FormEventHandler<HTMLInputElement> = e => {
    onchange?.(...getValue(e as FileEvent));
  };

  const onDrop: DragEventHandler<HTMLDivElement> = e => {
    console.info('ondrop', e);
    e.preventDefault();

    if (e.dataTransfer?.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...e.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (!file) return;
          console.info(`… file[${i}].name = ${file.name}`);
        }
      });
    } else if (e.dataTransfer?.files) {
      // Use DataTransfer interface to access the file(s)
      files = e.dataTransfer.files;
    }
    dragging = false;
  };

  let dragRef = $state<HTMLDivElement>();
  let dragWith = $state<string>();
  let dragHeight = $state<string>();

  const onDragOver: DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
  };

  const onDragEnter: DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    dragWith = dragRef?.clientWidth ? `${dragRef?.clientWidth}px` : undefined;
    dragHeight = dragRef?.clientHeight ? `${dragRef?.clientHeight}px` : undefined;
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
  // TODO animated loading progress
  // TODO animated success/failure
  // TODO show accepted file types
</script>

{#snippet after()}
  <NeoButton {...afterProps}>
    {#snippet icon()}
      <IconFileUpload width="1.25rem" height="1.25rem" />
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

<svelte:element this={containerTag} class:neo-file-picker={true} class:neo-dragging={dragging} {...containerProps}>
  {#if drop}
    <!-- Drag & drop -->
    <div
      bind:this={dragRef}
      role={drop ? 'region' : undefined}
      class="neo-file-picker-drop-container"
      ondrop={onDrop}
      ondragover={onDragOver}
      ondragenter={onDragEnter}
      ondragleave={onDragLeave}
      style:min-width={dragWith}
      style:min-height={dragHeight}
    >
      {#if expanded}
        <!--   TODO: expanded view-->
        {@render input()}
      {:else if dragging}
        <div class="neo-file-picker-drag-container">Drop files here</div>
      {:else}
        {@render input()}
      {/if}
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
      display: none;
    }

    &-drop-container :global(> *) {
      pointer-events: none;
    }

    &-drop-container,
    &-drag-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
