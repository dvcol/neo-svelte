<script lang="ts" generics="Data extends NeoSortableData">

  import type { ComponentProps } from 'svelte';

  import type { NeoSortableData } from '~/sortable/neo-sortable-context.svelte.js';
  import type { NeoSortableProviderProps } from '~/sortable/neo-sortable.model.js';

  import { RestrictToHorizontalAxis, RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
  import { RestrictToElement } from '@dnd-kit/dom/modifiers';
  import { DragDropProvider, DragOverlay } from '@dnd-kit/svelte';

  import { NeoSortableContext } from '~/sortable/neo-sortable-context.svelte.js';
  import { setNeoSortableContext } from '~/sortable/neo-sortable.model.js';

  let {
    // Snippets
    children,
    overlay,

    // states
    items = $bindable(),
    axis,
    container,

    // props
    overlayProps,

    // modifiers
    manager,
    plugins,
    sensors,
    modifiers = defaults => [
      ...defaults,
      RestrictToElement.configure({ element: container ?? document.body }),
      ...(axis === 'x' ? [RestrictToHorizontalAxis] : []),
      ...(axis === 'y' ? [RestrictToVerticalAxis] : []),
    ],

    // listeners
    onCollision,
    onBeforeDragStart,
    onDragMove,

    onDragStart,
    onDragOver,
    onDragEnd,

    ...rest
  }: NeoSortableProviderProps<Data> = $props();

  const context = new NeoSortableContext<Data>({
    get items() {
      return items;
    },
    set items(value) {
      items = value;
    },
    get handlers() {
      return {
        get onCollision() {
          return onCollision;
        },
        get onBeforeDragStart() {
          return onBeforeDragStart;
        },
        get onDragMove() {
          return onDragMove;
        },
        get onDragStart() {
          return onDragStart;
        },
        get onDragOver() {
          return onDragOver;
        },
        get onDragEnd() {
          return onDragEnd;
        },
      };
    },
  });

  setNeoSortableContext<Data>(context);
</script>

<DragDropProvider
  {manager}
  {plugins}
  {sensors}
  {modifiers}

  onCollision={onCollision as ComponentProps<typeof DragDropProvider>['onCollision']}
  onBeforeDragStart={onBeforeDragStart as ComponentProps<typeof DragDropProvider>['onBeforeDragStart']}
  onDragMove={onDragMove as ComponentProps<typeof DragDropProvider>['onDragMove']}

  onDragStart={context.dragStart as ComponentProps<typeof DragDropProvider>['onDragStart']}
  onDragOver={context.dragOver as ComponentProps<typeof DragDropProvider>['onDragOver']}
  onDragEnd={context.dragEnd as ComponentProps<typeof DragDropProvider>['onDragEnd']}

  {...rest}
>
  {@render children?.(context)}

  {#if overlay}
    <DragOverlay {...overlayProps}>
      {#snippet children(source)}
        {@render overlay(source)}
      {/snippet}
    </DragOverlay>
  {/if}
</DragDropProvider>
