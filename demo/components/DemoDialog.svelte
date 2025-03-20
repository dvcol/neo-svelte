<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';

  import NeoDialogStepper from '../../src/lib/floating/dialog/NeoDialogStepper.svelte';
  import IconAccount from '../../src/lib/icons/IconAccount.svelte';
  import IconAddress from '../../src/lib/icons/IconAddress.svelte';
  import IconListSmall from '../../src/lib/icons/IconListSmall.svelte';

  import NeoNumberStep from '../../src/lib/inputs/NeoNumberStep.svelte';
  import NeoSelect from '../../src/lib/inputs/NeoSelect.svelte';

  import { DefaultShadowElevation, MaxShadowElevation } from '../../src/lib/utils/shadow.utils';
  import { colorOptions } from '../utils/color.utils';
  import { positionOptions } from '../utils/placement.utils';

  import type { NeoStepperStep } from '../../src/lib';
  import type { NeoDialogConfirmProps } from '../../src/lib/floating/dialog/neo-dialog-confirm.model';
  import type { NeoDialogStepperProps } from '../../src/lib/floating/dialog/neo-dialog-stepper.model';
  import type { NeoDialogProps } from '~/floating/dialog/neo-dialog.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoDialog from '~/floating/dialog/NeoDialog.svelte';
  import NeoDialogConfirm from '~/floating/dialog/NeoDialogConfirm.svelte';

  const options = $state<NeoDialogProps>({
    modal: true,
    backdrop: true,
    disableBodyScroll: true,
    closeOnClickOutside: true,

    color: '',
    filled: false,
    tinted: false,
    rounded: false,
    borderless: false,

    elevation: 0,

    returnValue: undefined,
    placement: 'center',
  });

  const position = [{ value: 'center', label: 'Center' }, ...positionOptions];

  let openDefault = $state(false);
  let openConfirm = $state(false);
  let openStepper = $state(false);

  const confirmOptions: NeoDialogConfirmProps = {
    dialog: lorem,
    header: 'Confirm dialog',
    width: { max: '40rem' },
    onClose: () => console.info('Confirm dialog button closed'),
    onConfirm: async () => {
      console.info('Confirm dialog button confirming...');
      await wait(2000);
      console.info('Confirm dialog button confirmed');
      return true;
    },
    onCancel: async () => {
      console.info('Confirm dialog button cancelling...');
      await wait(1000);
      console.info('Confirm dialog button cancelled');
      return true;
    },
    dialogProps: {
      onclose: () => console.info('Dialog closed'),
      oncancel: () => console.info('Dialog cancelled'),
    },
  };

  let active = $state(0);
  const step1Value = $state({ username: '', password: '' });
  const step2Value = $state({ address: '', city: '', country: '', zip: '' });
  const steps: NeoStepperStep[] = [
    {
      markProps: {
        label: 'Account',
        ariaLabel: 'Step 1',
        title: 'Step 1',
        icon: account,
      },
      render: lorem,
      value: step1Value,
    },
    {
      markProps: {
        label: 'Address',
        ariaLabel: 'Step 2',
        title: 'Step 2',
        icon: address,
      },
      render: lorem,
      value: step2Value,
    },
    {
      markProps: {
        label: 'Summary',
        ariaLabel: 'Step 3',
        title: 'Step 3',
        icon: summary,
      },
      render: lorem,
    },
  ];

  const stepperOptions: NeoDialogStepperProps = {
    steps,
    header: 'Stepper dialog',
    onOpen: () => console.info('Confirm dialog opened'),
    onClose: () => console.info('Confirm dialog closed'),
    onConfirm: async () => {
      console.info('Confirm dialog confirming...');
      await wait(2000);
      console.info('Confirm dialog confirmed');
      return true;
    },
    onCancel: async () => {
      console.info('Confirm dialog cancelling...');
      await wait(1000);
      console.info('Confirm dialog cancelled');
      return true;
    },
  };
</script>

<div class="row">
  <NeoButtonGroup rounded={options.rounded}>
    <NeoButton toggle bind:checked={options.modal}>Modal</NeoButton>
    <NeoButton toggle bind:checked={options.disableBodyScroll}>Body Scroll</NeoButton>
    <NeoButton toggle bind:checked={options.closeOnClickOutside}>Click Outside</NeoButton>
    <NeoButton toggle bind:checked={options.backdrop}>Backdrop</NeoButton>
    <NeoButton toggle bind:checked={options.filled}>Filled</NeoButton>
    <NeoButton toggle bind:checked={options.tinted}>Tinted</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
  </NeoButtonGroup>

  <NeoSelect
    label="Placement"
    placeholder="Select placement"
    placement="left"
    floating={false}
    bind:value={options.placement}
    rounded={options.rounded}
    containerProps={{ style: 'margin-left: 6.75rem' }}
    options={position}
    size="15"
    openOnFocus
  />
  <NeoNumberStep
    label="Elevation"
    placement="left"
    center
    bind:value={options.elevation}
    min={0}
    max={MaxShadowElevation}
    defaultValue={DefaultShadowElevation}
    rounded={options.rounded}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
  />

  <NeoSelect
    label="Color"
    placeholder="Select color"
    placement="left"
    floating={false}
    color={options.color}
    size="10"
    bind:value={options.color}
    containerProps={{ style: 'margin-left: 6rem' }}
    options={colorOptions}
    openOnFocus
  />
