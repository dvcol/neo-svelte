<script lang="ts">
  import type { NeoEllipsisProps } from '~/text/neo-ellipsis.model.js';

  const {
    // Snippets
    children,

    // States
    value,
    lines,

    // Other props
    ...rest
  }: NeoEllipsisProps = $props();
</script>

<span class:neo-ellipsis={true} style:--neo-ellipsis-lines={lines} {...rest}>
  {value}
  {@render children?.()}
</span>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-ellipsis {
    @include mixin.ellipsis;
  }
</style>
