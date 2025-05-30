<script lang="ts">
  import type { NeoCollapseContext, NeoCollapseProps } from '~/collapse/neo-collapse.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';
  import { height, width } from '@dvcol/svelte-utils/transition';
  import { untrack } from 'svelte';
  import { cubicIn, sineInOut } from 'svelte/easing';

  import { getNeoCollapseGroupContext } from '~/collapse/neo-collapse-context.svelte.js';
  import NeoDivider from '~/divider/NeoDivider.svelte';

  let {
    // Snippet
    children,
    label,
    description,

    // State
    tag = 'section',
    id = `neo-collapse-${getUUID()}`,
    ref = $bindable(),
    open = $bindable(false),
    horizontal = false,
    disabled: _disabled = false,
    readonly: _readonly = false,
    standalone = false,
    divider = false,
    unmountOnClose = true,
    fade = true,

    // Transition
    transition: _transition,

    // Other props
    triggerRef = $bindable(),
    triggerProps,
    dividerProps,
    containerProps,
    ...rest
  }: NeoCollapseProps = $props();

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});
  const { tag: triggerTag = 'button', ...triggerRest } = $derived(triggerProps ?? {});

  const group = getNeoCollapseGroupContext();

  const disabled = $derived(!!(_disabled || group?.disabled));
  const readonly = $derived(!!(_readonly || group?.readonly || (!open && group?.canOpen === false) || (open && group?.canClose === false)));

  const role = $derived(!['button', 'a'].includes(triggerTag) ? 'button' : undefined);
  const tabindex = $derived(!disabled && role ? 0 : undefined);
  const type = $derived(triggerTag === 'button' ? 'button' : undefined);

  const transition = $derived(horizontal ? width : height);
  const transitionProps = $derived({ duration: 300, easing: sineInOut, opacity: horizontal ? false : { easing: cubicIn }, ..._transition });

  const trigger = $derived(!!(label || description));
  const triggerId = $derived(trigger ? (triggerProps?.id ?? `neo-collapse-trigger-${getUUID()}`) : undefined);

  const context = $derived<NeoCollapseContext>({ id, open, trigger, triggerId, horizontal, disabled, readonly, standalone, divider });

  export function toggle(state = !open) {
    if (disabled || readonly) return;
    open = state;
    if (standalone) return;
    group?.update(id);
  }

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, {
      get trigger() {
        return triggerRef;
      },
      toggle,
    });
  });

  $effect(() => {
    if (!triggerRef) return;
    Object.assign(triggerRef, {
      get section() {
        return ref;
      },
      toggle,
    });
  });

  $effect.pre(() => {
    if (standalone || !group) return;
    untrack(() =>
      group.register(id, {
        id,
        get editable() {
          return !disabled && !readonly;
        },
        get open() {
          return open;
        },
        set open(value) {
          open = value;
        },
        changed: Date.now(),
      }),
    );
    return () => group.remove(id);
  });
</script>

