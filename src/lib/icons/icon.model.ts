import type { SVGAttributes } from 'svelte/elements';

export type IconProps = {
  size?: CSSStyleDeclaration['width'] | CSSStyleDeclaration['height'];
  scale?: number | string;
  stroke?: number | string;
  enter?: boolean;
} & Omit<SVGAttributes<SVGElement>, 'stroke'>;

export const IconArrowDirection = {
  Left: 'left' as const,
  Right: 'right' as const,
  Up: 'up' as const,
  Down: 'down' as const,
} as const;

export type IconArrowDirections = (typeof IconArrowDirection)[keyof typeof IconArrowDirection];

export type IconArrowProps = IconProps & {
  expanded?: boolean;
  direction?: IconArrowDirections;
  chevron?: boolean;
  delay?: number;
  start?: `${number}%` | `${number}px` | `${number}rem` | `${number}em`;
  end?: `${number}%` | `${number}px` | `${number}rem` | `${number}em`;
};

export type IconFilledProps = IconProps & {
  filled?: boolean;
};

export type IconAddressProps = IconFilledProps & {
  dot?: CSSStyleDeclaration['color'];
  repeat?: SVGAttributes<SVGAnimateTransformElement>['repeatCount'];
};

export type IconBouncingDotsProps = IconProps & {
  fill?: CSSStyleDeclaration['color'];
  steps?: number[];
};

export interface IconCheckboxProps {
  /**
   * The stroke width of the border.
   */
  box?: number;
  /**
   * The stroke width of the checkmark.
   */
  check?: number;
  /**
   * The scale of the icon.
   */
  scale?: number;
  /**
   * The size (width and height) of the icon.
   */
  size?: string;
  /**
   * Whether to render the border.
   */
  border?: boolean;
  /**
   * Whether to render a square or circle checkbox.
   */
  circle?: boolean;
  /**
   * Whether to draw the border on enter.
   */
  draw?: boolean;
  /**
   * Whether to animate on enter.
   */
  enter?: boolean;
  /**
   * If the checkbox is checked.
   */
  checked?: boolean;
  /**
   * If the checkbox is indeterminate.
   */
  indeterminate?: boolean;
}

export type IconCircleLoadingProps = IconProps & {
  animate?: boolean;
  speed?: number;
};

export type IconPlayPauseProps = IconProps & {
  state?: 'play' | 'pause';
};

export type IconRadioProps = IconProps & {
  checked?: boolean;
  circle?: boolean;
};

export type IconSunMoonProps = IconProps & {
  state?: 'sun' | 'moon';
};
