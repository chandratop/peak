"""Import the two user-supplied Cicerone approach stages without inventing track points.
Usage: python3 scripts/import-kalanag-approach.py /path/to/0986...zip
"""
import json
import math
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1] / 'public/data/kalanag'
NS = 'http://www.topografix.com/GPX/1/1'
ET.register_namespace('', NS)
def node(tag): return '{' + NS + '}' + tag
def distance(a, b):
    lat1, lon1, lat2, lon2 = map(math.radians, [a[1], a[0], b[1], b[0]])
    h = math.sin((lat2-lat1)/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin((lon2-lon1)/2)**2
    return 6371000 * 2 * math.asin(min(1, math.sqrt(h)))

with zipfile.ZipFile(sys.argv[1]) as archive:
    stages = []
    for name in ['Trek 2 Stage 1 Taluka to Osla', 'Trek 2 Stage 2 Osla to Ruinsara Tal']:
        source = ET.fromstring(archive.read('gpx-986/' + name + '.gpx'))
        points = source.findall('.//{*}trkpt') or source.findall('.//{*}rtept')
        coords = [(float(p.attrib['lon']), float(p.attrib['lat']), float(p.find('{*}ele').text)) for p in points]
        stages.append((name, coords))

root = ET.Element(node('gpx'), version='1.1', creator='Peak - Cicerone approach import')
meta = ET.SubElement(root, node('metadata'))
ET.SubElement(meta, node('name')).text = 'Taluka to Ruinsara - approach only'
ET.SubElement(meta, node('desc')).text = 'Cicerone Trekking in the Indian Himalayas, Trek 2 stages 1-2. Publisher route exports, not a verified recorded track. No Kalanag summit route. Separate stages preserved without an invented connecting segment.'
for name, points in stages:
    trk = ET.SubElement(root, node('trk'))
    ET.SubElement(trk, node('name')).text = name
    seg = ET.SubElement(trk, node('trkseg'))
    for lng, lat, elevation in points:
        p = ET.SubElement(seg, node('trkpt'), lat=str(lat), lon=str(lng))
        ET.SubElement(p, node('ele')).text = str(elevation)
ET.indent(root)
ET.ElementTree(root).write(ROOT / 'route.gpx', encoding='utf-8', xml_declaration=True)
lengths = [sum(distance(a, b) for a, b in zip(points, points[1:])) / 1000 for _, points in stages]
ascent = sum(max(0, b[2]-a[2]) for _, points in stages for a,b in zip(points, points[1:]))
start = stages[0][1][0]
osla = stages[0][1][-1]
ruinsara = stages[1][1][-1]
def waypoint(id, name, p, km):
    return dict(id=id, name=name, lng=p[0], lat=p[1], elevation_m=round(p[2]), camp_type='waypoint', distance_from_start_km=round(km, 3), description='Location and elevation from the supplied Cicerone approach GPX. Current conditions unverified.')
data = {
 'metadata': dict(route_name='Kalanag via Ruinsara - planning overview', peak_name='Kalanag', summit_elevation_m=6387,
    total_distance_km=round(sum(lengths), 1), total_gain_m=round(ascent), region='Ruinsara Valley, Uttarakhand, India',
    coverage='approach-only',
    route_note='Solid orange: supplied Cicerone approach to Ruinsara. Dashed cyan: approximate direction via Kyarkoti to Kalanag, not a trail or Garmin course. High camps and glacier crossings are unmapped.',
    planning_outline=[dict(name='Ruinsara Tal', lng=ruinsara[0], lat=ruinsara[1]),
      dict(name='Kyarkoti area (approx.)', lng=78.51382, lat=31.07552),
      dict(name='Kalanag Summit', lng=78.5681, lat=31.0264)]),
 'waypoints': [waypoint('taluka','Taluka',start,0), waypoint('osla','Osla',osla,lengths[0]), waypoint('ruinsara','Ruinsara Tal',ruinsara,sum(lengths))]
}
(ROOT/'route-waypoints.json').write_text(json.dumps(data,indent=2)+'\n')
print('Imported',sum(len(p) for _,p in stages),'points;',data['metadata']['total_distance_km'],'km approach;',round(ascent),'m GPX ascent')
