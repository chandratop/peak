'use client';

import { useState, useEffect } from 'react';
import type { Feature, LineString } from 'geojson';
import { parseGpxToLineString } from '@/lib/parseGpx';
import { EXPEDITION } from '@/lib/expedition.config';

interface UseGpxTrackResult {
  geojson: Feature<LineString> | null;
  loading: boolean;
  error: string | null;
}

export function useGpxTrack(): UseGpxTrackResult {
  const [geojson, setGeojson] = useState<Feature<LineString> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(EXPEDITION.gpxPath)
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
  }, []);

  return { geojson, loading, error };
}
