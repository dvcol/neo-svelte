import { getContext, setContext } from 'svelte';

import {
  getSource,
  getTheme,
  hasSaved,
  type INeoThemeProviderContext,
  NeoSourceKey,
  NeoThemeKey,
  NeoThemeRoot,
} from '~/providers/neo-theme-provider.model.js';

import { NeoErrorThemeContextNotFound, NeoErrorThemeInvalidTarget, NeoErrorThemeTargetNotFound } from '~/utils/error.utils.js';

type NeoThemeProviderRoot = INeoThemeProviderContext['root'] | (() => INeoThemeProviderContext['root']);
export type NeoThemeProviderContextState = Partial<Omit<INeoThemeProviderContext, 'root'>> & { root?: NeoThemeProviderRoot };
export class NeoThemeProviderContext implements INeoThemeProviderContext {
  #theme = $state<INeoThemeProviderContext['theme']>(getTheme());
  #source = $state<INeoThemeProviderContext['source']>(getSource());
  #remember = $state<INeoThemeProviderContext['remember']>(hasSaved());
  #root = $state<INeoThemeProviderContext['root'] | (() => INeoThemeProviderContext['root'])>(document?.documentElement);

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
      theme: this.theme,
      source: this.source,
      remember: this.remember,
      root: this.root,
    };
  }

  constructor({ theme, source, remember, root }: NeoThemeProviderContextState) {
    this.#theme = theme ?? this.theme;
    this.#source = source ?? this.source;
    this.#remember = remember ?? this.remember;
    this.#root = root ?? this.root;

    this.sync();
  }

  update(partial: Partial<NeoThemeProviderContextState>) {
    this.#theme = partial.theme ?? this.#theme;
    this.#source = partial.source ?? this.#source;
    this.#remember = partial.remember ?? this.#remember;
    this.#root = partial.root ?? this.#root;

    this.sync();
  }

  sync() {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    if (!('setAttribute' in this.root)) throw new NeoErrorThemeInvalidTarget();

    this.root.setAttribute(NeoThemeRoot, '');

    this.root.setAttribute(NeoThemeKey, this.theme);
    this.root.setAttribute(NeoSourceKey, this.source);

    if (this.remember) {
      localStorage.setItem(NeoThemeKey, this.theme);
      localStorage.setItem(NeoSourceKey, this.source);
    } else {
      localStorage.removeItem(NeoThemeKey);
      localStorage.removeItem(NeoSourceKey);
    }
  }

  destroy() {
    if (!this.root) return;
    if (!('removeAttribute' in this.root)) return;

    this.root.removeAttribute(NeoThemeRoot);
    this.root.removeAttribute(NeoThemeKey);
    this.root.removeAttribute(NeoSourceKey);
  }
}

const NeoContextKey = Symbol('NeoThemeProviderContext');
export const setNeoThemeContext = (context: NeoThemeProviderContextState) =>
  setContext<NeoThemeProviderContext>(NeoContextKey, new NeoThemeProviderContext(context));
export const getNeoThemeContext = () => getContext<NeoThemeProviderContext>(NeoContextKey);

export const useNeoThemeContext = () => {
  const context = getNeoThemeContext();
  if (!context) throw new NeoErrorThemeContextNotFound();
  return context;
};
