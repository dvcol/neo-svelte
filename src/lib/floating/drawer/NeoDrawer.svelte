<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';

  import type { NeoDialogProps } from '~/floating/dialog/neo-dialog.model.js';

  import type { NeoMovable, NeoMovableLimits } from '~/floating/dialog/use-movable.svelte.js';

  import { NeoDialogPlacements } from '~/floating/common/neo-placement.model.js';
  import NeoDialog from '~/floating/dialog/NeoDialog.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    id = `neo-drawer-${getUUID()}`,
    ref = $bindable(),
    open = $bindable(false),
    modal = $bindable(true),
    moved = $bindable({ x: 0, y: 0 }),
    returnValue = $bindable(),

    // Position
    placement = $bindable(NeoDialogPlacements.Right),
    outside = $bindable(false),
    movable: _movable,

    ...rest
  }: NeoDialogProps = $props();
  /* eslint-enable prefer-const */

  const getLimits = (limits: NeoMovableLimits = {}): NeoMovableLimits => {
    if (placement.startsWith('right')) return { ...limits, x: { min: 0, ...limits?.x } };
    if (placement.startsWith('left')) return { ...limits, x: { max: 0, ...limits?.x } };
    if (placement.startsWith('top')) return { ...limits, y: { max: 0, ...limits?.y } };
    if (placement.startsWith('bottom')) return { ...limits, y: { min: 0, ...limits?.y } };
    return limits;
  };

  const getAxis = (axis?: NeoMovable['axis']): NeoMovable['axis'] => {
    if (axis) return axis;
    if (placement.startsWith('top') || placement.startsWith('bottom')) return 'y';
    if (placement.startsWith('left') || placement.startsWith('right')) return 'x';
  };

  const movable = $derived.by((): NeoMovable => {
    const parsed: NeoMovable = typeof _movable === 'object' ? _movable : { enabled: !!_movable };
    const snap = typeof parsed.snap === 'object' ? parsed.snap : { enabled: !!parsed.snap, corner: parsed.snap === 'corner' };
    const handle = typeof parsed.handle === 'boolean' ? { visible: !!parsed.handle } : parsed.handle;
    return {
      margin: 0,
      ...parsed,
      limits: getLimits(parsed.limits),
      axis: getAxis(parsed.axis),
      snap,
      handle,
    };
  });
</script>

<div class:neo-drawer={true}>
  <NeoDialog bind:ref bind:open bind:modal bind:moved bind:returnValue bind:placement bind:outside {id} {movable} {...rest} />
</div>

<style lang="scss">
  .neo-drawer {
    display: contents;

    :global(> .neo-dialog[data-placement^='top']) {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    :global(> .neo-dialog[data-placement^='bottom']) {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }

    :global(> .neo-dialog[data-placement^='left']) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    :global(> .neo-dialog[data-placement^='right']) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
</style>
