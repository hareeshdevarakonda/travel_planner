import { useState, useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (initialData, fetchApi) => {
  const [items, setItems] = useState(initialData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const newData = await fetchApi(page + 1);
    
    if (newData.length === 0) {
      setHasMore(false);
    } else {
      setItems((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);
    }
    setLoading(false);
  }, [page, loading, hasMore, fetchApi]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return { items, loading, loaderRef };
};