<script lang="ts">
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';
  import NeoCollapseGroup from '~/collapse/NeoCollapseGroup.svelte';

  const {
    sections = [],
    min,
    max,
    disabled,
    readonly,
  }: {
    sections?: { id: string; label: string; open?: boolean }[];
    min?: number;
    max?: number;
    disabled?: boolean;
    readonly?: boolean;
  } = $props();
</script>

<NeoCollapseGroup {min} {max} {disabled} {readonly}>
  {#each sections as section (section.id)}
    <NeoCollapse id={section.id} label={section.label} open={section.open} unmountOnClose={false}>
      <span data-testid="collapse-content-{section.id}">{section.label} content</span>
    </NeoCollapse>
  {/each}
</NeoCollapseGroup>
