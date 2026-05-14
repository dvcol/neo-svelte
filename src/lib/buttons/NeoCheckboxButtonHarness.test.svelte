<script lang="ts">
  import type { NeoCheckboxButtonProps } from '~/buttons/neo-checkbox-button.model.js';

  import NeoCheckboxButton from '~/buttons/NeoCheckboxButton.svelte';

  type HarnessProps = Partial<NeoCheckboxButtonProps>;

  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    touched = $bindable(false),
    ...rest
  }: HarnessProps = $props();
</script>

<NeoCheckboxButton bind:checked bind:indeterminate bind:touched {...rest} />
