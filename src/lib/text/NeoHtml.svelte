<script lang="ts">
  import type { Config } from 'dompurify';

  import purify from 'dompurify';

  import { Logger } from '~/utils/logger.utils.js';

  const {
    html,
    ...options
  }: Config & { html?: string } = $props();

  const content = $derived.by(() => {
    if (!html) return;
    try {
      return purify.sanitize(html, options);
    } catch (error) {
      Logger.error('Failed to sanitize HTML content', error);
    }
  });
</script>

{#if content}
  <!-- eslint-disable-next-line - svelte/no-at-html-tags  -->
  {@html content}
{/if}
