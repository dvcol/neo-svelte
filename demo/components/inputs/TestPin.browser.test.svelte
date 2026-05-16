<script lang="ts">
  import NeoPin from '~/inputs/NeoPin.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  let {
    value = $bindable(''),
    count = 4,
    groups = 1,
    type = 'text',
  }: {
    value?: string;
    count?: number;
    groups?: number;
    type?: 'text' | 'number' | 'password';
  } = $props();
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <NeoPin bind:value {count} {groups} {type} />
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
