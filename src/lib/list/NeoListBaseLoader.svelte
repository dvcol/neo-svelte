<script lang="ts">
  import { clamp, randomInt } from '@dvcol/common-utils/common/math';
  import { circIn } from 'svelte/easing';

  import { scale } from 'svelte/transition';

  import type { NeoListBaseLoaderProps } from '~/list/neo-list-base-loader.model.js';

  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';

  import { scaleTransitionProps } from '~/utils/transition.utils.js';

  const {
    loading,
    select,
    before,
    after,
    checkmark = select,

    lines = 1,
    items = 3,
    flex = items > 1 ? undefined : '0 0 70%',

    transition,

    beforeProps,
    afterProps,
    ...rest
  }: NeoListBaseLoaderProps = $props();

  const transitionFn = $derived(toTransition(transition, scale));
  const transitionProps = $derived(toTransitionProps(transition, scaleTransitionProps));
</script>

{#each { length: items } as _, i (i)}
  {#if loading}
    <div
      class="neo-list-base-loader"
      class:neo-select={select}
      in:transitionFn={{ ...transitionProps, delay: Math.min(300 + circIn(clamp(i / 10, 0, 1)) * 2000, 600) }}
      out:transitionFn={{ ...transitionProps, delay: Math.min(circIn(clamp((items - i) / 10, 0, 1)) * 2000, 600) }}
    >
      <div class="neo-list-base-loader-content">
        {#if before}
          {@const { width, height, ...bProps } = beforeProps ?? {}}
          <div class="neo-list-base-loader-before-skeleton" style:width style:height {...bProps}>
            <!--  Checkmark placeholder  -->
          </div>
        {/if}

        <NeoSkeletonText flex={flex ?? `0 1 ${randomInt(40, 80)}%`} {lines} {...rest} class={['neo-list-loader-skeleton', rest?.class]} />

        {#if after}
          {@const { width, height, ...aProps } = afterProps ?? {}}
          <div class="neo-list-base-loader-after-skeleton" style:width style:height {...aProps}>
            <!--  Checkmark placeholder  -->
          </div>
        {/if}
      </div>

      {#if checkmark}
        <div class:neo-list-base-loader-checkmark-skeleton={true}>
          <!--  Checkmark placeholder  -->
        </div>
      {/if}
    </div>
  {/if}
{/each}

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-list-base-loader {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;

    &-content {
      display: inline-flex;
      flex: 1 1 auto;
      gap: var(--neo-gap-xxs, 0.5rem);
      align-items: center;
      padding: 0.125rem 0.5rem;

      :global(.neo-list-loader-skeleton .neo-skeleton-text-paragraph) {
        gap: 0.25rem;
      }
    }

    &-after-skeleton,
    &-before-skeleton,
    &-checkmark-skeleton {
      flex: 0 0 auto;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;

      @include mixin.skeleton;
    }

    &-after-skeleton {
      margin-left: auto;
    }

    &-checkmark-skeleton {
      margin-inline-end: 0.4375rem;
    }

    &.neo-select {
      padding-inline: 0.125rem;
    }
  }
</style>
