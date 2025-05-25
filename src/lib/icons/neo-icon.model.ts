import type { SVGAttributes } from 'svelte/elements';

export type NeoIconProps = {
  size?: CSSStyleDeclaration['width'] | CSSStyleDeclaration['height'];
  scale?: number | string;
  stroke?: number | string;
  enter?: boolean;
} & Omit<SVGAttributes<SVGElement>, 'stroke'>;

export const NeoIconArrowDirection = {
  Left: 'left',
  Right: 'right',
  Up: 'up',
  Down: 'down',
} as const;

export type NeoIconArrowDirections = (typeof NeoIconArrowDirection)[keyof typeof NeoIconArrowDirection];

export type NeoIconArrowProps = NeoIconProps & {
  expanded?: boolean;
  direction?: NeoIconArrowDirections;
  chevron?: boolean;
  delay?: number;
  start?: `${number}%` | `${number}px` | `${number}rem` | `${number}em`;
  end?: `${number}%` | `${number}px` | `${number}rem` | `${number}em`;
};

export type NeoIconFilledProps = NeoIconProps & {
  filled?: boolean;
};

export type NeoIconAddressProps = NeoIconFilledProps & {
  dot?: CSSStyleDeclaration['color'];
  repeat?: SVGAttributes<SVGAnimateTransformElement>['repeatCount'];
};

export type NeoIconBouncingDotsProps = NeoIconProps & {
  fill?: CSSStyleDeclaration['color'];
  steps?: number[];
  bounce?: boolean;
};

export interface NeoIconCheckboxProps {
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

export type NeoIconCircleLoadingProps = NeoIconProps & {
  animate?: boolean;
  speed?: number;
};

export type NeoIconPlayPauseProps = NeoIconProps & {
  state?: 'play' | 'pause';
};

export type NeoIconRadioProps = NeoIconProps & {
  checked?: boolean;
  circle?: boolean;
};

export type NeoIconSunMoonProps = NeoIconProps & {
  state?: 'sun' | 'moon';
};

export type NeoIconThemeProps = NeoIconSunMoonProps;

export type NeoIconDoubleChevronProps = NeoIconProps & { space?: number };

export type NeoIconUnplugProps = NeoIconProps & { plug?: boolean };

export type NeoIconAudioProps = NeoIconProps & {
  /**
   * The speed of the animation in seconds.
   */
  speed?: number;
  /**
   * Whether the icon should animate.
   */
  animated?: boolean;
  /**
   * The number animation iterations before stopping.
   */
  repeat?: number | 'indefinite';
};
