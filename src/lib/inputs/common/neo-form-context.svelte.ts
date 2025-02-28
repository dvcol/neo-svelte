import { getUUID } from '@dvcol/common-utils/common/string';
import { getContext, setContext } from 'svelte';

import { SvelteMap } from 'svelte/reactivity';

import type { NeoValidationState } from '~/inputs/common/neo-validation.model.js';

export type NeoFormContextField<Value = unknown, Element = HTMLElement> = {
  id: string;
  ref?: Element;
  state: NeoValidationState<Value>;
  message?: unknown | string;
  error?: unknown | string;
};

export class NeoFormContext {
  readonly #id: string;
  readonly #fields = new SvelteMap<NeoFormContextField['id'], NeoFormContextField>();
  readonly #entries = $derived<Record<NeoFormContextField['id'], NeoFormContextField>>(Object.fromEntries(this.#fields.entries()));
  readonly #values = $derived<Record<NeoFormContextField['id'], NeoFormContextField['state']['value']>>(
    Object.fromEntries([...this.#fields.entries()].map(([id, field]) => [id, field.state.value])),
  );
  readonly #initials = $derived<Record<NeoFormContextField['id'], NeoFormContextField['state']['initial']>>(
    Object.fromEntries([...this.#fields.entries()].map(([id, field]) => [id, field.state.initial])),
  );
  readonly #touched = $derived<boolean>([...this.#fields.values()].some(field => field.state.touched));
  readonly #dirty = $derived<boolean>([...this.#fields.values()].some(field => field.state.dirty));
  readonly #valid = $derived<boolean>([...this.#fields.values()].every(field => field.state.valid));

  readonly #messages = $derived<Record<NeoFormContextField['id'], NeoFormContextField['message']>>(
    Object.fromEntries([...this.#fields.entries()].map(([id, field]) => [id, field.message]).filter(([_, message]) => !!message)),
  );
  readonly #errors = $derived<Record<NeoFormContextField['id'], NeoFormContextField['error']>>(
    Object.fromEntries([...this.#fields.entries()].map(([id, field]) => [id, field.error]).filter(([_, error]) => !!error)),
  );

  get fields() {
    return this.#entries;
  }

  get values() {
    return this.#values;
  }

  get initials() {
    return this.#initials;
  }

  get touched() {
    return this.#touched;
  }

  get dirty() {
    return this.#dirty;
  }

  get valid() {
    return this.#valid;
  }

  get messages() {
    return this.#messages;
  }

  get errors() {
    return this.#errors;
  }

  constructor(id: string = `neo-form-${getUUID()}`) {
    this.#id = id;
  }

  register(field: NeoFormContextField) {
    if (!field?.id) throw new Error('Field id is required'); // TODO: Add a better error message
    if (this.#fields.has(field.id)) throw new Error('Field id already exists'); // TODO: Add a better error message
    this.#fields.set(field.id, field);
  }

  remove(id: NeoFormContextField['id']) {
    this.#fields.delete(id);
  }
}

const NeoFormContextSymbol = Symbol('NeoFormContext');

export const getNeoFormContext = (): NeoFormContext => {
  return getContext(NeoFormContextSymbol);
};

export const setNeoFormContext = (id?: string): NeoFormContext => {
  return setContext(NeoFormContextSymbol, new NeoFormContext(id));
};
