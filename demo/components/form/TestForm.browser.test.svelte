<script lang="ts">
  import NeoFieldSet from '~/form/NeoFieldSet.svelte';
  import NeoForm from '~/form/NeoForm.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoCheckbox from '~/inputs/NeoCheckbox.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <NeoForm legend="Account">
      <div class="grid">
        <NeoInput label="Username" value="dvcol" />
        <NeoInput label="Email" value="dvcol@example.com" />
        <NeoCheckbox label="Subscribe to newsletter" checked />
      </div>
    </NeoForm>

    <NeoFieldSet legend="Borderless block" borderless>
      <div class="grid">
        <NeoInput label="Phone" value="+33 1 23 45 67 89" />
        <NeoInput label="City" value="Paris" />
      </div>
    </NeoFieldSet>

    <NeoFieldSet legend="Bordered block">
      <div class="grid">
        <NeoInput label="First name" value="Jane" />
        <NeoInput label="Last name" value="Doe" />
      </div>
    </NeoFieldSet>
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
    gap: 1.5rem;
    align-items: stretch;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    align-items: center;
    margin-top: 0.75rem;
  }
</style>
