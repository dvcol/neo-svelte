<script lang="ts">
  import { tick } from 'svelte';

  import type { DragEventHandler, FocusEventHandler, FormEventHandler, MouseEventHandler } from 'svelte/elements';
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoInputContext, NeoInputHTMLElement } from '~/inputs/common/neo-input.model.js';
  import type { NeoFilePickerProps } from '~/inputs/neo-file-picker.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconDownload from '~/icons/IconDownload.svelte';
  import IconFileUpload from '~/icons/IconFileUpload.svelte';
  import NeoFilePickerCard from '~/inputs/NeoFilePickerCard.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoInputValidation from '~/inputs/common/NeoInputValidation.svelte';
  import { computeButtonShadows, getDefaultElevation, getDefaultHoverElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    label,
    error,
    message,
    after,
    before,

    // States
    id = label ? `neo-file-picker-${crypto.randomUUID()}` : undefined,
    ref = $bindable(),
    files = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    focusin = $bindable(false),
    placeholder = 'Choose a file',

    loading,
    clearable,
    validation,
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
    expandText,
    expandHeight,

    // Events
    oninput,
    onchange,

    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    labelRef = $bindable(),
    labelProps,
    cardProps,
    buttonProps,
    groupProps,
    messageTag = 'div',
    messageProps,
    containerRef = $bindable(),
    containerTag = 'div',
    containerProps,
    wrapperRef = $bindable(),
    wrapperTag = 'div',
    wrapperProps,
    ...rest
  }: NeoFilePickerProps = $props();
  /* eslint-enable prefer-const */

  const text = $derived(elevation >= 0 || !pressed);
  const style = $derived(computeButtonShadows(elevation, text));
  const isDragging = $derived(drop && dragging && !disabled);

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
    if (!drop || !expanded) return;

    dragWith = target ? `${target.clientWidth}px` : 0;
    dragHeight = target ? `${target.clientHeight}px` : 0;

    updateMargin(dragRef?.firstElementChild);
  };

  const onClear: MouseEventHandler<HTMLButtonElement> = e => {
    e?.stopPropagation();
    ref?.clear?.();
  };

  const onclick = (e: SvelteEvent<MouseEvent>) => {
    if (disabled || skeleton) return;
    e?.stopPropagation();
    ref?.focus?.();
    ref?.click?.();
    buttonProps?.onclick?.(e);
  };

  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Add files',
    title: 'Add files',
    skeleton,
    disabled,
    rounded: expanded || rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    ...buttonProps,
    class: ['neo-file-picker-button', buttonProps?.class],
    onclick,
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

  const removeFile = async (i: number, e?: SvelteEvent<MouseEvent>) => {
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
    } else files = new DataTransfer().files;
    return emitChange();
  };

  let visible = $state(false);
  let messageId = $state(`neo-file-picker-message-${crypto.randomUUID()}`);
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  const context = $derived<NeoInputContext<NeoInputHTMLElement>>({
    // Ref
    ref,

    // Methods
    mark: ref?.mark,
    clear: ref?.clear,
    change: ref?.change,
    validate: ref?.validate,

    // State
    value: files,
    touched,
    dirty,
    valid,
    readonly,
    disabled,

    // Styles
    elevation,
    hover,
    pressed,
    borderless: rest.borderless,
    rounded,
    glass: rest.glass,
    start: rest.start,
    skeleton,
  });

  let timeout: ReturnType<typeof setTimeout>;
  const onFocusIn: FocusEventHandler<HTMLDivElement> = e => {
    clearTimeout(timeout);
    focusin = true;
    containerProps?.onfocusin?.(e);
  };
  const onFocusOut: FocusEventHandler<HTMLDivElement> = e => {
    timeout = setTimeout(() => {
      focusin = false;
      containerProps?.onfocusout?.(e);
    }, 0);
  };
</script>

