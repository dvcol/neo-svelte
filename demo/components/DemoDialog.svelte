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
    movable: {
      enabled: false,
      contain: false,
      axis: undefined,
      snap: {
        enabled: false,
        corner: false,
        outside: false,
        placement: false,
      },
      handle: {
        full: true,
        visible: true,
        position: 'inside',
      },
    },

    onclose: () => console.info('Dialog closed'),
    oncancel: () => console.info('Dialog cancelled'),
  });

  const onHandlePosition = () => {
    options.movable.handle.position = options.movable.handle.position === 'outside' ? 'inside' : 'outside';
  };

  const placement = $derived(
    options.movable.placement
      ? Object.entries(options.movable.placement)
          .filter(([, v]) => v)
          .map(([k]) => k)
      : undefined,
  );
  const onSelectPlacement = (values: string[]) => {
    options.movable.placement = values?.reduce((acc, cur) => ({ ...acc, [cur]: true }), {});
  };

  const position = [{ value: 'center', label: 'Center' }, ...positionOptions];

  let openDefault = $state(false);
  let openConfirm = $state(false);
  let openStepper = $state(false);
  let openDrawer = $state(false);

  const confirmOptions: NeoDialogConfirmProps = {
    dialog: lorem,
    header: 'Confirm dialog',
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
  <div class="row">
    <NeoButtonGroup text rounded>
      <NeoButton toggle bind:checked={options.modal}>Modal</NeoButton>
      <NeoButton toggle bind:checked={options.disableBodyScroll}>Body Scroll</NeoButton>
      <NeoButton toggle bind:checked={options.closeOnClickOutside}>Closable</NeoButton>
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
      containerProps={{ style: 'margin-left: 6.75rem' }}
      options={position}
      size="15"
      openOnFocus
      rounded
      glass
    />
    <NeoNumberStep
      label="Elevation"
      placement="left"
      center
      bind:value={options.elevation}
      min={0}
      max={MaxShadowElevation}
      defaultValue={DefaultShadowElevation}
      nullable={false}
      floating={false}
      groupProps={{ style: 'margin-left: 6rem' }}
      rounded
      glass
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
      rounded
      glass
    />
  </div>

  <div class="row">
    <NeoButtonGroup text rounded>
      <NeoButton toggle bind:checked={options.movable.enabled}>Movable</NeoButton>
      <NeoButton toggle bind:checked={options.movable.contain} disabled={!options.movable.enabled}>Contain</NeoButton>
      <NeoButton
        toggle
        checked={options.movable.axis === 'x'}
        disabled={!options.movable.enabled}
        onclick={() => {
          options.movable.axis = options.movable.axis === 'x' ? undefined : 'x';
        }}
      >
        Axis X
      </NeoButton>
      <NeoButton
        toggle
        checked={options.movable.axis === 'y'}
        disabled={!options.movable.enabled}
        onclick={() => {
          options.movable.axis = options.movable.axis === 'y' ? undefined : 'y';
        }}
      >
        Axis Y
      </NeoButton>
      <NeoButton toggle bind:checked={options.movable.snap.enabled} disabled={!options.movable.enabled}>Snap</NeoButton>
      <NeoButton toggle bind:checked={options.movable.snap.corner} disabled={!options.movable.enabled || !options.movable.snap.enabled}>
        Snap Corner
      </NeoButton>
      <NeoButton toggle bind:checked={options.movable.snap.outside} disabled={!options.movable.enabled || !options.movable.snap.enabled}>
        Snap Outside
      </NeoButton>
      <NeoButton toggle checked={options.movable.handle.position === 'outside'} onclick={onHandlePosition} disabled={!options.movable.enabled}>
        Handle {options.movable.handle.position}
      </NeoButton>
      <NeoButton toggle bind:checked={options.movable.handle.full} disabled={!options.movable.enabled}>Handle Full</NeoButton>
    </NeoButtonGroup>

    <NeoSelect
      label="Handles"
      placeholder="Handles"
      placement="left"
      floating={false}
      size="10"
      containerProps={{ style: 'margin-left: 6rem' }}
      disabled={!options.movable.enabled}
      value={placement}
      options={[
        { value: 'top', label: 'Top' },
        { value: 'right', label: 'Right' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'left', label: 'Left' },
      ]}
      multiple
      onChange={onSelectPlacement}
      openOnFocus
      rounded
      glass
    />
  </div>
</div>

<!-- TODO snap options-->

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

<section>
  <div class="row">
    {#if options.returnValue !== undefined}
      <span>Returned value: {JSON.stringify(options.returnValue, undefined, 2)}</span>
    {/if}
    <div class="column">
      <span class="label">Default</span>

      <NeoButton elevation="0" toggle bind:checked={openDefault}>Open</NeoButton>

      <NeoDialog
        {...options}
        elevation={options.elevation > 0 ? options.elevation : undefined}
        bind:open={openDefault}
        bind:modal={options.modal}
        bind:placement={options.placement}
        bind:returnValue={options.returnValue}
      >
        {@render lorem()}
      </NeoDialog>
    </div>

    <div class="column">
      <span class="label">Confirm</span>

      <NeoButton elevation="0" toggle bind:checked={openConfirm}>Open</NeoButton>

      <NeoDialogConfirm
        bind:open={openConfirm}
        bind:modal={options.modal}
        bind:placement={options.placement}
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

      <NeoDialogStepper
        bind:active
        bind:open={openStepper}
        bind:modal={options.modal}
        bind:placement={options.placement}
        bind:returnValue={options.returnValue}
        closable={options.closeOnClickOutside}
        rounded={options.rounded}
        {...stepperOptions}
        dialogProps={{ ...options, elevation: options.elevation > 0 ? options.elevation : undefined, ...stepperOptions.dialogProps }}
      />
    </div>
  </div>

  <div class="row">
    <span class="label">Drawer</span>

    <NeoButton elevation="0" toggle bind:checked={openDrawer}>Open</NeoButton>
    <div class="column">
      <NeoDialog
        bind:open={openDrawer}
        bind:modal={options.modal}
        bind:placement={options.placement}
        bind:returnValue={options.returnValue}
        closable={options.closeOnClickOutside}
        rounded={options.rounded}
        elevation={options.elevation > 0 ? options.elevation : undefined}
        {...options}
      >
        {@render lorem()}
      </NeoDialog>
    </div>
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

  p {
    max-width: 80ch;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;

    .row {
      margin: 0;
    }
  }
</style>
