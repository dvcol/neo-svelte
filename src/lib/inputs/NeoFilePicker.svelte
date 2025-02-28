<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { tick } from 'svelte';

  import type { DragEventHandler, FocusEventHandler, FormEventHandler, MouseEventHandler } from 'svelte/elements';
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoFormContextField } from '~/inputs/common/neo-form-context.svelte.js';
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
  import { coerce, computeButtonTemplate, getDefaultElevation, getDefaultHoverElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    label,
    error,
    message,
    after,
    before,
    iconDownload,
    iconUpload,

    // States
    id = `neo-file-picker-${getUUID()}`,
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

    type = 'file',
    loading,
    clearable,
    validation,
    skeleton = false,
    disabled,
    readonly,
    rounded,
    pressed,
    register,

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
    messageProps,
    containerRef = $bindable(),
    containerProps,
    validationRef = $bindable(),
    validationProps,
    ...rest
  }: NeoFilePickerProps = $props();
  /* eslint-enable prefer-const */

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});

  const elevation = $derived(coerce(rest?.elevation ?? getDefaultElevation(pressed)));
  const hover = $derived(coerce(rest?.hover ?? getDefaultHoverElevation(pressed)));

  const template = $derived(computeButtonTemplate(elevation, pressed, rest?.glass));
  const isDragging = $derived(drop && dragging && !disabled);

  let dragRef = $state<HTMLDivElement>();
  let dragWith = $state<string | number>();
  let dragHeight = $state<string | number>();

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
    start: rest.start,
    ...template,
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
  let messageId = $state(`neo-file-picker-message-${getUUID()}`);
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  let initial = $state();
  const context = $derived<NeoInputContext<NeoInputHTMLElement>>({
    // Ref
    ref,

    // Methods
    mark: ref?.mark,
    clear: ref?.clear,
    change: ref?.change,
    validate: ref?.validate,

    // State
    initial,
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
    tinted: rest.tinted,
    color: rest.color,
  });

  const inputForm = $derived<NeoFormContextField>({
    id,
    ref,
    name: rest?.name,
    form: rest?.form,
    type,
    state: { valid, dirty, touched, value: files, initial },
  });

  let timeout: ReturnType<typeof setTimeout>;
  const onFocusIn: FocusEventHandler<HTMLDivElement> = e => {
    clearTimeout(timeout);
    focusin = true;
    containerRest?.onfocusin?.(e);
  };
  const onFocusOut: FocusEventHandler<HTMLDivElement> = e => {
    timeout = setTimeout(() => {
      focusin = false;
      containerRest?.onfocusout?.(e);
    }, 0);
  };
</script>

{#snippet upload()}
  <NeoButton {...afterProps}>
    {#snippet icon()}
      {#if isDragging && iconDownload}
        {@render iconDownload()}
      {:else if isDragging}
        <IconDownload size="1.25rem" scale="1.5" stroke="1" />
      {:else if iconUpload}
        {@render iconUpload()}
      {:else}
        <IconFileUpload size="1.25rem" scale="var(--neo-input-icon-scale, 1.125)" />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

{#snippet overlay(ctx: NeoInputContext<NeoInputHTMLElement>)}
  <div class="neo-drop-overlay">
    {dropText}
  </div>
  {@render rest.inner?.(ctx)}
{/snippet}

{#snippet input()}
  <NeoInput
    bind:ref
    bind:validationRef
    bind:files
    bind:value
    bind:valid
    bind:dirty
    bind:touched
    bind:hovered
    bind:focused
    bind:labelRef
    {type}
    {id}
    {label}
    {labelProps}
    {error}
    {message}
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
    {register}
    {validationProps}
    {elevation}
    {hover}
    {multiple}
    in={inAction}
    out={outAction}
    transition={transitionAction}
    inner={drop ? overlay : rest.inner}
    {...rest}
    class={['neo-input-file-picker', rest.class]}
    oninput={mirrorInput}
    onchange={mirrorChange}
    containerProps={{ ...groupProps, class: ['neo-file-picker-input-group', groupProps?.class] }}
  />
{/snippet}

{#snippet card()}
  <NeoBaseInput
    bind:ref
    bind:files
    bind:value
    bind:valid
    bind:dirty
    bind:initial
    bind:touched
    bind:validationMessage
    {type}
    aria-invalid={valid === undefined ? undefined : !valid}
    aria-describedby={visible ? messageId : undefined}
    {id}
    {multiple}
    {...rest}
    class={['neo-input-file-picker', rest.class]}
    hide
    hidden
    aria-hidden
    tabindex={-1}
    oninput={mirrorInput}
    onchange={mirrorChange}
  />
  <NeoFilePickerCard
    bind:ref={validationRef}
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
    tinted={rest.tinted}
    color={rest.color}
    start={rest.start}
    required={rest.required}
    maxHeight={expandHeight}
    detailText={expandText}
    {label}
    labelProps={{ for: id, ...labelProps }}
    {iconDownload}
    {iconUpload}
    {...cardProps}
    {onClear}
    onRemove={removeFile}
    onEdit={onclick}
    addButtonProps={afterProps}
  />
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
  {...containerRest}
  onfocusin={onFocusIn}
  onfocusout={onFocusOut}
>
  {#if drop && expanded}
    <!-- Expanded picker -->
    <NeoInputValidation
      bind:ref={validationRef}
      bind:visible
      bind:messageId
      input={inputForm}
      {register}
      {valid}
      {validation}
      {validationMessage}
      {error}
      {rounded}
      {context}
      {message}
      {messageProps}
      in={inAction}
      out={outAction}
      transition={transitionAction}
      {...validationProps}
      class={['neo-file-picker-validation', validationProps?.class]}
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

    :global(.neo-input.neo-input-file-picker::file-selector-button) {
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

      :global(> .neo-file-picker-card) {
        gap: var(--neo-gap);
        width: 100%;
        height: calc(
          100% - var(--neo-file-picker-drag-margin-top, var(--neo-shadow-margin, 0.625rem)) - var(
              --neo-file-picker-drag-margin-bottom,
              var(--neo-shadow-margin, 0.625rem)
            )
        );
        padding: var(--neo-file-picker-card-padding, 1rem 1.5rem 1.5rem);
      }

      &.neo-dragging:not(.neo-skeleton) {
        .neo-drop-overlay {
          opacity: 1;
        }

        :global(> .neo-file-picker-card),
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
        }

        :global(> *) {
          pointer-events: none;
        }

        :global(*.neo-file-picker-input-group > *:not(.neo-input-after, .neo-drop-overlay)) {
          opacity: 0;
        }
      }
    }

    :global(> .neo-file-picker-validation) {
      width: 100%;
    }
  }
</style>
