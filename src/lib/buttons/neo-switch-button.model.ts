import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { ShadowShallowElevation, ShadowShallowElevationString } from '~/utils/shadow.utils.js';

export type NeoSwitchElevation = ShadowShallowElevation | ShadowShallowElevationString;

export type NeoSwitchButtonContext = Pick<NeoInputProps, 'checked' | 'indeterminate' | 'disabled'>;

export type NeoCommonSwitchProps = Pick<NeoInputProps, 'valid' | 'start' | 'glass' | 'rounded' | 'skeleton' | 'color' | 'tinted'> &
  NeoSwitchButtonContext & {
    // Snippets
    /**
     * Optional snippets to be displayed inside the switch button when checked;
     */
    on?: string | Snippet<[NeoSwitchButtonContext]>;
    /**
     * Optional snippets to be displayed inside the switch button when unchecked;
     */
    off?: string | Snippet<[NeoSwitchButtonContext]>;
    /**
     * Optional snippets to be displayed inside the switch button handle;
     */
    handle?: string | Snippet<[NeoSwitchButtonContext]>;

    /**
     * Input elevation.
     * @default 2
     */
    elevation?: NeoSwitchElevation;
  };

export type NeoSwitchButtonProps = NeoCommonSwitchProps &
  HTMLButtonAttributes & {
    /**
     * Any content to be displayed inside the radio button.
     */
    children?: Snippet;
  };
