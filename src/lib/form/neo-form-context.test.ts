import { describe, expect, it, vi } from 'vitest';

import { NeoErrorFormDuplicateId, NeoErrorFormMissingId } from '~/utils/error.utils.js';

import { NeoFormContext } from './neo-form-context.svelte.js';

function field(overrides: Partial<Parameters<NeoFormContext['register']>[0]> = {}) {
  return {
    id: overrides.id ?? `field-${Math.random().toString(36).slice(2)}`,
    name: undefined,
    form: undefined,
    type: undefined,
    state: { touched: false, dirty: false, valid: true, value: undefined, initial: undefined, ...(overrides.state ?? {}) },
    ...overrides,
  };
}

describe('neoFormContext — registration', { tags: ['jsdom'] }, () => {
  it('register adds a field by id and stores it in fields', () => {
    const ctx = new NeoFormContext('form-1');
    ctx.register(field({ id: 'a' }));
    expect(Object.keys(ctx.fields)).toEqual(['a']);
  });

  it('register throws NeoErrorFormMissingId when id is missing', () => {
    const ctx = new NeoFormContext('form-1');
    expect(() => ctx.register(field({ id: '' }))).toThrow(NeoErrorFormMissingId);
  });

  it('register throws NeoErrorFormDuplicateId on second insert with same id', () => {
    const ctx = new NeoFormContext('form-1');
    ctx.register(field({ id: 'dup' }));
    expect(() => ctx.register(field({ id: 'dup' }))).toThrow(NeoErrorFormDuplicateId);
  });

  it('register silently ignores fields whose form id does not match', () => {
    const ctx = new NeoFormContext('form-1');
    ctx.register(field({ id: 'a', form: 'form-2' }));
    expect(Object.keys(ctx.fields)).toEqual([]);
  });

  it('register accepts fields with matching form id', () => {
    const ctx = new NeoFormContext('form-1');
    ctx.register(field({ id: 'a', form: 'form-1' }));
    expect(Object.keys(ctx.fields)).toEqual(['a']);
  });

  it('remove deletes a registered field by id', () => {
    const ctx = new NeoFormContext('form-1');
    ctx.register(field({ id: 'a' }));
    ctx.remove('a');
    expect(Object.keys(ctx.fields)).toEqual([]);
  });
});

describe('neoFormContext — values & initials', { tags: ['jsdom'] }, () => {
  it('keys values by id when name is undefined', () => {
    const ctx = new NeoFormContext('form-1');
    ctx.register(field({ id: 'a', state: { touched: false, dirty: false, valid: true, value: 1, initial: 0 } }));
    ctx.register(field({ id: 'b', state: { touched: false, dirty: false, valid: true, value: 'foo', initial: 'bar' } }));
    expect(ctx.values).toEqual({ a: 1, b: 'foo' });
    expect(ctx.initials).toEqual({ a: 0, b: 'bar' });
  });

  it('keys values by name when name is provided', () => {
    const ctx = new NeoFormContext('form-1');
    ctx.register(field({ id: 'a', name: 'first', state: { touched: false, dirty: false, valid: true, value: 'X' } }));
    expect(ctx.values).toEqual({ first: 'X' });
  });

  it('groups same-name radio fields into an array', () => {
    const ctx = new NeoFormContext('form-1');
    ctx.register(field({ id: 'a', name: 'choice', type: 'radio', state: { touched: false, dirty: false, valid: true, value: 'A' } }));
    ctx.register(field({ id: 'b', name: 'choice', type: 'radio', state: { touched: false, dirty: false, valid: true, value: 'B' } }));
    expect(ctx.values).toEqual({ choice: ['A', 'B'] });
  });

  it('groups same-name fields into an array when name ends with []', () => {
    const ctx = new NeoFormContext('form-1');
    ctx.register(field({ id: 'a', name: 'tag[]', state: { touched: false, dirty: false, valid: true, value: 1 } }));
    ctx.register(field({ id: 'b', name: 'tag[]', state: { touched: false, dirty: false, valid: true, value: 2 } }));
    expect(ctx.values).toEqual({ tag: [1, 2] });
  });

  it('arrays duplicate names even without radio/[] (any second hit collects)', () => {
    const ctx = new NeoFormContext('form-1');
    ctx.register(field({ id: 'a', name: 'first', state: { touched: false, dirty: false, valid: true, value: 'A' } }));
    ctx.register(field({ id: 'b', name: 'first', state: { touched: false, dirty: false, valid: true, value: 'B' } }));
    // toRecord uses `current !== undefined` as a coalescing trigger,
    // so the second insert under the same name promotes the value to an array.
    expect(ctx.values).toEqual({ first: ['A', 'B'] });
  });
});

