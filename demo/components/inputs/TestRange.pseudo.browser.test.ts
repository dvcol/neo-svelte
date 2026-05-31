import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestRange.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoRange',
  harness: VisualHarness,
});
