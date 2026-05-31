import { describePseudoGrid } from 'test/helpers/pseudo.js';

import VisualHarness from './TestFieldSet.pseudo.browser.test.svelte';

describePseudoGrid({
  component: 'NeoFieldSet',
  harness: VisualHarness,
});
