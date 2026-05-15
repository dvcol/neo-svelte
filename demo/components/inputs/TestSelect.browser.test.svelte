<script lang="ts">
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Props = {
    placement?: string;
    openOnFocus?: boolean;
    openOnHover?: boolean;
    rounded?: boolean;
  };

  const {
    placement = 'bottom',
    openOnFocus = true,
    openOnHover = false,
    rounded = false,
  }: Props = $props();

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry' },
  ];

  let value = $state();
</script>

<NeoThemeProvider>
  <div class="visual-frame" data-testid="visual-target">
    <NeoSelect
      label="Fruit"
      placeholder="Pick one"
      {placement}
      {openOnFocus}
      {openOnHover}
      {rounded}
      bind:value
      {options}
    />
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
