<script lang="ts">
  import type { NeoSimpleNotificationProps } from '~/floating/notification/neo-simple-notification.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { scaleHeight, scaleWidth } from '@dvcol/svelte-utils/transition';
  import { scale } from 'svelte/transition';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoCloseButton from '~/buttons/NeoCloseButton.svelte';
  import { NeoNotificationStatus, NeoNotificationType } from '~/floating/notification/neo-notification.model.js';
  import NeoIconCircleLoading from '~/icons/NeoIconCircleLoading.svelte';
  import NeoIconError from '~/icons/NeoIconError.svelte';
  import NeoIconInfo from '~/icons/NeoIconInfo.svelte';
  import NeoIconSuccess from '~/icons/NeoIconSuccess.svelte';
  import NeoIconWarning from '~/icons/NeoIconWarning.svelte';
  import NeoProgressBar from '~/progress/NeoProgressBar.svelte';
  import { quickDurationProps } from '~/utils/transition.utils.js';

  let {
    // Snippet
    children,
    before,
    after,

    // State
    ref = $bindable(),
    bar = $bindable(),
    height = $bindable(0),

    tag = 'div',

    item,
    index,

    restartOnTouch,
    progress,
    loading,
    close = true,

    // Style
    rounded,

    // Events
    onCancel,

    // Other Props
    progressProps,
    actionProps,
    closeProps,
    ...rest
  }: NeoSimpleNotificationProps = $props();

  // Height of the notification body
  let bodyHeight = $state(0);

  const onCloseButton = (event: SvelteEvent<MouseEvent>) => {
    item.cancel(NeoNotificationStatus.Dismissed);
    onCancel?.({ item, index, event });
  };

  const showClose = $derived(item.close ?? close);
  const showAction = $derived(!!(item.actionProps || actionProps));
  const showAfter = $derived(showClose || showAction || (item.after ?? after));
  const showBefore = $derived((item.loading ?? loading) || !!(item.before ?? before) || (item.type && item.type !== NeoNotificationType.Default));

  const notifSize = $derived.by(() => {
    if (height <= 48) return 'sm';
    if (height <= 96) return 'md';
    return 'lg';
  });

  const iconSize = $derived.by(() => {
    if (height <= 48) return '1.25rem';
    if (height <= 96) return '2rem';
    return '2.5rem';
  });

  const onActionButton = async (event: SvelteEvent<MouseEvent>, checked?: boolean) => {
    const cb = item.actionProps?.onclick ?? actionProps?.onclick;
    const result = await cb?.(event, checked);
    if (item.paused && (item.restartOnTouch ?? restartOnTouch)) item.paused = item.added;
    if (!result) return;
    item.cancel(typeof result === 'string' ? result : NeoNotificationStatus.Dismissed);
    onCancel?.({ item, index, event });
  };

  const defaultProgress = $derived.by(() => {
    const duration = item.duration ? (item.duration - (Date.now() - item.added)) : undefined;
    const step = duration ? (100 / (duration / 1000)) : undefined;
    return {
      step,
      tick: 1000,
      autoStart: { pending: !duration },
      autoComplete: true,
    };
  });
</script>

<svelte:element
  this={tag}
  bind:this={ref}
  bind:offsetHeight={height}
  class:neo-notification={true}
  class:neo-rounded={rounded}
  aria-live="polite"
  role={item.type === NeoNotificationType.Error ? 'alert' : 'status'}
  data-size={notifSize}
  style:--neo-notification-height="{bodyHeight}px"
  {...rest}
