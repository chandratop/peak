import SplitLayout from '@/components/layout/SplitLayout';
import LeftPanel from '@/components/layout/LeftPanel';
import RightPanel from '@/components/layout/RightPanel';

export default function Page() {
  return (
    <SplitLayout>
      <LeftPanel />
      <RightPanel />
    </SplitLayout>
  );
}
