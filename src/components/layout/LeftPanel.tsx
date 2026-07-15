import SectionHeader from '@/components/ui/SectionHeader';
import Divider from '@/components/ui/Divider';
import GearFeed from '@/components/gear/GearFeed';
import WaypointFeed from '@/components/route/WaypointFeed';
import { EXPEDITION } from '@/lib/expedition.config';

export default function LeftPanel() {
  return (
    <div className="flex flex-col h-full px-4 py-4">
      {/* Header */}
      <div className="mb-5 flex-shrink-0">
        <p className="text-2xs tracking-[0.3em] text-neutral-600 uppercase font-mono mb-1">
          EXPEDITION DASHBOARD
        </p>
        <h1 className="text-white font-mono text-sm tracking-widest uppercase">
          {EXPEDITION.peakName}
          <span className="text-neon-orange ml-2 text-xs">{EXPEDITION.elevationM}m</span>
        </h1>
        <p className="text-neutral-600 text-2xs font-mono mt-0.5">
          {EXPEDITION.region}
        </p>
      </div>

      <Divider className="mb-5 flex-shrink-0" />

      {/* Gear section */}
      <div className="flex-shrink-0">
        <SectionHeader label="Gear Manifest" accent="orange" />
        <GearFeed />
      </div>

      <Divider className="my-5 flex-shrink-0" />

      {/* Route section */}
      <div className="flex-shrink-0 pb-6">
        <SectionHeader label="Route Waypoints" accent="cyan" />
        <WaypointFeed />
      </div>
    </div>
  );
}
