<script lang="ts">
  import type { NeoTabRowItem } from '~/nav/neo-tabs-row.model.js';

  import NeoTabsRow from '~/nav/NeoTabsRow.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  let {
    tabs = [],
    active = $bindable<string | undefined>(undefined),
    vertical,
    wrapperStyle,
  }: {
    tabs?: NeoTabRowItem<string>[];
    active?: string;
    vertical?: boolean;
    wrapperStyle?: string;
  } = $props();
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="frame" style={wrapperStyle}>
      <NeoTabsRow
        {tabs}
        bind:active
        {vertical}
        width="100%"
        containerProps={{ style: 'width: 100%; box-sizing: border-box;' }}
      />
    </div>
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
    align-items: flex-start;
    justify-content: center;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
    background: var(--neo-background-color);
  }

  .frame {
    box-sizing: border-box;
  }
</style>
