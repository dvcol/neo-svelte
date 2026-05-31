import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestPin.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoPin',
  harness: VisualHarness,
});
