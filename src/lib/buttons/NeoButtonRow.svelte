<script lang="ts">
  import type { NeoButtonGroupContext } from '~/buttons/neo-button-group.model.js';
  import type { NeoButtonRowItem, NeoButtonRowProps } from '~/buttons/neo-button-row.model.js';
  import type { NeoMenuItem } from '~/floating/menu/neo-menu-list-item.model.js';

  import { watch } from '@dvcol/svelte-utils/watch';
  import { tick } from 'svelte';
  import { innerHeight, innerWidth } from 'svelte/reactivity/window';

  import { isButtonRowDivider } from '~/buttons/neo-button-row.model.js';
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoDivider from '~/divider/NeoDivider.svelte';
  import NeoMenu from '~/floating/menu/NeoMenu.svelte';
  import NeoIconBouncingDots from '~/icons/NeoIconBouncingDots.svelte';

  let {
    // Snippets
    children: innerChildren,
    collapsed,

    // State
    items: buttons = [],
    threshold = $bindable(0),

    // Group props
    ref = $bindable(),
    offsetWidth = $bindable(),
    offsetHeight = $bindable(),

    // Button props
    hovered = $bindable(false),
    focused = $bindable(false),

    // Other props
    menuProps,
    iconProps,
    buttonProps,
    collapseProps,
    ...rest
  }: NeoButtonRowProps = $props();

  function buttonRowItemToMenuItem(item: NeoButtonRowItem, next?: NeoButtonRowItem): NeoMenuItem | undefined {
    if (isButtonRowDivider(item)) return;
    return {
      id: item.id?.toString(),
      label: item.label,
      value: item.value,
      before: item.icon,
      reverse: item.reverse,
      disabled: item.disabled,
      readonly: item.readonly,
      color: item.color || undefined,
      href: item.href,
      onclick: item.onclick,
      divider: {
        bottom: next && isButtonRowDivider(next),
      },
      ...(item.menuProps ?? {}),
    };
  }

  const visible = $derived(threshold ? buttons?.slice(0, -threshold) : buttons);
  const hidden = $derived(threshold ? buttons?.slice(-threshold) : []);
  const items = $derived(
    hidden?.map((t, i, arr) => buttonRowItemToMenuItem(t, arr[i + 1]))
      .filter(Boolean) as NeoMenuItem[],
  );

  const isOverflown = (el?: Element) => {
    if (!el || !buttons?.length) return false;
    if (rest.vertical) return el.scrollHeight > el.clientHeight;
    return el.scrollWidth > el.clientWidth;
  };

  const autoSize = async (el = ref) => {
    threshold = 0;
    await tick();
    if (!el || !buttons?.length) return;
    while (threshold < buttons.length && isOverflown(el)) {
      threshold += 1;
      await tick();
    }
  };

  watch(
    () => {
      void autoSize();
    },
    () => [
      rest.vertical,
      offsetWidth,
      offsetHeight,
      innerWidth.current,
      innerHeight.current,
    ],
  );
</script>

<NeoButtonGroup bind:ref bind:offsetWidth bind:offsetHeight nowrap {...rest}>
  {#snippet children(ctx: NeoButtonGroupContext)}
    {@render innerChildren?.(ctx, { items, threshold, menuProps, collapseProps, iconProps })}

    {#each visible as _props, index (_props.id ?? index)}
      {#if (isButtonRowDivider(_props))}
        <NeoDivider vertical={!rest.vertical} {..._props} />
      {:else}
        <NeoButton {...buttonProps} {..._props} />
      {/if}
    {/each}

    {#if items?.length && collapsed}
      {@render collapsed(ctx, { items, threshold, menuProps, collapseProps, iconProps })}
    {:else if items?.length}
      <div class="neo-button-row-collapse">
        <NeoMenu {items} openOnClick {...menuProps}>
          <NeoButton bind:hovered bind:focused {...collapseProps}>
            {#snippet icon()}
              <NeoIconBouncingDots bounce={hovered || focused} {...iconProps} />
            {/snippet}
          </NeoButton>
        </NeoMenu>
      </div>
    {/if}
  {/snippet}
</NeoButtonGroup>

<style lang="scss">
  .neo-button-row-collapse {
    display: contents;

    :global(> .neo-tooltip-trigger) {
      width: 100%;
      height: 100%;

      :global(svg) {
        margin-inline: 0.25rem;
      }
    }
  }
</style>
