<script lang="ts">
  import { link } from '@dvcol/svelte-simple-router';

  import { Path } from '../router/routes.js';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import { useButtonState } from '../utils/use-button-state.svelte';

  import type { NeoButtonProps } from '~/buttons/neo-button.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';

  const { onClick, loading: isLoading, onLoading } = useButtonState('DemoButtonClick');

  const options = $state<NeoButtonProps>({
    disabled: false,
    skeleton: false,
    loading: false,
    inset: false,
  });

  const loading = $derived.by(() => isLoading() || options.loading);

  const columns = [
    { label: 'Default' },
    { label: 'Rounded', props: { rounded: true, shallow: true } },
    { label: 'Flat', props: { flat: true, shallow: true } },
    { label: 'Text', props: { text: true, shallow: true } },
  ];
</script>

{#snippet icon()}
  <IconAccount />
{/snippet}

{#snippet buttons(opts: NeoButtonProps = {})}
  <NeoButton {...opts} {...options} onclick={onClick} href={`${Path.ButtonGroups}`} use={link}>Anchor</NeoButton>
  <NeoButton {...opts} {...options} onclick={onClick}>Button</NeoButton>
  <NeoButton {...opts} {...options} toggle onclick={onClick}>Toggle</NeoButton>
  <NeoButton {...opts} {...options} disabled onclick={onClick}>Disabled</NeoButton>
  <NeoButton {...opts} {...options} {loading} onclick={onLoading}>Loading</NeoButton>
  <NeoButton {...opts} {...options} {loading} onclick={onLoading} {icon} />
  <NeoButton {...opts} {...options} onclick={onClick} {icon}>Icon</NeoButton>
  <NeoButton {...opts} {...options} reverse onclick={onClick} {icon}>Reversed</NeoButton>
  <NeoButton {...opts} {...options} {loading} pulse onclick={onLoading}>Pulse</NeoButton>
  <NeoButton {...opts} {...options} coalesce onclick={onClick}>Coalesce</NeoButton>
{/snippet}

<div class="row">
  <div class="column">
    <NeoButtonGroup>
      <NeoButton toggle bind:checked={options.inset}>Inset</NeoButton>
      <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
      <NeoButton toggle bind:checked={options.loading}>Loading</NeoButton>
      <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
    </NeoButtonGroup>
  </div>
</div>

<div class="row">
  {#each columns as { label, props }}
    <div class="column">
      <span class="label">{label}</span>
      {@render buttons(props)}
    </div>
  {/each}

  <div class="column">
    <span class="label">Glass</span>
    <SphereBackdrop>
      <NeoButton glass {...options} onclick={onClick} href={`${Path.ButtonGroups}`} use={link}>Anchor</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {...options} onclick={onClick}>Button</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {...options} toggle onclick={onClick}>Toggle</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {...options} disabled onclick={onClick}>Disabled</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {...options} {loading} onclick={onLoading}>Loading</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {...options} {loading} onclick={onLoading} {icon} />
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {...options} onclick={onClick} {icon}>Icon</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {...options} reverse onclick={onClick} {icon}>Reversed</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {...options} {loading} pulse onclick={onLoading}>Pulse</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {...options} coalesce onclick={onClick}>Coalesce</NeoButton>
    </SphereBackdrop>
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));
  }

  .row {
    @include flex.row($gap: var(--neo-gap-xl), $flex: 0 1 auto);

    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }

  @media (width > 1550px) {
    .column {
      @include flex.row($gap: var(--neo-gap-xl));
    }

    .row {
      @include flex.column($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);
    }

    .label {
      min-width: 4.5rem;
    }
  }
</style>
