<script lang="ts">
  import type { NeoSwitchButtonProps } from '~/buttons/neo-switch-button.model.js';

  import NeoSwitchButton from '~/buttons/NeoSwitchButton.svelte';

  type HarnessProps = Partial<NeoSwitchButtonProps>;

  let { checked = $bindable(false), indeterminate = $bindable(false), ...rest }: HarnessProps = $props();
</script>

<NeoSwitchButton bind:checked bind:indeterminate {...rest} />
