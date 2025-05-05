<script lang="ts">
  import type { NeoSourceSelectorProps } from '~/providers/neo-source-selector.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoIconSun from '~/icons/NeoIconSun.svelte';
  import { useNeoThemeContext } from '~/providers/neo-theme-provider-context.svelte.js';
  import { NeoSource } from '~/providers/neo-theme-provider.model.js';

  const {
    // state
    label = 'Source',

    // Button props
    ref = $bindable(),
    hovered = $bindable(false),
    focused = $bindable(false),

    // Other props
    ...rest
  }: NeoSourceSelectorProps = $props();

  const context = useNeoThemeContext();

  const source = $derived(context.source);

  const sources = Object.values(NeoSource);
  const sourceMap = { ...sources };
  const sourceIndexMap = Object.fromEntries(Object.entries(sourceMap).map(([k, v]) => [v, Number(k)]));

  let angle = $state(sourceIndexMap[context.source] * 90);
  const onCycleSource = () => {
    angle += 90;
    context.update({ source: sourceMap[(sourceIndexMap[source] + 1) % sources.length] });
  };

</script>

<NeoButton
  aria-label="Cycle light source origin"
  title="Cycle light source origin"
  checked
  onclick={onCycleSource}
  {label}
  {...rest}
>
  {#snippet icon()}
    <span class="neo-source-icon" style:--neo-source-rotate="{angle}deg">
      <NeoIconSun />
    </span>
  {/snippet}
</NeoButton>

<style lang="scss">
  .neo-source-icon {
    overflow: hidden;
    border-radius: var(--neo-theme-selector-border-radius, var(--neo-border-radius-xxl));
    rotate: var(--neo-source-rotate, 0);
    transition: rotate 0.5s ease;

    :global(> svg) {
      width: 1.25rem;
      height: 1.25rem;
      translate: -30% -30%;
    }
  }
</style>
