const useAbortPromise = <T>({
  controller = new AbortController(),
  fallback,
  error,
  onAbort,
  onResolve,
  onReject,
}: {
  controller?: AbortController;
  error?: Error | unknown;
  fallback?: T | PromiseLike<T>;
  onAbort?: (controller: AbortController) => void;
  onResolve?: (value?: T) => void;
  onReject?: (reason?: unknown) => void;
} = {}) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  const abort = () => {
    onAbort?.(controller);
    if (error) reject(error);
    resolve(fallback);
  };
  controller.signal.addEventListener('abort', abort);
  return {
    controller,
    promise,
    resolve: (value?: T) => {
      onResolve?.(value);
      controller.signal.removeEventListener('abort', abort);
      resolve(value);
    },
    reject: (reason?: unknown) => {
      onReject?.(reason);
      controller.signal.removeEventListener('abort', abort);
      reject(reason);
    },
    abort,
  };
};

export const KeyboardLayouts = Object.freeze({
  Qwerty: 'qwerty' as const,
  Azerty: 'azerty' as const,
} as const);

export type KeyboardLayout = (typeof KeyboardLayouts)[keyof typeof KeyboardLayouts];

const KeyboardTypoMap: Record<KeyboardLayout, Record<string, string>> = Object.freeze({
  [KeyboardLayouts.Qwerty]: Object.freeze({
    q: 'wa',
    w: 'qse',
    e: 'wrd',
    r: 'etf',
    t: 'ryg',
    y: 'tuh',
    u: 'yij',
    i: 'uok',
    o: 'ipl',
    p: 'o',
    a: 'qsz',
    s: 'awed',
    d: 'serf',
    f: 'drtg',
    g: 'ftyh',
    h: 'gyuj',
    j: 'huik',
    k: 'jiol',
    l: 'kop',
    z: 'asx',
    x: 'zdc',
    c: 'xdfv',
    v: 'cfgb',
    b: 'vghn',
    n: 'bhjm',
    m: 'njk',
    '1': '2q',
    '2': '13w',
    '3': '24e',
    '4': '35r',
    '5': '46t',
    '6': '57y',
    '7': '68u',
    '8': '79i',
    '9': '80o',
    '0': '9p',
    '-': '0=',
    '=': '-',
    '.': ',/',
    ',': 'm.',
    '/': '.',
  } as const),
  [KeyboardLayouts.Azerty]: Object.freeze({
    a: 'qzs',
    z: 'aqse',
    e: 'zrsd',
    r: 'etfd',
    t: 'rygf',
    y: 'tuhg',
    u: 'yijh',
    i: 'uokj',
    o: 'iplk',
    p: 'o',
    q: 'azw',
    s: 'awed',
    d: 'serf',
    f: 'drtg',
    g: 'ftyh',
    h: 'gyuj',
    j: 'huik',
    k: 'jiol',
    l: 'kopm',
    m: 'l',
    w: 'qsx',
    x: 'wcd',
    c: 'xdfv',
    v: 'cfgb',
    b: 'vghn',
    n: 'bhjm',
    '1': '2a',
    '2': '13z',
    '3': '24e',
    '4': '35r',
    '5': '46t',
    '6': '57y',
    '7': '68u',
    '8': '79i',
    '9': '80o',
    '0': '9p',
    '-': '0=',
    '=': '-',
    '.': ',/',
    ',': 'm.',
    '/': '.',
  } as const),
} as const);

const generateTypo = (char: string, layout: KeyboardLayout) => {
  const lowerChar = char.toLowerCase();
  const keyMap = KeyboardTypoMap[layout] || KeyboardTypoMap.qwerty;

  // If no mapping, return the original character
  if (!keyMap[lowerChar]) return char;

  const possibleChars = keyMap[lowerChar];
  return possibleChars[Math.floor(Math.random() * possibleChars.length)];
};

