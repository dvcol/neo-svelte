<script lang="ts">
  import type { NeoButtonGroupContext, NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';
  import type { NeoButtonRowItem } from '~/buttons/neo-button-row.model';

  import { link } from '@dvcol/svelte-simple-router';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoButtonRow from '~/buttons/NeoButtonRow.svelte';
  import NeoIconAccount from '~/icons/NeoIconAccount.svelte';
  import { displayValue } from '~/inputs/neo-select.model';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { DefaultShadowElevation } from '~/utils/shadow.utils';

  import { Path } from '../router/routes.js';
  import { colorOptions } from '../utils/color.utils';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';
  import { useButtonState } from '../utils/use-button-state.svelte';

  const { onClick, loading: loading$, onLoading } = useButtonState('DemoGroupClicked');
  const loading = $derived.by(loading$);
  const options = $state<NeoButtonGroupProps>({
    skeleton: false,
    rounded: false,
    vertical: false,
    elevation: DefaultShadowElevation,
    glass: false,
    color: '',
    tinted: false,
  });

  const columns: { label: string; props?: NeoButtonGroupProps }[] = [
    { label: 'Default' },
    { label: 'Flat', props: { elevation: 0 } },
    { label: 'Text', props: { elevation: 0, borderless: true } },
    { label: 'Raised', props: { elevation: 0, borderless: true, button: { hover: 1, active: -1, pressed: true } } },
    { label: 'Inset', props: { elevation: -2 } },
    { label: 'Pressed', props: { elevation: -2, pressed: true } },
    { label: 'Convex', props: { elevation: 2, convex: true } },
  ];

  const items: NeoButtonRowItem[] = [
    { label: 'Anchor', href: `${Path.Buttons}`, onclick: onClick, use: link },
    { label: 'Button', onclick: onClick },
    { label: 'Toggle', toggle: true, onclick: onClick },
    { label: 'Disabled', disabled: true, onclick: onClick },
    { divider: true },
    { label: 'Loading', get loading() {
      return loading;
    }, onclick: onLoading },
    { label: 'Icon', icon, onclick: onClick },
    { label: 'Reversed', reverse: true, icon, onclick: onClick },
    ...Array.from({ length: 3 }, (_, i) => ({
      label: `Button ${i + 1}`,
      onclick: onClick,
    })),
    { divider: true },
    ...Array.from({ length: 3 }, (_, i) => ({
      label: `Button ${i + 4}`,
      onclick: onClick,
    })),
  ];
</script>

{#snippet icon()}
  <NeoIconAccount />
{/snippet}

{#snippet buttons()}
  <NeoButton onclick={onClick} href={`${Path.Buttons}`} use={link}>Anchor</NeoButton>
  <NeoButton onclick={onClick}>Button</NeoButton>
  <NeoButton toggle onclick={onClick}>Toggle</NeoButton>
  <NeoButton disabled onclick={onClick}>Disabled</NeoButton>
  <NeoButton {loading} onclick={onLoading}>Loading</NeoButton>
  <NeoButton {loading} onclick={onLoading} {icon} />
  <NeoButton onclick={onClick} {icon}>Icon</NeoButton>
  <NeoButton reverse onclick={onClick} {icon}>Reversed</NeoButton>
{/snippet}

{#snippet group(props: NeoButtonGroupContext = {})}
  <NeoButtonGroup {...options} {...props}>
    {@render buttons()}
  </NeoButtonGroup>
{/snippet}

<div class="row">
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.tinted}>Tinted</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.vertical}>Vertical</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
  </NeoButtonGroup>

  <NeoSelect
    label="Color"
    rounded
    glass
    placeholder="Select color"
    placement="left"
    floating={false}
    color={options.color}
    display={displayValue}
    size={10}
    bind:value={options.color}
    containerProps={{ style: 'margin-left: 6rem' }}
    options={colorOptions}
    openOnFocus
  />
</div>

<section>
  <div class="row" class:invert={!options.vertical}>
    {#each columns as { label, props } (label)}
      <div class="column">
        <span class="label">{label}</span>
        <SphereBackdrop glass={options?.glass}>
          {@render group(props)}
        </SphereBackdrop>
      </div>
    {/each}

    <div class="column">
      <span class="label">Pulse</span>
      <NeoButtonGroup {...options} pulse>
        <NeoButton onclick={onClick}>Button</NeoButton>
        <NeoButton toggle onclick={onClick}>Toggle</NeoButton>
        <NeoButton {loading} onclick={onLoading} {icon} />
      </NeoButtonGroup>

      <span class="label">Coalesce</span>
      <NeoButtonGroup {...options} coalesce>
        <NeoButton onclick={onClick}>Button</NeoButton>
        <NeoButton disabled onclick={onClick}>Disabled</NeoButton>
        <NeoButton {loading} onclick={onLoading}>Loading</NeoButton>
      </NeoButtonGroup>
    </div>

    <div class="column">
      <span class="label">Collapse</span>
      <SphereBackdrop glass={options?.glass}>
        <NeoButtonRow {items} {...options} />
      </SphereBackdrop>
    </div>
  </div>
</section>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  section {
    flex: 1 1 100%;
    align-content: center;

    :global(.neo-button-group) {
      max-width: min(80vw, 44rem);
      max-height: min(80vh, 31rem);
    }
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));
  }

  .row {
    @include flex.row($gap: var(--neo-gap-xl), $flex: 0 1 auto);

    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }

  .invert {
    @include flex.column($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    .column {
      @include flex.row($gap: var(--neo-gap-xxl));
    }

    .label {
      min-width: 4.5rem;
    }
  }
</style>
