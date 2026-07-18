<script lang="ts">
  import type { NeoListVirtualRowProps, NeoListVirtualRowTransition } from '~/list/neo-list-virtual-row.model.js';
  import type { NeoListContext } from '~/list/neo-list.model.js';
  import type { NeoVirtualRegister } from '~/list/neo-virtual-list.model.js';

  import NeoListVirtualRow from '~/list/NeoListVirtualRow.svelte';

  type HarnessProps = Omit<
    NeoListVirtualRowProps,
    'context' | 'itemRender' | 'register' | 'transitionIn' | 'transitionOut'
  > & {
    context?: NeoListContext;
    customItem?: boolean;
    onRegister?: (element: Element) => void;
  };

  const {
    context = {} as NeoListContext,
    customItem = false,
    onRegister,
    ...rest
  }: HarnessProps = $props();

  const transition: NeoListVirtualRowTransition = () => ({ duration: 0 });
  const register: NeoVirtualRegister = element => onRegister?.(element);
</script>

{#snippet itemRender({ item, index, checked })}
  <output data-testid="custom-item" data-index={index} data-checked={checked}>{item.label}</output>
{/snippet}

<NeoListVirtualRow
  {...rest}
  {context}
  {register}
  transitionIn={transition}
  transitionOut={transition}
  itemRender={customItem ? itemRender : undefined}
/>
