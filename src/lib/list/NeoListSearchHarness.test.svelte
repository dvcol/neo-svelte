<script lang="ts">
  import type { NeoListContext } from '~/list/neo-list.model.js';

  import NeoListSearch from '~/list/NeoListSearch.svelte';

  let {
    context,
    invert = $bindable(),
    delay,
  }: {
    context?: NeoListContext;
    invert?: boolean;
    delay?: number;
  } = $props();
</script>

<NeoListSearch bind:invert {context} {delay} />
