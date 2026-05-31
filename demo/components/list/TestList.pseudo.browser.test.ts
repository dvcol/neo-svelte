import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestList.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoList',
  harness: VisualHarness,
});
