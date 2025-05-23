<script lang="ts">
  import type { NeoImageProps } from '~/media/neo-image.model.js';

  import { Logger } from '~/utils/logger.utils.js';
  import { toSize } from '~/utils/style.utils.js';

  let {
    ref = $bindable(),
    src = $bindable(),
    fallback,
    alt,
    error = $bindable(false),
    loaded = $bindable(false),

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
    ...rest
  }: NeoImageProps = $props();

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
  // TODO loading (skeleton && render snippet if loading & opacity 0 on IMG)
  // TODO gracefull fade-in betwwen loading/img/fallback
  // TODO border/shadow to NeoImage
  // TODO move away from use: to {@attach ...}

</script>

<img
  class="neo-image"
  bind:this={ref}
  {src}
  {alt}
  loading="lazy"
  decoding="async"
  style:flex
  style:width={width?.absolute}
  style:min-width={width?.min}
  style:max-width={width?.max}
  style:height={height?.absolute}
  style:min-height={height?.min}
  style:max-height={height?.max}
  style:aspect-ratio={ratio}
  style:object-fit={fit}
  onerror={onError}
  onload={onLoad}
  {...rest}
/>

<style lang="scss">
  .neo-image {
    width: 100%;
    height: 100%;
    border-radius: var(--neo-imgage-border-radius, var(--neo-border-radius, 0.5rem));
  }
</style>
