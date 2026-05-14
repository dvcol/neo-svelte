import { describe, expect, it } from 'vitest';

import {
  NeoError,
  NeoErrorFormDuplicateId,
  NeoErrorFormMissingId,
  NeoErrorListSelectDisabled,
  NeoErrorMissingCollapseId,
  NeoErrorMissingId,
  NeoErrorMissingTabId,
  NeoErrorName,
  NeoErrorNotificationDuplicateId,
  NeoErrorNotificationMissingId,
  NeoErrorNotificationNotFound,
  NeoErrorNotificationProviderNotFound,
  NeoErrorNotificationServiceNotFound,
  NeoErrorProgressContextNotFound,
  NeoErrorThemeContextNotFound,
  NeoErrorThemeInvalidTarget,
  NeoErrorThemeProvider,
  NeoErrorThemeTargetNotFound,
  NeoErrorType,
} from './error.utils.js';

describe('neoError — base class', () => {
  it('prefixes the message with the type', () => {
    const err = new NeoError('boom');
    expect(err.message).toBe('[NeoError]: boom');
    expect(err.type).toBe('NeoError');
  });

  it('lets subclasses override type via constructor argument', () => {
    const err = new NeoError('x', NeoErrorType.NeoForm);
    expect(err.message).toBe('[NeoForm]: x');
    expect(err.type).toBe('NeoForm');
  });

  it('is an instance of Error', () => {
    expect(new NeoError('x')).toBeInstanceOf(Error);
  });
});

describe('theme errors', () => {
  it('neoErrorThemeProvider sets type=NeoThemeProvider', () => {
    const err = new NeoErrorThemeProvider('x');
    expect(err.type).toBe('NeoThemeProvider');
    expect(err.message).toBe('[NeoThemeProvider]: x');
  });

  it('neoErrorThemeTargetNotFound uses the canonical name', () => {
    expect(new NeoErrorThemeTargetNotFound().message).toBe(`[NeoThemeProvider]: ${NeoErrorName.TargetNotFound}`);
  });

  it('neoErrorThemeInvalidTarget uses the canonical name', () => {
    expect(new NeoErrorThemeInvalidTarget().message).toBe(`[NeoThemeProvider]: ${NeoErrorName.InvalidTarget}`);
  });

  it('neoErrorThemeContextNotFound has the wrap-with-NeoThemeProvider message', () => {
    expect(new NeoErrorThemeContextNotFound().message).toContain('NeoThemeProvider');
  });
});

describe('missing-id errors', () => {
  it('neoErrorMissingId default message', () => {
    expect(new NeoErrorMissingId(undefined, NeoErrorType.NeoForm).message).toBe('[NeoForm]: A unique ID is required.');
  });

  it('neoErrorMissingTabId scopes to NeoTab', () => {
    expect(new NeoErrorMissingTabId().type).toBe('NeoTab');
  });

  it('neoErrorMissingCollapseId scopes to NeoCollapse', () => {
    expect(new NeoErrorMissingCollapseId().type).toBe('NeoCollapse');
  });

  it('neoErrorFormMissingId scopes to NeoForm', () => {
    expect(new NeoErrorFormMissingId().type).toBe('NeoForm');
  });
});

describe('form errors', () => {
  it('neoErrorFormDuplicateId has the canonical message', () => {
    expect(new NeoErrorFormDuplicateId().message).toBe('[NeoForm]: Field id already exists');
  });
});

describe('list errors', () => {
  it('neoErrorListSelectDisabled is scoped to NeoList', () => {
    const err = new NeoErrorListSelectDisabled();
    expect(err.type).toBe('NeoList');
    expect(err.message).toBe('[NeoList]: Cannot select an item in a disabled list.');
  });
});

describe('progress errors', () => {
  it('neoErrorProgressContextNotFound is scoped to NeoProgress', () => {
    const err = new NeoErrorProgressContextNotFound();
    expect(err.type).toBe('NeoProgress');
  });
});

describe('notification errors', () => {
  it('neoErrorNotificationMissingId requires id', () => {
    expect(new NeoErrorNotificationMissingId().message).toBe('[NeoNotification]: Notification id is required');
  });

  it('neoErrorNotificationNotFound includes the missing id', () => {
    const err = new NeoErrorNotificationNotFound('abc');
    expect(err.id).toBe('abc');
    expect(err.message).toBe(`[NeoNotification]: Notification 'abc' not found`);
  });

  it('neoErrorNotificationDuplicateId stores the id', () => {
    const err = new NeoErrorNotificationDuplicateId('xyz');
    expect(err.id).toBe('xyz');
    expect(err.message).toBe(`[NeoNotification]: Notification stack with id 'xyz' already exists`);
  });

  it('neoErrorNotificationProviderNotFound has the provider hint', () => {
    expect(new NeoErrorNotificationProviderNotFound().message).toContain('Notification provider not found');
  });

  it('neoErrorNotificationServiceNotFound omits id hint when none given', () => {
    expect(new NeoErrorNotificationServiceNotFound().message).toBe('[NeoNotification]: Notification service not found.');
  });

  it('neoErrorNotificationServiceNotFound appends id hint when provided', () => {
    expect(new NeoErrorNotificationServiceNotFound('svc')).toEqual(
      expect.objectContaining({
        message: `[NeoNotification]: Notification service not found. Make sure you have a service with id 'svc'.`,
      }),
    );
  });
});
