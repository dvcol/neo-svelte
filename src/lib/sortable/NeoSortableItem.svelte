<script lang="ts" generics="Data extends NeoSortableData">

  import type { NeoSortableData } from '~/sortable/neo-sortable-context.svelte.js';
  import type { NeoSortableItemProps } from '~/sortable/neo-sortable.model.js';

  import { createSortable } from '@dnd-kit/svelte/sortable';
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { onDestroy } from 'svelte';

  import { getNeoSortableContext } from '~/sortable/neo-sortable.model.js';

  const {
    id = `neo-sortable-item-${getUUID()}`,
    index,
    group,

    data,
    type = 'neo-sortable-item',
    disabled,
    alignment,

    transition,
    plugins,
    sensors,
    modifiers,

    children,
  }: NeoSortableItemProps<Data> = $props();

  const instance = createSortable<Data>({
    get id() {
      return id;
    },
    get index() {
      return index;
    },
    get group() {
      return group;
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

    get plugins() {
      return plugins;
    },
    get transition() {
      return transition;
    },
    get sensors() {
      return sensors;
    },
    get modifiers() {
      return modifiers;
    },
  });

  const context = getNeoSortableContext<Data>();

  const remove = context.add(instance.sortable);

  onDestroy(remove);
</script>

{@render children?.({ id, index, data, instance }, context)}
