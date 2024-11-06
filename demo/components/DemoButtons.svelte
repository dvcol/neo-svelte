<script lang="ts">
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import NeoButton from '~/buttons/NeoButton.svelte';
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
</script>

{#snippet icon()}
  <IconAccount />
{/snippet}

<div class="row">
  <div class="column">
    <span class="label">Glass</span>
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

  <div class="column">
    <span class="label">Default</span>
    <NeoButton onclick={onClick}>Button</NeoButton>
    <NeoButton toggle onclick={onClick}>Toggle</NeoButton>
    <NeoButton disabled onclick={onClick}>Disabled</NeoButton>
    <NeoButton {loading} onclick={onLoading}>Loading</NeoButton>
    <NeoButton {loading} onclick={onLoading} {icon} />
    <NeoButton onclick={onClick} {icon}>Icon</NeoButton>
    <NeoButton reverse onclick={onClick} {icon}>Reversed</NeoButton>
    <NeoButton {loading} pulse onclick={onLoading}>Pulse</NeoButton>
    <NeoButton coalesce onclick={onClick}>Coalesce</NeoButton>
    <NeoButton {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
  </div>

  <div class="column">
    <span class="label">Rounded</span>
    <NeoButton rounded onclick={onClick}>Button</NeoButton>
    <NeoButton rounded toggle onclick={onClick}>Toggle</NeoButton>
    <NeoButton rounded disabled onclick={onClick}>Disabled</NeoButton>
    <NeoButton rounded {loading} onclick={onLoading}>Loading</NeoButton>
    <NeoButton rounded {loading} onclick={onLoading} {icon} />
    <NeoButton rounded onclick={onClick} {icon}>Icon</NeoButton>
    <NeoButton rounded reverse onclick={onClick} {icon}>Reversed</NeoButton>
    <NeoButton rounded {loading} pulse onclick={onLoading}>Pulse</NeoButton>
    <NeoButton rounded coalesce onclick={onClick}>Coalesce</NeoButton>
    <NeoButton {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
  </div>

  <div class="column">
    <span class="label">Flat</span>
    <NeoButton flat onclick={onClick}>Button</NeoButton>
    <NeoButton flat toggle onclick={onClick}>Toggle</NeoButton>
    <NeoButton flat disabled onclick={onClick}>Disabled</NeoButton>
    <NeoButton flat {loading} onclick={onLoading}>Loading</NeoButton>
    <NeoButton flat {loading} onclick={onLoading} {icon} />
    <NeoButton flat onclick={onClick} {icon}>Icon</NeoButton>
    <NeoButton flat reverse onclick={onClick} {icon}>Reversed</NeoButton>
    <NeoButton flat {loading} pulse onclick={onLoading}>Pulse</NeoButton>
    <NeoButton flat coalesce onclick={onClick}>Coalesce</NeoButton>
    <NeoButton flat {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
  </div>

  <div class="column">
    <span class="label">Text</span>
    <NeoButton text onclick={onClick}>Button</NeoButton>
    <NeoButton text toggle onclick={onClick}>Toggle</NeoButton>
    <NeoButton text disabled onclick={onClick}>Disabled</NeoButton>
    <NeoButton text {loading} onclick={onLoading}>Loading</NeoButton>
    <NeoButton text {loading} onclick={onLoading} {icon} />
    <NeoButton text onclick={onClick} {icon}>Icon</NeoButton>
    <NeoButton text reverse onclick={onClick} {icon}>Reversed</NeoButton>
    <NeoButton text {loading} pulse onclick={onLoading}>Pulse</NeoButton>
    <NeoButton text coalesce onclick={onClick}>Coalesce</NeoButton>
    <NeoButton text {skeleton} onclick={onSkeleton}>Skeleton</NeoButton>
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .column {
    @include flex.column($center: true, $gap: var(--gap-md));
  }

  .row {
    @include flex.row;
  }

  @media (width > 1550px) {
    .column {
      @include flex.row($gap: var(--gap-xl));
    }

    .row {
      @include flex.column($center: true, $gap: var(--gap-lg));
    }

    .label {
      min-width: 4.5rem;
    }
  }
</style>
