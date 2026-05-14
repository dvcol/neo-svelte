<script lang="ts">
  import type { NeoRadioButtonProps } from '~/buttons/neo-radio-button.model.js';

  import NeoRadioButton from '~/buttons/NeoRadioButton.svelte';

  type HarnessProps = Partial<NeoRadioButtonProps>;

  let { checked = $bindable(false), touched = $bindable(false), ...rest }: HarnessProps = $props();
</script>

<NeoRadioButton bind:checked bind:touched {...rest} />
