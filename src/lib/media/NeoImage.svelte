<script lang="ts">
  import type { NeoImageProps } from '~/media/neo-image.model.js';

  import NeoIconImage from '~/icons/NeoIconImage.svelte';
  import { computeBorderRadius } from '~/utils/border.utils.js';
  import { Logger } from '~/utils/logger.utils.js';
  import { toSize } from '~/utils/style.utils.js';

  let {
    // State
    ref = $bindable(),
    src = $bindable(),
    fallback,
    alt,
    error = $bindable(false),
    loaded = $bindable(false),
    skeleton,

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

  $inspect(containerProps);

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  const onError: NeoImageProps['onerror'] = (e) => {
    onerror?.(e);
    error = true;
    Logger.error('Image failed to load', e);
    if (!ref || !fallback || src === fallback || e.defaultPrevented) return;
    src = fallback;
  };

  const onLoad: NeoImageProps['onload'] = (e) => {
    loaded = true;
    onload?.(e);
  };

// TODO children fallback (render snippet if error)
  // TODO loading (when loading apply skeleton styles, then transition to image when loaded)
  // TODO replace MediaSkeleton from NeoMedia with inner component loading

</script>

<svelte:element
  this={tag}
  data-error={error}
  data-loaded={loaded}
  class:neo-image={true}
  class:neo-rounded={rounded}
  class:neo-skeleton={skeleton || (!loaded && !error)}
  class:neo-glass={glass}
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
  <span class="neo-image-icon">
    <NeoIconImage />
  </span>
  <img
    bind:this={ref}
    class:neo-image-img={true}
    class:neo-rounded={rounded}
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
      width: var(--neo-image-icon-size, 20%);
      height: var(--neo-image-icon-size, 20%);
      color: var(--neo-text-color-inverse);
      visibility: hidden;
      opacity: 0.75;
      transition: visibility 0.3s ease, opacity 0.3s ease;

      :global(> svg:only-child) {
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

    &.neo-glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
    }
  }
</style>
