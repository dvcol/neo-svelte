<script lang="ts">
  import type { NeoImageProps } from '~/media/neo-image.model.js';

  import { onMount } from 'svelte';

  import NeoIconImage from '~/icons/NeoIconImage.svelte';
  import NeoIconInfo from '~/icons/NeoIconWarning.svelte';
  import { computeBorderRadius } from '~/utils/border.utils.js';
  import { Logger } from '~/utils/logger.utils.js';
  import { toSize } from '~/utils/style.utils.js';

  let {
    // Snippet
    children,

    // State
    ref = $bindable(),
    src = $bindable(),
    fallback,
    alt,
    error = $bindable(false),
    loaded = $bindable(false),
    skeleton,
    delay = 0,
    showAltText,

    // Styles
    rounded,
    glass,

    // Size
    width: _width,
    height: _height,
    ratio,
    flex,
    fit,

    // Events
    onerror,
    onload,

    // Other props
    containerProps: _containerProps = {},
    ...rest
  }: NeoImageProps = $props();

  const { tag = 'div', ...containerProps } = $derived(_containerProps);

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  let ready = $state(delay === null);
  const loading = $derived(ready && !loaded && !error);

  onMount(() => {
    if (ready) return;
    if (!delay) return ready = true;
    setTimeout(() => {
      ready = true;
    }, delay);
  });

  const onError: NeoImageProps['onerror'] = (e) => {
    onerror?.(e);
    error = true;
    Logger.error('Image failed to load', e);
    if (!ref || !fallback || src === fallback || e.defaultPrevented) return;
    src = fallback;
  };

  const onLoad: NeoImageProps['onload'] = (e) => {
    loaded = true;
    error = false;
    onload?.(e);
  };
</script>

<svelte:element
  this={tag}
  data-error={error}
  data-loaded={loaded}
  data-fallback={(error && src === fallback)}
  data-src={(error && src === fallback) ? src : undefined}
  class:neo-image={true}
  class:neo-rounded={rounded}
  class:neo-skeleton={skeleton || loading}
  class:neo-glass={glass}
  class:neo-error={error}
  style:flex
  style:width={width?.absolute}
  style:min-width={width?.min}
  style:max-width={width?.max}
  style:height={height?.absolute}
  style:min-height={height?.min}
  style:max-height={height?.max}
  style:aspect-ratio={ratio}
  style:--neo-image-border-radius={computeBorderRadius(rounded)}
  {...containerProps}
>
  <div class="neo-image-icon">
    {#if error}
      <NeoIconInfo />
      {@render children?.()}
    {:else}
      <NeoIconImage delay={0.3} />
    {/if}
  </div>
  <img
    bind:this={ref}
    class:neo-image-img={true}
    class:neo-rounded={rounded}
    class:neo-alt-text={showAltText}
    {src}
    {alt}
    loading="lazy"
    decoding="auto"
    style:object-fit={fit}
    onerror={onError}
    onload={onLoad}
    {...rest}
  />
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-image,
  .neo-image-img {
    width: 100%;
    height: 100%;
    border-radius: var(--neo-image-border-radius, var(--neo-border-radius, 0.5rem));
    transition:
            border-radius 0.3s ease,
            color  0.3s ease,
            background-color  0.5s ease,
            border-color 0.5s ease,
            opacity  0.5s ease;

    &.neo-rounded {
      border-radius: var(--neo-image-border-radius, var(--neo-border-radius-xxl));
    }
  }

  .neo-image {
    position: relative;
    background-color: transparent;
    visibility: visible;

    &-icon {
      position: absolute;
      top: calc(50% - var(--neo-image-icon-size, 20%) / 2);
      left: calc(50% - var(--neo-image-icon-size, 20%) / 2);
      display: flex;
      flex-direction: column;
      gap: var(--neo-gap-xxs, 0.5rem);
      align-items: center;
      justify-content: center;
      width: var(--neo-image-icon-size, 20%);
      height: var(--neo-image-icon-size, 20%);
      color: var(--neo-text-color-inverse);
      visibility: hidden;
      opacity: 0.75;
      transition: visibility 0.3s ease, opacity 0.3s ease;

      :global(> svg) {
        width: 100%;
        height: 100%;
      }
    }

    &.neo-skeleton {
      @include mixin.skeleton($content: false);

      .neo-image-img {
        visibility: hidden;
        opacity: 0;
      }

      .neo-image-icon {
        visibility: visible;
      }
    }

    &.neo-error {
      background-color: var(--neo-image-error-bg, color-mix(in srgb, var(--neo-skeleton-color) 75%, var(--neo-dark-color-error-75)));

      .neo-image-img:not(.neo-alt-text) {
        align-content: flex-end;
        opacity: 0;

        &[alt] {
          width: 1px;
          height: 1px;
          overflow: hidden;
        }

        &:not([alt]) {
          display: none;
          width: 0;
          height: 0;
        }
      }

      .neo-image-icon {
        visibility: visible;
      }
    }

    &.neo-glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
    }
  }
</style>
