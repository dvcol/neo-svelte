<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';

  import { defaultHandle, defaultMovable, defaultSnap } from '../../src/lib/floating/dialog/use-movable.svelte';
  import { colorOptions } from '../utils/color.utils';
  import { positionOptions } from '../utils/placement.utils';

  import type { NeoDialogConfirmProps } from '~/floating/dialog/neo-dialog-confirm.model.js';
  import type { NeoDialogStepperProps } from '~/floating/dialog/neo-dialog-stepper.model.js';
  import type { NeoDialogProps } from '~/floating/dialog/neo-dialog.model.js';
  import type { NeoStepperStep } from '~/stepper/neo-stepper.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import { NeoDialogPlacements } from '~/floating/common/neo-placement.model.js';
  import NeoDialog from '~/floating/dialog/NeoDialog.svelte';
  import NeoDialogConfirm from '~/floating/dialog/NeoDialogConfirm.svelte';
  import NeoDialogStepper from '~/floating/dialog/NeoDialogStepper.svelte';
  import NeoDrawer from '~/floating/drawer/NeoDrawer.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';
  import IconAddress from '~/icons/IconAddress.svelte';
  import IconListSmall from '~/icons/IconListSmall.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { DefaultShadowElevation, MaxShadowElevation } from '~/utils/shadow.utils';

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
    placement: NeoDialogPlacements.Center,
    moved: { x: 0, y: 0 },
    portal: false,
    full: false,
    movable: {
      contain: defaultMovable.contain,
      enabled: defaultMovable.enabled,
      resetOnClose: defaultMovable.resetOnClose,
      axis: defaultMovable.axis,
      snap: {
        enabled: defaultSnap.enabled,
        outside: defaultSnap.outside,
        corner: defaultSnap.corner,
      },
      handle: {
        full: defaultHandle.full,
        position: defaultHandle.position,
      },
    },

    ontoggle: () => console.info('Dialog toggled'),
    onclose: () => console.info('Dialog closed'),
    oncancel: () => console.info('Dialog cancelled'),
  });

  const drawerOptions = $state<NeoDialogProps>({
    ...options,
    placement: NeoDialogPlacements.Right,
    moved: { x: 0, y: 0 },
    portal: false,
    elevation: 1,
    full: true,
    movable: {
      contain: defaultMovable.contain,
      enabled: defaultMovable.enabled,
      resetOnClose: defaultMovable.resetOnClose,
      axis: defaultMovable.axis,
      snap: {
        enabled: true,
        outside: defaultSnap.outside,
        corner: defaultSnap.corner,
      },
      handle: {
        full: defaultHandle.full,
        position: defaultHandle.position,
      },
    },

    ontoggle: () => console.info('Drawer toggled'),
    onclose: () => console.info('Drawer closed'),
    oncancel: () => console.info('Drawer cancelled'),
  });

  const onHandlePosition = (opts: NeoDialogProps) => {
    opts.movable.handle.position = opts.movable.handle.position === 'outside' ? 'inside' : 'outside';
  };

  const getSelectPlacement = (opts: NeoDialogProps) => {
    if (!opts.movable.placement) return undefined;
    return Object.entries(opts.movable.placement)
      .filter(([, v]) => v)
      .map(([k]) => k);
  };
  const onSelectPlacement = (values: string[], opts: NeoDialogProps) => {
    opts.movable.placement = values?.reduce((acc, cur) => ({ ...acc, [cur]: true }), {});
  };

  const position = [{ value: 'center', label: 'Center' }, ...positionOptions];

  let openDefault = $state(false);
  let openConfirm = $state(false);
  let openStepper = $state(false);
  let openDrawer = $state(false);

  const refs = $state([]);

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

  const reset = async () => {
    await Promise.all(refs.map(ref => ref?.reset?.({ translate: true })));
    options.moved = { x: 0, y: 0 };
    drawerOptions.moved = { x: 0, y: 0 };
  };
</script>

