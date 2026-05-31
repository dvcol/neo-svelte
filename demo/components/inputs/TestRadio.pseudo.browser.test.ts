import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestRadio.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoRadio',
  harness: VisualHarness,
});
