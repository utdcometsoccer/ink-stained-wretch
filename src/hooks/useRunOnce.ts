import { useEffect, useRef, type RefObject } from "react";

/**
 * Runs the provided effect exactly once per mount, even under React Strict Mode.
 * Provides a cancelRef that will be set to true on cleanup to avoid state updates after unmount.
 */
export function useRunOnce(
  effect: (cancelRef: RefObject<boolean>) => void | Promise<void>
): void {
  const didRunRef = useRef(false);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    void Promise.resolve(effect(cancelRef));

    return () => {
      cancelRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