describe('neoFormContext — touched / dirty / valid aggregations', { tags: ['jsdom'] }, () => {
  it('touched=true when at least one field is touched', () => {
    const ctx = new NeoFormContext();
    ctx.register(field({ id: 'a', state: { touched: false, dirty: false, valid: true } }));
    ctx.register(field({ id: 'b', state: { touched: true, dirty: false, valid: true } }));
    expect(ctx.touched).toBe(true);
  });

  it('touched=false when no field is touched', () => {
    const ctx = new NeoFormContext();
    ctx.register(field({ id: 'a', state: { touched: false, dirty: false, valid: true } }));
    expect(ctx.touched).toBe(false);
  });

  it('dirty=true when at least one field is dirty', () => {
    const ctx = new NeoFormContext();
    ctx.register(field({ id: 'a', state: { touched: false, dirty: true, valid: true } }));
    expect(ctx.dirty).toBe(true);
  });

  it('valid=false when at least one field is invalid', () => {
    const ctx = new NeoFormContext();
    ctx.register(field({ id: 'a', state: { touched: false, dirty: false, valid: true } }));
    ctx.register(field({ id: 'b', state: { touched: false, dirty: false, valid: false } }));
    expect(ctx.valid).toBe(false);
  });

  it('valid=true (vacuous) when no fields are registered', () => {
    const ctx = new NeoFormContext();
    expect(ctx.valid).toBe(true);
  });
});

describe('neoFormContext — messages & errors omit nullish entries', { tags: ['jsdom'] }, () => {
  it('only fields with truthy messages appear', () => {
    const ctx = new NeoFormContext();
    ctx.register(field({ id: 'a', state: { touched: false, dirty: false, valid: true, value: 1 }, message: 'ok' }));
    ctx.register(field({ id: 'b', state: { touched: false, dirty: false, valid: true, value: 2 }, message: undefined }));
    expect(ctx.messages).toEqual({ a: 'ok' });
  });

  it('only fields with truthy errors appear', () => {
    const ctx = new NeoFormContext();
    ctx.register(field({ id: 'a', state: { touched: false, dirty: false, valid: false, value: 1 }, error: 'required' }));
    ctx.register(field({ id: 'b', state: { touched: false, dirty: false, valid: true, value: 2 } }));
    expect(ctx.errors).toEqual({ a: 'required' });
  });
});

describe('neoFormContext — validate()', { tags: ['jsdom'] }, () => {
  it('calls ref.validate() on every registered field that has one', () => {
    const ctx = new NeoFormContext();
    const validateA = vi.fn();
    const validateB = vi.fn();
    ctx.register(field({ id: 'a', ref: { validate: validateA } as never }));
    ctx.register(field({ id: 'b', ref: { validate: validateB } as never }));
    ctx.validate();
    expect(validateA).toHaveBeenCalledOnce();
    expect(validateB).toHaveBeenCalledOnce();
  });

  it('returns the aggregated validation state', () => {
    const ctx = new NeoFormContext();
    ctx.register(field({ id: 'a', state: { touched: true, dirty: false, valid: true, value: 1, initial: 0 } }));
    ctx.register(field({ id: 'b', state: { touched: false, dirty: true, valid: false, value: 'x' } }));
    expect(ctx.validate()).toEqual({
      touched: true,
      dirty: true,
      valid: false,
      value: ctx.values,
      initial: ctx.initials,
    });
  });

  it('skips fields that have no ref or no validate method', () => {
    const ctx = new NeoFormContext();
    ctx.register(field({ id: 'a' })); // no ref
    ctx.register(field({ id: 'b', ref: {} as never })); // ref but no validate
    expect(() => ctx.validate()).not.toThrow();
  });
});
