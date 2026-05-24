<script lang="ts">
  import type { NeoDialogPlacement } from '~/floating/common/neo-placement.model.js';
  import type { NeoMovable, NeoMovableOutside, NeoMovableUseResult, NeoMoved } from '~/floating/dialog/use-movable.svelte.js';

  import { useMovable } from '~/floating/dialog/use-movable.svelte.js';

  type Props = {
    movable?: Partial<NeoMovable>;
    placement?: NeoDialogPlacement;
    initialOffset?: NeoMoved;
    onResult?: (result: NeoMovableUseResult<HTMLDivElement, HTMLDivElement>) => void;
    close?: () => unknown;
  };

  const {
    movable,
    placement = 'center',
    initialOffset = { x: 0, y: 0 },
    onResult,
    close,
  }: Props = $props();

  let element = $state<HTMLDivElement | undefined>(undefined);
  /** Harness seeds local state from `initialOffset` once; tests don't drive re-seeding (they mutate via the get/set bridge below). */
  // svelte-ignore state_referenced_locally
  let offset = $state<NeoMoved>({ ...initialOffset });
  let outside = $state<NeoMovableOutside>(false);

  /** Harness passes `close` once at hook init; tests don't swap it. */
  // svelte-ignore state_referenced_locally
  const onClose = close;

  const result = useMovable<HTMLDivElement, HTMLDivElement>({
    get offset() {
      return offset;
    },
    set offset(v) {
      offset = v;
    },
    get outside() {
      return outside;
    },
    set outside(v) {
      outside = v;
    },
    get placement() {
      return placement!;
    },
    get movable() {
      return movable;
    },
    get element() {
      return element;
    },
    close: onClose,
  });

  $effect(() => {
    onResult?.(result);
  });
</script>

<div
  bind:this={element}
  data-testid="movable"
  data-translate={result.translate}
  data-translating={result.translating}
  data-moving={result.moving}
  data-offset-x={offset.x}
  data-offset-y={offset.y}
  style="position: fixed; top: 100px; left: 100px; width: 200px; height: 200px;"
></div>
