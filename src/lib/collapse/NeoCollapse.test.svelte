<script lang="ts">
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';

  type CollapseInstance = ReturnType<typeof NeoCollapse>;

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
    ref = $bindable<HTMLElement | undefined>(undefined),
    triggerRef = $bindable<HTMLElement | undefined>(undefined),
    instance = $bindable<CollapseInstance | undefined>(undefined),
    onInstance,
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
    ref?: HTMLElement;
    triggerRef?: HTMLElement;
    instance?: CollapseInstance;
    onInstance?: (instance: CollapseInstance | undefined) => void;
  } = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoCollapse
  bind:this={instance}
  bind:ref
  bind:triggerRef
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
