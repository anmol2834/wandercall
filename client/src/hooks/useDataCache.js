import { useState, useEffect, useRef } from 'react';

const cache = new Map();
const pendingRequests = new Map();
const abortControllers = new Map();

export const useDataCache = (key, fetchFn, options = {}) => {
  const { 
    ttl = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
    dependencies = []
  } = options;

  const [data, setData] = useState(() => cache.get(key)?.data || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchData = async (forceRefresh = false) => {
    if (!enabled) return;

    const cached = cache.get(key);
    const isExpired = cached && Date.now() > cached.expiry;

    if (!forceRefresh && cached && !isExpired) {
      setData(cached.data);
      return cached.data;
    }

    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }

    setLoading(true);
    setError(null);

    const abortController = new AbortController();
    abortControllers.set(key, abortController);

    const request = fetchFn(abortController.signal)
      .then(result => {
        if (!mountedRef.current) return result;

        cache.set(key, {
          data: result,
          expiry: Date.now() + ttl
        });

        setData(result);
        setLoading(false);
        return result;
      })
      .catch(err => {
        if (!mountedRef.current) return;

        if (err.name !== 'AbortError') {
          setError(err);
        }
        setLoading(false);
        throw err;
      })
      .finally(() => {
        pendingRequests.delete(key);
        abortControllers.delete(key);
      });

    pendingRequests.set(key, request);
    return request;
  };

  const mutate = (newData) => {
    cache.set(key, {
      data: newData,
      expiry: Date.now() + ttl
    });
    setData(newData);
  };

  const invalidate = () => {
    cache.delete(key);
    const controller = abortControllers.get(key);
    if (controller) {
      controller.abort();
    }
  };

  useEffect(() => {
    fetchData();
  }, [key, enabled, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    mutate,
    invalidate
  };
};

export const clearCache = (pattern) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};