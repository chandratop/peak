import type { Metadata } from 'next';
import { getExpedition } from '@/lib/expeditions';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ expedition: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { expedition: slug } = await params;
  const expedition = getExpedition(slug);
  if (!expedition) notFound();
  return {
    title: expedition.pageTitle,
    description: expedition.pageDescription,
  };
}

export default function ExpeditionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
