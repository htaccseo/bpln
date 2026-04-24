// PropertyMap — real Leaflet map with tiles + parcel boundary + dimension labels
// Tile sources: CartoDB Positron (cadastral-style) + ESRI World Imagery (aerial)
// Vicmap WMTS tiles require vic.gov.au origin — not accessible from local/external hosts.
function PropertyMap({ property, mode = 'zoning' }) {
  const containerRef = React.useRef(null);
  const mapRef       = React.useRef(null);
  const tileRef      = React.useRef(null);
  const parcelRef    = React.useRef(null);
  const dimsRef      = React.useRef(null); // LayerGroup for edge dimension labels
  const markerRef    = React.useRef(null);

  // ── Tile URL templates ───────────────────────────────────────────────────────
  const CARTO_URL  = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const CARTO_ATTR = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>';
  const AERIAL_URL  = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const AERIAL_ATTR = '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics';

  const { lat, lng } = property.coords;

  // ── Haversine distance (metres) between two [lng, lat] points ────────────────
  function haversine([lng1, lat1], [lng2, lat2]) {
    const R = 6371000;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }

  function formatDist(m) {
    return m >= 1000 ? (m / 1000).toFixed(2) + ' km' : m.toFixed(1) + ' m';
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function getTileConfig(currentMode) {
    if (currentMode === 'aerial') return { url: AERIAL_URL, attr: AERIAL_ATTR, subdomains: 'abcd' };
    return { url: CARTO_URL, attr: CARTO_ATTR, subdomains: 'abcd' };
  }

  function getParcelColor(currentMode) {
    return currentMode === 'overlay' ? '#F5A623' : '#0066FF';
  }

  // Build a DivIcon label centered on a midpoint
  function makeDimLabel(midLng, midLat, text, color) {
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        transform: translate(-50%, -50%);
        background: #fff;
        border: 1px solid ${color}55;
        border-radius: 3px;
        padding: 2px 5px;
        font-size: 10px;
        font-weight: 600;
        font-family: ui-monospace, 'SF Mono', monospace;
        white-space: nowrap;
        box-shadow: 0 1px 4px rgba(0,0,0,0.12);
        color: ${color === '#F5A623' ? '#b37400' : '#0044cc'};
        pointer-events: none;
        line-height: 1.4;
      ">${text}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
    return L.marker([midLat, midLng], { icon, interactive: false, keyboard: false });
  }

  // Render parcel boundary + dimension labels
  function renderParcel(map, currentMode) {
    // Clear existing parcel layer
    if (parcelRef.current) { map.removeLayer(parcelRef.current); parcelRef.current = null; }

    // Clear existing dim labels
    if (dimsRef.current) { map.removeLayer(dimsRef.current); dimsRef.current = null; }

    const geo = property.parcelGeometry;
    if (!geo || !geo.rings || geo.rings.length === 0) return;

    const color = getParcelColor(currentMode);

    // Draw polygon
    parcelRef.current = L.geoJSON(
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: geo.rings } },
      { style: { color, weight: 2.5, opacity: 1, fillColor: color, fillOpacity: 0.15 } }
    ).addTo(map);

    // Dimension labels on the exterior ring only (index 0)
    const ring = geo.rings[0];
    if (!ring || ring.length < 2) return;

    const group = L.layerGroup();

    // ring is closed: [p0, p1, ..., pN, p0]. Iterate edges p[i]→p[i+1].
    for (let i = 0; i < ring.length - 1; i++) {
      const p1 = ring[i];     // [lng, lat]
      const p2 = ring[i + 1]; // [lng, lat]
      const dist = haversine(p1, p2);

      if (dist < 0.5) continue; // skip sub-metre degenerate edges

      const midLng = (p1[0] + p2[0]) / 2;
      const midLat = (p1[1] + p2[1]) / 2;

      makeDimLabel(midLng, midLat, formatDist(dist), color).addTo(group);
    }

    group.addTo(map);
    dimsRef.current = group;
  }

  function swapTileLayer(map, currentMode) {
    if (tileRef.current) map.removeLayer(tileRef.current);
    const cfg = getTileConfig(currentMode);
    tileRef.current = L.tileLayer(cfg.url, {
      maxZoom: 21, tileSize: 256, subdomains: cfg.subdomains, attribution: cfg.attr,
    }).addTo(map);
  }

  // ── Mount: initialise map once ───────────────────────────────────────────────
  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 20,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;
    map.attributionControl.setPrefix('');

    // Tile layer
    const cfg = getTileConfig(mode);
    tileRef.current = L.tileLayer(cfg.url, {
      maxZoom: 21, tileSize: 256, subdomains: cfg.subdomains, attribution: cfg.attr,
    }).addTo(map);

    // Parcel + dims
    renderParcel(map, mode);

    // Address marker
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:14px;height:14px;border-radius:50%;
        background:#FFF;border:2.5px solid #0066FF;
        box-shadow:0 1px 4px rgba(0,0,0,0.35);
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    markerRef.current = L.marker([lat, lng], { icon })
      .addTo(map)
      .bindTooltip(property.address, { direction: 'top', offset: [0, -10] });

    return () => {
      map.remove();
      mapRef.current = tileRef.current = parcelRef.current = dimsRef.current = markerRef.current = null;
    };
  }, []);

  // ── Mode changes ─────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    swapTileLayer(map, mode);
    renderParcel(map, mode);
  }, [mode]);

  return (
    <div style={{
      width: '100%',
      height: 440,
      border: '1px solid #E5E5E5',
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
window.PropertyMap = PropertyMap;
