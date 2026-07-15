'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import type { GearItem, GearCategory, GearStatus, GearPriority } from '@/types/gear';
import { BASE_PATH } from '@/lib/expedition.config';

interface UseGearManifestResult {
  items: GearItem[];
  loading: boolean;
  error: string | null;
}

export function useGearManifest(): UseGearManifestResult {
  const [items, setItems] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE_PATH}/data/gear-manifest.csv`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch gear manifest: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const result = Papa.parse<Record<string, string>>(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
        });

        const parsed: GearItem[] = result.data.map((row) => ({
          item_name: row.item_name ?? '',
          category: (row.category ?? 'misc') as GearCategory,
          weight_g: Number(row.weight_g) || 0,
          qty: Number(row.qty) || 1,
          status: (row.status ?? 'needed') as GearStatus,
          priority: (row.priority ?? 'optional') as GearPriority,
        }));

        setItems(parsed);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { items, loading, error };
}
