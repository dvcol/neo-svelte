<script lang="ts">
  import { colorOptions } from '../utils/color.utils';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { displayValue } from '~/inputs/neo-select.model';

  const options = $state({
    color: '',
    close: false,
  });
</script>

<div class="row">
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={options.close}>Close</NeoButton>
  </NeoButtonGroup>
</div>

<div class="row">
  <NeoSelect
    label="Color"
    placeholder="Select color"
    placement="left"
    floating={false}
    color={options.color}
    display={displayValue}
    size="10"
    bind:value={options.color}
    containerProps={{ style: 'margin-left: 4rem' }}
    options={colorOptions}
    openOnFocus
    rounded
    glass
  />
</div>

<section>
  <div class="row">
    <span class="label">Menu</span>
  </div>
</section>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  section {
    flex: 1 1 100%;
    align-content: center;
  }

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 4rem 0;
  }

  @media (width < 1200px) {
    .row {
      margin: 2rem 0;
    }
  }
</style>
