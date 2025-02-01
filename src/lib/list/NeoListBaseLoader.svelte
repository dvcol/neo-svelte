<script lang="ts">
  import { clamp, randomInt } from '@dvcol/common-utils/common/math';
  import { circIn, circOut } from 'svelte/easing';

  import { fade } from 'svelte/transition';

  import type { NeoListBaseLoaderProps } from '~/list/neo-list-base-loader.model.js';

  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';

  import { scaleEnterProps, scaleLeaveProps } from '~/utils/transition.utils.js';

  const {
    loading,
    select,
    before,
    after,
    checkmark = select,
    description,

    lines = description ? 2 : 1,
    items = 3,
    flex = items > 1 ? undefined : '0 0 70%',

    in: inAction = { use: fade, props: scaleEnterProps },
    out: outAction = { use: fade, props: scaleLeaveProps },

    beforeProps,
    afterProps,
    ...rest
  }: NeoListBaseLoaderProps = $props();

  const inFn = $derived(toTransition(inAction));
  const inProps = $derived(toTransitionProps(inAction));
  const outFn = $derived(toTransition(outAction));
  const outProps = $derived(toTransitionProps(outAction));
</script>

{#each { length: items } as _, i (i)}
  {#if loading}
    <div
      class="neo-list-base-loader"
      class:neo-select={select}
      in:inFn={{ ...inProps, delay: Math.min((inProps?.duration ?? 0) + circIn(clamp(i / 10, 0, 1)) * 2000, 400) }}
      out:outFn={{ ...outProps, delay: Math.min(circOut(clamp((items - i) / 10, 0, 1)) * 200, 400) }}
    >
      <div class="neo-list-base-loader-content" class:neo-description={description}>
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

      :global(.neo-skeleton-text-line) {
        --neo-skeleton-text-line-height: var(--neo-line-height-sm, 1.25rem);
      }

      &.neo-description {
        gap: var(--neo-gap-xs, 0.625rem);

        :global(.neo-skeleton-text-line:nth-child(2n)) {
          --neo-skeleton-text-font-size: var(--neo-font-size-sm, 0.875rem);
          --neo-skeleton-text-line-height: var(--neo-line-height-sm, 1.25rem);
        }
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
