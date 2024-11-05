<script lang="ts">
  import '~/styles/reset.scss';
  import '~/styles/theme.scss';

  import DemoButtons from './components/DemoButtons.svelte';

  import NeoButton from '~/buttons/NeoButton.svelte';

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
</script>

<NeoButton onclick={onTransition}>transition</NeoButton>
<div class="container" class:transition-in={transitionIn} class:transition-out={transitionOut}>
  <DemoButtons />
</div>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;
  @use 'src/lib/styles/common/flex' as flex;

  .container {
    @include flex.column;

    padding: 1rem;

    &:global(.transition-out *),
    &:global(.transition-out *::before),
    &:global(.transition-out *::after) {
      box-shadow: var(--box-shadow-flat) !important;
      transition:
        all 0.5s ease,
        box-shadow 0.5s ease-in-out;
    }

    &:global(.transition-in *),
    &:global(.transition-in *::before),
    &:global(.transition-in *::after) {
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
