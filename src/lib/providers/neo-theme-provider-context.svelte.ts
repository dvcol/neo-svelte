import type { INeoThemeProviderContext } from '~/providers/neo-theme-provider.model.js';

import { wait } from '@dvcol/common-utils/common/promise';
import { getContext, setContext, untrack } from 'svelte';

import { getRemember, getReset, getSource, getTheme, getTransition, NeoThemeRoot, NeoThemeStorageKey } from '~/providers/neo-theme-provider.model.js';
import { NeoErrorThemeContextNotFound, NeoErrorThemeInvalidTarget, NeoErrorThemeTargetNotFound } from '~/utils/error.utils.js';

import styles from '~/providers/neo-theme-provider.scss?url';

type NeoThemeProviderRoot = INeoThemeProviderContext['root'] | (() => INeoThemeProviderContext['root']);

async function transitionViewTheme(context: NeoThemeProviderContextState, theme: INeoThemeProviderContext['theme']) {
  const { promise, resolve, reject } = Promise.withResolvers<void>();

  document.startViewTransition(() => {
    if (!context.root) return reject(new NeoErrorThemeTargetNotFound());
    if (!('setAttribute' in context.root)) return reject(new NeoErrorThemeInvalidTarget());
    context.root.setAttribute(NeoThemeStorageKey.Theme, theme);
    resolve();
  });

  return promise;
}

export type NeoThemeProviderContextState = Partial<Omit<INeoThemeProviderContext, 'root'>> & { root?: NeoThemeProviderRoot };
export class NeoThemeProviderContext implements INeoThemeProviderContext {
  #reset = $state<INeoThemeProviderContext['reset']>(getReset());
  #theme = $state<INeoThemeProviderContext['theme']>(getTheme());
  #source = $state<INeoThemeProviderContext['source']>(getSource());
  #remember = $state<INeoThemeProviderContext['remember']>(getRemember());
  #transition = $state<INeoThemeProviderContext['transition']>(getTransition());
  #root = $state<INeoThemeProviderContext['root'] | (() => INeoThemeProviderContext['root'])>(document?.documentElement);
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
    return typeof this.#root === 'function' ? this.#root() : this.#root;
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
      root: this.root,
    };
  }

  constructor({ reset, theme, source, remember, transition, root }: NeoThemeProviderContextState) {
    this.#reset = reset ?? this.reset;
    this.#theme = theme ?? this.theme;
    this.#source = source ?? this.source;
    this.#remember = remember ?? this.remember;
    this.#transition = transition ?? this.transition;
    this.#root = root ?? this.root;
  }

  update(partial: Partial<NeoThemeProviderContextState>) {
    untrack(() => {
      if (partial.reset !== undefined) this.#reset = partial.reset;
      if (partial.theme !== undefined) this.#theme = partial.theme;
      if (partial.source !== undefined) this.#source = partial.source;
      if (partial.remember !== undefined) this.#remember = partial.remember;
      if (partial.root !== undefined) this.#root = partial.root;

      this.sync();
    });
  }

  private async setTheme(theme: INeoThemeProviderContext['theme']) {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    if (!('setAttribute' in this.root)) throw new NeoErrorThemeInvalidTarget();
    if (this.theme === this.root.getAttribute(NeoThemeStorageKey.Theme)) return;

    if ('startViewTransition' in document && this.root.getAttribute(NeoThemeStorageKey.Transition)?.startsWith('neo')) {
      return transitionViewTheme(this, theme);
    }

    this.root.setAttribute(NeoThemeStorageKey.Transition, 'false');
    this.root.setAttribute(NeoThemeStorageKey.Theme, theme);
    await wait();
    this.root.setAttribute(NeoThemeStorageKey.Transition, this.transition);
  }

  private setSource(source: INeoThemeProviderContext['source']) {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    if (!('setAttribute' in this.root)) throw new NeoErrorThemeInvalidTarget();
    if (this.source === this.root.getAttribute(NeoThemeStorageKey.Source)) return;

    this.root.setAttribute(NeoThemeStorageKey.Source, source);
  }

  import(target = this.root) {
    if (!target) throw new NeoErrorThemeTargetNotFound();
    if (!('setAttribute' in target)) throw new NeoErrorThemeInvalidTarget();
    if (target.parentElement?.querySelector('#neo-theme-provider')) return;

    const link = document.createElement('link');
    link.setAttribute('type', 'text/css');
    link.setAttribute('id', 'neo-theme-provider');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', new URL(styles, import.meta.url).href);
    link.addEventListener('load', () => {
      this.#ready = true;
    });
    if (target === document?.documentElement) document.head.appendChild(link);
    else target.after(link);
  }

  sync() {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    if (!('setAttribute' in this.root)) throw new NeoErrorThemeInvalidTarget();

    this.import(this.root);
    this.root.setAttribute(NeoThemeRoot, '');
    void this.setTheme(this.theme);
    this.setSource(this.source);

    if (this.reset) this.root.setAttribute(NeoThemeStorageKey.Reset, '');
    else this.root.removeAttribute(NeoThemeStorageKey.Reset);

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
    if (!('removeAttribute' in this.root)) return;

    this.root.removeAttribute(NeoThemeRoot);
    this.root.removeAttribute(NeoThemeStorageKey.Reset);
    this.root.removeAttribute(NeoThemeStorageKey.Theme);
    this.root.removeAttribute(NeoThemeStorageKey.Source);
    this.root.removeAttribute(NeoThemeStorageKey.Transition);
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
