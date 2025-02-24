<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { height, width } from '@dvcol/svelte-utils/transition';
  import { untrack } from 'svelte';
  import { cubicIn, sineInOut } from 'svelte/easing';

  import type { NeoCollapseContext, NeoCollapseProps } from '~/collapse/neo-collapse.model.js';

  import { getNeoCollapseGroupContext } from '~/collapse/neo-collapse-context.svelte.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
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
    standalone = false,

    // Transition
    transition: _transition,

    // Other props
    triggerRef = $bindable(),
    triggerProps,
    containerProps,
    ...rest
  }: NeoCollapseProps = $props();
  /* eslint-enable prefer-const */

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});
  const { tag: triggerTag = 'button', ...triggerRest } = $derived(triggerProps ?? {});

  const group = getNeoCollapseGroupContext();

  const disabled = $derived(!!(_disabled || group?.disabled));
  const role = $derived(!['button', 'a'].includes(triggerTag) ? 'button' : undefined);
  const tabindex = $derived(!disabled && role ? 0 : undefined);

  const transition = $derived(horizontal ? width : height);
  const transitionProps = $derived({ duration: 200, easing: sineInOut, opacity: horizontal ? false : { easing: cubicIn }, ..._transition });

  const trigger = $derived(!!(label || description));
  const triggerId = $derived(trigger ? (triggerProps?.id ?? `neo-collapse-trigger-${getUUID()}`) : undefined);

  const context = $derived<NeoCollapseContext>({ id, open, trigger, triggerId, horizontal, disabled });

  const toggle = (state = !open) => {
    if (disabled) return;
    open = state;
    if (standalone) return;
    group?.update(id);
  };

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, {
      get context() {
        return context;
      },
      get trigger() {
        return triggerRef;
      },
      toggle,
    });
  });

  $effect(() => {
    if (!triggerRef) return;
    Object.assign(triggerRef, {
      get context() {
        return context;
      },
      get section() {
        return ref;
      },
      toggle,
    });
  });

  $effect(() => {
    if (standalone || !group) return;
    untrack(() =>
      group.register(id, {
        id,
        get disabled() {
          return disabled;
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
      {tabindex}
      {disabled}
      id={triggerId}
      bind:this={triggerRef}
      aria-expanded={open}
      aria-controls={id}
      class:neo-collapse-trigger={true}
      onclick={() => toggle()}
      {...triggerRest}
    >
      {#if label && description}
        <div class="neo-collapse-label">
          <div class="neo-collapse-label-label">{@render renderTriggerContent(label)}</div>
          <div class="neo-collapse-label-description">{@render renderTriggerContent(description)}</div>
        </div>
      {:else}
        {@render renderTriggerContent(label ?? description)}
      {/if}
    </svelte:element>
  {/if}
  {#if open}
    <svelte:element
      this={tag}
      bind:this={ref}
      {id}
      role="region"
      aria-labelledby={triggerId}
      in:transition={transitionProps}
      out:transition={transitionProps}
      class:neo-collapse-content={true}
      {...rest}
    >
      {@render children?.(context)}
    </svelte:element>
  {/if}
</svelte:element>

<style lang="scss">
  .neo-collapse {
    &-trigger {
      flex: 0 0 auto;
      margin: 0;
      padding: 0;
      color: inherit;
      text-align: start;
      text-decoration: none;
      background: none;
      border: none;
      appearance: none;

      &:disabled,
      &[disabled]:not([disabled='false']) {
        cursor: not-allowed;
      }
    }

    &:not(.neo-horizontal) {
      width: 100%;
    }

    &.neo-horizontal {
      display: flex;
      flex-direction: row;
    }
  }
</style>
