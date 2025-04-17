import type { INeoThemeProviderContext } from '~/providers/neo-theme-provider.model.js';

import { wait } from '@dvcol/common-utils/common/promise';
import { getContext, setContext, untrack } from 'svelte';

import {
  getRemember,
  getReset,
  getSource,
  getTheme,

  NeoThemeRoot,
  NeoThemeStorageKey,
} from '~/providers/neo-theme-provider.model.js';
import { NeoErrorThemeContextNotFound, NeoErrorThemeInvalidTarget, NeoErrorThemeTargetNotFound } from '~/utils/error.utils.js';

type NeoThemeProviderRoot = INeoThemeProviderContext['root'] | (() => INeoThemeProviderContext['root']);
export type NeoThemeProviderContextState = Partial<Omit<INeoThemeProviderContext, 'root'>> & { root?: NeoThemeProviderRoot };
export class NeoThemeProviderContext implements INeoThemeProviderContext {
  #reset = $state<INeoThemeProviderContext['reset']>(getReset());
  #theme = $state<INeoThemeProviderContext['theme']>(getTheme());
  #source = $state<INeoThemeProviderContext['source']>(getSource());
  #remember = $state<INeoThemeProviderContext['remember']>(getRemember());
  #root = $state<INeoThemeProviderContext['root'] | (() => INeoThemeProviderContext['root'])>(document?.documentElement);

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

  get root() {
    return typeof this.#root === 'function' ? this.#root() : this.#root;
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

  constructor({ reset, theme, source, remember, root }: NeoThemeProviderContextState) {
    this.#reset = reset ?? this.reset;
    this.#theme = theme ?? this.theme;
    this.#source = source ?? this.source;
    this.#remember = remember ?? this.remember;
    this.#root = root ?? this.root;

    this.sync();
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

    this.root.setAttribute(NeoThemeStorageKey.Transition, 'false');
    this.root.setAttribute(NeoThemeStorageKey.Theme, theme);
    await wait();
    this.root.removeAttribute(NeoThemeStorageKey.Transition);
  }

  private setSource(source: INeoThemeProviderContext['source']) {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    if (!('setAttribute' in this.root)) throw new NeoErrorThemeInvalidTarget();
    if (this.source === this.root.getAttribute(NeoThemeStorageKey.Source)) return;

    this.root.setAttribute(NeoThemeStorageKey.Source, source);
  }

  sync() {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    if (!('setAttribute' in this.root)) throw new NeoErrorThemeInvalidTarget();

    this.root.setAttribute(NeoThemeRoot, '');
    this.setTheme(this.theme);
    this.setSource(this.source);

    if (this.reset) this.root.setAttribute(NeoThemeStorageKey.Reset, '');
    else this.root.removeAttribute(NeoThemeStorageKey.Reset);

    if (!localStorage) return;

    localStorage.setItem(NeoThemeStorageKey.Remember, Boolean(this.remember).toString());

    if (this.remember) {
      localStorage.setItem(NeoThemeStorageKey.Reset, Boolean(this.reset).toString());
      localStorage.setItem(NeoThemeStorageKey.Theme, this.theme);
      localStorage.setItem(NeoThemeStorageKey.Source, this.source);
    } else {
      localStorage.removeItem(NeoThemeStorageKey.Reset);
      localStorage.removeItem(NeoThemeStorageKey.Theme);
      localStorage.removeItem(NeoThemeStorageKey.Source);
    }
  }

  destroy() {
    if (!this.root) return;
    if (!('removeAttribute' in this.root)) return;

    this.root.removeAttribute(NeoThemeRoot);
    this.root.removeAttribute(NeoThemeStorageKey.Reset);
    this.root.removeAttribute(NeoThemeStorageKey.Theme);
    this.root.removeAttribute(NeoThemeStorageKey.Source);
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
