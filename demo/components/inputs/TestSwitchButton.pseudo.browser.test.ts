import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestSwitchButton.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoSwitchButton',
  harness: VisualHarness,
});
