import { notFound } from 'next/navigation';
import { EXPEDITIONS, getExpedition } from '@/lib/expeditions';
import SplitLayout from '@/components/layout/SplitLayout';
import LeftPanel from '@/components/layout/LeftPanel';
import RightPanel from '@/components/layout/RightPanel';

export function generateStaticParams() {
  return EXPEDITIONS.map((e) => ({ expedition: e.slug }));
}

interface Props {
  params: Promise<{ expedition: string }>;
}

export default async function ExpeditionPage({ params }: Props) {
  const { expedition: slug } = await params;
  const expedition = getExpedition(slug);
  if (!expedition) notFound();

  return (
    <SplitLayout expedition={expedition}>
      <LeftPanel />
      <RightPanel />
    </SplitLayout>
  );
}
