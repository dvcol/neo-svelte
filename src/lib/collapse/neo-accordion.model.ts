import type { Snippet } from 'svelte';
import type { NeoCollapseGroupProps } from '~/collapse/neo-collapse-group.model.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';
import type {
  BlurElevation,
  BlurElevationString,
  ShadowElevation,
  ShadowElevationString,
  ShadowHoverElevation,
  ShadowHoverElevationsString,
} from '~/utils/shadow.utils.js';

export type NeoAccordionBlur = BlurElevation | BlurElevationString;
export type NeoAccordionElevation = ShadowElevation | ShadowElevationString;
export type NeoAccordionHoverElevation = ShadowHoverElevation | ShadowHoverElevationsString;

export type NeoAccordionContext = {
  /**
   * Whether the whole accordion is disabled.
   */
  disabled?: NeoCollapseGroupProps['disabled'];
  /**
   * Whether the whole accordion is readonly.
   */
  readonly?: NeoCollapseGroupProps['readonly'];
  /**
   * Whether the accordion opens horizontally.
   */
  horizontal?: boolean;
};

export type NeoAccordionProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets
  /**
   * The collapsible sections of the accordion.
   */
  children: NeoCollapseGroupProps['children'] | Snippet<[NeoAccordionContext]>;

  // State
  /**
   * The HTML tag to use for the accordion wrapper.
   * @default 'div'
   */
  tag?: Tag;

  // Shadow
  /**
   * Accordion elevation.
   * @default 0
   */
  elevation?: NeoAccordionElevation;
  /**
   * Whether to increase/decrease the elevation when hovered/focused.
   * @default 0
   */
  hover?: NeoAccordionHoverElevation;
  /**
   * The blur level to apply when in glass mode.
   *
   * @default elevation, min: 1, max: 5
   * @see glass
   */
  blur?: NeoAccordionBlur;

  // Style
  /**
   * By default, accordion with no elevation will display a border.
   * If this is `true`, the card will never display a border.
   */
  borderless?: boolean;
  /**
   * Whether the accordion shows a border between each section.
   */
  segmented?: boolean;
  /**
   * If true, the accordion will have a rounded border.
   */
  rounded?: boolean;
  /**
   * If true, negative elevation (< 0) will be displayed as pressed instead of inset.
   */
  pressed?: boolean;
  /**
   * Tints the background with the current color.
   */
  tinted?: boolean;
  /**
   * If true, the accordion will be displayed with a glass effect.
   */
  glass?: boolean;
  /**
   * Text color to use for the accordion.
   */
  color?: Color | CSSStyleDeclaration['color'];
  /**
   * If true, the accordion will start as flat on first render.
   * @see [@starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) for browser support
   */
  start?: boolean;

  /**
   * The group settings to pass to the inner collapse group.
   */
  group?: Omit<NeoCollapseGroupProps, 'children'>;
} & NeoAccordionContext &
  HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
