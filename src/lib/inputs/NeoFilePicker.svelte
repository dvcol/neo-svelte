<script lang="ts">
  import { tick } from 'svelte';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  import type { DragEventHandler, FormEventHandler, MouseEventHandler } from 'svelte/elements';
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoFilePickerProps } from '~/inputs/neo-file-picker.model.js';
  import type { NeoInputProps } from '~/inputs/neo-input.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoCard from '~/cards/NeoCard.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import IconClear from '~/icons/IconClear.svelte';
  import IconDownload from '~/icons/IconDownload.svelte';
  import IconFileUpload from '~/icons/IconFileUpload.svelte';
  import IconPencil from '~/icons/IconPencil.svelte';
  import NeoAffix from '~/inputs/NeoAffix.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';

  import { toClass } from '~/utils/props.utils.js';
  import { computeButtonShadows, getDefaultElevation, getDefaultHoverElevation } from '~/utils/shadow.utils.js';
  import { enterDefaultTransition, leaveDefaultFadeTransition } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    label,

    // States
    ref = $bindable(),
    files = $bindable(),
    valid = $bindable(), // TODO - wrap validation
    dirty = $bindable(false), // TODO - wrap validation
    touched = $bindable(false), // TODO - wrap validation
    hovered = $bindable(false), // TODO - wrap validation
    focused = $bindable(false), // TODO - wrap validation
    placeholder = 'Choose a file',

    loading,
    clearable, // TODO - clearable
    validation, // TODO - wrap validation
    skeleton,
    disabled,
    readonly,
    rounded,
    pressed,

    elevation = getDefaultElevation(pressed),
    hover = getDefaultHoverElevation(pressed),

    // File picker
    append,
    multiple,
    expanded = $bindable(false),
    dragging = $bindable(false),
    drop = true,
    dropText = `Drop${multiple ? ' ' : ' a '}File${multiple ? 's' : ''} here`,
    expandHeight = '300px',

    // Events
    oninput,
    onchange,

    // Other props
    labelRef = $bindable(),
    cardProps,
    buttonProps,
    containerTag = 'div',
    containerProps,
    ...rest
  }: NeoFilePickerProps = $props();
  /* eslint-enable prefer-const */

  // TODO - mask scroll
  // TODO - children
  // TODO - validation

  $inspect(valid).with((...args) => console.log('valid', ...args));

  const text = $derived(elevation >= 0 || !pressed);
  const style = $derived(computeButtonShadows(elevation, text));
  const isDragging = $derived(drop && dragging && !disabled);
  const close = $derived(clearable && !!files?.length && (hovered || focused));

  let dragRef = $state<HTMLDivElement>();
  let dragWith = $state<string | number>();
  let dragHeight = $state<string | number>();

  let overlayRef = $state<HTMLDivElement>();
  let contentMargin = $state<{ top?: string | number; left?: string | number; right?: string | number; bottom?: string | number }>({});

  const updateMargin = (target: Element | null | undefined) => {
    if (!target) return;
    const { marginTop, marginLeft, marginRight, marginBottom } = getComputedStyle(target);
    contentMargin = { top: marginTop, left: marginLeft, right: marginRight, bottom: marginBottom };
  };

  const updateDragState = async (target: Element | null | undefined = dragRef) => {
    if (!drop) return;

    dragWith = target ? `${target.clientWidth}px` : 0;
    dragHeight = target ? `${target.clientHeight}px` : 0;

    updateMargin(expanded ? dragRef?.firstElementChild : overlayRef?.nextElementSibling);
  };

  const onClear: MouseEventHandler<HTMLButtonElement> = e => {
    e?.stopPropagation();
    files = undefined;
    // rest.onclear?.(); // TODO clear & mark
  };

  const onclick: NeoButtonProps['onclick'] = e => {
    if (disabled || skeleton) return;
    e?.stopPropagation();
    ref?.focus?.();
    ref?.click?.();
    buttonProps?.onclick?.(e);
  };

  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle picker',
    title: 'Toggle picker',
    skeleton,
    disabled,
    rounded: expanded || rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    ...buttonProps,
    class: toClass('neo-file-picker-button', buttonProps?.class),
    onclick,
  });

  const expandProps = $derived.by(() => {
    if (!drop || !expanded) return;
    return {
      elevation,
      hover,
      hovered,
      disabled,
      skeleton,
      pressed,
      rounded,
      glass: rest.glass,
      start: rest.start,
      flex: '1 1 auto',
      ...cardProps,
      class: toClass('neo-file-picker-card', cardProps?.class),
    };
  });

  type FileEvent = SvelteEvent<InputEvent, HTMLInputElement>;
  const getValue = (e: FileEvent): null | FileList | File => {
    updateDragState();
    if (!e?.currentTarget?.files) return null;
    if (multiple) return e.currentTarget.files;
    return e.currentTarget.files[0];
  };

  const mirror = (e: FileEvent, cb?: NeoFilePickerProps['oninput'] | NeoFilePickerProps['onchange']) => cb?.(e, getValue(e));
  const mirrorInput: FormEventHandler<HTMLInputElement> = e => mirror(e as FileEvent, oninput);
  const mirrorChange: FormEventHandler<HTMLInputElement> = e => mirror(e as FileEvent, onchange);

  const emitChange = async () => {
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

  const mergeLists = (left?: FileList, right?: FileList): FileList | undefined => {
    if (!left?.length && !right?.length) return;
    if (!left?.length) return right;
    if (!right?.length) return left;
    const transfer = new DataTransfer();
    const map = new Map<string, File>();
    let file: File;
    for (let i = 0; i < left.length; i += 1) {
      file = left[i];
      map.set(file.name, file);
    }
    for (let i = 0; i < right.length; i += 1) {
      file = right[i];
      map.set(file.name, file);
    }
    map.forEach(f => transfer.items.add(f));
    return transfer.files;
  };

  const onDrop: DragEventHandler<HTMLDivElement> = async e => {
    dragging = false;
    e.preventDefault();
    if (disabled || skeleton) return;
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
    return emitChange();
  };

  const onDragOver: DragEventHandler<HTMLDivElement> = e => e.preventDefault();

  const onDragEnter: DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    updateDragState();
    dragging = true;
    hovered = true;
  };

  const onDragLeave: DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    hovered = false;
    dragging = false;
  };

  const removeFile = async (i: number, e?: MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!ref) return;
    if (!files?.length || i < 0 || i >= files.length) return;
    if (files.length) {
      const transfer = new DataTransfer();
      for (let j = 0; j < files.length; j += 1) {
        if (i !== j) transfer.items.add(files[j]);
      }
      files = transfer.files;
    } else files = undefined;
    return emitChange();
  };
