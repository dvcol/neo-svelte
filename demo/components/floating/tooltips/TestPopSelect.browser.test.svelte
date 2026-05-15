<script lang="ts">
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoPopSelect from '~/floating/tooltips/NeoPopSelect.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Props = {
    placement?: string;
    openOnHover?: boolean;
    openOnFocus?: boolean;
    openOnClick?: boolean;
    rounded?: boolean;
    search?: boolean;
  };

  const {
    placement = 'bottom',
    openOnHover = true,
    openOnFocus = false,
    openOnClick = false,
    rounded = false,
    search = false,
  }: Props = $props();

  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

  let selected = $state();
</script>

<NeoThemeProvider>
  <div class="visual-frame" data-testid="visual-target">
    <NeoPopSelect
      {items}
      {rounded}
      {search}
      bind:selected
      height="20rem"
      tooltipProps={{ placement, openOnHover, openOnFocus, openOnClick }}
    >
      <NeoButton class="trigger" text {rounded}>Hover Select</NeoButton>
    </NeoPopSelect>
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
