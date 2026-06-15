<script lang="ts" generics="Data extends NeoSortableData">
  import type { NeoSortableData } from '~/sortable/neo-sortable-context.svelte.js';
  import type { NeoDraggableProps } from '~/sortable/neo-sortable.model.js';

  import { createDraggable } from '@dnd-kit/svelte';

  const {
    id,
    data,

    type = 'neo-draggable',
    disabled,
    alignment,

    sensors,
    modifiers,
    plugins,

    children,
  }: NeoDraggableProps<Data> = $props();

  const draggable = createDraggable<Data>({
    get id() {
      return id;
    },
    get data() {
      return data;
    },

    get type() {
      return type;
    },
    get alignment() {
      return alignment;
    },
    get disabled() {
      return disabled;
    },

    get sensors() {
      return sensors;
    },
    get modifiers() {
      return modifiers;
    },
    get plugins() {
      return plugins;
    },
  });
</script>

{@render children?.(draggable)}