{#snippet upload()}
  <NeoButton {...afterProps}>
    {#snippet icon()}
      {#if isDragging}
        <IconDownload size="1.25rem" scale="1.5" stroke="1" />
      {:else}
        <IconFileUpload size="1.25rem" scale="var(--neo-input-icon-scale, 1.125)" />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

{#snippet input()}
  <NeoInput
    bind:ref
    bind:wrapperRef
    bind:files
    bind:value
    bind:valid
    bind:dirty
    bind:touched
    bind:hovered
    bind:focused
    bind:labelRef
    type="file"
    {id}
    {label}
    {labelProps}
    {error}
    {message}
    {messageTag}
    {messageProps}
    after={after ?? upload}
    {before}
    {placeholder}
    {loading}
    {clearable}
    {skeleton}
    {disabled}
    {readonly}
    {rounded}
    {pressed}
    {validation}
    {wrapperTag}
    {wrapperProps}
    {elevation}
    {hover}
    {multiple}
    in={inAction}
    out={outAction}
    transition={transitionAction}
    {...rest}
    oninput={mirrorInput}
    onchange={mirrorChange}
    containerProps={{ ...groupProps, class: ['neo-file-picker-input-group', groupProps?.class] }}
  >
    {#if drop}
      <div bind:this={overlayRef} class="neo-drop-overlay">
        {dropText}
      </div>
    {/if}
  </NeoInput>
{/snippet}

{#snippet card()}
  <NeoFilePickerCard
    bind:ref={wrapperRef}
    bind:hovered
    bind:focused
    bind:labelRef
    dragging={isDragging}
    {multiple}
    {append}
    {children}
    {files}
    valid={validation ? valid : undefined}
    {clearable}
    {placeholder}
    {dropText}
    {loading}
    {skeleton}
    {disabled}
    {rounded}
    {pressed}
    {elevation}
    {hover}
    glass={rest.glass}
    start={rest.start}
    required={rest.required}
    maxHeight={expandHeight}
    detailText={expandText}
    {label}
    labelProps={{ for: id, ...labelProps }}
    {...cardProps}
    {onClear}
    onRemove={removeFile}
    onEdit={onclick}
    addButtonProps={afterProps}
  />
  <span class="neo-expanded-input">
    <NeoBaseInput
      bind:ref
      bind:files
      bind:value
      bind:valid
      bind:dirty
      bind:touched
      bind:validationMessage
      type="file"
      aria-invalid={valid === undefined ? undefined : !valid}
      aria-describedby={visible ? messageId : undefined}
      {id}
      {multiple}
      {...rest}
      hidden
      aria-hidden
      tabindex={-1}
      oninput={mirrorInput}
      onchange={mirrorChange}
    />
  </span>
{/snippet}

<!-- Drag & drop -->
{#snippet drag()}
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
    style:--neo-file-picker-drag-margin-top={contentMargin.top}
    style:--neo-file-picker-drag-margin-bottom={contentMargin.bottom}
  >
    {#if expanded}
      {@render card()}
    {:else}
      {@render input()}
    {/if}
  </div>
{/snippet}

<svelte:element
  this={containerTag}
  bind:this={containerRef}
  class:neo-file-picker={true}
  class:neo-expanded={expanded}
  {...containerProps}
  onfocusin={onFocusIn}
  onfocusout={onFocusOut}
>
  {#if drop && expanded}
    <!-- Expanded picker -->
    <NeoInputValidation
      tag={wrapperTag}
      bind:ref={wrapperRef}
      bind:visible
      bind:messageId
      {valid}
      {validation}
      {validationMessage}
      {error}
      {rounded}
      {context}
      {message}
      {messageTag}
      {messageProps}
      in={inAction}
      out={outAction}
      transition={transitionAction}
      {...wrapperProps}
      class={['neo-file-picker-validation', wrapperProps?.class]}
    >
      {@render drag()}
    </NeoInputValidation>
  {:else if drop}
    <!-- Drop support -->
    {@render drag()}
  {:else}
    <!-- No drop support -->
    {@render input()}
  {/if}
</svelte:element>

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
    }

    .neo-drop-container {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      min-width: var(--neo-file-picker-expanded-min-width, 0);
      min-height: var(--neo-file-picker-expanded-min-height, 0);
      padding: 0.75rem;
      transition:
        min-width 0.3s ease,
        min-height 0.3s ease;

      .neo-drop-overlay {
        position: absolute;
        z-index: var(--neo-z-index-in-front, 1);
        display: inline-flex;
        align-items: center;
        box-sizing: border-box;
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

      .neo-expanded-input {
        display: none;
      }

      :global(.neo-file-picker-card) {
        gap: var(--neo-gap);
        width: 100%;
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

        :global(*.neo-file-picker-input-group > *:not(.neo-input-after, .neo-drop-overlay)) {
          opacity: 0;
        }
      }
    }

    :global(.neo-file-picker-validation) {
      width: 100%;
    }
  }
</style>
