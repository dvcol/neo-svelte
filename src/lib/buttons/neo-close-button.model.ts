import type { NeoIconButtonProps } from '~/buttons/neo-icon-button.model.js';
import type { Color } from '~/utils/colors.utils.js';

export const NeoCloseButtonSize = {
  Small: 'sm',
  Medium: 'md',
  Large: 'lg',
} as const;

export type NeoCloseButtonSizes = (typeof NeoCloseButtonSize)[keyof typeof NeoCloseButtonSize];

export interface NeoCloseButtonProps extends NeoIconButtonProps {
  hoverColor?: Color | CSSStyleDeclaration['color'];
  size?: NeoCloseButtonSizes;
}