</div>

{#snippet lorem()}
  <div class="column">
    <p>
      Lorem ipsum odor amet, consectetuer adipiscing elit. Malesuada pharetra ullamcorper eget hac; imperdiet a finibus hac. Sollicitudin tincidunt
      mauris eros ex pharetra imperdiet. Nibh facilisi ante vestibulum feugiat facilisi quam risus ex? Malesuada condimentum nulla odio facilisi
      semper sodales. Dapibus est duis odio tincidunt elementum. Sodales scelerisque venenatis hac ridiculus scelerisque massa vitae. Hendrerit
      blandit sed, ac cursus ante varius quam. Malesuada habitant curae diam pulvinar proin congue tristique dictum.
    </p>

    <p>
      Dignissim quisque non fermentum ipsum; sapien dignissim lobortis. Quam montes lacus ipsum ac dolor class. Erat accumsan morbi fermentum
      consectetur sollicitudin elit a. Primis tincidunt aenean malesuada eleifend nunc morbi consequat. Aenean malesuada sapien habitant feugiat
      sapien consectetur torquent risus nascetur. Dui elit gravida sollicitudin nascetur suscipit facilisi est sodales? Vulputate rhoncus rhoncus
      suspendisse amet nostra quisque eleifend tellus interdum? Volutpat nunc imperdiet sagittis, efficitur nibh eget maecenas. Finibus justo nascetur
      parturient nascetur ac condimentum erat ultrices. Sociosqu nascetur quisque; elit iaculis libero quis.
    </p>
  </div>
{/snippet}

{#snippet account()}
  <IconAccount filled={active === 0} />
{/snippet}

{#snippet address()}
  <IconAddress filled={active === 1} repeat="1" dot="var(--neo-background-color)" />
{/snippet}

{#snippet summary()}
  <IconListSmall filled={active === 2} />
{/snippet}

<div class="row content">
  <div class="column">
    <span class="label">Default</span>

    <NeoButton elevation="0" toggle bind:checked={openDefault}>Open</NeoButton>
    {#if options.returnValue !== undefined}
      <span>Returned value: {JSON.stringify(options.returnValue, undefined, 2)}</span>
    {/if}

    <NeoDialog
      {...options}
      elevation={options.elevation > 0 ? options.elevation : undefined}
      bind:open={openDefault}
      bind:modal={options.modal}
      bind:returnValue={options.returnValue}
    >
      {@render lorem()}
    </NeoDialog>
  </div>

  <div class="column">
    <span class="label">Confirm</span>

    <NeoButton elevation="0" toggle bind:checked={openConfirm}>Open</NeoButton>
    {#if options.returnValue !== undefined}
      <span>Returned value: {JSON.stringify(options.returnValue, undefined, 2)}</span>
    {/if}

    <NeoDialogConfirm
      bind:open={openConfirm}
      bind:modal={options.modal}
      bind:returnValue={options.returnValue}
      closable={options.closeOnClickOutside}
      rounded={options.rounded}
      {...confirmOptions}
      dialogProps={{ ...options, elevation: options.elevation > 0 ? options.elevation : undefined, ...confirmOptions.dialogProps }}
    >
      {@render lorem()}
    </NeoDialogConfirm>
  </div>

  <div class="column">
    <span class="label">Stepper</span>

    <NeoButton elevation="0" toggle bind:checked={openStepper}>Open</NeoButton>
    {#if options.returnValue !== undefined}
      <span>Returned value: {JSON.stringify(options.returnValue, undefined, 2)}</span>
    {/if}

    <NeoDialogStepper
      bind:active
      bind:open={openStepper}
      bind:modal={options.modal}
      bind:returnValue={options.returnValue}
      closable={options.closeOnClickOutside}
      rounded={options.rounded}
      {...stepperOptions}
      dialogProps={{ ...options, elevation: options.elevation > 0 ? options.elevation : undefined, ...confirmOptions.dialogProps }}
    />
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;

    &.content {
      flex: 1 1 100%;
      height: 100%;
    }
  }
</style>
