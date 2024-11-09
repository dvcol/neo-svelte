export const useTimeout = <T extends any[]>(cb: (...args: T) => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const clear = () => clearTimeout(timeout);
  return {
    start: (...args: T) => {
      clear();
      timeout = setTimeout(() => cb(...args), delay);
    },
    immediate: (...args: T) => {
      clear();
      cb(...args);
    },
    clear,
  };
};
