<script lang="ts">
  import '~/styles/reset.scss';
  import '~/styles/theme.scss';

  import DemoButtons from './components/DemoButtons.svelte';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconMoon from '~/icons/IconMoon.svelte';
  import IconSun from '~/icons/IconSun.svelte';

  let transitionIn = $state(false);
  let transitionOut = $state(false);
  const onTransition = () => {
    transitionOut = true;
    setTimeout(() => {
      transitionOut = false;
      transitionIn = true;

      setTimeout(() => {
        transitionIn = false;
      }, 750);
    }, 750);
  };

  let dark = $state(window.matchMedia('(prefers-color-scheme: dark)').matches);

  $effect(() => {
    if (dark) {
      document.documentElement.setAttribute('theme', 'dark');
    } else {
      document.documentElement.setAttribute('theme', 'light');
    }
  });
</script>

<div class="container">
  <div class="row">
    <NeoButton onclick={onTransition}>transition</NeoButton>
    <NeoButton toggle bind:checked={dark}>
      {#snippet icon()}
        {#if dark}
          <IconMoon />
        {:else}
          <IconSun />
        {/if}
      {/snippet}
      <span>{dark ? 'Dark' : 'Light'} Theme</span>
    </NeoButton>
  </div>

  <div class="row" class:transition-in={transitionIn} class:transition-out={transitionOut}>
    <DemoButtons />
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;
  @use 'src/lib/styles/common/flex' as flex;

  .row {
    @include flex.row($center: true, $gap: var(--gap-xl));
  }

  .container {
    @include flex.column($gap: var(--gap-xl));

    padding: 1rem;

    :global(.transition-out *),
    :global(.transition-out *::before),
    :global(.transition-out *::after) {
      box-shadow: var(--box-shadow-flat) !important;
      transition:
        all 0.5s ease,
        box-shadow 0.5s ease-in-out;
    }

    :global(.transition-in *),
    :global(.transition-in *::before),
    :global(.transition-in *::after) {
      transition:
        all 0.5s ease,
        box-shadow 0.5s ease-in-out;
    }

    :global(.rotate) {
      @include mixin.border-rotate;
    }

    :global(.progress) {
      @include mixin.border-progress;
    }
  }
</style>
