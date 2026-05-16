<script lang="ts">
  import NeoArrowButton from '~/buttons/NeoArrowButton.svelte';
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoButtonRow from '~/buttons/NeoButtonRow.svelte';
  import NeoCancelButton from '~/buttons/NeoCancelButton.svelte';
  import NeoCheckboxButton from '~/buttons/NeoCheckboxButton.svelte';
  import NeoCloseButton from '~/buttons/NeoCloseButton.svelte';
  import NeoRadioButton from '~/buttons/NeoRadioButton.svelte';
  import NeoSwitchButton from '~/buttons/NeoSwitchButton.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  const {
    composite = false,
    variant = 'button',
    elevation = 2,
    rounded = true,
    glass = false,
    tinted = false,
    disabled = false,
    loading = false,
    text = 'Press',
  }: {
    composite?: boolean;
    variant?: 'button' | 'close' | 'arrow';
    elevation?: number;
    rounded?: boolean;
    glass?: boolean;
    tinted?: boolean;
    disabled?: boolean;
    loading?: boolean;
    text?: string;
  } = $props();
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    {#if composite}
      <section class="block" data-block="standard">
        <NeoButton elevation={2} rounded>Default</NeoButton>
        <NeoButton elevation={0} rounded>Flat</NeoButton>
        <NeoButton elevation={-2} rounded>Inset</NeoButton>
        <NeoButton elevation={2} rounded glass>Glass</NeoButton>
        <NeoButton elevation={2} rounded tinted color="var(--neo-color-primary)">Tint</NeoButton>
        <NeoButton elevation={2} rounded disabled>Off</NeoButton>
        <NeoButton elevation={2} rounded loading>Wait</NeoButton>
        <NeoCloseButton rounded elevation={2} />
        <NeoArrowButton rounded elevation={2}>Next</NeoArrowButton>
      </section>

      <section class="block" data-block="iconic">
        <NeoCancelButton rounded elevation={2} />
        <NeoCheckboxButton rounded elevation={2} />
        <NeoCheckboxButton rounded elevation={2} checked />
        <NeoCheckboxButton rounded elevation={2} indeterminate />
        <NeoRadioButton rounded elevation={2} />
        <NeoRadioButton rounded elevation={2} checked />
        <NeoSwitchButton rounded elevation={2} />
        <NeoSwitchButton rounded elevation={2} checked />
      </section>

      <section class="block" data-block="layout">
        <NeoButtonGroup rounded elevation={2}>
          <NeoButton>One</NeoButton>
          <NeoButton>Two</NeoButton>
          <NeoButton>Three</NeoButton>
        </NeoButtonGroup>

        <NeoButtonRow
          rounded
          elevation={2}
          items={[
            { label: 'Save' },
            { divider: true },
            { label: 'Cancel' },
          ]}
        />
      </section>
    {:else if variant === 'close'}
      <NeoCloseButton {rounded} {glass} {tinted} {disabled} {elevation} />
    {:else if variant === 'arrow'}
      <NeoArrowButton {rounded} {glass} {tinted} {disabled} {elevation}>{text}</NeoArrowButton>
    {:else}
      <NeoButton {rounded} {glass} {tinted} {disabled} {loading} {elevation}>{text}</NeoButton>
    {/if}
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
    flex-direction: column;
    gap: 1.25rem;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .block {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    max-width: 60rem;
  }
</style>
