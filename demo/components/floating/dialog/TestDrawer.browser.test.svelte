<script lang="ts">
  import type { NeoDialogHTMLElement } from '~/floating/dialog/neo-dialog.model.js';
  import type { NeoDrawerProps } from '~/floating/drawer/neo-drawer.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoDrawer from '~/floating/drawer/NeoDrawer.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type HarnessProps = Partial<NeoDrawerProps> & {
    bodyText?: string;
    onRef?: (ref: NeoDialogHTMLElement | undefined) => void;
  };

  const LOREM = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.',
    'Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh.',
    'Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.',
  ].join('\n\n');

  let {
    ref = $bindable<NeoDialogHTMLElement | undefined>(undefined),
    open = $bindable(false),
    returnValue = $bindable<string | undefined>(),
    bodyText = LOREM,
    onRef,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onRef?.(ref);
  });
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <NeoDrawer bind:ref bind:open bind:returnValue {...rest}>
      <div class="drawer-content">
        <h2 data-testid="drawer-title" class="drawer-title">Drawer title</h2>
        {#each bodyText.split('\n\n') as paragraph, i (i)}
          <p data-testid="drawer-body" class="drawer-body">{paragraph}</p>
        {/each}
        <NeoButton data-testid="drawer-action">Primary action</NeoButton>
      </div>
    </NeoDrawer>
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-stage {
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
  }

  .drawer-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-sizing: border-box;
    padding: 1.25rem;
  }

  .drawer-title {
    margin: 0;
    font-size: 1.125rem;
  }

  .drawer-body {
    margin: 0;
  }
</style>
