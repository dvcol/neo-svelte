import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestMedia.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoMedia',
  harness: VisualHarness,
});
