import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestCheckboxButton.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoCheckboxButton',
  harness: VisualHarness,
});
