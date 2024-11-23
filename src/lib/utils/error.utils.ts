export const NeoErrorType = {
  NeoError: 'NeoError' as const,
  NeoThemeProvider: 'NeoThemeProvider' as const,
} as const;

export type NeoErrorTypes = (typeof NeoErrorType)[keyof typeof NeoErrorType];

export const NeoErrorName = {
  TargetNotFound: 'Target not found' as const,
  InvalidTarget: 'Target is not a valid HTMLElement or ShadowRoot' as const,
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
