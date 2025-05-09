<script lang="ts">
  import type { NeoMenuItem } from '~/floating/menu/neo-menu-list-item.model.js';
  import type { NeoTabContext, NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';
  import type { NeoTabsRowProps } from '~/nav/neo-tabs-row.model.js';

  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { watch } from '@dvcol/svelte-utils/watch';
  import { tick } from 'svelte';
  import { innerHeight, innerWidth } from 'svelte/reactivity/window';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoMenu from '~/floating/menu/NeoMenu.svelte';
  import NeoIconBouncingDots from '~/icons/NeoIconBouncingDots.svelte';
  import { isTabRowDivider, tabRowItemToMenuItem } from '~/nav/neo-tabs-row.model.js';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabDivider from '~/nav/NeoTabDivider.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';
  import { Logger } from '~/utils/logger.utils.js';

  let {
    // Snippets
    children: innerChildren,
    collapsed,

    // State
    items: tabs = [],
    threshold = $bindable(0),

    // Tabs props
    ref = $bindable(),
    active = $bindable(),
    value = $bindable(),
    offsetWidth = $bindable(),
    offsetHeight = $bindable(),
    vertical,

    // Button props
    hovered = $bindable(false),
    focused = $bindable(false),

    // Other props
    menuProps,
    iconProps,
    tabProps,
    collapseProps,
    ...rest
  }: NeoTabsRowProps = $props();

  const visible = $derived(threshold ? tabs?.slice(0, -threshold) : tabs);
  const hidden = $derived(threshold ? tabs?.slice(-threshold) : []);
  const items = $derived(
    hidden?.map((t, i, arr) => tabRowItemToMenuItem(t, arr[i + 1]))
      .filter(Boolean) as NeoMenuItem[],
  );

  const isOverflown = (el?: Element) => {
    if (!el || !tabs?.length) return false;
    if (vertical) return el.scrollHeight > el.clientHeight;
    return el.scrollWidth > el.clientWidth;
  };

  let instance = $state<{ context: NeoTabContext }>();
  let menu = $state<HTMLElement>();

  const unregister = () => {
    if (!instance?.context) return;
    items?.forEach((item) => {
      if (item?.id === undefined) return;
      instance?.context.remove(item.id, false);
    });
  };

  const register = debounce(() => {
    if (!instance?.context) return;
    items.forEach((item) => {
      if (item?.id === undefined) return Logger.warn('Missing tab id, cannot register collapse menu item', item);
      instance?.context.register(item.id, { ref: menu, value: item.value });
    });
  }, 0);

  watch(
    () => {
      void register();
    },
    () => [
      instance?.context,
      visible,
      items,
    ],
  );

  const onSelect = (item: NeoMenuItem, ctx: NeoTabContext) => {
    if (item?.id === undefined) return;
    ctx.onChange(item.id);
  };

  const activeMenu = $derived(items.some(t => t.id === active));

  const autoSize = async (el = ref?.firstElementChild) => {
    threshold = 0;
    await tick();
    if (!el || !tabs?.length) return;
    while (threshold < tabs.length && isOverflown(el)) {
      threshold += 1;
      await tick();
    }
  };

  watch(
    () => {
      void autoSize();
      return unregister;
    },
    () => [
      vertical,
      offsetWidth,
      offsetHeight,
      innerWidth.current,
      innerHeight.current,
    ],
  );
</script>

<NeoTabs bind:this={instance} bind:ref bind:active bind:value bind:offsetWidth bind:offsetHeight nowrap {vertical} {...rest}>
  {#snippet children(ctx: NeoTabsContext, context: NeoTabContext)}

    {@render innerChildren?.(ctx, { items, threshold, menuProps, collapseProps, iconProps })}

    {#each visible as _props, index ((isTabRowDivider(_props) ? _props.id : _props.tabId) ?? index)}
      {#if (isTabRowDivider(_props))}
        <NeoTabDivider vertical={!vertical} {..._props} />
      {:else}
        <NeoTab {...tabProps} {..._props} />
      {/if}
    {/each}

    {#if items?.length && collapsed}
      {@render collapsed(ctx, { items, threshold, menuProps, collapseProps, iconProps })}
    {:else if items?.length}
      <div bind:this={menu} class="neo-tab neo-tabs-row-collapse" class:neo-vertical={vertical} class:neo-active={activeMenu}>
        <NeoMenu {items} onSelect={item => onSelect(item, context)} {...menuProps}>
          <NeoButton
            bind:hovered
            bind:focused
            toggle
            checked={activeMenu}
            disabled={rest.disabled}
            {...collapseProps}
            class={['neo-tab-button', collapseProps?.class]}
          >
            {#snippet icon()}
              <NeoIconBouncingDots bounce={hovered || focused} {...iconProps} />
            {/snippet}
          </NeoButton>
        </NeoMenu>
      </div>
    {/if}
  {/snippet}
</NeoTabs>

<style lang="scss">
  .neo-tabs-row-collapse {
    display: inline-flex;

    &.neo-vertical {
      width: 100%;
    }

    :global(> .neo-tooltip-trigger) {
      width: 100%;
      height: 100%;

      :global(svg) {
        margin-inline: 0.25rem;
      }
    }

  }
</style>
