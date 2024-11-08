export const useButtonState = (prefix = '') => {
  const onClick = (...args: any) => {
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

  let skeleton = $state(false);
  const onSkeleton = (e: MouseEvent, checked?: boolean, duration = 5000) => {
    skeleton = !skeleton;
    setTimeout(() => {
      skeleton = !skeleton;
    }, duration);
    onClick(e);
  };

  return {
    onClick,
    loading: () => loading,
    skeleton: () => skeleton,
    onLoading,
    onSkeleton,
  };
};
