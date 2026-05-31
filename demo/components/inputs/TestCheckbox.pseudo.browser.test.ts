import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestCheckbox.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoCheckbox',
  harness: VisualHarness,
});
