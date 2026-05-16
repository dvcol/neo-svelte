<script lang="ts">
  import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';

  import NeoInput from '~/inputs/common/NeoInput.svelte';

  type InputInstance = ReturnType<typeof NeoInput>;

  type HarnessProps = Partial<NeoInputProps> & {
    instance?: InputInstance;
    onInstance?: (instance: InputInstance | undefined) => void;
  };

  let {
    ref = $bindable(),
    value = $bindable(),
    files = $bindable(),
    group = $bindable(),
    checked = $bindable(),
    indeterminate = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    focusin = $bindable(false),
    instance = $bindable<InputInstance | undefined>(undefined),
    onInstance,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoInput
  bind:this={instance}
  bind:ref
  bind:value
  bind:files
  bind:group
  bind:checked
  bind:indeterminate
  bind:valid
  bind:dirty
  bind:touched
  bind:hovered
  bind:focused
  bind:focusin
  {...rest}
/>
