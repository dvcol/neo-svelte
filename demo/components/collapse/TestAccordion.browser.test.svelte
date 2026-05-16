<script lang="ts">
  import type { NeoAccordionProps } from '~/collapse/neo-accordion.model.js';

  import NeoAccordion from '~/collapse/NeoAccordion.svelte';
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Section = { id: string; label: string; open?: boolean };

  type HarnessProps = Partial<NeoAccordionProps> & {
    sections?: Section[];
  };

  const {
    sections = [],
    group,
    ...rest
  }: HarnessProps = $props();
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <NeoAccordion {group} {...rest}>
      {#each sections as section (section.id)}
        <NeoCollapse id={section.id} label={section.label} open={section.open} unmountOnClose={false}>
          <p data-testid="content-{section.id}">{section.label} body text — long enough to render meaningfully.</p>
        </NeoCollapse>
      {/each}
    </NeoAccordion>
  </div>
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
</style>
