<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';

  import type { NeoCollapseGroupProps } from '~/collapse/neo-collapse-group.model.js';

  import { setCollapseGroupContext } from '~/collapse/neo-collapse-context.svelte.js';

  const {
    // Snippets
    children,

    // States
    id = `neo-collapse-group-${getUUID()}`,
    min = 0,
    max = Infinity,
    disabled = false,
  }: NeoCollapseGroupProps = $props();

  const group = setCollapseGroupContext({
    get id() {
      return id;
    },
    get min() {
      return min;
    },
    get max() {
      return max;
    },
    get disabled() {
      return disabled || max === 0;
    },
  });
</script>

{@render children?.(group)}
