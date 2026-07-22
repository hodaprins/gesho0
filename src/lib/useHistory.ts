import { useCallback, useRef, useState } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(initial: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initial,
    future: [],
  });
  const skipNext = useRef(false);

  const set = useCallback(
    (updater: T | ((prev: T) => T), skipHistory = false) => {
      setState((prev) => {
        const nextValue =
          typeof updater === 'function' ? (updater as (p: T) => T)(prev.present) : updater;
        if (Object.is(nextValue, prev.present)) return prev;
        if (skipHistory || skipNext.current) {
          skipNext.current = false;
          return { ...prev, present: nextValue };
        }
        return {
          past: [...prev.past, prev.present].slice(-50),
          present: nextValue,
          future: [],
        };
      });
    },
    [],
  );

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      return {
        past: prev.past.slice(0, -1),
        present: previous,
        future: [prev.present, ...prev.future].slice(0, 50),
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      return {
        past: [...prev.past, prev.present].slice(-50),
        present: next,
        future: prev.future.slice(1),
      };
    });
  }, []);

  const reset = useCallback((value: T) => {
    skipNext.current = true;
    setState({ past: [], present: value, future: [] });
  }, []);

  return {
    state: state.present,
    set,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    historyDepth: state.past.length,
  };
}
