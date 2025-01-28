<script lang="ts">
  import type { NeoDividerProps } from '~/divider/neo-divider.model.js';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import { getTabContext } from '~/nav/neo-tabs-context.svelte.js';
  import { coerce } from '~/utils/shadow.utils.js';

  const inputs: NeoDividerProps = $props();

  const context = getTabContext();
  const elevation = $derived(coerce(context?.state?.elevation ?? 0));
  const vertical = $derived(context?.state?.vertical);
</script>

<NeoDivider elevation={elevation < 0 ? 1 : -1} vertical={!vertical} {...inputs} class={['neo-tab-divider', inputs.class]} />
