<script lang="ts">
  import type { NeoCollapseGroupProps } from '~/collapse/neo-collapse-group.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';

  import { defaultCollapseGroupStrategy, setCollapseGroupContext } from '~/collapse/neo-collapse-context.svelte.js';

  const {
    // Snippets
    children,

    // States
    id = `neo-collapse-group-${getUUID()}`,
    min = 0,
    max = Infinity,
    disabled = false,
    readonly = false,
    strategy = defaultCollapseGroupStrategy,
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
      return disabled;
    },
    get readonly() {
      return readonly || max === 0;
    },
    get strategy() {
      return strategy;
    },
  });
</script>

{@render children?.(group)}
