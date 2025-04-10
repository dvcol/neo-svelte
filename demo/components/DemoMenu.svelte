<script lang="ts">
  import NeoMenu from '../../src/lib/floating/menu/NeoMenu.svelte';
  import { colorOptions } from '../utils/color.utils';

  import type { NeoMenuItem } from '../../src/lib/floating/menu/neo-menu-item.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { displayValue } from '~/inputs/neo-select.model';

  const options = $state({
    color: '',
    keepOpenOnHover: false,
    keepOpenOnSelect: false,

    onMenu: (i, e) => console.info('Menu', i, e),
    onSelect: (i, e) => console.info('Select', i, e),
  });

  const open = $state({
    menu: false,
    menuPanel: false,
    externalMenu: false,
    externalMenuPanel: false,
  });

  const items: NeoMenuItem[] = [
    { label: 'Line 1' },
    {
      label: 'Line 2',
      divider: true,
      items: [
        { label: 'Level 2 Line 1' },
        { label: 'Level 2 Line 2' },
        { label: 'Level 2 Line 3', divider: true, items: [{ label: 'Level 3 Line 1' }, { label: 'Level 3 Line 2' }] },
        { label: 'Level 2 Line 4' },
        { label: 'Level 2 Line 5' },
      ],
    },
    { label: 'Line 3' },
    { label: 'Line 4' },
    { label: 'Line 5' },
  ];
</script>

<div class="row">
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={options.keepOpenOnHover}>Keep Open (Hover)</NeoButton>
    <NeoButton toggle bind:checked={options.keepOpenOnSelect}>Keep Open (Click)</NeoButton>
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
    <div class="column">
      <span class="label">Menu</span>

      <NeoMenu open={open.menu} {items} {...options}>
        <NeoButton elevation="0">Open</NeoButton>
      </NeoMenu>
    </div>

    <!--    <div class="column">-->
    <!--      <span class="label">Menu Collapse</span>-->

    <!--      <NeoButton elevation="0">Open</NeoButton>-->
    <!--    </div>-->

    <!--    <div class="column">-->
    <!--      <span class="label">Menu Panel</span>-->

    <!--      <NeoButton elevation="0">Open</NeoButton>-->
    <!--    </div>-->
  </div>

  <!--  <div class="row">-->
  <!--    <div class="column">-->
  <!--      <span class="label">Complexe Menu</span>-->

  <!--      <NeoButton elevation="0">Open</NeoButton>-->
  <!--    </div>-->

  <!--    <div class="column">-->
  <!--      <span class="label">Complexe Menu Collapse</span>-->

  <!--      <NeoButton elevation="0">Open</NeoButton>-->
  <!--    </div>-->

  <!--    <div class="column">-->
  <!--      <span class="label">Complexe Menu Panel</span>-->

  <!--      <NeoButton elevation="0">Open</NeoButton>-->
  <!--    </div>-->
  <!--  </div>-->

  <!--  <div class="row">-->
  <!--    <div class="column">-->
  <!--      <span class="label">Complexe Menu List</span>-->

  <!--      <NeoButton elevation="0">Open</NeoButton>-->
  <!--    </div>-->

  <!--    <div class="column">-->
  <!--      <span class="label">Complexe Menu List Collapse </span>-->

  <!--      <NeoButton elevation="0">Open</NeoButton>-->
  <!--    </div>-->

  <!--    <div class="column">-->
  <!--      <span class="label">Complexe Menu List Panel</span>-->

  <!--      <NeoButton elevation="0">Open</NeoButton>-->
  <!--    </div>-->
  <!--  </div>-->
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

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);
  }

  @media (width < 1200px) {
    .row {
      margin: 2rem 0;
    }
  }
</style>
