<script lang="ts">
  import type { Snippet } from 'svelte';

  const { children }: { children: Snippet } = $props();

  let ref = $state<HTMLElement | null>(null);
  const width = $derived(ref?.clientWidth ? `${ref?.clientWidth}px` : '200%');
  const height = $derived(ref?.clientHeight ? `${ref?.clientHeight}px` : '100%');

  $inspect(height);
</script>

<div bind:this={ref} class="sphere">
  <div class="sphere-before" style={`--translate:${width}; --translate-y:${height}`}></div>
  {@render children?.()}
  <div class="sphere-after" style={`--translate:-${width}; --translate-y:-${height}`}></div>
</div>

<style lang="scss">
  @keyframes sphere {
    20% {
      transform: scale(1);
      translate: var(--translate);
    }

    40% {
      transform: scale(0.5) translateY(var(--translate-y));
      translate: var(--translate);
    }

    60% {
      transform: scale(1) translateY(var(--translate-y));
    }

    80% {
      transform: scale(0);
      translate: 0;
    }
  }

  .sphere {
    position: relative;

    &-before,
    &-after {
      position: absolute;
      z-index: -1;
      display: flex;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      transform: scale(0);
      animation: sphere 30s infinite;
      translate: 0;
    }

    &-before {
      top: -30%;
      left: -20%;
      background: linear-gradient(rgb(255 0 0 / 50%), rgb(255 47 0 / 50%));
    }

    &-after {
      right: -20%;
      bottom: -30%;
      background: linear-gradient(rgb(32 0 128 / 50%), rgb(0 0 255 / 50%));
    }
  }
</style>
