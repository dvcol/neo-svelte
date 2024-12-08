<script lang="ts">
  import { tick } from 'svelte';

  import NeoButton from '../buttons/NeoButton.svelte';

  import type { DragEventHandler, FormEventHandler } from 'svelte/elements';
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoFilePickerProps } from '~/inputs/neo-file-picker.model.js';

  import NeoCard from '~/cards/NeoCard.svelte';
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

  const onDrop: DragEventHandler<HTMLDivElement> = async e => {
    dragging = false;
    e.preventDefault();
    if (!e.dataTransfer?.files?.length) return;
    if (multiple && append) {
      const list = new DataTransfer();
      if (files?.length) {
        for (let i = 0; i < files.length; i += 1) {
          list.items.add(files[i]);
        }
      }
      for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
        list.items.add(e.dataTransfer.files[i]);
      }
      files = list.files;
    } else {
      files = e.dataTransfer.files;
    }
    console.info('files', files);
    await tick();
    if (!ref) return;
    const init: InputEventInit = {
      bubbles: true,
      cancelable: false,
      data: multiple ? `${files.length} Files` : files[0]?.name,
      inputType: 'insertFromDrop',
    };
    ref.dispatchEvent(new InputEvent('input', init));
    ref.dispatchEvent(new InputEvent('change', init));
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

<svelte:element this={containerTag} class:neo-file-picker={true} {...containerProps}>
  {#if drop}
    <!-- Drag & drop -->
    <div
      bind:this={dragRef}
      role={drop ? 'region' : undefined}
      class="neo-file-picker-drop-container"
      class:neo-dragging={dragging}
      ondrop={onDrop}
      ondragover={onDragOver}
      ondragenter={onDragEnter}
      ondragleave={onDragLeave}
      style:min-width={dragWith}
      style:min-height={dragHeight}
    >
      <NeoCard borderless elevation={0} flex="1 1 auto">
        <div>{@render input()}</div>
      </NeoCard>
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

    &-drop-container {
      --neo-card-spacing: 0;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      &.neo-dragging :global(> *) {
        pointer-events: none;
      }
    }
  }
</style>
