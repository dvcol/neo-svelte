import { page } from '@vitest/browser/context';

export type ViewportName = 'mobile' | 'desktop' | 'uhd';

export const VIEWPORTS: Record<ViewportName, { width: number; height: number }> = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1440, height: 900 },
  uhd: { width: 3840, height: 2160 },
};

export const VIEWPORT_NAMES: ViewportName[] = ['mobile', 'desktop', 'uhd'];

/**
 * Set the browser viewport to a named preset.
 * Uses the vitest browser `page.viewport` API.
 */
export async function setViewport(name: ViewportName): Promise<void> {
  const { width, height } = VIEWPORTS[name];
  await page.viewport(width, height);
}

/**
 * Compose a stable screenshot file name from component / scenario / viewport.
 * Filename only — vitest writes under each test's __screenshots__/ (or
 * configured screenshotDirectory) automatically.
 */
export function screenshotName(component: string, scenario: string, viewport: ViewportName): string {
  return `${component}__${scenario}__${viewport}`;
}

/**
 * Toggle a global "quiet" class on document.documentElement that disables
 * transitions, animations, caret blink, and focus-ring noise. Tests should
 * call this in beforeEach.
 */
export function quietForVisual(): void {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.classList.add('visual-quiet');
  if (document.getElementById('visual-quiet-style')) return;
  const style = document.createElement('style');
  style.id = 'visual-quiet-style';
  style.textContent = `
    html.visual-quiet *,
    html.visual-quiet *::before,
    html.visual-quiet *::after {
      transition: none !important;
      animation: none !important;
      caret-color: transparent !important;
    }
    html.visual-quiet *:focus,
    html.visual-quiet *:focus-visible {
      outline: none !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Default comparator options for screenshot diffs.
 * 1% tolerance smooths over rare sub-pixel font/AA flicker.
 */
export const DEFAULT_COMPARATOR = {
  comparatorOptions: { allowedMismatchedPixelRatio: 0.01 },
} as const;
