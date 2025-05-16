export const NeoErrorType = {
  NeoError: 'NeoError',
  NeoThemeProvider: 'NeoThemeProvider',
  NeoList: 'NeoList',
  NeoTab: 'NeoTab',
  NeoCollapse: 'NeoCollapse',
  NeoForm: 'NeoForm',
  NeoProgress: 'NeoProgress',
} as const;

export type NeoErrorTypes = (typeof NeoErrorType)[keyof typeof NeoErrorType];

export const NeoErrorName = {
  TargetNotFound: 'Target not found',
  InvalidTarget: 'Target is not a valid HTMLElement or ShadowRoot',
} as const;

export class NeoError extends Error {
  readonly type: NeoErrorTypes;

  constructor(message: string, type: NeoErrorTypes = NeoErrorType.NeoError) {
    super(`[${type}]: ${message}`);
    this.type = type;
  }
}

export class NeoErrorThemeProvider extends NeoError {
  constructor(message: string) {
    super(message, NeoErrorType.NeoThemeProvider);
  }
}

export class NeoErrorThemeTargetNotFound extends NeoErrorThemeProvider {
  constructor() {
    super(NeoErrorName.TargetNotFound);
  }
}

export class NeoErrorThemeInvalidTarget extends NeoErrorThemeProvider {
  constructor() {
    super(NeoErrorName.InvalidTarget);
  }
}

export class NeoErrorThemeContextNotFound extends NeoErrorThemeProvider {
  constructor() {
    super('No theme context found. Did you forget to wrap your component with `NeoThemeProvider`?');
  }
}

export class NeoErrorListSelectDisabled extends NeoError {
  constructor() {
    super('Cannot select an item in a disabled list.', NeoErrorType.NeoList);
  }
}

export class NeoErrorMissingId extends NeoError {
  constructor(message = 'A unique ID is required.', type: NeoErrorTypes) {
    super(message, type);
  }
}

export class NeoErrorMissingTabId extends NeoErrorMissingId {
  constructor(message?: string) {
    super(message, NeoErrorType.NeoTab);
  }
}

export class NeoErrorMissingCollapseId extends NeoErrorMissingId {
  constructor(message?: string) {
    super(message, NeoErrorType.NeoCollapse);
  }
}

export class NeoErrorFormMissingId extends NeoErrorMissingId {
  constructor(message?: string) {
    super(message, NeoErrorType.NeoForm);
  }
}

export class NeoErrorFormDuplicateId extends NeoError {
  constructor() {
    super('Field id already exists', NeoErrorType.NeoForm);
  }
}

export class NeoErrorProgressContextNotFound extends NeoError {
  constructor() {
    super('Progress context not found', NeoErrorType.NeoProgress);
  }
}
