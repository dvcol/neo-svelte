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

    lines = 1,
    items = 3,
    flex = items > 1 ? undefined : '0 0 70%',

    transition,

    ...rest
  }: NeoListBaseLoaderProps = $props();

  const transitionFn = $derived(toTransition(transition, scale));
  const transitionProps = $derived(toTransitionProps(transition, scaleTransitionProps));
</script>

{#each { length: items } as _, i (i)}
  {#if loading}
    <div
      class="neo-list-base-loader"
      in:transitionFn={{ ...transitionProps, delay: Math.min(300 + circIn(clamp(i / 10, 0, 1)) * 2000, 600) }}
      out:transitionFn={{ ...transitionProps, delay: Math.min(circIn(clamp((items - i) / 10, 0, 1)) * 2000, 600) }}
    >
      <NeoSkeletonText flex={flex ?? `0 0 ${randomInt(40, 80)}%`} {lines} {...rest} class={['neo-list-loader-skeleton', rest?.class]} />

      {#if select}
        <div class="neo-list-base-loader-checkmark-skeleton">
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
    padding: 0.125rem;

    &-checkmark-skeleton {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      margin-inline-end: 0.4375rem;
      margin-block-end: 0.125rem;

      @include mixin.skeleton;
    }
  }
</style>
