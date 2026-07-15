'use client';

import { useState, useEffect } from 'react';
import type { RouteWaypointsFile } from '@/types/route';
import { BASE_PATH } from '@/lib/expedition.config';
import { useExpedition } from '@/lib/expeditionContext';

interface UseRouteWaypointsResult {
  data: RouteWaypointsFile | null;
  loading: boolean;
  error: string | null;
}

export function useRouteWaypoints(): UseRouteWaypointsResult {
  const { slug } = useExpedition();
  const [data, setData] = useState<RouteWaypointsFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setData(null);
    fetch(`${BASE_PATH}/data/${slug}/route-waypoints.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch waypoints: ${res.status}`);
        return res.json() as Promise<RouteWaypointsFile>;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  return { data, loading, error };
}
