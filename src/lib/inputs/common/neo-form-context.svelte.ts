import { getUUID } from '@dvcol/common-utils/common/string';
import { getContext, setContext } from 'svelte';

import { SvelteMap } from 'svelte/reactivity';

import type { HTMLInputTypeAttribute } from 'svelte/elements';
import type { NeoValidationState } from '~/inputs/common/neo-validation.model.js';

import { NeoErrorFormDuplicateId, NeoErrorFormMissingId } from '~/utils/error.utils.js';

export type NeoFormContextFieldHTMLElement<Element extends HTMLElement = HTMLElement> = Element & {
  /**
   * Check the input validity.
   * @param update whether to check the input dirty and/or valid state.
   */
  validate?: (update?: { dirty?: boolean; valid?: boolean }) => NeoValidationState<unknown>;
};

export type NeoFormType = HTMLInputTypeAttribute | 'range' | 'switch' | null;

export type NeoFormContextField<Value = unknown, Element extends NeoFormContextFieldHTMLElement = NeoFormContextFieldHTMLElement> = {
  id: string;
  ref?: Element;
  name?: string | null;
  form?: string | null;
  type?: NeoFormType;
  state: NeoValidationState<Value>;
  error?: unknown | string;
  message?: unknown | string;
};

type NeoFormContextFieldRecord<Key extends keyof NeoFormContextField | keyof NeoFormContextField['state']> = Key extends keyof NeoFormContextField
  ? Record<string, NeoFormContextField[Key] | NeoFormContextField[Key][]>
  : Key extends keyof NeoFormContextField['state']
    ? Record<string, NeoFormContextField['state'][Key] | NeoFormContextField['state'][Key][]>
    : never;

const toRecord = <Key extends keyof NeoFormContextField | keyof NeoFormContextField['state']>(
  map: Map<NeoFormContextField['id'], NeoFormContextField>,
  key: Key,
  nullable = true,
): NeoFormContextFieldRecord<Key> =>
  [...map.entries()].sort().reduce((acc, [id, field]) => {
    const val = key in field ? field[key as keyof NeoFormContextField] : field.state[key as keyof NeoFormContextField['state']];
    if (!nullable && (val === undefined || val === null)) return acc;
    if (field.name) {
      const name = field.name.replace('[]', '');
      const current = acc[name];
      if (current !== undefined || field.type === 'radio' || field.name.endsWith('[]')) {
        if (Array.isArray(current)) acc[name] = [...current, val];
        else if (current !== undefined) acc[name] = [current, val];
        else acc[name] = [val];
      } else acc[name] = val;
    } else acc[id] = val;
    return acc;
  }, {} as NeoFormContextFieldRecord<Key>);

export class NeoFormContext {
  readonly #id: string;
  readonly #fields = new SvelteMap<NeoFormContextField['id'], NeoFormContextField>();
  readonly #entries = $derived<Record<NeoFormContextField['id'], NeoFormContextField>>(Object.fromEntries(this.#fields.entries()));
  readonly #values = $derived<Record<NeoFormContextField['id'], NeoFormContextField['state']['value']>>(toRecord(this.#fields, 'value'));
  readonly #initials = $derived<Record<NeoFormContextField['id'], NeoFormContextField['state']['initial']>>(toRecord(this.#fields, 'initial'));
  readonly #touched = $derived<boolean>([...this.#fields.values()].some(field => field.state.touched));
  readonly #dirty = $derived<boolean>([...this.#fields.values()].some(field => field.state.dirty));
  readonly #valid = $derived<boolean>([...this.#fields.values()].every(field => field.state.valid));

  readonly #messages = $derived<Record<NeoFormContextField['id'], NeoFormContextField['message']>>(toRecord(this.#fields, 'message', false));
  readonly #errors = $derived<Record<NeoFormContextField['id'], NeoFormContextField['error']>>(toRecord(this.#fields, 'error', false));

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
    if (field?.form && field.form !== this.#id) return;
    if (!field?.id) throw new NeoErrorFormMissingId();
    if (this.#fields.has(field.id)) throw new NeoErrorFormDuplicateId();
    this.#fields.set(field.id, field);
  }

  remove(id: NeoFormContextField['id']) {
    this.#fields.delete(id);
  }

  validate(): NeoValidationState {
    this.#fields.forEach(field => field.ref?.validate?.());
    return { touched: this.touched, dirty: this.dirty, valid: this.valid, value: this.values, initial: this.initials };
  }
}

const NeoFormContextSymbol = Symbol('NeoFormContext');

export const getNeoFormContext = (): NeoFormContext => {
  return getContext(NeoFormContextSymbol);
};

export const setNeoFormContext = (id?: string): NeoFormContext => {
  return setContext(NeoFormContextSymbol, new NeoFormContext(id));
};
