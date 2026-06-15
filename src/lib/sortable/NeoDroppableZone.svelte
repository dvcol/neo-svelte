<script lang="ts" generics="Data extends NeoSortableData">
  import type { NeoSortableData } from '~/sortable/neo-sortable-context.svelte.js';
  import type { NeoDroppableZoneProps } from '~/sortable/neo-sortable.model.js';

  import { createDroppable } from '@dnd-kit/svelte';

  const {
    id,
    data,

    type = 'neo-droppable-zone',
    accept,
    disabled,

    collisionDetector,
    collisionPriority,

    children,
  }: NeoDroppableZoneProps<Data> = $props();

  const droppable = createDroppable<Data>({
    get id() {
      return id;
    },
    get data() {
      return data;
    },

    get type() {
      return type;
    },
    get accept() {
      return accept;
    },
    get disabled() {
      return disabled;
    },

    get collisionDetector() {
      return collisionDetector;
    },
    get collisionPriority() {
      return collisionPriority;
    },
  });
</script>

{@render children?.(droppable)}