>
  <div bind:offsetHeight={bodyHeight} class="neo-notification-body" class:neo-after={showAfter}>
    {#if showBefore}
      <div class="neo-notification-before" transition:scaleWidth={quickDurationProps}>
        {#if item.loading ?? loading}
          <NeoIconCircleLoading size={iconSize} />
        {:else if (item.before ?? before)}
          {@render (item.before ?? before)?.(item)}
        {:else if item.type === NeoNotificationType.Error}
          <NeoIconError size={iconSize} stroke={1} />
        {:else if item.type === NeoNotificationType.Warning}
          <NeoIconWarning size={iconSize} stroke={1} />
        {:else if item.type === NeoNotificationType.Info}
          <NeoIconInfo size={iconSize} stroke={1} />
        {:else if item.type === NeoNotificationType.Success}
          <NeoIconSuccess size={iconSize} stroke={1} />
        {/if}
      </div>
    {/if}
    <div class="neo-notification-text" class:neo-before={showBefore}>
      {#if item.title}
        <div class="neo-notification-title" transition:scaleHeight={quickDurationProps}>{item.title}</div>
      {/if}
      {#if item.subtitle}
        <div class="neo-notification-subtitle" transition:scaleHeight={quickDurationProps}>{item.subtitle}</div>
      {/if}
      {#if item.content}
        <div class="neo-notification-content" transition:scaleHeight={quickDurationProps}>
          {item.content}
        </div>
      {/if}
      {#if children}
        {@render children(item)}
      {/if}
      {#if item.progress ?? progress}
        <div class="neo-notification-progress" transition:scaleHeight={quickDurationProps}>
          <NeoProgressBar
            bind:ref={bar}
            glass
            elevation={-1}
            aria-label="Notification progress"
            {...defaultProgress}
            {...progressProps}
            {...item.progressProps}
          />
        </div>
      {/if}
    </div>
  </div>
  {#if showAfter}
    <div class="neo-notification-actions" class:neo-rounded={rounded} transition:scaleWidth={quickDurationProps}>
      {#if item.close ?? close}
        <NeoCloseButton
          rounded
          text
          size="md"
          inline={notifSize === 'sm'}
          aria-label="Close notification"
          title="Close"
          transition={{ use: scale, props: quickDurationProps }}
          {...closeProps}
          {...item.closeProps}
          onclick={onCloseButton}
          class={['neo-notification-close-button', closeProps?.class, item.closeProps?.class]}
        />
      {/if}
      {#if item.actionProps || actionProps}
        <NeoButton
          {rounded}
          elevation={0}
          aria-label="Notification action"
          title="Action"
          label="action"
          transition={{ use: scale, props: quickDurationProps }}
          {...actionProps}
          {...item.actionProps}
          class={['neo-notification-action-button', actionProps?.class, item.actionProps?.class]}
          onclick={onActionButton}
        />
      {/if}
      {#if item.after ?? after}
        {@render (item.after ?? after)?.(item)}
      {/if}
    </div>
  {/if}
</svelte:element>

<style lang="scss">
  .neo-notification {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;

    :global(.neo-notification-close-button) {
      margin-bottom: auto;
      opacity: 0.5;
      transition: opacity 0.3s ease;
      transition-duration: 0.6s;
    }

    &.neo-rounded {
      padding-inline: var(--neo-gap-3xs, 0.3125rem);
    }

    &-body {
      display: flex;
      flex: 1 1 auto;
      width: max-content;
      min-width: min(10rem, 80vw);
      max-width: calc(100vw - 2rem);
      padding: var(--neo-notification-padding, var(--neo-gap-xxs, 0.5rem));
      transition: padding 0.3s ease;

      &.neo-after {
        padding-inline-end: 0;
      }
    }

    &-before {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      margin-inline-end: var(--neo-gap-xxs, 0.5rem)
    }

    &-text {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: var(--neo-gap-5xs, 0.125rem);
    }

    &-title {
      font-weight: var(--neo-font-weight-xxl, 800);
    }

    &-subtitle {
      font-weight: var(--neo-font-weight-md, 500);
    }

    &-subtitle,
    &-content {
      color: var(--neo-notification-color, var(--neo-text-color-secondary));
      font-size: var(--neo-font-size-sm, 0.875rem);
      line-height: var(--neo-line-height-sm, 1.25rem);
      white-space: pre-line;
    }

    &-title,
    &-subtitle,
    &-content {
      transition: color 0.6s ease;
    }

    &:hover,
    &:active,
    &:focus,
    &:focus-within,
    &:focus-visible {
      :global(.neo-notification-close-button) {
        opacity: 1;
        transition-delay: 0s;
      }

      .neo-notification-subtitle,
      .neo-notification-content {
        color: var(--neo-notification-color-highlight, var(--neo-text-color-secondary-highlight));
      }
    }

    &-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-around;
      height: 100%;
      min-height: var(--neo-notification-height, strech);
      transition: margin 0.3s ease;

     &.neo-rounded :global(.neo-notification-close-button) {
       margin-right: var(--neo-gap-xxs, 0.25rem);
      }
    }

    &-progress {
      margin-top: var(--neo-gap-4xs, 0.25rem);
    }

    &[data-size='sm'] {
      :global(.neo-notification-close-button) {
        margin-left: var(--neo-gap-4xs, 0.25rem);
      }

      &.neo-rounded :global(.neo-notification-close-button) {
        margin-top: auto;
        margin-right: var(--neo-gap-5xs, 0.125rem);
      }
    }

    &[data-size='md'] {
      .neo-notification-body {
        padding: var(--neo-notification-padding, var(--neo-gap-xxs, 0.5rem) var(--neo-gap-xs, 0.625rem));

        &.neo-after {
          padding-inline-end: 0;
        }
      }

      .neo-notification-before {
        margin-inline-end: var(--neo-gap-xs, 0.625rem);
      }
    }

    &[data-size='lg'] {
      :global(.neo-close-button) {
        --neo-btn-close-margin: var(--neo-gap-xs, 0.625rem);
      }

      .neo-notification-body {
        padding: var(--neo-notification-padding, var(--neo-gap-xxs, 0.5rem) var(--neo-gap-sm, 0.75rem));

        &.neo-after {
          padding-inline-end: 0;
        }
      }

      .neo-notification-before {
        margin-inline-end: var(--neo-gap-sm, 0.75rem)
      }
    }
  }
  </style>