{#snippet optionRow(opts: NeoDialogProps, drawer = false)}
  <div class="row">
    <div class="row">
      <NeoButtonGroup text rounded>
        <NeoButton toggle bind:checked={opts.modal}>Modal</NeoButton>
        <NeoButton toggle bind:checked={opts.disableBodyScroll}>Body Scroll</NeoButton>
        <NeoButton toggle bind:checked={opts.closeOnClickOutside}>Closable</NeoButton>
        <NeoButton toggle bind:checked={opts.backdrop}>Backdrop</NeoButton>
        <NeoButton toggle bind:checked={opts.filled}>Filled</NeoButton>
        <NeoButton toggle bind:checked={opts.tinted}>Tinted</NeoButton>
        <NeoButton toggle bind:checked={opts.rounded}>Rounded</NeoButton>
        <NeoButton toggle bind:checked={opts.borderless}>Borderless</NeoButton>
        <NeoButton toggle bind:checked={opts.portal}>Portal</NeoButton>
        <NeoButton toggle bind:checked={opts.full}>Full size</NeoButton>
      </NeoButtonGroup>

      <NeoSelect
        label="Placement"
        placeholder="Select placement"
        placement="left"
        floating={false}
        bind:value={opts.placement}
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
        bind:value={opts.elevation}
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
        color={opts.color}
        size="10"
        bind:value={opts.color}
        containerProps={{ style: 'margin-left: 6rem' }}
        options={colorOptions}
        openOnFocus
        rounded
        glass
      />
    </div>

    <div class="row">
      <NeoButtonGroup text rounded>
        <NeoButton toggle bind:checked={opts.movable.enabled}>Movable</NeoButton>
        {#if !drawer}
          <NeoButton toggle bind:checked={opts.movable.contain} disabled={!opts.movable.enabled}>Contain</NeoButton>
          <NeoButton
            toggle
            checked={opts.movable.axis === 'x'}
            disabled={!opts.movable.enabled}
            onclick={() => {
              opts.movable.axis = opts.movable.axis === 'x' ? undefined : 'x';
            }}
          >
            Axis X
          </NeoButton>
          <NeoButton
            toggle
            checked={opts.movable.axis === 'y'}
            disabled={!opts.movable.enabled}
            onclick={() => {
              opts.movable.axis = opts.movable.axis === 'y' ? undefined : 'y';
            }}
          >
            Axis Y
          </NeoButton>
        {/if}
        <NeoButton toggle bind:checked={opts.movable.snap.enabled} disabled={!opts.movable.enabled}>Snap</NeoButton>
        {#if !drawer}
          <NeoButton toggle bind:checked={opts.movable.snap.corner} disabled={!opts.movable.enabled || !opts.movable.snap.enabled}>
            Snap Corner
          </NeoButton>
        {/if}
        <NeoButton toggle bind:checked={opts.movable.snap.outside} disabled={!opts.movable.enabled || !opts.movable.snap.enabled}>
          Snap Outside
        </NeoButton>
        <NeoButton
          toggle
          checked={opts.movable.handle.position === 'outside'}
          onclick={() => onHandlePosition(opts)}
          disabled={!opts.movable.enabled}
        >
          Handle {opts.movable.handle.position}
        </NeoButton>
        <NeoButton toggle bind:checked={opts.movable.handle.full} disabled={!opts.movable.enabled}>Element as Handle</NeoButton>
        <NeoButton toggle bind:checked={opts.movable.resetOnClose} disabled={!opts.movable.enabled}>Reset on Close</NeoButton>
      </NeoButtonGroup>

      <NeoButton rounded onclick={reset} disabled={!opts.movable.enabled}>Reset</NeoButton>

      <NeoSelect
        label="Handles"
        placeholder="Handles"
        placement="left"
        floating={false}
        size="10"
        containerProps={{ style: 'margin-left: 6rem' }}
        disabled={!opts.movable.enabled}
        value={getSelectPlacement(opts)}
        options={[
          { value: 'top', label: 'Top' },
          { value: 'right', label: 'Right' },
          { value: 'bottom', label: 'Bottom' },
          { value: 'left', label: 'Left' },
        ]}
        multiple
        onChange={e => onSelectPlacement(e, opts)}
        openOnFocus
        rounded
        glass
      />
    </div>
  </div>
{/snippet}

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

{@render optionRow(options)}

<section>
  <div class="row">
    {#if options.returnValue !== undefined}
      <span>Returned value: {JSON.stringify(options.returnValue, undefined, 2)}</span>
    {/if}
    <div class="column">
      <span class="label">Default</span>

      <NeoButton elevation="0" toggle bind:checked={openDefault}>Open</NeoButton>

      <NeoDialog
        bind:ref={refs[0]}
        bind:open={openDefault}
        bind:modal={options.modal}
        bind:moved={options.moved}
        bind:placement={options.placement}
        bind:returnValue={options.returnValue}
        {...options}
        elevation={options.elevation > 0 ? options.elevation : undefined}
      >
        {@render lorem()}
      </NeoDialog>
    </div>

    <div class="column">
      <span class="label">Confirm</span>

      <NeoButton elevation="0" toggle bind:checked={openConfirm}>Open</NeoButton>

      <NeoDialogConfirm
        bind:ref={refs[1]}
        bind:open={openConfirm}
        bind:modal={options.modal}
        bind:moved={options.moved}
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
        bind:dialogRef={refs[2]}
        bind:active
        bind:open={openStepper}
        bind:modal={options.modal}
        bind:moved={options.moved}
        bind:placement={options.placement}
        bind:returnValue={options.returnValue}
        {...stepperOptions}
        closable={options.closeOnClickOutside}
        rounded={options.rounded}
        dialogProps={{ ...options, elevation: options.elevation > 0 ? options.elevation : undefined, ...stepperOptions.dialogProps }}
      />
    </div>
  </div>
</section>

{@render optionRow(drawerOptions, true)}

<section>
  <div class="row">
    <span class="label">Drawer</span>

    <NeoButton elevation="0" toggle bind:checked={openDrawer}>Open</NeoButton>

    <div class="column">
      <NeoDrawer
        bind:dialogRef={refs[3]}
        bind:open={openDrawer}
        bind:modal={drawerOptions.modal}
        bind:moved={drawerOptions.moved}
        bind:placement={drawerOptions.placement}
        bind:returnValue={drawerOptions.returnValue}
        closable={drawerOptions.closeOnClickOutside}
        rounded={drawerOptions.rounded}
        {...drawerOptions}
        elevation={drawerOptions.elevation > 0 ? drawerOptions.elevation : undefined}
      >
        {@render lorem()}
      </NeoDrawer>
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
