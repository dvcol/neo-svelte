import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestProgressBar.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoProgressBar',
  harness: VisualHarness,
});