export type TypeWriterRandomOptions = {
  /**
   * Should generate typos
   */
  enabled?: boolean;
  /**
   * How often to generate a typo
   *
   * @default 0.2 (20% chance)
   */
  odds?: number;
  /**
   * Modulo to generate a typo
   *
   * @default 5 (every 5 characters)
   */
  modulo?: number;
};

export type TypeWriterTypoOptions = TypeWriterRandomOptions & {
  /**
   * The keyboard layout to use for typos
   *
   * @default KeyboardLayouts.Qwerty
   */
  layout?: KeyboardLayout;
};

export type TypeWriterPauseOptions = TypeWriterRandomOptions & {
  /**
   * Which mode to use for sleep value
   */
  mode?: 'write' | 'delete';
  /**
   * Duration of the pause
   *
   * @default { write: 600, delete: 400 }
   */
  speed?: TypeWriterSpeed;
  /**
   * Regex to match characters to pause on.
   *
   * @default /\s|[.,;:!?]/ (whitespace and punctuation)
   */
  regex?: RegExp;
  /**
   * Whether to pause between loops and iterations
   *
   * @default 2000
   */
  iterations?: boolean | number;
  /**
   * Abort controller to exit early
   */
  controller?: AbortController;
};

export type TypeWriterSpeed = {
  write: number | number[];
  delete: number | number[];
};

export type TypeWriterLine = {
  text: string;
  display?: string;
  mode?: 'write' | 'delete' | 'loop';
  speed?: TypeWriterSpeed;
  pause?: TypeWriterPauseOptions;
  typo?: TypeWriterTypoOptions;
};
export type TypeWriterContext = { line: number; text: string; display?: string; mode?: 'write' | 'delete' };
export type TypewriterOptions<T extends (string | TypeWriterLine)[] = (string | TypeWriterLine)[]> = {
  /**
   * The lines to iterate over
   */
  lines: T;
  /**
   * The current display text
   */
  display?: string;
  /**
   * The animation mode (write, delete, loop)
   *
   * @default 'write'
   */
  mode?: TypeWriterLine['mode'];
  /**
   * The speed of the typewriter (ms between characters)
   *
   * @default { write: 120, delete: 80 }
   */
  speed?: number | TypeWriterLine['speed'];
  /**
   * Optional pause options to semi-randomly pause between words or characters
   *
   * @default { enabled: false, odds: 0.1, modulo: 1, speed: { write: 600, delete: 400 } }
   */
  pause?: boolean | TypeWriterPauseOptions;
  /**
   * Optional typo options to semi-randomly generate typos in the text
   *
   * @default { enabled: false, odds: 0.1, modulo: 6, layout: KeyboardLayouts.Qwerty, speed: { write: 120, delete: 80 } }
   */
  typo?: boolean | TypeWriterTypoOptions;
  /**
   * Number of iterations to run the typewriter (0 for infinite)
   *
   * @default 1
   */
  iterations?: number;
  /**
   * Abort controller to exit early
   */
  controller?: AbortController;
  /**
   * Event handlers that fire when a new iteration starts (or when a loop change direction)
   *
   * @param context
   */
  onStart?: (context: TypeWriterContext & { iteration: number }) => void;
  /**
   * Event handlers that fire when a new iteration ends (or when a loop change direction)
   * @param context
   */
  onEnd?: (context: TypeWriterContext & { iteration: number }) => void;
  /**
   * Event handlers that fire when a new character is typed
   * @param context
   */
  onType?: (context: TypeWriterContext) => void;
  /**
   * Event handlers that fire when a typo is generated
   * @param context
   */
  onTypo?: (context: TypeWriterContext) => void;
  /**
   * Event handlers that fire when a pause is generated
   * @param context
   */
  onPause?: (context: TypeWriterContext) => void;
  /**
   * Event handlers that fire when the typewriter is aborted via the controller.
   * @param controller
   */
  onAbort?: (controller: AbortController) => void;
};

