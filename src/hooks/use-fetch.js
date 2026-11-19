import { useCallback, useRef, useState } from "react";

/**
 * Wraps an async function with `data` / `loading` / `error` state.
 *
 * `run(...args)` calls the function and never throws: it resolves to
 * `{ data, error }` so callers can branch on the outcome without try/catch.
 * `data` keeps its last successful value if a later run fails.
 */
export function useFetch(asyncFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Always call the latest function without making `run` change identity.
  const asyncFnRef = useRef(asyncFn);
  asyncFnRef.current = asyncFn;

  const run = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFnRef.current(...args);
      setData(result);
      return { data: result, error: null };
    } catch (caught) {
      setError(caught);
      return { data: null, error: caught };
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, run };
}
