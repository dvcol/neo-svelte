<script lang="ts">
  import '~/styles/reset.scss';
  import '~/styles/theme.scss';

  import DemoButtons from './components/DemoButtons.svelte';
</script>

<div class="container">
  <DemoButtons />
</div>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;
  @use 'src/lib/styles/common/flex' as flex;

  .container {
    @include flex.column;

    padding: 1rem;

    :global {
      .rotate {
        @include mixin.border-rotate;
      }

      .progress {
        @include mixin.border-progress;
      }
    }
  }
</style>
