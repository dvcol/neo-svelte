<script lang="ts">
  import NeoButton from '../../src/lib/buttons/NeoButton.svelte';

  import NeoButtonGroup from '../../src/lib/buttons/NeoButtonGroup.svelte';

  import NeoSelect from '../../src/lib/inputs/NeoSelect.svelte';

  import type { NeoSelectOption } from '../../.svelte-kit/__package__';
  import type { NeoTypewriterProps } from '~/text/neo-typewriter.model';

  import IconTextHighlight from '~/icons/IconTextHighlight.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoTextarea from '~/inputs/common/NeoTextarea.svelte';
  import NeoEllipsis from '~/text/NeoEllipsis.svelte';
  import NeoMark from '~/text/NeoMark.svelte';
  import NeoScrollShadow from '~/text/NeoScrollShadow.svelte';
  import NeoTypewriter from '~/text/NeoTypewriter.svelte';

  let lines = $state(1);
  let filter = $state('');
  let typeWriter = $state('Lorem ipsum odor amet, consectetuer adipiscing elit. \nMalesuada pharetra ullamcorper eget hac; imperdiet a finibus hac.');

  const options = $state<NeoTypewriterProps>({
    speed: 120,

    typo: false,
    pause: false,
    iterations: 1,

    mode: 'write',

    caret: true,
  });

  const modes: NeoSelectOption[] = [
    { value: 'write', label: 'Write' },
    { value: 'delete', label: 'Delete' },
    { value: 'loop', label: 'Loop' },
  ];
</script>

<section>
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
      <NeoInput bind:value={filter} placeholder="Highlight text" rounded size="30" clearable>
        {#snippet before()}
          <IconTextHighlight size="1.25rem" />
        {/snippet}
      </NeoInput>
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
      <span class="label">Typewriter</span>

      <div class="options">
        <NeoNumberStep
          label="Speed"
          placement="left"
          center
          bind:value={options.speed}
          min={0}
          max={10000}
          step={1}
          defaultValue={120}
          nullable={false}
          floating={false}
          groupProps={{ style: 'margin-left: 4rem' }}
          rounded
          glass
        />
        <NeoNumberStep
          label="Iterations"
          placement="left"
          center
          bind:value={options.iterations}
          min={0}
          max={10000}
          step={1}
          defaultValue={1}
          nullable={false}
          floating={false}
          groupProps={{ style: 'margin-left: 5rem' }}
          rounded
          glass
        />

        <NeoSelect
          rounded
          glass
          label="Mode"
          placeholder="Select mode"
          placement="left"
          floating={false}
          nullable={false}
          size="8"
          bind:value={options.mode}
          containerProps={{ style: 'margin-left: 4rem' }}
          options={modes}
          openOnFocus
        />
      </div>

      <div class="options">
        <NeoButtonGroup text rounded>
          <NeoButton toggle bind:checked={options.typo}>Typos</NeoButton>
          <NeoButton toggle bind:checked={options.pause}>Pauses</NeoButton>
          <NeoButton toggle bind:checked={options.caret}>Caret</NeoButton>
        </NeoButtonGroup>
      </div>

      <NeoTextarea bind:value={typeWriter} placeholder="Typewriter text" cols="50" clearable />
      <NeoTypewriter bind:value={typeWriter} {...options} />
    </div>
  </div>

  <div class="row">
    <div class="column content">
      <span class="label">Scroll Shadow vertical</span>
      <NeoScrollShadow height="10rem">
        <div class="column">
          <p>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Malesuada pharetra ullamcorper eget hac; imperdiet a finibus hac. Sollicitudin
            tincidunt mauris eros ex pharetra imperdiet. Nibh facilisi ante vestibulum feugiat facilisi quam risus ex? Malesuada condimentum nulla
            odio facilisi semper sodales. Dapibus est duis odio tincidunt elementum. Sodales scelerisque venenatis hac ridiculus scelerisque massa
            vitae. Hendrerit blandit sed, ac cursus ante varius quam. Malesuada habitant curae diam pulvinar proin congue tristique dictum.
          </p>

          <p>
            Dignissim quisque non fermentum ipsum; sapien dignissim lobortis. Quam montes lacus ipsum ac dolor class. Erat accumsan morbi fermentum
            consectetur sollicitudin elit a. Primis tincidunt aenean malesuada eleifend nunc morbi consequat. Aenean malesuada sapien habitant feugiat
            sapien consectetur torquent risus nascetur. Dui elit gravida sollicitudin nascetur suscipit facilisi est sodales? Vulputate rhoncus
            rhoncus suspendisse amet nostra quisque eleifend tellus interdum? Volutpat nunc imperdiet sagittis, efficitur nibh eget maecenas. Finibus
            justo nascetur parturient nascetur ac condimentum erat ultrices. Sociosqu nascetur quisque; elit iaculis libero quis.
          </p>
        </div>
      </NeoScrollShadow>
    </div>

    <div class="column content">
      <span class="label">Scroll Shadow horizontal</span>
      <NeoScrollShadow width="20rem" direction="right">
        <p style="width: 40rem;">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Malesuada pharetra ullamcorper eget hac; imperdiet a finibus hac. Sollicitudin
          tincidunt mauris eros ex pharetra imperdiet. Nibh facilisi ante vestibulum feugiat facilisi quam risus ex? Malesuada condimentum nulla odio
          facilisi semper sodales. Dapibus est duis odio tincidunt elementum. Sodales scelerisque venenatis hac ridiculus scelerisque massa vitae.
          Hendrerit blandit sed, ac cursus ante varius quam. Malesuada habitant curae diam pulvinar proin congue tristique dictum.
        </p>
      </NeoScrollShadow>
    </div>
  </div>
</section>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  section {
    flex: 1 1 100%;
    align-content: center;
  }

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .options {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);
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
