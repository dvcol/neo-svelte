<script lang="ts">
  import NeoSuspense from '~/loading/NeoSuspense.svelte';

  type Props = {
    promise: Promise<any>;
    delay?: number;
    loadingText?: string;
    showLoading?: boolean | 'snippet';
    resultText?: string;
    childrenText?: string;
    errorText?: string;
    matrixProps?: Record<string, any>;
  };

  const {
    promise,
    delay,
    loadingText,
    showLoading = true,
    resultText,
    childrenText,
    errorText,
    matrixProps,
  }: Props = $props();
</script>

<NeoSuspense
  {promise}
  {delay}
  loading={showLoading === false ? false : showLoading === 'snippet' ? loadingSnippet : undefined}
  result={resultText !== undefined ? resultSnippet : undefined}
  error={errorText !== undefined ? errorSnippet : undefined}
  {matrixProps}
>
  {#if childrenText !== undefined}
    <span data-testid="suspense-children">{childrenText}</span>
  {/if}
</NeoSuspense>

{#snippet loadingSnippet()}
  <span data-testid="suspense-loading">{loadingText ?? 'loading'}</span>
{/snippet}

{#snippet resultSnippet(value: any)}
  <span data-testid="suspense-result">{resultText}:{String(value)}</span>
{/snippet}

{#snippet errorSnippet(err: any)}
  <span data-testid="suspense-error">{errorText}:{err?.message ?? String(err)}</span>
{/snippet}
