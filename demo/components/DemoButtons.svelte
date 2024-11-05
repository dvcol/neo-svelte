<script lang="ts">
  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';

  const onClick = (...args: any) => {
    console.info(...args);
  };

  let loading = $state(false);
  const onLoading = (e: MouseEvent, duration = 5000) => {
    loading = !loading;
    setTimeout(() => {
      loading = !loading;
    }, duration);
    onClick(e);
  };
</script>

{#snippet icon()}
  <IconAccount />
{/snippet}

<div class="column">
  <div class="row">
    <NeoButton onclick={onClick}>Button</NeoButton>
    <NeoButton disabled onclick={onClick}>Disabled</NeoButton>
    <NeoButton {loading} onclick={onLoading}>Loading</NeoButton>
    <NeoButton {loading} onclick={onLoading} {icon} />
    <NeoButton onclick={onClick} {icon}>Icon</NeoButton>
    <NeoButton onclick={onClick} {icon}>Reversed</NeoButton>
    <NeoButton {loading} pulse onclick={onLoading}>Pulse</NeoButton>
    <NeoButton coalesce onclick={onClick}>Coalesce</NeoButton>
    <NeoButton skeleton={loading} onclick={onLoading}>Skeleton</NeoButton>
  </div>

  <div class="row">
    <NeoButton rounded onclick={onClick}>Button</NeoButton>
    <NeoButton rounded disabled onclick={onClick}>Disabled</NeoButton>
    <NeoButton rounded {loading} onclick={onLoading}>Loading</NeoButton>
    <NeoButton rounded {loading} onclick={onLoading} {icon} />
    <NeoButton rounded onclick={onClick} {icon}>Icon</NeoButton>
    <NeoButton rounded onclick={onClick} {icon}>Reversed</NeoButton>
    <NeoButton rounded {loading} pulse onclick={onLoading}>Pulse</NeoButton>
    <NeoButton rounded coalesce onclick={onClick}>Coalesce</NeoButton>
    <NeoButton skeleton={loading} onclick={onLoading}>Skeleton</NeoButton>
  </div>

  <div class="row">
    <NeoButton flat onclick={onClick}>Button</NeoButton>
    <NeoButton flat disabled onclick={onClick}>Disabled</NeoButton>
    <NeoButton flat {loading} onclick={onLoading}>Loading</NeoButton>
    <NeoButton flat {loading} onclick={onLoading} {icon} />
    <NeoButton flat onclick={onClick} {icon}>Icon</NeoButton>
    <NeoButton flat onclick={onClick} {icon}>Reversed</NeoButton>
    <NeoButton flat {loading} pulse onclick={onLoading}>Pulse</NeoButton>
    <NeoButton flat coalesce onclick={onClick}>Coalesce</NeoButton>
    <NeoButton flat skeleton={loading} onclick={onLoading}>Skeleton</NeoButton>
  </div>

  <div class="row">
    <NeoButton text onclick={onClick}>Button</NeoButton>
    <NeoButton text disabled onclick={onClick}>Disabled</NeoButton>
    <NeoButton text {loading} onclick={onLoading}>Loading</NeoButton>
    <NeoButton text {loading} onclick={onLoading} {icon} />
    <NeoButton text onclick={onClick} {icon}>Icon</NeoButton>
    <NeoButton text onclick={onClick} {icon}>Reversed</NeoButton>
    <NeoButton text {loading} pulse onclick={onLoading}>Pulse</NeoButton>
    <NeoButton text coalesce onclick={onClick}>Coalesce</NeoButton>
    <NeoButton text skeleton={loading} onclick={onLoading}>Skeleton</NeoButton>
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
</style>
