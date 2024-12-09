type Value = string | undefined | null;
type Values = Record<string, boolean> | Value[] | Value;
const parse = (values?: Values, separator = ' '): string | undefined => {
  if (!values) return;
  if (typeof values === 'string') return values;
  if (Array.isArray(values)) return values.filter(Boolean).join(separator);
  return Object.entries(values)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(separator);
};

const merge = (styles?: Values, ...args: Value[]): Values => {
  if (!args.length) return styles;
  if (!styles) return args;
  if (Array.isArray(styles)) return styles.concat(args);
  if (typeof styles === 'string') return [styles, ...args];
  return args.reduce((acc, value) => {
    if (value?.length) acc[value] = true;
    return acc;
  }, styles);
};

export const toClass = (classes?: Values, ...args: Value[]) => parse(merge(classes, ...args));
export const toStyle = (styles?: Values, ...args: Value[]) => parse(merge(styles, ...args), '; ');
