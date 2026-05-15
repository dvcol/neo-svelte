<script lang="ts">
  import NeoRange from '~/inputs/NeoRange.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Props = {
    placement?: string;
    dual?: boolean;
    rounded?: boolean;
  };

  const {
    placement = 'top',
    dual = false,
    rounded = false,
  }: Props = $props();

  let value = $state<number | [number, number]>(dual ? [25, 75] : 50);

  $effect(() => {
    value = dual ? [25, 75] : 50;
  });
</script>

<NeoThemeProvider>
  <div class="visual-frame" data-testid="visual-target">
    <NeoRange
      bind:value
      min={0}
      max={100}
      tooltips
      {rounded}
      floatingOptions={{ placement }}
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
    padding: 0 10vw;
  }
</style>
