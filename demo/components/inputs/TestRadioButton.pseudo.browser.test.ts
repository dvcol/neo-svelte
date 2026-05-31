import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestRadioButton.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoRadioButton',
  harness: VisualHarness,
});
