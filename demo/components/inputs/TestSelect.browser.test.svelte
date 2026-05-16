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
    open?: boolean;
    variant?: 'matrix' | 'single';
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
    open = false,
    variant = 'single',
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
  {#if variant === 'matrix'}
    <div class="visual-stage matrix" data-testid="visual-target">
      <section class="row">
        <span class="cell-label">placeholder</span>
        <NeoSelect label="Fruit" placeholder="Pick one" {options} openOnFocus={false} openOnHover={false} />

        <span class="cell-label">value set</span>
        <NeoSelect label="Fruit" placeholder="Pick one" value="banana" {options} openOnFocus={false} openOnHover={false} />

        <span class="cell-label">label start</span>
        <NeoSelect label="Fruit" placeholder="Pick one" start {options} openOnFocus={false} openOnHover={false} />
      </section>

      <section class="row">
        <span class="cell-label">multiple</span>
        <NeoSelect label="Fruits" placeholder="Pick many" multiple {options} openOnFocus={false} openOnHover={false} />

        <span class="cell-label">clearable</span>
        <NeoSelect label="Fruit" placeholder="Pick one" clearable value="cherry" {options} openOnFocus={false} openOnHover={false} />

        <span class="cell-label">disabled</span>
        <NeoSelect label="Fruit" placeholder="Pick one" disabled {options} openOnFocus={false} openOnHover={false} />
      </section>

      <section class="row">
        <span class="cell-label">rounded</span>
        <NeoSelect label="Fruit" placeholder="Pick one" rounded {options} openOnFocus={false} openOnHover={false} />

        <span class="cell-label">tinted</span>
        <NeoSelect label="Fruit" placeholder="Pick one" tinted color="var(--neo-color-primary)" {options} openOnFocus={false} openOnHover={false} />

        <span class="cell-label">glass</span>
        <NeoSelect label="Fruit" placeholder="Pick one" glass {options} openOnFocus={false} openOnHover={false} />
      </section>

      <section class="row">
        <span class="cell-label">required invalid</span>
        <NeoSelect label="Fruit" placeholder="Pick one" required validation valid={false} {options} openOnFocus={false} openOnHover={false} />

        <span class="cell-label">readonly</span>
        <NeoSelect label="Fruit" placeholder="Pick one" readonly value="apple" {options} openOnFocus={false} openOnHover={false} />

        <span class="cell-label">skeleton</span>
        <NeoSelect label="Fruit" placeholder="Pick one" skeleton {options} openOnFocus={false} openOnHover={false} />
      </section>
    </div>
  {:else}
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
          {open}
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
  {/if}
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

  .visual-stage.matrix {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .row {
    display: grid;
    grid-template-columns: 9rem 14rem 9rem 14rem 9rem 14rem;
    gap: 0.75rem 1rem;
    align-items: start;
  }

  .cell-label {
    padding-top: 0.5rem;
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
