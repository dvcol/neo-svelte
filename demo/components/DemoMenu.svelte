<script lang="ts">
  import type { NeoMenuItem } from '~/lib/floating/menu/neo-menu-item.model.js';
  import type { NeoMenuProps } from '~/lib/floating/menu/neo-menu.model.js';

  import { shallowClone } from '@dvcol/common-utils/common/object';
  import { getUUID } from '@dvcol/common-utils/common/string';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoMenu from '~/floating/menu/NeoMenu.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';
  import { displayValue } from '~/inputs/neo-select.model.js';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { Colors } from '~/utils/colors.utils.js';

  import { colorOptions } from '../utils/color.utils.js';

  const options = $state<NeoMenuProps>({
    color: '',
    rounded: false,
    keepOpenOnSelect: false,

    onMenu: (i, e) => console.info('Menu', shallowClone(i), e),
    onSelect: (i, e) => console.info('Select', shallowClone(i), e),
  });

  const open = $state({
    menu: false,
    menuRich: false,
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
    {
      label: 'Line item with external link',
      value: 'https://www.google.com',
      href: 'https://www.google.com',
      buttonProps: { target: '_blank' },
      title: 'This is a link to google',
      color: Colors.Primary,
    },
    {
      label: 'Line item disabled',
      value: 'This is a disabled item',
      onclick: () => console.info('disabled clicked'),
      disabled: true,
      divider: { bottom: true },
    },
    { label: 'Line 3' },
    { label: 'Line 4' },
    { label: 'Line 5' },
  ];

  const itemsRich = $state(
    [
      { label: 'John Doe', value: 'John', description: 'john.doe@gmail.com' },
      { label: 'Peter Jackson', value: 'Peter', description: 'peter.jackson@icloud.me' },
      { label: 'John Smith', value: 'Smith', description: 'john.smith@hotmal.com' },
      { label: 'Alice Johnson', value: 'Alice', description: 'alice.johnson@outlook.com' },
      { label: 'Ivy Johnson', value: 'Ivy', description: 'ivy.johnson@hotmail.com' },
      { label: 'Jack King', value: 'Jack', description: 'jack.king@yahoo.com' },
      { label: 'Karen Lee', value: 'Karen', description: 'karen.lee@outlook.com' },
      {
        label: 'Directors',
        section: true,
        divider: true,
        sticky: true,
        items: [
          {
            label: 'Denis Villeneuve',
            value: 'Denis',
            description: '+33 1 25 48 45 45',

            items: [
              {
                label: 'emails',
                section: true,
                items: [
                  { label: 'work', description: 'denis.villeneuve@gmail.com' },
                  { label: 'personal', description: 'denis.villeneuve@yahoo.com' },
                  { label: 'landline', description: '+33 1 25 48 45 45' },
                  { label: 'mobile', description: '+33 6 25 48 45 45' },
                ],
              },
            ],
          },
          { label: 'Christopher Nolan', value: 'Christopher', description: '+44 2 07 94 60 95' },
          { label: 'Quentin Tarantino', value: 'Quentin', description: '+33 1 05 55 12 34' },
          { label: 'Martin Scorsese', value: 'Martin', description: '+33 1 25 55 56 78' },
          { label: 'Steven Spielberg', value: 'Steven', description: '+33 1 85 55 87 65' },
        ].map(item => ({ ...item, id: getUUID(), before: avatar })),
      },
      {
        label: 'Actors',
        divider: true,
        sticky: true,
        items: [
          { label: 'Leonardo DiCaprio', value: 'Leonardo', description: '+1 310 555 1234' },
          { label: 'Brad Pitt', value: 'Brad', description: '+1 323 555 5678' },
          { label: 'Meryl Streep', value: 'Meryl', description: '+1 212 555 8765' },
          { label: 'Tom Hanks', value: 'Tom', description: '+1 310 555 4321' },
          { label: 'Natalie Portman', value: 'Natalie', description: '+1 818 555 6789' },
        ].map(item => ({ ...item, id: getUUID(), before: avatar })),
      },
    ].map(item => ({ ...item, id: getUUID(), before: avatar })),
  );
</script>

<div class="row">
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={options.keepOpenOnSelect}>Keep Open (Click)</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
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

{#snippet avatar()}
  <span class="custom-item-avatar">
    <IconAccount size="1.5rem" stroke="2" />
  </span>
{/snippet}

<section>
  <div class="row">
    <div class="column">
      <span class="label">Menu</span>

      <NeoMenu bind:open={open.menu} {items} {...options}>
        <NeoButton elevation="0" toggle bind:checked={open.menu}>Open</NeoButton>
      </NeoMenu>
    </div>

    <!--    <div class="column"> -->
    <!--      <span class="label">Menu Collapse</span> -->

    <!--      <NeoButton elevation="0">Open</NeoButton> -->
    <!--    </div> -->

    <!--    <div class="column"> -->
    <!--      <span class="label">Menu Panel</span> -->

    <!--      <NeoButton elevation="0">Open</NeoButton> -->
    <!--    </div> -->
  </div>

  <div class="row">
    <div class="column">
      <span class="label">Rich Menu</span>

      <NeoMenu bind:open={open.menuRich} items={itemsRich} {...options}>
        <NeoButton elevation="0" toggle bind:checked={open.menuRich}>Open</NeoButton>
      </NeoMenu>
    </div>

    <!--    <div class="column"> -->
    <!--      <span class="label">Complexe Menu Collapse</span> -->

    <!--      <NeoButton elevation="0">Open</NeoButton> -->
    <!--    </div> -->

    <!--    <div class="column"> -->
    <!--      <span class="label">Complexe Menu Panel</span> -->

    <!--      <NeoButton elevation="0">Open</NeoButton> -->
    <!--    </div> -->
    <!--  </div> -->

    <!--  <div class="row"> -->
    <!--    <div class="column"> -->
    <!--      <span class="label">Complexe Menu List</span> -->

    <!--      <NeoButton elevation="0">Open</NeoButton> -->
    <!--    </div> -->

    <!--    <div class="column"> -->
    <!--      <span class="label">Complexe Menu List Collapse </span> -->

    <!--      <NeoButton elevation="0">Open</NeoButton> -->
    <!--    </div> -->

    <!--    <div class="column"> -->
    <!--      <span class="label">Complexe Menu List Panel</span> -->

    <!--      <NeoButton elevation="0">Open</NeoButton> -->
    <!--    </div> -->
    <!--  </div> -->
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

  .custom-item-avatar {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem;
    border: 1px currentcolor solid;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
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
