<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoSelectProps } from '~/inputs/neo-select.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconDoubleChevron from '~/icons/IconDoubleChevron.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { coerce, computeButtonShadows, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    icon: customIcon,

    // State
    ref = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    focusin = $bindable(false),
    type = 'select',
    options = [],
    multiple,
    floating,

    // Other props
    containerRef = $bindable(),
    wrapperRef = $bindable(),
    labelRef = $bindable(),
    buttonProps,
    ...rest
  }: NeoSelectProps = $props();
  /* eslint-enable prefer-const */

  const elevation = $derived(coerce(rest?.elevation ?? getDefaultElevation(rest?.pressed)));
  const text = $derived(elevation >= 0 || !rest.pressed);
  const style = $derived(computeButtonShadows(elevation, text));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle select dropdown',
    title: 'Toggle select dropdown',
    skeleton: rest.skeleton,
    disabled: rest.disabled,
    rounded: rest.rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    onclick: () => {
      ref?.focus?.();
      ref?.click?.();
      ref?.showPicker?.();
    },
    ...buttonProps,
    class: ['neo-select-toggle', buttonProps?.class],
  });

  let space = $state(7);
  const onpointerdown = () => {
    space = 6;
  };

  let timeout: ReturnType<typeof setTimeout>;
  const onpointerup = async () => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      space = 8;
      await wait(300);
      space = 7;
    }, 200);
  };
</script>

{#snippet after()}
  <NeoButton {onpointerdown} {onpointerup} {...afterProps}>
    {#snippet icon()}
      {#if customIcon}
        {@render customIcon()}
      {:else}
        <IconDoubleChevron {space} />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

{#snippet content()}
  {#each options as { label, ...option }}
    <option {...option} value={option.value}>{label ?? option.value}</option>
  {/each}
  {@render children?.()}
{/snippet}

<NeoInput
  bind:ref
  bind:containerRef
  bind:wrapperRef
  bind:labelRef
  bind:value
  bind:dirty
  bind:valid
  bind:touched
  bind:hovered
  bind:focused
  bind:focusin
  {type}
  {multiple}
  floating={multiple ? false : floating}
  after={multiple ? undefined : after}
  children={options?.length ? content : children}
  {onpointerdown}
  {onpointerup}
  {...rest}
/>
