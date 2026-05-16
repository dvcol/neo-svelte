<script lang="ts">
  import NeoIconAccount from '~/icons/NeoIconAccount.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabDivider from '~/nav/NeoTabDivider.svelte';
  import NeoTabPanel from '~/nav/NeoTabPanel.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Tab = { tabId: string; label: string };

  let {
    tabs = [],
    active = $bindable<string | undefined>(undefined),
    line,
    pill,
    slide,
    vertical,
    variant = 'single',
  }: {
    tabs?: Tab[];
    active?: string;
    line?: boolean;
    pill?: boolean;
    slide?: boolean;
    vertical?: boolean;
    variant?: 'single' | 'matrix';
  } = $props();
</script>

{#snippet icon()}
  <NeoIconAccount />
{/snippet}

<NeoThemeProvider>
  {#if variant === 'single'}
    <div class="visual-stage" data-testid="visual-stage">
      <NeoTabs bind:active {line} {pill} {slide} {vertical}>
        {#each tabs as tab (tab.tabId)}
          <NeoTab tabId={tab.tabId} value={tab.label}>
            {tab.label}
          </NeoTab>
        {/each}
        {#snippet panes()}
          {#each tabs as tab (tab.tabId)}
            <NeoTabPanel tabId={tab.tabId}>
              <div class="visual-pane" data-pane={tab.tabId}>panel-{tab.label}</div>
            </NeoTabPanel>
          {/each}
        {/snippet}
      </NeoTabs>
    </div>
  {:else}
    <div class="visual-stage matrix" data-testid="visual-stage">
      <section class="grid">
        <div class="column">
          <span class="cell-label">slide · default</span>
          <NeoTabs active="t2" slide>
            <NeoTab tabId="t1" value="t1" close={false}>One</NeoTab>
            <NeoTab tabId="t2" value="t2" close={false}>Two</NeoTab>
            <NeoTab tabId="t3" value="t3" close={false}>Three</NeoTab>
          </NeoTabs>
        </div>

        <div class="column">
          <span class="cell-label">line</span>
          <NeoTabs active="t2" slide line>
            <NeoTab tabId="t1" value="t1" close={false}>One</NeoTab>
            <NeoTab tabId="t2" value="t2" close={false}>Two</NeoTab>
            <NeoTab tabId="t3" value="t3" close={false}>Three</NeoTab>
          </NeoTabs>
        </div>

        <div class="column">
          <span class="cell-label">pill</span>
          <NeoTabs active="t2" slide pill>
            <NeoTab tabId="t1" value="t1" close={false}>One</NeoTab>
            <NeoTab tabId="t2" value="t2" close={false}>Two</NeoTab>
            <NeoTab tabId="t3" value="t3" close={false}>Three</NeoTab>
          </NeoTabs>
        </div>

        <div class="column">
          <span class="cell-label">rounded · glass</span>
          <NeoTabs active="t2" slide pill rounded glass>
            <NeoTab tabId="t1" value="t1" close={false}>One</NeoTab>
            <NeoTab tabId="t2" value="t2" close={false}>Two</NeoTab>
            <NeoTab tabId="t3" value="t3" close={false}>Three</NeoTab>
          </NeoTabs>
        </div>

        <div class="column">
          <span class="cell-label">tinted</span>
          <NeoTabs active="t2" slide pill tinted color="var(--neo-color-primary)">
            <NeoTab tabId="t1" value="t1" close={false}>One</NeoTab>
            <NeoTab tabId="t2" value="t2" close={false}>Two</NeoTab>
            <NeoTab tabId="t3" value="t3" close={false}>Three</NeoTab>
          </NeoTabs>
        </div>

        <div class="column">
          <span class="cell-label">disabled tab</span>
          <NeoTabs active="t1" slide line>
            <NeoTab tabId="t1" value="t1" close={false}>One</NeoTab>
            <NeoTab tabId="t2" value="t2" close={false} disabled>Two</NeoTab>
            <NeoTab tabId="t3" value="t3" close={false}>Three</NeoTab>
          </NeoTabs>
        </div>

        <div class="column">
          <span class="cell-label">close · add</span>
          <NeoTabs active="t2" slide line onadd={() => {}} onclose={() => {}}>
            <NeoTab tabId="t1" value="t1" close>One</NeoTab>
            <NeoTab tabId="t2" value="t2" close>Two</NeoTab>
            <NeoTab tabId="t3" value="t3" close>Three</NeoTab>
          </NeoTabs>
        </div>

        <div class="column">
          <span class="cell-label">icon · divider</span>
          <NeoTabs active="t2" slide line>
            <NeoTab tabId="t1" value="t1" close={false} {icon}>One</NeoTab>
            <NeoTabDivider aria-hidden="true" />
            <NeoTab tabId="t2" value="t2" close={false} aria-label="icon-only" {icon} />
            <NeoTab tabId="t3" value="t3" close={false} {icon}>Three</NeoTab>
          </NeoTabs>
        </div>

        <div class="column">
          <span class="cell-label">vertical</span>
          <NeoTabs active="t2" slide line vertical>
            <NeoTab tabId="t1" value="t1" close={false}>One</NeoTab>
            <NeoTab tabId="t2" value="t2" close={false}>Two</NeoTab>
            <NeoTab tabId="t3" value="t3" close={false}>Three</NeoTab>
          </NeoTabs>
        </div>

        <div class="column">
          <span class="cell-label">skeleton</span>
          <NeoTabs active="t2" slide line skeleton>
            <NeoTab tabId="t1" value="t1" close={false}>One</NeoTab>
            <NeoTab tabId="t2" value="t2" close={false}>Two</NeoTab>
            <NeoTab tabId="t3" value="t3" close={false}>Three</NeoTab>
          </NeoTabs>
        </div>
      </section>
    </div>
  {/if}
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-stage {
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .visual-stage.matrix .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(20rem, 1fr));
    gap: 1.5rem 2rem;
    align-items: start;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .cell-label {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .visual-pane {
    padding: 1rem;
  }
</style>
