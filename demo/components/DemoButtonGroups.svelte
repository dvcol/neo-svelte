<script lang="ts">
  import { useWatchMedia } from '@dvcol/svelte-utils/media';

  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';

  const onClick = (...args: any) => {
    console.info(...args);
  };

  let loading = $state(false);
  const onLoading = (e: MouseEvent, checked?: boolean, duration = 5000) => {
    loading = !loading;
    setTimeout(() => {
      loading = !loading;
    }, duration);
    onClick(e);
  };

  let skeleton = $state(false);
  const onSkeleton = (e: MouseEvent, checked?: boolean, duration = 5000) => {
    skeleton = !skeleton;
    setTimeout(() => {
      skeleton = !skeleton;
    }, duration);
    onClick(e);
  };

  const { matches } = useWatchMedia('(max-width: 1550px)');
  const vertical = $derived.by(matches);
</script>

{#snippet icon()}
  <IconAccount />
{/snippet}

<div class="row">
  <div class="column">
    <span class="label">Default</span>
    <NeoButtonGroup {vertical} {skeleton}>
      <NeoButton onclick={onClick}>Button</NeoButton>
      <NeoButton toggle onclick={onClick}>Toggle</NeoButton>
      <NeoButton disabled onclick={onClick}>Disabled</NeoButton>
      <NeoButton {loading} onclick={onLoading}>Loading</NeoButton>
      <NeoButton {loading} onclick={onLoading} {icon} />
      <NeoButton onclick={onClick} {icon}>Icon</NeoButton>
      <NeoButton reverse onclick={onClick} {icon}>Reversed</NeoButton>
      <NeoButton {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
    </NeoButtonGroup>
  </div>

  <div class="column">
    <span class="label">Rounded</span>
    <NeoButtonGroup {vertical} {skeleton} rounded>
      <NeoButton onclick={onClick}>Button</NeoButton>
      <NeoButton toggle onclick={onClick}>Toggle</NeoButton>
      <NeoButton disabled onclick={onClick}>Disabled</NeoButton>
      <NeoButton {loading} onclick={onLoading}>Loading</NeoButton>
      <NeoButton {loading} onclick={onLoading} {icon} />
      <NeoButton onclick={onClick} {icon}>Icon</NeoButton>
      <NeoButton reverse onclick={onClick} {icon}>Reversed</NeoButton>
      <NeoButton {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
    </NeoButtonGroup>
  </div>

  <div class="column">
    <span class="label">Flat</span>
    <NeoButtonGroup {vertical} {skeleton} flat>
      <NeoButton flat onclick={onClick}>Button</NeoButton>
      <NeoButton flat toggle onclick={onClick}>Toggle</NeoButton>
      <NeoButton flat disabled onclick={onClick}>Disabled</NeoButton>
      <NeoButton flat {loading} onclick={onLoading}>Loading</NeoButton>
      <NeoButton flat {loading} onclick={onLoading} {icon} />
      <NeoButton flat onclick={onClick} {icon}>Icon</NeoButton>
      <NeoButton flat reverse onclick={onClick} {icon}>Reversed</NeoButton>
      <NeoButton flat {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
    </NeoButtonGroup>
  </div>

  <div class="column">
    <span class="label">Text</span>
    <NeoButtonGroup {vertical} {skeleton} text>
      <NeoButton text onclick={onClick}>Button</NeoButton>
      <NeoButton text toggle onclick={onClick}>Toggle</NeoButton>
      <NeoButton text disabled onclick={onClick}>Disabled</NeoButton>
      <NeoButton text {loading} onclick={onLoading}>Loading</NeoButton>
      <NeoButton text {loading} onclick={onLoading} {icon} />
      <NeoButton text onclick={onClick} {icon}>Icon</NeoButton>
      <NeoButton text reverse onclick={onClick} {icon}>Reversed</NeoButton>
      <NeoButton text {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
    </NeoButtonGroup>
  </div>

  <div class="column">
    <span class="label">Glass</span>
    <SphereBackdrop>
      <NeoButtonGroup {vertical} {skeleton} glass>
        <NeoButton onclick={onClick}>Button</NeoButton>
        <NeoButton toggle onclick={onClick}>Toggle</NeoButton>
        <NeoButton disabled onclick={onClick}>Disabled</NeoButton>
        <NeoButton {loading} onclick={onLoading}>Loading</NeoButton>
        <NeoButton {loading} onclick={onLoading} {icon} />
        <NeoButton onclick={onClick} {icon}>Icon</NeoButton>
        <NeoButton reverse onclick={onClick} {icon}>Reversed</NeoButton>
        <NeoButton {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
      </NeoButtonGroup>
    </SphereBackdrop>
  </div>

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
