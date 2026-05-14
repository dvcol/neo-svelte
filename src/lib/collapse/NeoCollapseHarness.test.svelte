<script lang="ts">
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';

  let {
    open = $bindable(false),
    label,
    description,
    horizontal,
    disabled,
    readonly,
    standalone,
    divider,
    unmountOnClose,
    fade,
    content = 'collapse-content',
  }: {
    open?: boolean;
    label?: string;
    description?: string;
    horizontal?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    standalone?: boolean;
    divider?: boolean;
    unmountOnClose?: boolean;
    fade?: boolean;
    content?: string;
  } = $props();
</script>

<NeoCollapse
  bind:open
  {label}
  {description}
  {horizontal}
  {disabled}
  {readonly}
  {standalone}
  {divider}
  {unmountOnClose}
  {fade}
>
  <span data-testid="collapse-content">{content}</span>
</NeoCollapse>
