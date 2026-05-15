<script lang="ts">
  import type { ComponentType, SvelteComponent } from 'svelte';

  import { useRoute } from '@dvcol/svelte-simple-router/router';
  import { coerceQuery } from 'demo/utils/query.js';

  // Vite/Rollup `import.meta.glob` builds a name → loader map at compile time.
  // Each Test<Name>.browser.test.svelte is the same harness driven by the
  // browser test file; rendering it here under `#/test/<name>?prop=value`
  // gives contributors a URL to debug visually using the exact same component
  // the test exercises.
  const loaders = import.meta.glob<{ default: ComponentType<SvelteComponent> }>('./**/Test*.browser.test.svelte');

  const HARNESS_NAME_RE = /\/Test(?<key>[^/]+?)\.browser\.test\.svelte$/;
  const SEGMENT_SEPARATOR_RE = /[-_]/;

  const LoaderByKey = Object.fromEntries(
    Object.entries(loaders).flatMap(([path, loader]) => {
      const match = HARNESS_NAME_RE.exec(path);
      return match?.groups?.key ? [[match.groups.key, loader]] : [];
    }),
  );

  const route = $derived(useRoute());
  const name = $derived((route.location?.params?.name ?? '') as string);
  const props = $derived(coerceQuery(route.location?.query ?? {}));

  const loader = $derived(LoaderByKey[capitalize(name)]);

  let component = $state<ComponentType<SvelteComponent> | null>(null);
  let error = $state<string | null>(null);

  $effect(() => {
    component = null;
    error = null;
    if (!loader) {
      error = `No harness found for "${name}". Available: ${Object.keys(LoaderByKey).join(', ')}.`;
      return;
    }
    loader().then((mod) => {
      component = mod.default;
    }).catch((err) => {
      error = String(err);
    });
  });

  function capitalize(s: string): string {
    if (!s) return s;
    return s.split(SEGMENT_SEPARATOR_RE).map(seg => seg.charAt(0).toUpperCase() + seg.slice(1)).join('');
  }

  const SvelteComp = $derived(component);
</script>

{#if error}
  <pre class="test-harness-error">{error}</pre>
{:else if SvelteComp}
  <SvelteComp {...props} />
{/if}

<style lang="scss">
  .test-harness-error {
    margin: 2rem;
    padding: 1rem;
    color: #b00020;
    white-space: pre-wrap;
    background: #fff3f3;
    border: 1px solid #b00020;
    border-radius: 0.5rem;
  }
</style>
