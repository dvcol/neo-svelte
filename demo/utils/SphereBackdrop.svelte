<script lang="ts">
  import { useWatchMedia } from '@dvcol/svelte-utils/media';

  import type { Snippet } from 'svelte';

  const { children }: { children: Snippet } = $props();

  let ref = $state<HTMLElement | null>(null);

  const { matches } = useWatchMedia('(max-width: 1550px)');
  const vertical = $derived.by(matches);

  const width = $derived.by(() => {
    if (!ref?.clientWidth) return '200%';
    if (vertical) return `${ref?.clientWidth}px`;
    return `${ref?.clientWidth}px`;
  });
  const height = $derived.by(() => {
    if (!ref?.clientHeight) return '200%';
    if (vertical) return `${ref?.clientHeight}px`;
    return `${ref?.clientHeight}px`;
  });
</script>

<div bind:this={ref} class="sphere">
  <div class="sphere-before" style={`--translate:${width}; --translate-y:${height}`}></div>
  {@render children?.()}
  <div class="sphere-after" style={`--translate:-${width}; --translate-y:-${height}`}></div>
</div>

<style lang="scss">
  @keyframes sphere {
    20% {
      transform: scale(1) translateX(var(--translate)) translateY(0);
    }

    40% {
      transform: scale(0.5) translateX(var(--translate)) translateY(var(--translate-y));
    }

    60% {
      transform: scale(1) translateY(var(--translate-y));
    }

    80% {
      transform: scale(0) translateX(0) translateY(0);
    }
  }

  .sphere {
    position: relative;
    display: flex;
    flex-direction: column;

    &-before,
    &-after {
      position: absolute;
      z-index: -1;
      display: flex;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      transform: scale(0) translateX(0) translateY(0);
      animation: sphere 30s infinite;
      will-change: transform;
    }

    &-before {
      top: -0.75rem;
      left: -0.5rem;
      background: linear-gradient(rgb(255 0 0 / 50%), rgb(255 47 0 / 50%));
    }

    &-after {
      right: -0.5rem;
      bottom: -0.75rem;
      background: linear-gradient(rgb(32 0 128 / 50%), rgb(0 0 255 / 50%));
    }
  }
</style>
