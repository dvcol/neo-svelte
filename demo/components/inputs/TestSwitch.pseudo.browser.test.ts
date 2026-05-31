import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestSwitch.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoSwitch',
  harness: VisualHarness,
});
