import { watch } from '@dvcol/svelte-utils/watch';

export const doubleBind = <T = unknown, E = unknown>({
  outer,
  inner,
  input,
  output,
}: {
  outer: () => T;
  inner: () => T;
  input: () => E;
  output: () => E;
}) => {
  watch(outer, () => {
    if (outer() === inner()) return;
    input();
  });
  watch(inner, () => {
    if (outer() === inner()) return;
    output();
  });
};
