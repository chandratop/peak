import ErrorBoundary from '@/components/ui/ErrorBoundary';
import MapViewLoader from '@/components/map/MapViewLoader';
import MapStyleSwitcher from '@/components/map/MapStyleSwitcher';

export default function RightPanel() {
  return (
    <div className="w-full h-full relative bg-amoled">
      <ErrorBoundary label="MAP">
        <MapViewLoader />
      </ErrorBoundary>
      <MapStyleSwitcher />
    </div>
  );
}
