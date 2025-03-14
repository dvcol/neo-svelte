<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  import type { NeoPopConfirmProps } from '~/floating/tooltips/neo-pop-confirm.model.js';
  import type { NeoTooltipContext, NeoTooltipToggle } from '~/floating/tooltips/neo-tooltip.model.js';

  import NeoConfirm from '~/floating/common/NeoConfirm.svelte';
  import NeoTooltip from '~/floating/tooltips/NeoTooltip.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children: trigger,
    tooltip: content,
    header: title,

    // States
    tag = 'div',
    loading = $bindable({
      cancel: false,
      confirm: false,
    }),
    disabled = $bindable({
      cancel: false,
      confirm: false,
    }),

    // Tooltip Props
    tooltipRef = $bindable(),
    triggerRef = $bindable(),
    open = $bindable(false),
    target,
    openDelay,
    hoverDelay,
    openOnFocus,
    openOnHover,
    closable = true,

    // Styles
    rounded = false,
    color,
    filled,
    tinted,
    elevation,
    flex,
    width,
    height,

    // Events
    onOpen,
    onClose,
    onCancel,
    onConfirm,

    // Other Props
    tooltipProps,
    closeProps,
    cancelProps,
    confirmProps,
    ...rest
  }: NeoPopConfirmProps = $props();
  /* eslint-enable prefer-const */

  const onCloseButton: MouseEventHandler<HTMLButtonElement> = e => {
    open = false;
    closeProps?.onclick?.(e);
  };

  const handlePromise = async (result: unknown, button: 'cancel' | 'confirm') => {
    if (!(result instanceof Promise)) return;
    try {
      loading[button] = true;
      await result;
    } finally {
      loading[button] = false;
    }
  };

  const onCancelButton: MouseEventHandler<HTMLButtonElement> = async e => {
    cancelProps?.onclick?.(e);
    await handlePromise(onCancel?.(e), 'cancel');
    open = false;
  };

  const onConfirmButton: MouseEventHandler<HTMLButtonElement> = async e => {
    confirmProps?.onclick?.(e);
    await handlePromise(onConfirm?.(e), 'confirm');
    open = false;
  };
</script>

{#snippet tooltip(floating: NeoTooltipContext, toggle: NeoTooltipToggle)}
  <NeoConfirm
    {tag}
    bind:loading
    bind:disabled
    {closable}
    {rounded}
    {closeProps}
    {cancelProps}
    {confirmProps}
    onClose={onCloseButton}
    onCancel={onCancelButton}
    onConfirm={onConfirmButton}
    {...rest}
  >
    {#snippet header()}
      {#if typeof title === 'function'}
        {@render title?.(floating, toggle)}
      {:else}
        {title}
      {/if}
    {/snippet}

    {#if typeof content === 'function'}
      {@render content?.(floating, toggle)}
    {:else}
      {content}
    {/if}
  </NeoConfirm>
{/snippet}

<NeoTooltip
  bind:ref={tooltipRef}
  bind:triggerRef
  bind:open
  keepOpenOnFocus
  closeOnDismiss={closable}
  {tooltip}
  {target}
  {rounded}
  {flex}
  {width}
  {height}
  {color}
  {filled}
  {tinted}
  {elevation}
  {openDelay}
  {hoverDelay}
  {openOnFocus}
  {openOnHover}
  {onOpen}
  {onClose}
  {...tooltipProps}
>
  {#snippet children(floating: NeoTooltipContext, toggle: NeoTooltipToggle)}
    {@render trigger?.(floating, toggle)}
  {/snippet}
</NeoTooltip>
