<script lang="ts">
  import type { NeoFilePickerCardProps } from '~/inputs/neo-file-picker.model.js';

  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoCard from '~/cards/NeoCard.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import IconClear from '~/icons/IconClear.svelte';
  import IconDownload from '~/icons/IconDownload.svelte';
  import IconFileUpload from '~/icons/IconFileUpload.svelte';
  import IconPencil from '~/icons/IconPencil.svelte';
  import NeoAffix from '~/inputs/common/NeoAffix.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { quickCircOutProps, quickDelayProps, quickDurationProps } from '~/utils/transition.utils.js';

  let {
    // Snippets
    children,
    label,
    iconUpload,
    iconDownload,

    // States
    ref = $bindable(),
    hovered = $bindable(false),
    focused = $bindable(false),

    files,
    valid,
    clearable,
    dragging,
    multiple,
    append,
    placeholder,
    dropText = placeholder,
    detailText,

    required,
    loading,
    rounded,
    disabled,
    skeleton = false,

    // Style
    maxHeight = '20rem',
    scrollbar = true,

    // Events
    onClear,
    onRemove,
    onEdit,

    // Other props
    labelRef = $bindable(),
    labelProps,
    addButtonProps,
    editButtonProps,
    removeButtonProps,

    ...rest
  }: NeoFilePickerCardProps = $props();

  const detail = $derived(detailText || `${files?.length ?? 0} file${files?.length !== 1 ? 's' : ''}`);

  const close = $derived(clearable && !!files?.length && (hovered || focused));
</script>

{#snippet labelGroup()}
  <div class="neo-expanded-count" class:neo-label={label}>
    <NeoLabel bind:ref={labelRef} {label} {disabled} onclick={e => e.preventDefault()} {...labelProps}>
      <span class="neo-expanded-detail">{detail}</span>
    </NeoLabel>

    <NeoAffix
      {loading}
      {valid}
      {close}
      {skeleton}
      {disabled}
      size="1.375rem"
      closeProps={{
        onclick: onClear,
      }}
    />
  </div>
{/snippet}

<NeoCard
  bind:ref
  bind:hovered
  bind:focused
  scrollbar={false}
  {rounded}
  {disabled}
  {skeleton}
  out={{ use: fade, props: quickDelayProps }}
  flex="1 1 auto"
  {...rest}
  class={['neo-file-picker-card', rest?.class]}
>
  {#if children}
    {@render children({
      dragging,
      multiple,
      append,
      files,
    })}
  {:else if files?.length}
    {@render labelGroup()}
    <div class="neo-expanded-list" class:neo-rounded={rounded} style:--neo-file-picker-card-max-height={maxHeight}>
      <div class="neo-expanded-scroll" class:neo-scroll={scrollbar}>
        {#each files as file, i (file)}
          <div class="neo-file" transition:fade={quickDurationProps} animate:flip={quickCircOutProps}>
            <span class="neo-file-name" title={file.name}>{file.name}</span>
            {#if clearable}
              <span class="neo-file-remove">
                <NeoButton
                  text
                  rounded
                  {disabled}
                  onclickcapture={e => onRemove?.(i, e)}
                  title="Remove file"
                  aria-label="Remove file"
                  {...removeButtonProps}
                  class={['neo-file-remove-button', removeButtonProps?.class]}
                >
                  {#snippet icon()}
                    <IconClear size="1rem" scale="1.5" stroke="1" />
                  {/snippet}
                </NeoButton>
              </span>
            {/if}
          </div>
        {/each}
      </div>
    </div>
    <div class="neo-expanded-edit">
      <span>{placeholder}</span>
      <NeoButton {disabled} rounded text onclick={onEdit} title="Edit files" aria-label="Edit files" {...editButtonProps}>
        {#snippet icon()}
          <IconPencil size="1.25rem" scale="1" />
        {/snippet}
      </NeoButton>
    </div>
  {:else}
    {#if label}
      {@render labelGroup()}
    {/if}
    <div
      role="none"
      class="neo-expanded-empty"
      class:neo-dragging={dragging}
      class:neo-rounded={rounded}
      class:neo-disabled={disabled}
      class:neo-label={label}
      onclick={onEdit}
      in:fade={quickDurationProps}
    >
      <div class="neo-expanded-button">
        <NeoButton aria-label="Add files" title="Add files" text rounded {skeleton} {disabled} onclick={onEdit} {...addButtonProps}>
          {#snippet icon(ctx)}
            {#if dragging && iconDownload}
              {@render iconDownload(ctx)}
            {:else if dragging}
              <IconDownload size="2rem" scale="1.25" stroke="0.5" />
            {:else if loading}
              <IconCircleLoading size="2rem" scale="1" />
            {:else if iconUpload}
              {@render iconUpload(ctx)}
            {:else}
              <IconFileUpload size="2rem" scale="1" stroke="0.5" />
            {/if}
          {/snippet}
        </NeoButton>
      </div>
      <div class="neo-expanded-placeholder" style:min-width="max({dropText?.length ?? 0}ch,{placeholder?.length ?? 0}ch)">
        {#if dragging}
          <span class="neo-expanded-placeholder-drop">{dropText}</span>
        {:else}
          <span class="neo-expanded-placeholder-select">{placeholder}</span>
        {/if}
      </div>
    </div>
  {/if}
</NeoCard>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-expanded {
    &-placeholder,
    &-button {
      align-self: center;
      width: fit-content;
    }

    &-placeholder {
      text-align: center;
    }

    &-empty,
    &-scroll {
      min-width: var(--neo-file-picker-card-min-width);
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
        border: var(--neo-border-width) dashed var(--neo-text-color-secondary);
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

      &.neo-dragging::before {
        margin: -0.25rem;
      }

      &.neo-label {
        margin-top: 0.25rem;
      }
    }

    &-edit,
    &-count {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
    }

    &-edit {
      margin-top: 0.25rem;
    }

    &-count {
      --neo-label-margin: 0;
      --neo-label-padding: 0;

      &.neo-label {
        margin-top: 0.25rem;
        margin-bottom: 0.5rem;

        .neo-expanded-detail {
          color: var(--neo-text-color-secondary);
          font-size: var(--neo-font-size-sm);
          line-height: var(--neo-line-height-sm);
        }
      }
    }

    &-list {
      display: inline-flex;
      flex: 1 1 auto;
      margin: 0 var(--neo-shadow-margin, 0.625rem);
      padding: 0 0.5rem;
      border-radius: var(--neo-border-radius);
      box-shadow: var(--neo-box-shadow-inset-1);

      &.neo-rounded {
        border-radius: var(--neo-border-radius-md);
      }

      .neo-file {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        transition: color 0.1s ease;

        &-name {
          @include mixin.ellipsis($line: 2);
        }

        &-remove {
          flex: 0 0 auto;
        }

        &:hover {
          color: var(--neo-text-color-highlight);
        }
      }
    }

    &-scroll {
      position: relative;
      display: inline-flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: var(--neo-gap-xxs);
      max-height: var(--neo-file-picker-card-max-height);
      padding: 0.625rem 0.25rem;
      overflow: auto;

      &.neo-scroll {
        @include mixin.fade-scroll(1rem);
        @include mixin.scrollbar($button-height: 0.375rem);
      }
    }
  }
</style>
