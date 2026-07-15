'use client';

import { useState, useEffect } from 'react';
import type { Feature, LineString } from 'geojson';
import { parseGpxToLineString } from '@/lib/parseGpx';
import { BASE_PATH } from '@/lib/expedition.config';
import { useExpedition } from '@/lib/expeditionContext';

interface UseGpxTrackResult {
  geojson: Feature<LineString> | null;
  loading: boolean;
  error: string | null;
}

export function useGpxTrack(): UseGpxTrackResult {
  const { slug } = useExpedition();
  const [geojson, setGeojson] = useState<Feature<LineString> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setGeojson(null);
    fetch(`${BASE_PATH}/data/${slug}/route.gpx`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch GPX: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const line = parseGpxToLineString(text);
        setGeojson(line);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  return { geojson, loading, error };
}
