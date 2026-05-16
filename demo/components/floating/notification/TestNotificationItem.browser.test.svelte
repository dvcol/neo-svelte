<script lang="ts">
  import type { NeoNotificationQueued } from '~/floating/notification/neo-notification.model.js';

  import { NeoNotificationStatus, NeoNotificationType } from '~/floating/notification/neo-notification.model.js';
  import NeoSimpleNotification from '~/floating/notification/NeoSimpleNotification.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Cell = {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'default';
    close: boolean;
    action: boolean;
    title?: string;
    subtitle?: string;
    content?: string;
    loading?: boolean;
    progress?: boolean;
  };

  function makeItem(cell: Cell): NeoNotificationQueued {
    const item: NeoNotificationQueued = {
      id: cell.id,
      status: NeoNotificationStatus.Pending,
      added: Date.now(),
      // Fixed duration so the progress bar paints at a stable 50% — actual
      // ticking is muted by quietForVisual, but we need a value so the
      // <NeoProgressBar> mounts.
      duration: cell.progress ? 10000 : 0,
      type: cell.type as never,
      title: cell.title,
      subtitle: cell.subtitle,
      content: cell.content,
      close: cell.close,
      loading: cell.loading,
      progress: cell.progress,
      actionProps: cell.action ? { label: 'Retry', onclick: () => undefined } : undefined,
      promise: new Promise(() => undefined),
      cancel: () => ({
        id: cell.id,
        status: NeoNotificationStatus.Dismissed,
        added: Date.now(),
      } as never),
      update: () => item,
      restart: () => item,
    };
    return item;
  }

  const cells: Cell[] = [
    { id: 'i1', type: NeoNotificationType.Info, close: true, action: false, title: 'Info', subtitle: 'subtitle', content: 'Heads up — informational message.' },
    { id: 's1', type: NeoNotificationType.Success, close: true, action: false, title: 'Success', subtitle: 'all good', content: 'Operation completed successfully.' },
    { id: 'w1', type: NeoNotificationType.Warning, close: true, action: false, title: 'Warning', subtitle: 'review this', content: 'Something needs attention.' },
    { id: 'e1', type: NeoNotificationType.Error, close: true, action: false, title: 'Error', subtitle: 'failed', content: 'The action did not succeed.' },
    { id: 'i2', type: NeoNotificationType.Info, close: true, action: true, title: 'Info + action', content: 'Click retry to attempt again.' },
    { id: 's2', type: NeoNotificationType.Success, close: false, action: false, title: 'Success (no close)', content: 'Persistent notification body.' },
    { id: 'w2', type: NeoNotificationType.Warning, close: false, action: true, title: 'Warning + action only', content: 'Action without a close button.' },
    { id: 'd1', type: NeoNotificationType.Default, close: true, action: false, title: 'Default', content: 'No icon variant.' },
    // Demo-page variations: progress bar, loading spinner, compact (no title), title-only.
    { id: 'p1', type: NeoNotificationType.Info, close: true, action: false, title: 'With progress', content: 'Auto-dismiss in 10s.', progress: true },
    { id: 'l1', type: NeoNotificationType.Default, close: false, action: false, title: 'Loading', content: 'Working on it…', loading: true },
    { id: 'c1', type: NeoNotificationType.Default, close: true, action: false, content: 'Compact body — no title or subtitle.' },
    { id: 't1', type: NeoNotificationType.Success, close: true, action: false, title: 'Title only — no body or subtitle.' },
  ];
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    {#each cells as cell (cell.id)}
      <div class="cell">
        <NeoSimpleNotification rounded item={makeItem(cell)} index={0} />
      </div>
    {/each}
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-stage {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 24rem));
    gap: 1rem;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .cell {
    display: flex;
    align-items: stretch;
    min-height: 5rem;
    background: var(--neo-background-color);
    border: 1px solid var(--neo-border-color);
    border-radius: var(--neo-border-radius);
  }
</style>
