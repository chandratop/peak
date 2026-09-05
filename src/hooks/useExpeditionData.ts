'use client';

import { useEffect, useState } from 'react';
import { BASE_PATH } from '@/lib/expedition.config';
import { useExpedition } from '@/lib/expeditionContext';

const requests = new Map<string, Promise<string>>();
export function useExpeditionData<T>(file: string, parse: (text: string) => T) {
  const { slug } = useExpedition();
  const url = `${BASE_PATH}/data/${slug}/${file}`;
  const [state, setState] = useState<{ url: string; data: T | null; loading: boolean; error: string | null }>({ url, data: null, loading: true, error: null });
  useEffect(() => {
    let active = true;
    setState({ url, data: null, loading: true, error: null });
    let request = requests.get(url);
    if (!request) {
      request = fetch(url).then(res => { if (!res.ok) throw new Error(`Unable to load ${file} (${res.status})`); return res.text(); });
      requests.set(url, request);
      request.catch(() => requests.delete(url));
    }
    request.then(parse).then(data => { if (active) setState({ url, data, loading: false, error: null }); }).catch((error: unknown) => { if (active) setState({ url, data: null, loading: false, error: error instanceof Error ? error.message : 'Unable to load data' }); });
    return () => { active = false; };
  }, [url, file, parse]);
  return state.url === url ? state : { data: null, loading: true, error: null };
}
