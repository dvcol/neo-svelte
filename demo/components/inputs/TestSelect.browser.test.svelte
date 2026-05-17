<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import NeoPill from '~/pill/NeoPill.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import { quickCircOutProps, quickDurationProps } from '~/utils/transition.utils.js';

  type Props = {
    placement?: string;
    openOnFocus?: boolean;
    openOnHover?: boolean;
    rounded?: boolean;
    multiple?: boolean;
    clearable?: boolean;
    pillContent?: boolean;
    search?: boolean;
    initialValue?: unknown;
    /** Mirror DemoInputs' three-instance shared-state setup for the multi-select section. */
    sharedTriple?: boolean;
  };

  const {
    placement = 'bottom',
    openOnFocus = true,
    openOnHover = false,
    rounded = false,
    multiple = false,
    clearable = false,
    pillContent = false,
    search = false,
    initialValue,
    sharedTriple = false,
  }: Props = $props();

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry' },
  ];

  let value = $state<unknown>(initialValue);
</script>

<NeoThemeProvider>
  <div class="visual-frame" data-testid="visual-target">
    {#if sharedTriple}
      <!-- Default display -->
      <NeoSelect
        required
        label="Custom Select"
        placeholder="Select multiple"
        {placement}
        {openOnFocus}
        {openOnHover}
        {rounded}
        multiple
        {clearable}
        {search}
        bind:value
        {options}
      />
      <!-- Function display -->
      <NeoSelect
        required
        label="Custom Select"
        placeholder="Select multiple"
        display={(selection) => {
          if (Array.isArray(selection)) return selection.map(s => s?.item?.label ?? s?.item?.value).join(', ');
          return selection?.item?.label ?? selection?.item?.value?.toString();
        }}
        {placement}
        {openOnFocus}
        {openOnHover}
        {rounded}
        multiple
        {clearable}
        {search}
        bind:value
        {options}
      />
      <!-- Snippet content -->
      <NeoSelect
        required
        label="Custom Select"
        placeholder="Select multiple"
        {placement}
        {openOnFocus}
        {openOnHover}
        {rounded}
        multiple
        {clearable}
        {search}
        bind:value
        {options}
      >
        {#snippet content({ value: current }: { value: unknown })}
          <div style="display: inline-flex; gap: 0.25rem;">
            {#each (Array.isArray(current) ? current : []) as item (item)}
              <span>
                <NeoPill tinted small elevation="0">{String(item)}</NeoPill>
              </span>
            {/each}
          </div>
        {/snippet}
      </NeoSelect>
    {:else}
      <NeoSelect
        label="Fruit"
        placeholder="Pick one"
        {placement}
        {openOnFocus}
        {openOnHover}
        {rounded}
        {multiple}
        {clearable}
        {search}
        bind:value
        {options}
      >
        {#if pillContent}
          <!-- eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars -->
          {#snippet content({ value: current }: { value: unknown })}
            <div style="display: inline-flex; gap: 0.25rem;">
              {#each (Array.isArray(current) ? current : []) as item (item)}
                <span in:fade out:fade={quickDurationProps} animate:flip={quickCircOutProps}>
                  <NeoPill tinted small elevation="0">{String(item)}</NeoPill>
                </span>
              {/each}
            </div>
          {/snippet}
        {/if}
      </NeoSelect>
    {/if}
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-frame {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }
</style>
