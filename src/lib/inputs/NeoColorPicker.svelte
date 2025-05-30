<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoColorPickerProps } from '~/inputs/neo-color-picker.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoIconPaint from '~/icons/NeoIconPaint.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoColorPickerSelector from '~/inputs/NeoColorPickerSelector.svelte';
  import NeoImage from '~/media/NeoImage.svelte';
  import { HexColorRegexString } from '~/utils/regex.utils.js';
  import { coerce, computeButtonTemplate, getDefaultElevation } from '~/utils/shadow.utils.js';

  let {
    // Snippets
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
    placeholder = 'Pick a color',
    pattern = HexColorRegexString,
    minlength = 7,
    maxlength = 7,

    // Other props
    containerRef = $bindable(),
    validationRef = $bindable(),
    labelRef = $bindable(),
    buttonProps,
    pickerRef = $bindable(),
    pickerProps,
    ...rest
  }: NeoColorPickerProps = $props();

  const onclick: NeoButtonProps['onclick'] = (e) => {
    pickerRef?.focus?.();
    pickerRef?.click?.();
    pickerRef?.showPicker?.();
    buttonProps?.onclick?.(e);
  };

  const elevation = $derived(coerce(rest?.elevation ?? getDefaultElevation(rest?.pressed)));
  const template = $derived(computeButtonTemplate(elevation, rest?.pressed, rest?.glass));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle picker',
    'title': 'Toggle picker',
    'skeleton': rest.skeleton,
    'disabled': rest.disabled,
    'rounded': rest.rounded,
    'start': rest.start,
    ...template,
    ...buttonProps,
    onclick,
  });

  const oninput: FormEventHandler<HTMLInputElement> = (e) => {
    ref?.dispatchEvent(new InputEvent(e.type, e));
    pickerProps?.oninput?.(e);
  };

  const onchange: FormEventHandler<HTMLInputElement> = (e) => {
    ref?.dispatchEvent(new InputEvent(e.type, e));
    pickerProps?.onchange?.(e);
  };

  const labelId = $derived(rest?.label ? `neo-color-picker-label-${getUUID()}` : undefined);
</script>

{#snippet before()}
  <NeoColorPickerSelector
    bind:ref={pickerRef}
    bind:value
    aria-labelledby={labelId}
    height="100%"
    rounded={rest.rounded}
    disabled={rest.disabled}
    readonly={rest.readonly}
    {oninput}
    {onchange}
    {...pickerProps}
  />
{/snippet}

{#snippet after()}
  <NeoButton {...afterProps}>
    {#snippet icon(ctx)}
      {#if typeof customIcon === 'function'}
        {@render customIcon(ctx)}
      {:else if typeof customIcon === 'string'}
        <NeoImage src={customIcon} ratio="1/1" {...afterProps?.imageProps} />
      {:else}
        <NeoIconPaint size="1.25rem" scale="var(--neo-input-icon-scale, 1.125)" />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

<NeoInput
  bind:ref
  bind:containerRef
  bind:validationRef
  bind:labelRef
  bind:value
  bind:valid
  bind:dirty
  bind:touched
  bind:hovered
  bind:focused
  bind:focusin
  type="text"
  {placeholder}
  {before}
  {after}
  {pattern}
  {minlength}
  {maxlength}
  {...rest}
  labelProps={{ id: labelId, ...rest.labelProps }}
/>