{#snippet renderTriggerContent(snip: NeoCollapseProps['label'] | NeoCollapseProps['description'])}
  {#if typeof snip === 'function'}{@render snip(context)}{:else}{snip}{/if}
{/snippet}

<svelte:element
  this={containerTag}
  class:neo-collapse={true}
  class:neo-horizontal={horizontal}
  class:neo-disabled={disabled}
  data-open={open}
  {...containerRest}
>
  {#if trigger}
    <svelte:element
      this={triggerTag}
      {role}
      {type}
      {tabindex}
      {disabled}
      id={triggerId}
      bind:this={triggerRef}
      aria-expanded={open}
      aria-controls={id}
      data-open={open}
      class:neo-collapse-trigger={true}
      class:neo-readonly={readonly}
      onclick={() => toggle()}
      {...triggerRest}
    >
      <div class="neo-collapse-label">
        {#if label && description}
          <div class="neo-collapse-label-label">{@render renderTriggerContent(label)}</div>
          <div class="neo-collapse-label-description">{@render renderTriggerContent(description)}</div>
        {:else}
          {@render renderTriggerContent(label ?? description)}
        {/if}
      </div>
    </svelte:element>
  {/if}
  {#if divider}
    <NeoDivider vertical={horizontal} {...dividerProps} />
  {/if}
  {#if !unmountOnClose || open}
    <svelte:element
      this={tag}
      bind:this={ref}
      aria-hidden={!open}
      data-unmount-on-close={unmountOnClose}
      {id}
      role="region"
      aria-labelledby={triggerId}
      data-open={open}
      in:transition={transitionProps}
      out:transition={transitionProps}
      class:neo-collapse-content={true}
      class:neo-fade={fade}
      {...rest}
    >
      {@render children?.(context)}
    </svelte:element>
  {/if}
</svelte:element>

<style lang="scss">
  .neo-collapse {
    box-sizing: border-box;
    border: var(--neo-border-width, 1px) solid var(--neo-collapse-border-color, transparent);
    transition: border-color 0.3s ease;

    &-trigger,
    &-content {
      transition: padding 0.3s ease;
    }

    &-trigger {
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      text-align: start;
      text-decoration: none;
      background: none;
      border: none;
      appearance: none;

      &:not(.neo-readonly) {
        cursor: pointer;
      }

      &:disabled,
      &[disabled]:not([disabled='false']) {
        color: var(--neo-text-color-disabled);
        cursor: not-allowed;
      }
    }

    &-content:not([data-unmount-on-close='true']) {
      overflow: hidden;
      transition-timing-function: ease-out;
      transition-duration: 0.3s;

      &[aria-hidden='true'].neo-fade {
        visibility: hidden;
        opacity: var(--neo-collapse-fade-opacity, 0);
      }
    }

    &-label {
      transition: color 0.15s ease;

      &-description {
        color: var(--neo-collapse-description-color, var(--neo-text-color-secondary));
        font-size: var(--neo-font-size-sm);
        line-height: var(--neo-line-height-sm);
      }

      &:focus,
      &:hover {
        color: var(--neo-collapse-trigger-color-hover, var(--neo-text-color-highlight));
      }
    }

    &:not(.neo-horizontal) {
      .neo-collapse-trigger {
        width: 100%;
        padding-block: var(--neo-collapse-trigger-gap, var(--neo-gap-xs, 0.625rem));
      }

      .neo-collapse-content:not([aria-hidden='true']) {
        padding-block-end: var(--neo-collapse-content-gap, var(--neo-gap-xs, 0.625rem));
      }

      .neo-collapse-content:not([data-unmount-on-close='true']) {
        transition-property: height, opacity, visibility, padding-block, margin-block;
        will-change: height, opacity, visibility, padding-block, margin-block;

        &[aria-hidden='true'] {
          height: 0;
          padding-block: 0;
          margin-block: 0;
        }
      }
    }

    &.neo-horizontal {
      display: inline-flex;

      .neo-collapse-trigger {
        min-width: max-content;
        padding-inline: var(--neo-collapse-trigger-gap, var(--neo-gap, 1rem));
      }

      .neo-collapse-content:not([aria-hidden='true']) {
        padding-inline-end: var(--neo-collapse-content-gap, var(--neo-gap, 1rem));
      }

      .neo-collapse-content:not([data-unmount-on-close='true']) {
        transition-property: width, opacity, visibility, padding-inline, margin-inline;
        will-change: width, opacity, visibility, padding-inline, margin-inline;

        &[aria-hidden='true'] {
          width: 0;
          padding-inline: 0;
          margin-inline: 0;
        }
      }
    }

    &:only-child {
      &:not(.neo-horizontal) .neo-collapse-content:not([aria-hidden='true']) {
        padding-block-start: var(--neo-collapse-content-gap, var(--neo-gap-xs, 0.625rem));
      }

      &.neo-horizontal .neo-collapse-content:not([aria-hidden='true']) {
        padding-inline-start: var(--neo-collapse-content-gap, var(--neo-gap, 1rem));
      }
    }
  }
</style>
