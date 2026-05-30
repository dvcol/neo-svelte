import type { INeoThemeProviderContext } from '~/providers/neo-theme-provider.model.js';

import { wait } from '@dvcol/common-utils/common/promise';
import { getContext, setContext, untrack } from 'svelte';

import { getRemember, getReset, getSource, getTheme, getTransition, NeoThemeRoot, NeoThemeStorageKey } from '~/providers/neo-theme-provider.model.js';
import { NeoErrorThemeContextNotFound, NeoErrorThemeInvalidTarget, NeoErrorThemeTargetNotFound } from '~/utils/error.utils.js';

import styles from '~/providers/neo-theme-provider.scss?inline';

type NeoThemeProviderRoot = INeoThemeProviderContext['root'] | (() => INeoThemeProviderContext['root']);

function isRootElement(root: INeoThemeProviderContext['root']): root is HTMLElement {
  return !!root && root instanceof HTMLElement;
}

/**
 * Resolves the element to use for attribute/style operations.
 * `ShadowRoot` does not implement `setAttribute`, so we target its `host` instead.
 */
function resolveHost(root: INeoThemeProviderContext['root']): HTMLElement | null {
  if (!root) return null;
  if (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot) {
    return root.host instanceof HTMLElement ? root.host : null;
  }
  return isRootElement(root) ? root : null;
}

/**
 * Resolves the scope onto which a `CSSStyleSheet` should be adopted.
 * Only `Document` and `ShadowRoot` expose `adoptedStyleSheets`; for plain
 * elements we fall back to their owning document so theme styles still reach them.
 */
function resolveAdoptTarget(root: INeoThemeProviderContext['root']): Document | ShadowRoot | null {
  if (!root) return null;
  if (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot) return root;
  if (root instanceof Document) return root;
  if (root instanceof HTMLElement) return root.ownerDocument ?? document;
  return null;
}

let sheet: CSSStyleSheet | undefined;
function getStyleSheet(): CSSStyleSheet {
  if (!sheet) {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
  }
  return sheet;
}

export function computeCircleStart(element?: HTMLElement, { viewportWidth = window.innerWidth, viewportHeight = window.innerHeight } = {}): { x?: number; y?: number } {
  if (!element) return {};
  // Get button's position relative to the viewport
  const rect = element.getBoundingClientRect();

  // Calculate center of the button
  const buttonCenterX = rect.left + (rect.width / 2);
  const buttonCenterY = rect.top + (rect.height / 2);

  // Convert to percentages
  const xPercentage = (buttonCenterX / viewportWidth) * 100;
  const yPercentage = (buttonCenterY / viewportHeight) * 100;

  return {
    x: Math.round(xPercentage),
    y: Math.round(yPercentage),
  };
}

async function transitionViewTheme(root: INeoThemeProviderContext['root'], theme: INeoThemeProviderContext['theme'], trigger?: HTMLElement) {
  const host = resolveHost(root);
  if (trigger && host) {
    const { x, y } = computeCircleStart(trigger);
    if (x) host.style.setProperty('--neo-transition-trigger-x', `${x}%`);
    if (y) host.style.setProperty('--neo-transition-trigger-y', `${y}%`);
  }

  const transition = document.startViewTransition(() => {
    if (!root) throw new NeoErrorThemeTargetNotFound();
    if (!host) throw new NeoErrorThemeInvalidTarget();
    host.setAttribute(NeoThemeStorageKey.InFlight, 'true');
    host.setAttribute(NeoThemeStorageKey.Theme, theme);
  });

  await transition.finished;

  if (!host) return;
  host.removeAttribute(NeoThemeStorageKey.InFlight);
  host.style.removeProperty('--neo-transition-trigger-x');
  host.style.removeProperty('--neo-transition-trigger-y');
}

export type NeoThemeProviderContextState = Partial<Omit<INeoThemeProviderContext, 'root'>> & { root?: NeoThemeProviderRoot };
export class NeoThemeProviderContext implements INeoThemeProviderContext {
  #reset = $state<INeoThemeProviderContext['reset']>(getReset());
  #theme = $state<INeoThemeProviderContext['theme']>(getTheme());
  #source = $state<INeoThemeProviderContext['source']>(getSource());
  #remember = $state<INeoThemeProviderContext['remember']>(getRemember());
  #transition = $state<INeoThemeProviderContext['transition']>(getTransition());
  #resolver = $state<INeoThemeProviderContext['root'] | (() => INeoThemeProviderContext['root'])>(document?.documentElement);
  #root = $derived<INeoThemeProviderContext['root']>(typeof this.#resolver === 'function' ? this.#resolver() : this.#resolver);
  #host = $derived<HTMLElement | null>(resolveHost(this.#root));
  #ready = $state<INeoThemeProviderContext['ready']>(false);

  get reset() {
    return this.#reset;
  }

  get theme() {
    return this.#theme;
  }

  get source() {
    return this.#source;
  }

  get remember() {
    return this.#remember;
  }

  get transition() {
    return this.#transition;
  }

  get root() {
    return this.#root;
  }

  /**
   * Element used for attribute/style mutations.
   *
   * When {@link root} is a `ShadowRoot` (which does not implement `setAttribute`),
   * this resolves to its `host`. Consumers that need to read/write attributes or
   * inline styles should target `host` instead of `root`.
   */
  get host(): HTMLElement | null {
    return this.#host;
  }