type TypeWriterSliceOptions<T extends TypeWriterLine[]> = Omit<TypewriterOptions<T>, 'mode' | 'typo' | 'pause' | 'speed' | 'lines'> & {
  mode: TypeWriterLine['mode'];
  typo?: TypeWriterLine['typo'];
  pause?: TypeWriterLine['pause'];
  speed?: TypeWriterLine['speed'];
};

const spaceRegex = /\s/;
const pauseRegex = /\s|[.,;:!?]/;

const defaults = {
  typo: {
    odds: 0.1,
    modulo: 6,
    layout: KeyboardLayouts.Qwerty,
  },
  pause: {
    odds: 0.1,
    modulo: 1,
    speed: {
      write: 600,
      delete: 400,
    },
    regex: pauseRegex,
    iterations: 2000,
  },
  speed: {
    write: 120,
    delete: 80,
  },
} satisfies Partial<TypewriterOptions>;

const sleep = (ms: number | number[] = defaults.speed.write, onAbort?: (c: AbortController) => void, controller?: AbortController) => {
  let timeout: ReturnType<typeof setTimeout>;
  const { promise, resolve } = useAbortPromise({
    controller,
    onAbort: c => {
      clearTimeout(timeout);
      onAbort?.(c);
    },
  });
  const speed = Array.isArray(ms) ? ms[Math.floor(Math.random() * ms.length)] : ms;
  timeout = setTimeout(resolve, speed);
  return promise;
};

const isLine = (line: string | TypeWriterLine): line is TypeWriterLine => typeof line !== 'string';
const toLine = (line: string | TypeWriterLine): TypeWriterLine => (isLine(line) ? line : { text: line });
const toRandom = <T extends TypeWriterRandomOptions>(typo?: boolean | T): T | undefined => {
  if (typeof typo === 'object') return { enabled: true, ...typo };
  if (typo === undefined) return;
  return { enabled: typo } as T;
};
const toSpeed = (speed?: number | TypeWriterSpeed): TypeWriterSpeed | undefined => {
  if (typeof speed === 'number') return { write: speed, delete: speed };
  return speed;
};

const mergeOptions = <T extends TypeWriterLine[]>(
  lineOptions: TypeWriterLine,
  options: Omit<TypewriterOptions, 'lines'>,
): TypeWriterSliceOptions<T> => {
  const pause: TypeWriterPauseOptions = { ...defaults.pause, ...toRandom(options.pause), ...toRandom(lineOptions.pause) };
  return {
    ...options,
    ...lineOptions,
    mode: lineOptions.mode || options.mode,
    typo: { ...toRandom(options.typo), ...toRandom(lineOptions.typo) },
    pause: { ...pause, speed: { ...defaults.pause.speed, ...pause.speed } },
    speed: { ...defaults.speed, ...toSpeed(options.speed), ...toSpeed(lineOptions.speed) },
  };
};

/* eslint-disable no-await-in-loop */

type TypeWriterDoOptions = {
  text: string;
  index: number;
  line: number;
  mode?: 'write' | 'delete';
};

const doPause = async <T extends TypeWriterLine[]>({
  display = '',
  text,
  index,
  line,
  mode = 'write',
  speed,
  regex = pauseRegex,
  odds = defaults.pause.odds,
  modulo = defaults.pause.modulo,
  controller,
  onPause,
  onAbort,
}: Pick<TypeWriterSliceOptions<T>, 'onPause' | 'onAbort' | 'display'> & TypeWriterDoOptions & TypeWriterPauseOptions) => {
  if (Math.random() >= odds) return;
  const char = text.charAt(index);
  if (regex && !regex.test(char)) return;
  if (modulo && index % modulo !== 0) return;
  onPause?.({ line, text, display, mode });
  await sleep(speed?.[mode], onAbort, controller);
};

