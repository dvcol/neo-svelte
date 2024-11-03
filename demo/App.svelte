<script lang="ts">
  import '~/styles/reset.scss';
  import '~/styles/theme.scss';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';

  const onClick = (...args: any) => {
    console.info(...args);
  };

  let loading = $state(false);
  const onLoading = (...args: any) => {
    loading = !loading;
    setTimeout(() => {
      loading = !loading;
    }, 3000);
    onClick(...args);
  };
</script>

<div class="container">
  <div class="column">
    <div class="row">
      <NeoButton onclick={onClick}>Hello</NeoButton>
      <NeoButton onclick={onClick}>Goodbye</NeoButton>
      <NeoButton disabled onclick={onClick}>Disabled</NeoButton>
      <NeoButton {loading} onclick={onLoading}>Loading</NeoButton>
      <NeoButton onclick={onClick}>
        {#snippet icon()}
          <IconAccount />
        {/snippet}
        Icon
      </NeoButton>
      <NeoButton reverse onclick={onClick}>
        {#snippet icon()}
          <IconAccount />
        {/snippet}
        Icon
      </NeoButton>
      <NeoButton rounded onclick={onClick}>Rounded</NeoButton>
      <NeoButton coalesce text {loading} onclick={onLoading}>Text</NeoButton>
      <NeoButton pulse flat {loading} onclick={onLoading}>Flat</NeoButton>
    </div>

    <div class="row" style="gap: 5rem;">
      <NeoButton {loading} pulse rounded onclick={onLoading}>Pulse</NeoButton>
      <NeoButton coalesce rounded onclick={onClick}>Coalesce</NeoButton>
    </div>
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .container {
    @include flex.column;

    padding: 1rem;
  }

  .column {
    @include flex.column($center: true, $gap: var(--gap-lg));
  }

  .row {
    @include flex.row;
  }
</style>