  get ready() {
    return this.#ready;
  }

  get state() {
    return {
      reset: this.reset,
      theme: this.theme,
      source: this.source,
      remember: this.remember,
      transition: this.transition,
      root: this.root,
      host: this.host,
    };
  }

  constructor({ reset, theme, source, remember, transition, root }: NeoThemeProviderContextState) {
    this.#reset = reset ?? this.reset;
    this.#theme = theme ?? this.theme;
    this.#source = source ?? this.source;
    this.#remember = remember ?? this.remember;
    this.#transition = transition ?? this.transition;
    this.#resolver = root ?? this.root;
  }

  update(partial: Partial<NeoThemeProviderContextState>, trigger?: HTMLElement) {
    untrack(() => {
      if (partial.reset !== undefined) this.#reset = partial.reset;
      if (partial.theme !== undefined) this.#theme = partial.theme;
      if (partial.source !== undefined) this.#source = partial.source;
      if (partial.remember !== undefined) this.#remember = partial.remember;
      if (partial.transition !== undefined) this.#transition = partial.transition;
      if (partial.root !== undefined) this.#resolver = partial.root;

      this.sync(trigger);
    });
  }

  private async setTheme(theme: INeoThemeProviderContext['theme'], trigger?: HTMLElement) {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    const host = this.host;
    if (!host) throw new NeoErrorThemeInvalidTarget();
    if (this.theme === host.getAttribute(NeoThemeStorageKey.Theme)) {
      return host.setAttribute(NeoThemeStorageKey.Transition, this.transition);
    }

    if ('startViewTransition' in document && host.getAttribute(NeoThemeStorageKey.Transition)?.startsWith('neo')) {
      return transitionViewTheme(this.root, theme, trigger);
    }

    host.setAttribute(NeoThemeStorageKey.Transition, 'false');
    host.setAttribute(NeoThemeStorageKey.Theme, theme);
    await wait();
    host.setAttribute(NeoThemeStorageKey.Transition, this.transition);
  }

  private setSource(source: INeoThemeProviderContext['source']) {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    const host = this.host;
    if (!host) throw new NeoErrorThemeInvalidTarget();
    if (this.source === host.getAttribute(NeoThemeStorageKey.Source)) return;

    host.setAttribute(NeoThemeStorageKey.Source, source);
  }

  import(target = this.root) {
    if (!target) throw new NeoErrorThemeTargetNotFound();
    const host = resolveHost(target);
    if (!host) throw new NeoErrorThemeInvalidTarget();
    const adoptTarget = resolveAdoptTarget(target);
    if (!adoptTarget) throw new NeoErrorThemeInvalidTarget();

    const styleSheet = getStyleSheet();
    if (!adoptTarget.adoptedStyleSheets.includes(styleSheet)) {
      adoptTarget.adoptedStyleSheets = [...adoptTarget.adoptedStyleSheets, styleSheet];
    }
    this.#ready = true;
  }

  sync(trigger?: HTMLElement) {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    const host = this.host;
    if (!host) throw new NeoErrorThemeInvalidTarget();

    this.import(this.root);
    host.setAttribute(NeoThemeRoot, '');
    void this.setTheme(this.theme, trigger);
    this.setSource(this.source);

    if (this.reset) host.setAttribute(NeoThemeStorageKey.Reset, '');
    else host.removeAttribute(NeoThemeStorageKey.Reset);

    if (!localStorage) return;

    localStorage.setItem(NeoThemeStorageKey.Remember, Boolean(this.remember).toString());

    if (this.remember) {
      localStorage.setItem(NeoThemeStorageKey.Reset, Boolean(this.reset).toString());
      localStorage.setItem(NeoThemeStorageKey.Theme, this.theme);
      localStorage.setItem(NeoThemeStorageKey.Source, this.source);
      localStorage.setItem(NeoThemeStorageKey.Transition, this.transition);
    } else {
      localStorage.removeItem(NeoThemeStorageKey.Reset);
      localStorage.removeItem(NeoThemeStorageKey.Theme);
      localStorage.removeItem(NeoThemeStorageKey.Source);
      localStorage.removeItem(NeoThemeStorageKey.Transition);
    }
  }

  destroy() {
    if (!this.root) return;
    const host = this.host;
    if (!host) return;

    host.removeAttribute(NeoThemeRoot);
    host.removeAttribute(NeoThemeStorageKey.Reset);
    host.removeAttribute(NeoThemeStorageKey.Theme);
    host.removeAttribute(NeoThemeStorageKey.Source);
    host.removeAttribute(NeoThemeStorageKey.Transition);
    this.#ready = false;
  }
}

const NeoContextKey = Symbol('NeoThemeProviderContext');
export function setNeoThemeContext(context: NeoThemeProviderContextState) {
  return setContext<NeoThemeProviderContext>(NeoContextKey, new NeoThemeProviderContext(context));
}
export const getNeoThemeContext = () => getContext<NeoThemeProviderContext>(NeoContextKey);

export function useNeoThemeContext() {
  const context = getNeoThemeContext();
  if (!context) throw new NeoErrorThemeContextNotFound();
  return context;
}