const doTypo = async <T extends TypeWriterLine[]>({
  display = '',
  text,
  index,
  line,
  speed,
  mode = 'write',
  odds = defaults.typo.odds,
  modulo = defaults.typo.modulo,
  layout = defaults.typo.layout,
  onType,
  onTypo,
  onAbort,
  controller,
}: Pick<TypeWriterSliceOptions<T>, 'display' | 'speed' | 'controller' | 'onType' | 'onTypo' | 'onAbort'> &
  TypeWriterDoOptions &
  TypeWriterTypoOptions) => {
  if (Math.random() >= odds) return;
  if (index % modulo !== 0) return;
  const char = text.charAt(index);
  if (spaceRegex.test(char)) return;

  // Add typo
  display += generateTypo(char, layout);
  onType?.({ line, text, display, mode });
  onTypo?.({ line, text, display, mode });
  await sleep(speed?.write, onAbort, controller);

  // Finish word or 5 char
  let cursor = index + 1;
  let rest = text.charAt(cursor);
  while (!spaceRegex.test(rest) && cursor < text.length && cursor < index + modulo * 2) {
    if (controller?.signal.aborted) break;
    display += rest;
    cursor += 1;
    rest = text.charAt(cursor);
    onType?.({ line, text, display, mode });
    await sleep(speed?.write, onAbort, controller);
  }

  // Pause after word / 5 char
  await sleep(speed?.write, onAbort, controller);

  // Remove until typo
  while (cursor > index) {
    if (controller?.signal.aborted) return;
    display = display.slice(0, -1);
    cursor -= 1;
    onType?.({ line, text, display, mode });
    await sleep(speed?.delete ?? defaults.speed.delete, onAbort, controller);
  }
};

async function sliceText<T extends TypeWriterLine[]>(
  text: string,
  line: number,
  iteration: number,
  mode: 'write' | 'delete' = 'write',
  { display = '', controller, typo, pause, speed, onStart, onType, onTypo, onPause, onEnd, onAbort }: TypeWriterSliceOptions<T>,
) {
  if (mode === 'delete') display = text;
  // Type text
  onStart?.({ display, line, text, iteration, mode });
  for (let index = 0; index <= text.length; index += 1) {
    // generate typo every modulo 5 with 1/3 chance
    if (mode === 'write' && typo?.enabled) {
      await doTypo({ display, text, index, line, mode, speed, controller, onType, onTypo, ...typo });
    }

    if (controller?.signal.aborted) break;
    if (mode === 'write') display += text.charAt(index);
    else display = display.slice(0, -1);
    onType?.({ line, text, display, mode });
    await sleep(speed?.[mode] ?? defaults.speed[mode], onAbort, controller);
    if (pause?.enabled) await doPause({ display, text, index, line, mode, controller, onPause, ...pause });
  }
  onEnd?.({ display, line, text, iteration, mode });
  if (pause?.enabled && pause.iterations) {
    onPause?.({ line, text, display, mode });
    await sleep(typeof pause.iterations === 'number' ? pause.iterations : defaults.pause.iterations, onAbort, controller);
  }
}

export async function typewriter<T extends (string | TypeWriterLine)[]>({
  lines,
  iterations = 1,
  controller,
  ...options
}: TypewriterOptions<T>): Promise<string | undefined> {
  if (!lines.length) return options.display;

  // Iterate over lines
  for (let iteration = 0; iterations === 0 || iteration < iterations; iteration += 1) {
    if (controller?.signal.aborted) break;
    // Each Line
    for (let index = 0; index < lines.length; index += 1) {
      if (controller?.signal.aborted) break;
      const line: TypeWriterLine = toLine(lines[index]);
      const opts = mergeOptions(line, { controller, ...options });
      console.info('Typewriter:', opts);
      if (opts.mode === 'loop') {
        await sliceText(line.text, index, iteration, 'write', opts);
        await sliceText(line.text, index, iteration, 'delete', opts);
      } else {
        await sliceText(line.text, index, iteration, opts.mode, opts);
      }
    }
  }
  return options.display;
}
/* eslint-enable no-await-in-loop */
