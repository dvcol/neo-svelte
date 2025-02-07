<script lang="ts">
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoPill from '~/pill/NeoPill.svelte';
  import NeoEllipsis from '~/text/NeoEllipsis.svelte';
  import NeoMark from '~/text/NeoMark.svelte';
  import NeoScrollShadow from '~/text/NeoScrollShadow.svelte';
  import { Colors } from '~/utils/colors.utils';

  let lines = $state(1);
  let filter = $state('');

  const options = $state({
    elevation: 0,
    hover: 0,

    color: '',
    close: false,
    loading: false,
    disabled: false,
    skeleton: false,

    borderless: false,
    rounded: true,
    glass: false,
  });

  const onElevation = () => {
    if (options.elevation + options.hover < -2) options.hover += 1;
    if (options.elevation + options.hover > 2) options.hover -= 1;
  };
</script>

<div class="row">
  <div class="column content">
    <span class="label">Ellipsis</span>
    <NeoNumberStep bind:value={lines} min={1} max={99} rounded />
    <NeoEllipsis {lines}>
      Lorem ipsum odor amet, consectetuer adipiscing elit. Malesuada pharetra ullamcorper eget hac; imperdiet a finibus hac. Sollicitudin tincidunt
      mauris eros ex pharetra imperdiet. Nibh facilisi ante vestibulum feugiat facilisi quam risus ex? Malesuada condimentum nulla odio facilisi
      semper sodales. Dapibus est duis odio tincidunt elementum. Sodales scelerisque venenatis hac ridiculus scelerisque massa vitae. Hendrerit
      blandit sed, ac cursus ante varius quam. Malesuada habitant curae diam pulvinar proin congue tristique dictum.
    </NeoEllipsis>
  </div>
</div>

<div class="row">
  <div class="column content">
    <span class="label">Mark</span>
    <NeoInput bind:value={filter} placeholder="Highlight text" rounded size="30" clearable />
    <NeoMark
      {filter}
      value="Lorem ipsum odor amet, consectetuer adipiscing elit. Malesuada pharetra ullamcorper eget hac; imperdiet a finibus hac. Sollicitudin tincidunt
      mauris eros ex pharetra imperdiet. Nibh facilisi ante vestibulum feugiat facilisi quam risus ex? Malesuada condimentum nulla odio facilisi
      semper sodales. Dapibus est duis odio tincidunt elementum. Sodales scelerisque venenatis hac ridiculus scelerisque massa vitae. Hendrerit
      blandit sed, ac cursus ante varius quam. Malesuada habitant curae diam pulvinar proin congue tristique dictum."
    />
  </div>
</div>

<div class="row">
  <div class="column content">
    <span class="label">Scroll Shadow vertical</span>
    <NeoScrollShadow height="10rem">
      <div class="column">
        <p>
          Lorem ipsum odor amet, consectetuer adipiscing elit. Malesuada pharetra ullamcorper eget hac; imperdiet a finibus hac. Sollicitudin
          tincidunt mauris eros ex pharetra imperdiet. Nibh facilisi ante vestibulum feugiat facilisi quam risus ex? Malesuada condimentum nulla odio
          facilisi semper sodales. Dapibus est duis odio tincidunt elementum. Sodales scelerisque venenatis hac ridiculus scelerisque massa vitae.
          Hendrerit blandit sed, ac cursus ante varius quam. Malesuada habitant curae diam pulvinar proin congue tristique dictum.
        </p>

        <p>
          Dignissim quisque non fermentum ipsum; sapien dignissim lobortis. Quam montes lacus ipsum ac dolor class. Erat accumsan morbi fermentum
          consectetur sollicitudin elit a. Primis tincidunt aenean malesuada eleifend nunc morbi consequat. Aenean malesuada sapien habitant feugiat
          sapien consectetur torquent risus nascetur. Dui elit gravida sollicitudin nascetur suscipit facilisi est sodales? Vulputate rhoncus rhoncus
          suspendisse amet nostra quisque eleifend tellus interdum? Volutpat nunc imperdiet sagittis, efficitur nibh eget maecenas. Finibus justo
          nascetur parturient nascetur ac condimentum erat ultrices. Sociosqu nascetur quisque; elit iaculis libero quis.
        </p>
      </div>
    </NeoScrollShadow>
  </div>

  <div class="column content">
    <span class="label">Scroll Shadow horizontal</span>
    <NeoScrollShadow width="20rem" direction="right">
      <p style="width: 40rem;">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Malesuada pharetra ullamcorper eget hac; imperdiet a finibus hac. Sollicitudin tincidunt
        mauris eros ex pharetra imperdiet. Nibh facilisi ante vestibulum feugiat facilisi quam risus ex? Malesuada condimentum nulla odio facilisi
        semper sodales. Dapibus est duis odio tincidunt elementum. Sodales scelerisque venenatis hac ridiculus scelerisque massa vitae. Hendrerit
        blandit sed, ac cursus ante varius quam. Malesuada habitant curae diam pulvinar proin congue tristique dictum.
      </p>
    </NeoScrollShadow>
  </div>
</div>

<div class="row">
  <NeoButtonGroup>
    <NeoButton toggle bind:checked={options.close}>Close</NeoButton>
    <NeoButton toggle bind:checked={options.loading}>Loading</NeoButton>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
  </NeoButtonGroup>

  <NeoNumberStep
    label="Elevation"
    position="left"
    center
    bind:value={options.elevation}
    min={-2}
    max={2}
    defaultValue={0}
    oninput={onElevation}
    rounded={options.rounded}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
  />

  <NeoNumberStep
    label="Hover"
    position="left"
    center
    bind:value={options.hover}
    min={-2 - options.elevation}
    max={2 - options.elevation}
    defaultValue={0}
    rounded={options.rounded}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 4rem' }}
  />

  <NeoSelect
    label="Color"
    placeholder="Select color"
    position="left"
    floating={false}
    size="10"
    bind:value={options.color}
    containerProps={{ style: 'margin-left: 6rem' }}
    options={[Colors.Primary, Colors.Secondary, Colors.Success, Colors.Warning, Colors.Error]}
  />
</div>

<div class="row">
  <span class="label">Pills</span>
  <NeoPill {...options}>Default</NeoPill>
  <NeoPill pressed {...options}>Pressed</NeoPill>
  <NeoPill convex {...options}>Convex</NeoPill>

  <NeoPill {...options}>
    <IconAccount style="margin-inline: -0.1875rem 0.325rem" />
    <span>Icon</span>
  </NeoPill>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);

    &.content {
      flex: 0 1 45%;
      max-width: 50%;
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 4rem 0;
  }

  @media (width < 1200px) {
    .column.content {
      flex: 0 1 90%;
      max-width: 90%;
    }

    .row {
      margin: 2rem 0;
    }
  }
</style>
