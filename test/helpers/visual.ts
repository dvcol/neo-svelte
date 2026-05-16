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

/**
 * Skip every in-document SVG SMIL animation (`<animate>` / `<animateTransform>`)
 * to its end state, then pause the SVG timeline. The neo icons use SMIL with
 * `fill="freeze"` to draw their strokes in over ~0.4s; without this, snapshots
 * captured before the animation completes show partial paths.
 */
export function freezeSvgAnimations(root: ParentNode = document): void {
  if (typeof document === 'undefined') return;
  const svgs = root.querySelectorAll<SVGSVGElement>('svg');
  for (const svg of svgs) {
    try {
      // Fast-forward each timeline far past any chained `begin` offsets so
      // every `<animate fill="freeze">` settles on its final value, then
      // pause the SVG clock so indefinite loops (BouncingDots, CircleLoading)
      // stop advancing between consecutive screenshot captures.
      if (typeof svg.setCurrentTime === 'function') svg.setCurrentTime(1000);
      if (typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
    } catch {
      // SVGs without active SMIL throw on setCurrentTime in some browsers — ignore.
    }
  }
}

/**
 * Poll computed style until the element has finished its in-flight Svelte
 * transition (opacity ≈ 1, transform either none or identity matrix).
 * `quietForVisual` only disables CSS transitions; Svelte's `scale`/`fly`/`fade`
 * transitions tween opacity and transform via JS each frame, so the screenshot
 * must wait for them to settle.
 */
const IDENTITY_MATRIX_RE = /matrix\(1,\s*0,\s*0,\s*1/;

export async function waitForVisualStability(el: HTMLElement, timeoutMs = 1500): Promise<void> {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    const cs = getComputedStyle(el);
    const opacity = Number.parseFloat(cs.opacity);
    const transform = cs.transform;
    const stable = opacity >= 0.999 && (transform === 'none' || IDENTITY_MATRIX_RE.test(transform));
    if (stable) return;
    await new Promise(r => requestAnimationFrame(() => r(null)));
  }
}
