export function useButtonState(prefix = '') {
  const onClick = (...args: unknown[]) => {
    console.info(prefix, ...args);
  };

  let loading = $state(false);
  const onLoading = (e: MouseEvent, checked?: boolean, duration = 5000) => {
    loading = !loading;
    setTimeout(() => {
      loading = !loading;
    }, duration);
    onClick(e);
  };

  return {
    onClick,
    loading: () => loading,
    onLoading,
  };
}
