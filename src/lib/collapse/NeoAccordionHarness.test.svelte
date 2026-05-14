<script lang="ts">
  import NeoAccordion from '~/collapse/NeoAccordion.svelte';
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';

  const {
    sections = [],
    horizontal,
    disabled,
    readonly,
    segmented,
    borderless,
    rounded,
    glass,
    group,
  }: {
    sections?: { id: string; label: string }[];
    horizontal?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    segmented?: boolean;
    borderless?: boolean;
    rounded?: boolean;
    glass?: boolean;
    group?: { min?: number; max?: number };
  } = $props();
</script>

<NeoAccordion
  {horizontal}
  {disabled}
  {readonly}
  {segmented}
  {borderless}
  {rounded}
  {glass}
  {group}
>
  {#each sections as section (section.id)}
    <NeoCollapse id={section.id} label={section.label} unmountOnClose={false}>
      <span data-testid="content-{section.id}">{section.label}</span>
    </NeoCollapse>
  {/each}
</NeoAccordion>
