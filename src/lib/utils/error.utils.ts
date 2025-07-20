export const NeoErrorType = {
  NeoError: 'NeoError',
  NeoThemeProvider: 'NeoThemeProvider',
  NeoList: 'NeoList',
  NeoTab: 'NeoTab',
  NeoCollapse: 'NeoCollapse',
  NeoForm: 'NeoForm',
  NeoProgress: 'NeoProgress',
  NeoNotification: 'NeoNotification',
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

export class NeoErrorNotificationMissingId extends NeoError {
  constructor() {
    super('Notification id is required', NeoErrorType.NeoNotification);
  }
}

export class NeoErrorNotificationNotFound extends NeoError {
  readonly id?: string;
  constructor(id?: string) {
    super(`Notification '${id}' not found`, NeoErrorType.NeoNotification);
    this.id = id;
  }
}

export class NeoErrorNotificationDuplicateId extends NeoError {
  readonly id: string;
  constructor(id: string) {
    super(`Notification stack with id '${id}' already exists`, NeoErrorType.NeoNotification);
    this.id = id;
  }
}

export class NeoErrorNotificationProviderNotFound extends NeoError {
  constructor() {
    super('Notification provider not found. Please ensure you have a provider in your app.', NeoErrorType.NeoNotification);
  }
}

export class NeoErrorNotificationServiceNotFound extends NeoError {
  constructor(id?: string) {
    super(`Notification service not found.${id ? ` Make sure you have a service with id '${id}'.` : ''}`, NeoErrorType.NeoNotification);
  }
}
