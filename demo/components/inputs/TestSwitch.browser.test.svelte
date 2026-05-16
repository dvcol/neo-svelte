<script lang="ts">
  import NeoSwitch from '~/inputs/NeoSwitch.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  let {
    checked = $bindable(false),
    label,
    disabled,
    rounded,
  }: {
    checked?: boolean;
    label?: string;
    disabled?: boolean;
    rounded?: boolean;
  } = $props();
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <NeoSwitch bind:checked {label} {disabled} {rounded} />
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }
</style>
