'use client';

import { createContext, useContext } from 'react';
import type { Expedition } from '@/lib/expeditions';

export const ExpeditionContext = createContext<Expedition | null>(null);

export function useExpedition(): Expedition {
  const ctx = useContext(ExpeditionContext);
  if (!ctx) throw new Error('useExpedition must be used inside ExpeditionContext.Provider');
  return ctx;
}