</script>

{#snippet after()}
  <NeoButton {...afterProps}>
    {#snippet icon()}
      {#if isDragging}
        <IconDownload width="1.25rem" height="1.25rem" scale="1.5" stroke="1" />
      {:else}
        <IconFileUpload width="1.25rem" height="1.25rem" scale="var(--neo-input-icon-scale, 1.125)" />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

{#snippet input(
  props: Partial<NeoInputProps> | undefined = {
    // Snippets
    label,
    after,

    // States
    placeholder,

    loading,
    clearable,
    skeleton,
    disabled,
    readonly,
    rounded,
    pressed,

    elevation,
    hover,
  },
)}
  <NeoInput
    bind:ref
    bind:files
    bind:valid
    bind:dirty
    bind:touched
    bind:hovered
    bind:focused
    bind:labelRef
    type="file"
    {multiple}
    {...props}
    {...rest}
    oninput={mirrorInput}
    onchange={mirrorChange}
    containerProps={{ class: 'neo-file-picker-input-group' }}
  />
{/snippet}

{#snippet overlay(props: Partial<NeoInputProps> | undefined)}
  <div bind:this={overlayRef} class="neo-drop-overlay">
    {dropText}
  </div>
  {@render input(props)}
{/snippet}

{#snippet card(props: Partial<NeoInputProps>)}
  <NeoCard out={leaveDefaultFadeTransition} {...expandProps}>
    {#if files?.length}
      <div class="neo-expanded-count">
        <span>{files.length} Files</span>
        <NeoAffix
          {loading}
          valid={validation ? valid : undefined}
          {close}
          {skeleton}
          {disabled}
          closeProps={{
            onclick: onClear,
          }}
        />
      </div>
      <div class="neo-expanded-list" class:neo-rounded={rounded}>
        {#each files as file, i (file)}
          <div class="neo-file" transition:fade={{ duration: 200 }} animate:flip={{ duration: 200, delay: 100 }}>
            <span class="neo-file-name" title={file.name}>{file.name}</span>
            {#if clearable}
              <span class="neo-file-remove">
                <NeoButton
                  text
                  rounded
                  {disabled}
                  onclickcapture={e => removeFile(i, e)}
                  class="neo-file-remove-button"
                  title="Remove file"
                  aria-label="Remove file"
                >
                  {#snippet icon()}
                    <IconClear width="1rem" height="1rem" scale="1.5" stroke="1" />
                  {/snippet}
                </NeoButton>
              </span>
            {/if}
          </div>
        {/each}
      </div>
      <div class="neo-expanded-edit">
        <span>{placeholder}</span>
        <NeoButton {disabled} rounded text {onclick} title="Edit files" aria-label="Edit files">
          {#snippet icon()}
            <IconPencil width="1.25rem" height="1.25rem" scale="1" />
          {/snippet}
        </NeoButton>
      </div>
    {:else}
      <div
        role="none"
        class="neo-expanded-empty"
        class:neo-rounded={rounded}
        class:neo-disabled={disabled}
        {onclick}
        in:fade={enterDefaultTransition}
      >
        <div class="neo-expanded-button">
          <NeoButton {...afterProps}>
            {#snippet icon()}
              {#if isDragging}
                <IconDownload width="2.5rem" height="2.5rem" scale="1.25" stroke="0.5" />
              {:else if loading}
                <IconCircleLoading width="2.5rem" height="2.5rem" scale="1" />
              {:else}
                <IconAdd width="2.5rem" height="2.5rem" scale="1" stroke="0.5" />
              {/if}
            {/snippet}
          </NeoButton>
        </div>
        <div class="neo-expanded-placeholder" style:min-width="max({dropText.length ?? 0}ch,{placeholder?.length ?? 0}ch)">
          {#if isDragging}
            <span class="neo-expanded-placeholder-drop">{dropText}</span>
          {:else}
            <span class="neo-expanded-placeholder-select">{placeholder}</span>
          {/if}
        </div>
      </div>
    {/if}
  </NeoCard>
  <div class="neo-expanded-input">
    {@render input(props)}
  </div>
{/snippet}

<!-- Drag & drop -->
{#snippet drag(props: Partial<NeoInputProps> | undefined)}
  <div
    bind:this={dragRef}
    role="region"
    class="neo-drop-container"
    class:neo-expanded={expanded}
    class:neo-dragging={isDragging}
    class:neo-pressed={pressed}
    class:neo-skeleton={skeleton}
    ondrop={onDrop}
    ondragover={onDragOver}
    ondragenter={onDragEnter}
    ondragleave={onDragLeave}
    style:--neo-file-picker-expanded-min-width={dragWith}
    style:--neo-file-picker-expanded-min-height={dragHeight}
    style:--neo-file-picker-expanded-max-height={expandHeight}
    style:--neo-file-picker-drag-margin-top={contentMargin.top}
    style:--neo-file-picker-drag-margin-left={contentMargin.left}
    style:--neo-file-picker-drag-margin-right={contentMargin.right}
    style:--neo-file-picker-drag-margin-bottom={contentMargin.bottom}
  >
    {#if expanded}
      {@render card({ hidden: true, 'aria-hidden': true, tabindex: -1 })}
    {:else}
      {@render overlay(props)}
    {/if}
  </div>
{/snippet}

<svelte:element this={containerTag} class:neo-file-picker={true} class:neo-expanded={expanded} {...containerProps}>
  {#if drop}
    <!-- Drop support -->
    {@render drag(undefined)}
  {:else}
    <!-- No drop support -->
    {@render input()}
  {/if}
</svelte:element>

<div>
  hover: {hovered}
  focused: {focused}
</div>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

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

    &.neo-expanded {
      display: inline-flex;
      flex: 1 1 auto;
      width: 100%;
    }

    .neo-drop-container {
      --neo-drop-spacing: 0.375rem;

      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      min-width: var(--neo-file-picker-expanded-min-width, 0);
      min-height: var(--neo-file-picker-expanded-min-height, 0);
      padding: 0.5rem;
      transition:
        min-width 0.3s ease,
        min-height 0.3s ease;

      .neo-drop-overlay {
        position: absolute;
        z-index: var(--neo-z-index-in-front, 1);
        display: inline-flex;
        align-items: center;
        box-sizing: border-box;
        margin: calc(var(--neo-drop-spacing) + var(--neo-file-picker-drag-margin-top))
          calc(var(--neo-drop-spacing) + var(--neo-file-picker-drag-margin-right))
          calc(var(--neo-drop-spacing) + var(--neo-file-picker-drag-margin-bottom))
          calc(var(--neo-drop-spacing) + var(--neo-file-picker-drag-margin-left));
        padding: 0.75rem 1rem;
        border-radius: var(--neo-border-radius);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        inset: 0;
      }

      &.neo-expanded {
        width: 100%;
      }

      .neo-expanded {
        &-input :global(.neo-input-group),
        &-input :global(.neo-input),
        &-input {
          width: 0;
          height: 0;
          margin: 0;
          padding: 0;
          overflow: hidden;
          visibility: hidden;
          pointer-events: none;
        }

        &-placeholder,
        &-button {
          align-self: center;
          width: fit-content;
        }

        &-placeholder {
          text-align: center;
        }

        &-empty {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 1rem;
          cursor: pointer;
          transition: color 0.3s ease;

          &::before {
            position: absolute;
            margin: -0.5rem;
            border: var(--neo-border-width) dashed var(--neo-grey-soft);
            border-radius: var(--neo-border-radius);
            transition: margin 0.3s ease;
            content: '';
            inset: 0;
          }

          &.neo-rounded::before {
            border-radius: var(--neo-border-radius-md);
          }

          &.neo-disabled {
            cursor: no-drop;
          }
        }

        &-list {
          position: relative;
          display: inline-flex;
          flex: 1 1 auto;
          flex-direction: column;
          gap: var(--neo-gap-xxs);
          max-height: var(--neo-file-picker-expanded-max-height);
          margin-right: 1.125rem;
          padding: var(--neo-shadow-margin, 0.625rem);
          overflow: auto;
          border-radius: var(--neo-border-radius);
          box-shadow: var(--neo-box-shadow-inset-1);

          &.neo-rounded {
            --neo-scrollbar-button-height: 0.375rem;

            border-radius: var(--neo-border-radius-md);
          }

          .neo-file {
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            transition: color 0.3s ease;

            &-name {
              display: -webkit-box;
              overflow: hidden;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            &-remove {
              flex: 0 0 auto;
            }

            &:hover {
              color: var(--neo-text-color-highlight);
            }
          }
        }

        &-edit,
        &-count {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      :global(.neo-file-picker-card) {
        gap: var(--neo-gap-sm);
        height: calc(
          100% - var(--neo-file-picker-drag-margin-top, var(--neo-shadow-margin, 0.625rem)) - var(
              --neo-file-picker-drag-margin-bottom,
              var(--neo-shadow-margin, 0.625rem)
            )
        );
      }

      &.neo-dragging:not(.neo-skeleton) {
        .neo-drop-overlay {
          opacity: 1;
        }

        .neo-expanded-empty::before {
          margin: -0.25rem;
        }

        :global(.neo-file-picker-card),
        :global(.neo-file-picker-input-group) {
          --neo-box-shadow-raised-1: var(--neo-box-shadow-pressed-1);
          --neo-box-shadow-raised-2: var(--neo-box-shadow-pressed-2);
          --neo-box-shadow-raised-3: var(--neo-box-shadow-pressed-3);
          --neo-box-shadow-raised-4: var(--neo-box-shadow-pressed-4);
          --neo-box-shadow-raised-5: var(--neo-box-shadow-pressed-4);
          --neo-glass-box-shadow-raised-1: var(--neo-glass-box-shadow-pressed-1);
          --neo-glass-box-shadow-raised-2: var(--neo-glass-box-shadow-pressed-2);
          --neo-glass-box-shadow-raised-3: var(--neo-glass-box-shadow-pressed-3);
          --neo-glass-box-shadow-raised-4: var(--neo-glass-box-shadow-pressed-4);
          --neo-glass-box-shadow-raised-5: var(--neo-glass-box-shadow-pressed-4);

          :global(.neo-file-picker-button) {
            --neo-btn-box-shadow: var(--neo-box-shadow-flat) !important;
          }
        }

        :global(> *) {
          pointer-events: none;
        }

        :global(> *.neo-input-group > *:not(.neo-input-after)) {
          opacity: 0;
        }
      }
    }

    .neo-expanded-list {
      @include mixin.scrollbar($gutter: stable both-edges);
    }
  }
</style>
