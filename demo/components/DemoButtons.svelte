<script lang="ts">
  import { link } from '@dvcol/svelte-simple-router';

  import { Path } from '../router/routes.js';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import { useButtonState } from '../utils/use-button-state.svelte';

  import type { NeoButtonProps } from '~/buttons/neo-button.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';

  const { onClick, loading: loading$, onLoading, skeleton: skeleton$, onSkeleton } = useButtonState('DemoButtonClick');
  const loading = $derived.by(loading$);
  const skeleton = $derived.by(skeleton$);

  const columns = [
    { label: 'Default' },
    { label: 'Rounded', props: { rounded: true } },
    { label: 'Flat', props: { flat: true } },
    { label: 'Text', props: { text: true } },
  ];
</script>

{#snippet icon()}
  <IconAccount />
{/snippet}

{#snippet buttons(opts: NeoButtonProps = {})}
  <NeoButton {...opts} onclick={onClick} href={`${Path.ButtonGroups}`} use={link}>Anchor</NeoButton>
  <NeoButton {...opts} onclick={onClick}>Button</NeoButton>
  <NeoButton {...opts} toggle onclick={onClick}>Toggle</NeoButton>
  <NeoButton {...opts} disabled onclick={onClick}>Disabled</NeoButton>
  <NeoButton {...opts} {loading} onclick={onLoading}>Loading</NeoButton>
  <NeoButton {...opts} {loading} onclick={onLoading} {icon} />
  <NeoButton {...opts} onclick={onClick} {icon}>Icon</NeoButton>
  <NeoButton {...opts} reverse onclick={onClick} {icon}>Reversed</NeoButton>
  <NeoButton {...opts} {loading} pulse onclick={onLoading}>Pulse</NeoButton>
  <NeoButton {...opts} coalesce onclick={onClick}>Coalesce</NeoButton>
  <NeoButton {...opts} {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
{/snippet}

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
      <NeoButton glass onclick={onClick} href={`${Path.ButtonGroups}`} use={link}>Anchor</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass onclick={onClick}>Button</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass toggle onclick={onClick}>Toggle</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass disabled onclick={onClick}>Disabled</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {loading} onclick={onLoading}>Loading</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {loading} onclick={onLoading} {icon} />
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass onclick={onClick} {icon}>Icon</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass reverse onclick={onClick} {icon}>Reversed</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {loading} pulse onclick={onLoading}>Pulse</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass coalesce onclick={onClick}>Coalesce</NeoButton>
    </SphereBackdrop>
    <SphereBackdrop>
      <NeoButton glass {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
    </SphereBackdrop>
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .column {
    @include flex.column($center: true, $gap: var(--gap-lg));
  }

  .row {
    @include flex.row($gap: var(--gap-xl));
  }

  @media (width > 1550px) {
    .column {
      @include flex.row($gap: var(--gap-xl));
    }

    .row {
      @include flex.column($center: true, $gap: var(--gap-xl));
    }

    .label {
      min-width: 4.5rem;
    }
  }
</style>
