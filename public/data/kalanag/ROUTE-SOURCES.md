# Kalanag planning overview

The solid approach is imported from the user-supplied Cicerone archive
`0986_trekking-in-the-indian-himalayas-gpx-files.zip`:

- Trek 2 Stage 1 Taluka to Osla: 346 points, 12.230 km.
- Trek 2 Stage 2 Osla to Ruinsara Tal: 128 points, 13.414 km.

Source: Brian Furze / Cicerone, *Trekking in the Indian Himalayas*.
https://www.cicerone.co.uk/trekking-in-the-indian-himalayas
The exports name Outdooractive as creator. No recording timestamps are supplied;
these are publisher route exports, not verified GPS recordings. Coordinates and
supplied elevations are preserved in two tracks, including the small gap at Osla.
Distances sum each track's horizontal point-to-point distances; ascent sums positive
supplied elevation differences without smoothing. Neither includes the outline.

Regenerate with:
`python3 scripts/import-kalanag-approach.py /path/to/the/archive.zip`

## Dashed outline (not a GPX course)

`metadata.planning_outline` in route-waypoints.json connects Ruinsara, the mapped
Kyarkoti locality, and the existing approximate Kalanag summit location. It is a
schematic direction of travel, NOT a terrain-following route. It has no invented
switchbacks, camp coordinates, glacier crossings, distances or ascent estimates.
The GPX stops at Ruinsara; the outline is never added to it.

Kyarkoti locality: OpenStreetMap node 7673848541, 31.07552 N, 78.51382 E,
accessed 2026-09-05. This is an area reference, not a confirmed campsite.
https://www.openstreetmap.org/node/7673848541
https://mapcarta.com/N7673848541
© OpenStreetMap contributors; ODbL: https://www.openstreetmap.org/copyright
Summit: existing repository approximate location, 31.0264 N, 78.5681 E.

Discovery Hike itinerary establishes the sequence Ruinsara–Kyarkoti–Camps 1–3–summit:
https://discoveryhike.in/black-peak-expedition-trek/
No recorded upper route has been supplied. Do not use the diagram for navigation
or load its coordinates onto a watch as a course. Obtain the operator's track and
current route assessment before replacing this schematic with a climbing route.

The original 18-point illustrative GPX and fictional camp positions are removed.
Sankri–Taluka is not included in the supplied approach.
