<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  import type { NeoFilePickerCardProps } from '~/inputs/neo-file-picker.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoCard from '~/cards/NeoCard.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import IconClear from '~/icons/IconClear.svelte';
  import IconDownload from '~/icons/IconDownload.svelte';
  import IconPencil from '~/icons/IconPencil.svelte';

  import NeoAffix from '~/inputs/common/NeoAffix.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { toClass } from '~/utils/props.utils.js';
  import { enterDefaultTransition, leaveDefaultFadeTransition } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    label,

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
    skeleton,

    // Style
    maxHeight = '20rem',

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
  /* eslint-enable prefer-const */

  const detail = $derived(detailText || `${files?.length} file${files?.length !== 1 ? 's' : ''}`);

  const close = $derived(clearable && !!files?.length && (hovered || focused));
</script>

{#snippet card()}
  <NeoCard
    bind:ref
    bind:hovered
    bind:focused
    {rounded}
    {disabled}
    {skeleton}
    out={leaveDefaultFadeTransition}
    flex="1 1 auto"
    {...rest}
    class={toClass('neo-file-picker-card', rest?.class)}
  >
    {#if children}
      {@render children({
        dragging,
        multiple,
        append,
        files,
      })}
    {:else if files?.length}
      <div class="neo-expanded-count">
        <span>{detail}</span>
        <NeoAffix
          {loading}
          {valid}
          {close}
          {skeleton}
          {disabled}
          closeProps={{
            onclick: onClear,
          }}
        />
      </div>
      <div class="neo-expanded-list" class:neo-rounded={rounded} style:--neo-file-picker-card-max-height={maxHeight}>
        <div class="neo-expanded-scroll">
          {#each files as file, i (file)}
            <div class="neo-file" transition:fade={{ duration: 200 }} animate:flip={{ duration: 200, delay: 100 }}>
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
                    class={toClass('neo-file-remove-button', removeButtonProps?.class)}
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
      </div>
      <div class="neo-expanded-edit">
        <span>{placeholder}</span>
        <NeoButton {disabled} rounded text onclick={onEdit} title="Edit files" aria-label="Edit files" {...editButtonProps}>
          {#snippet icon()}
            <IconPencil width="1.25rem" height="1.25rem" scale="1" />
          {/snippet}
        </NeoButton>
      </div>
    {:else}
      <div
        role="none"
        class="neo-expanded-empty"
        class:neo-dragging={dragging}
        class:neo-rounded={rounded}
        class:neo-disabled={disabled}
        onclick={onEdit}
        in:fade={enterDefaultTransition}
      >
        <div class="neo-expanded-button">
          <NeoButton aria-label="Add files" title="Add files" text rounded {skeleton} {disabled} onclick={onEdit} {...addButtonProps}>
            {#snippet icon()}
              {#if dragging}
                <IconDownload width="2.5rem" height="2.5rem" scale="1.25" stroke="0.5" />
              {:else if loading}
                <IconCircleLoading width="2.5rem" height="2.5rem" scale="1" />
              {:else}
                <IconAdd width="2.5rem" height="2.5rem" scale="1" stroke="0.5" />
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
{/snippet}

{#if label}
  <NeoLabel bind:ref={labelRef} {label} {disabled} {...labelProps}>
    {@render card()}
  </NeoLabel>
{:else}
  {@render card()}
{/if}

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

      &.neo-dragging::before {
        margin: -0.25rem;
      }
    }

    &-edit,
    &-count {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
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

    &-scroll {
      --neo-scrollbar-button-height: 0.375rem;

      position: relative;
      display: inline-flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: var(--neo-gap-xxs);
      max-height: var(--neo-file-picker-card-max-height);
      padding: 0.625rem 0.25rem;
      overflow: auto;

      @include mixin.fade-scroll(1rem);
      @include mixin.scrollbar($gutter: stable both-edges);
    }
  }
</style>
