<script lang="ts">
  import { link } from '@dvcol/svelte-simple-router';
  import { useWatchMedia } from '@dvcol/svelte-utils/media';

  import { Path } from '../router/routes.js';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import { useButtonState } from '../utils/use-button-state.svelte';

  import type { NeoButtonGroupContext } from '~/buttons/neo-button-group.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';

  const { onClick, loading: loading$, onLoading, skeleton: skeleton$, onSkeleton } = useButtonState('DemoGroupClicked');
  const loading = $derived.by(loading$);
  const skeleton = $derived.by(skeleton$);

  const { matches } = useWatchMedia('(max-width: 1550px)');
  const vertical = $derived.by(matches);

  const columns = [
    { label: 'Default' },
    { label: 'Rounded', props: { rounded: true } },
    { label: 'Flat', props: { flat: true } },
    { label: 'Text', props: { text: true } },
    { label: 'Glass', props: { glass: true } },
  ];
</script>

{#snippet icon()}
  <IconAccount />
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
  <NeoButton {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
{/snippet}

{#snippet group(props: NeoButtonGroupContext = {})}
  <NeoButtonGroup {vertical} {skeleton} {...props}>
    {@render buttons()}
  </NeoButtonGroup>
{/snippet}

<div class="row">
  {#each columns as { label, props }}
    <div class="column">
      <span class="label">{label}</span>

      {#if props?.glass}
        <SphereBackdrop>{@render group(props)}</SphereBackdrop>
      {:else}
        {@render group(props)}
      {/if}
    </div>
  {/each}

  <div class="column">
    <span class="label">Pulse</span>
    <NeoButtonGroup {skeleton} pulse>
      <NeoButton onclick={onClick}>Button</NeoButton>
      <NeoButton toggle onclick={onClick}>Toggle</NeoButton>
      <NeoButton {loading} onclick={onLoading} {icon} />
    </NeoButtonGroup>

    <span class="label">Coalesce</span>
    <NeoButtonGroup {skeleton} coalesce>
      <NeoButton onclick={onClick}>Button</NeoButton>
      <NeoButton disabled onclick={onClick}>Disabled</NeoButton>
      <NeoButton {loading} onclick={onLoading}>Loading</NeoButton>
    </NeoButtonGroup>
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
      @include flex.row($gap: var(--gap-xxl));
    }

    .row {
      @include flex.column($center: true, $gap: var(--gap-xl));
    }

    .label {
      min-width: 4.5rem;
    }
  }
</style>
