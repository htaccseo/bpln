// VicPlan API — three-step pipeline
// 1. Geocode address → coordinates
// 2. Property layer (coords) → PROP_PFI + parcel attributes
// 3. Planning Controls job (PROP_PFI) → Zone / Overlay / Area

import { getPlanningControlDescription } from './data/zone-overlay-descriptions.js';

const GEOCODE_URL       = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
const PROPERTY_URL      = 'https://plan-geo.mapshare.vic.gov.au/arcgis/rest/services/Planning/PlanningReport/MapServer/0/query';
const PARCEL_URL        = 'https://plan-geo.mapshare.vic.gov.au/arcgis/rest/services/Planning/PlanningReport/MapServer/1/query';
const CONTROLS_BASE     = 'https://plan-geo.mapshare.vic.gov.au/arcgis/rest/services/Planning/GetPlanningControls/GPServer/VicSmartApp';
const PLAN_ORDINANCE_BASE = 'https://plan-gis.mapshare.vic.gov.au/arcgis/rest/services/Planning/PlanOrdinance/MapServer';
// Point-based zone verification — used to exclude adjacent-parcel zones from GetPlanningControls results
const ZONE_VERIFY_URL   = 'https://plan-gis.mapshare.vic.gov.au/arcgis/rest/services/Planning/Vicplan_PlanningSchemeZones/MapServer/0/query';

// ── Lookup tables ─────────────────────────────────────────────────────────────

const ZONE_CLAUSES = {
  GRZ:'32.08', NRZ:'32.09', RGZ:'32.07', MUZ:'32.04', TZ:'32.05', LDZ:'32.03', LDRZ:'32.03',
  ACZ:'34.01', C1Z:'34.01', C2Z:'34.02', CDZ:'37.08', IN1Z:'33.01', IN2Z:'33.02', IN3Z:'33.03',
  PUZ:'36.04', PPRZ:'36.01', RCZ:'35.01', FZ:'35.07', SUZ:'37.01', CCZ:'37.03',
  BACZ:'30.01', CA:'37.08', UAZ:'37.07', TRZ:'36.02',
};

const OVERLAY_CLAUSES = {
  SBO:'44.05', ESO:'42.01', EMO:'42.09', DCO:'44.08', DCPO:'45.06', HO:'43.01',
  VPO:'42.12', DPO:'43.04', PAO:'45.05', EAO:'45.03', PO:'45.09', LSIO:'44.04',
  FPO:'44.01', BMO:'44.06', BMOZ:'44.06', IPO:'42.02', LPO:'43.10', ERO:'42.06',
  EEO:'42.03', DDO:'43.02', NCO:'43.05', SCO:'42.10',
};

const OVERLAY_DESCRIPTIONS = {
  SBO:'Land affected by overland flow paths. A permit may be required for buildings and works.',
  ESO:'Environmental Significance Overlay — protects areas of environmental or ecological significance.',
  EMO:'Erosion Management Overlay — applies to land prone to erosion, landslip or land instability.',
  DCPO:'Development contributions required for local infrastructure provision. A levy is calculated at permit stage.',
  DCO:'Development Contributions Overlay — financial contributions toward community infrastructure apply.',
  HO:'Heritage Overlay — applies to land, buildings or precincts with cultural heritage significance. A permit is required to demolish, alter or subdivide.',
  VPO:'Vegetation Protection Overlay — protects significant vegetation on the land.',
  DPO:'Development Plan Overlay — an approved development plan is required before a permit can be granted.',
  PAO:'Public Acquisition Overlay — land intended to be acquired by a public authority.',
  PO:'Parking Overlay — modifies standard car parking requirements under Clause 52.06.',
  LSIO:'Land Subject to Inundation Overlay — land subject to flooding from a 1-in-100 year flood event.',
  FPO:'Floodway Overlay — applies to the active floodway corridor; buildings and works are highly restricted.',
  BMO:'Bushfire Management Overlay — bushfire risk land; mandatory building standards apply.',
  BMOZ:'Bushfire Management Overlay — significant bushfire risk; mandatory CFA referral.',
  DDO:'Design and Development Overlay — specifies built-form requirements for new development.',
  EEO:'Environmental Audit Overlay — an environmental audit is required before certain uses commence.',
  NCO:'Neighbourhood Character Overlay — identifies and protects areas with a valued neighbourhood character.',
};

const LGA_COUNCIL_MAP = {
  'ALPINE':'Alpine Shire Council','ARARAT':'Ararat Rural City Council','BALLARAT':'City of Ballarat','BANYULE':'Banyule City Council','BASS COAST':'Bass Coast Shire Council','BAW BAW':'Baw Baw Shire Council','BAYSIDE':'Bayside City Council','BENALLA':'Benalla Rural City Council','BOROONDARA':'Boroondara City Council','BRIMBANK':'Brimbank City Council','CARDINIA':'Cardinia Shire Council','CASEY':'Casey City Council','COLAC-OTWAY':'Colac Otway Shire Council','DAREBIN':'Darebin City Council','EAST GIPPSLAND':'East Gippsland Shire Council','FRANKSTON':'Frankston City Council','GLEN EIRA':'Glen Eira City Council','GLENELG':'Glenelg Shire Council','GREATER BENDIGO':'City of Greater Bendigo','GREATER DANDENONG':'Greater Dandenong City Council','GREATER GEELONG':'City of Greater Geelong','GREATER SHEPPARTON':'Greater Shepparton City Council','HOBSONS BAY':'Hobsons Bay City Council','HORSHAM':'Horsham Rural City Council','HUME':'Hume City Council','KINGSTON':'Kingston City Council','KNOX':'Knox City Council','LATROBE':'Latrobe City Council','MACEDON RANGES':'Macedon Ranges Shire Council','MANNINGHAM':'Manningham City Council','MARIBYRNONG':'Maribyrnong City Council','MAROONDAH':'Maroondah City Council','MELBOURNE':'City of Melbourne','MELTON':'Melton City Council','MILDURA':'Mildura Rural City Council','MITCHELL':'Mitchell Shire Council','MONASH':'Monash City Council','MOONEE VALLEY':'Moonee Valley City Council','MOORABOOL':'Moorabool Shire Council','MORELAND':'Moreland City Council','MORNINGTON PENINSULA':'Mornington Peninsula Shire Council','MOUNT ALEXANDER':'Mount Alexander Shire Council','NILLUMBIK':'Nillumbik Shire Council','PORT PHILLIP':'Port Phillip City Council','QUEENSCLIFFE':'Borough of Queenscliffe','SOUTH GIPPSLAND':'South Gippsland Shire Council','STONNINGTON':'Stonnington City Council','SURF COAST':'Surf Coast Shire Council','SWAN HILL':'Swan Hill Rural City Council','WARRNAMBOOL':'Warrnambool City Council','WELLINGTON':'Wellington Shire Council','WHITEHORSE':'Whitehorse City Council','WHITTLESEA':'Whittlesea City Council','WODONGA':'Wodonga City Council','WYNDHAM':'Wyndham City Council','YARRA':'City of Yarra','YARRA RANGES':'Yarra Ranges Council',
};

const ZONE_PURPOSES = {
  GRZ: 'To encourage development that respects the neighbourhood character of the area. To implement neighbourhood character policy and adopted neighbourhood character guidelines.',
  NRZ: 'To recognise areas of predominantly single and double storey residential development. To limit opportunities for increased residential development.',
  RGZ: 'To encourage a diversity of housing types in locations offering good access to services and transport.',
  ACZ: 'To create vibrant mixed use activity centres for retail, office, business, entertainment and community uses.',
  C1Z: 'To create vibrant mixed use commercial centres for retail, office, business, entertainment and community uses.',
  C2Z: 'To encourage commercial and industrial uses that are not suitable for the Commercial 1 Zone.',
  IN1Z:'To provide for manufacturing industry, the storage and distribution of goods, and associated uses.',
  IN2Z:'To provide for industries and warehouses in an industrial area.',
  MUZ: 'To provide for a range of residential, commercial, industrial and other uses.',
  PUZ: 'To recognise and provide for the use and development of land for public utility purposes.',
  PPRZ:'To recognise areas used for public recreation and open space.',
  FZ:  'To conserve and protect forests, including flora and fauna values.',
};

const ZONE_CLAUSE_REFS = {
  GRZ: 'Refer to Clause 32.08 of the Victoria Planning Provisions and the relevant Planning Scheme for the full purpose statement and permit requirements.',
  NRZ: 'Refer to Clause 32.09 of the Victoria Planning Provisions and the relevant Planning Scheme for the full purpose statement and permit requirements.',
  RGZ: 'Refer to Clause 32.07 of the Victoria Planning Provisions and the relevant Planning Scheme for the full purpose statement and permit requirements.',
  C1Z: 'Refer to Clause 34.01 of the Victoria Planning Provisions and the relevant Planning Scheme for the full purpose statement and permit requirements.',
  IN1Z:'Refer to Clause 33.01 of the Victoria Planning Provisions and the relevant Planning Scheme for the full purpose statement and permit requirements.',
  PPRZ:'Refer to Clause 36.02 of the Victoria Planning Provisions and the relevant Planning Scheme for the full purpose statement and permit requirements.',
};

const PTAL_WFS = 'https://opendata.maps.vic.gov.au/geoserver/wfs';

const PTAL_RATES = {
  'Category 1': { dwellingRate: '1 space per dwelling (no minimum in some CADs)', visitor: 'As per council discretion' },
  'Category 2': { dwellingRate: '1 space per 1-bedroom, 2 spaces per 2+ bedroom dwelling', visitor: '1 visitor space per 5 dwellings (for 5+ dwellings)' },
  'Category 3': { dwellingRate: '1 space per dwelling (all sizes)', visitor: 'Assessed individually by council' },
  'Category 4': { dwellingRate: '1 space per dwelling (all sizes)', visitor: 'Assessed individually by council' },
};

// ── Cache-busting fetch helper ────────────────────────────────────────────────
// ArcGIS MapServer returns 304 from CDN-cached responses.
// Appending _t=<timestamp> makes each URL unique → browser never finds a cached
// entry → no conditional request → no 304.
// NOTE: Do NOT add Cache-Control/Pragma request headers — plan-geo.mapshare.vic.gov.au
// does not include them in Access-Control-Allow-Headers, so they trigger a CORS
// preflight that is blocked with net::ERR_FAILED.

function bustUrl(url) {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}_t=${Date.now()}`;
}

// ── Utilities ─────────────────────────────────────────────────────────────────

// Strip common LGA suffixes so "WYNDHAM CITY" and "WYNDHAM" both → "WYNDHAM"
// Enables reliable matching across geocoder, zone layer, and controls data.
function normalizeLgaName(name) {
  return (name || '').toUpperCase()
    .replace(/\s+(CITY|SHIRE|RURAL\s+CITY|COUNCIL|BOROUGH|MUNICIPALITY)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toTitleCase(str) {
  if (!str) return '';
  return str.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

function zoneBaseCode(code) { return code.replace(/\d+$/, ''); }

function buildZoneName(code, desc) {
  if (!desc) return code;
  return desc.split(' - ').map(p => toTitleCase(p.trim())).join(' — ');
}

function buildOverlayName(code, desc) {
  const scheduleNum = code.match(/\d+$/)?.[0] || null;
  const cleaned = desc ? toTitleCase(desc.replace(/\s*\([^)]*\)/g, '').trim()) : '';
  const name = cleaned || code;
  if (scheduleNum && !/schedule/i.test(name)) return `${name} — Schedule ${scheduleNum}`;
  return name;
}

function parsePythonDict(raw) {
  const match = raw.match(/"value":\s*(\{[\s\S]*\})\s*\}$/);
  if (!match) return null;
  const json = match[1]
    .replace(/'/g, '"')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null');
  return JSON.parse(json);
}

// ── PTAL parking ──────────────────────────────────────────────────────────────

async function getPTALParking(lat, lng) {
  const baseParams = {
    service: 'WFS', version: '2.0.0', request: 'GetFeature',
    outputFormat: 'application/json', count: '1',
    CQL_FILTER: `INTERSECTS(geom,POINT(${lat} ${lng}))`,
  };
  try {
    for (const typeName of ['open-data-platform:ptal_metro', 'open-data-platform:ptal_regional']) {
      const data = await fetch(bustUrl(`${PTAL_WFS}?${new URLSearchParams({ ...baseParams, typeName })}`)).then(r => r.json());
      const cat = data.features?.[0]?.properties?.category_8_9;
      if (cat) return { category: cat, clause: '52.06', ...(PTAL_RATES[cat] || { dwellingRate: 'Refer to Clause 52.06', visitor: 'Assessed by council' }) };
    }
  } catch { /* fall through */ }
  return { category: 'Not available', clause: '52.06', dwellingRate: 'Refer to Clause 52.06', visitor: 'Assessed by council' };
}

// ── PlanOrdinance URLs ────────────────────────────────────────────────────────

async function getPlanOrdinanceUrls(zoneCode, lgaCode) {
  if (!zoneCode || !lgaCode) return { vppUrl: null, lppUrl: null };
  try {
    const baseCode = zoneCode.replace(/\d+$/, '');
    const base = { returnGeometry: 'false', f: 'json' };
    const [vppData, lppData] = await Promise.all([
      fetch(bustUrl(`${PLAN_ORDINANCE_BASE}/1/query?${new URLSearchParams({ ...base, where: `ZONE_CODE='${baseCode}' AND LGA_CODE='${lgaCode}'`, outFields: 'ZONE_CODE,URL' })}`)).then(r => r.json()),
      fetch(bustUrl(`${PLAN_ORDINANCE_BASE}/2/query?${new URLSearchParams({ ...base, where: `ZONE_CODE='${zoneCode}' AND LGA_CODE='${lgaCode}'`, outFields: 'ZONE_CODE,LGA_CODE,URL' })}`)).then(r => r.json()),
    ]);
    const lppUrl = lppData.features?.[0]?.attributes?.URL || null;
    let vppUrl   = vppData.features?.[0]?.attributes?.URL || null;
    if (!vppUrl && lppUrl) {
      vppUrl = lppUrl.replace(/mapCode=[^&]+/, `mapCode=${baseCode}`).replace('level=LPP', 'level=VPP');
    }
    return { vppUrl, lppUrl };
  } catch {
    return { vppUrl: null, lppUrl: null };
  }
}

// ── Step 1: Geocode ───────────────────────────────────────────────────────────

export async function suggestAddresses(text) {
  if (!text || text.trim().length < 3) return [];
  const params = new URLSearchParams({
    SingleLine: text.trim() + ', Victoria',
    sourceCountry: 'AUS', maxLocations: 6, outFields: 'City,Region,Postal', f: 'json',
  });
  const res  = await fetch(`${GEOCODE_URL}?${params}`);
  const data = await res.json();
  return (data.candidates || [])
    .filter(c => c.score >= 50)
    .map(c => ({ addr: c.address, x: c.location.x, y: c.location.y, score: c.score }));
}

async function geocodeAddress(address) {
  const params = new URLSearchParams({
    SingleLine: address, sourceCountry: 'AUS', maxLocations: 1, outFields: '*', f: 'json',
  });
  const data = await fetch(`${GEOCODE_URL}?${params}`).then(r => r.json());
  const c = data.candidates?.[0];
  if (!c || c.score < 50) throw new Error('Address not found. Please try a more specific Victorian address.');
  return {
    x: c.location.x,
    y: c.location.y,
    address: c.address,
    // Subregion is the LGA name from the geocoder (e.g. "Wyndham City", "Hobsons Bay City")
    // This is point-accurate and reliable for primary LGA determination.
    subregion: c.attributes?.Subregion || '',
  };
}

// ── Step 2: Property layer ────────────────────────────────────────────────────

async function getPropertyByCoords(x, y) {
  const common = {
    geometry: JSON.stringify({ x, y }), geometryType: 'esriGeometryPoint',
    inSR: '4326', spatialRel: 'esriSpatialRelIntersects', f: 'json',
  };
  const [propRes, parcelRes] = await Promise.all([
    fetch(bustUrl(`${PROPERTY_URL}?${new URLSearchParams({ ...common, outFields: '*', returnGeometry: 'true', outSR: '4326' })}`)).then(r => r.json()),
    fetch(bustUrl(`${PARCEL_URL}?${new URLSearchParams({ ...common, outFields: 'PARCEL_SPI,PARCEL_LOT_NUMBER,PARCEL_PLAN_NUMBER', returnGeometry: 'false' })}`)).then(r => r.json()),
  ]);

  if (propRes.error) {
    throw new Error(`Property API error ${propRes.error.code}: ${propRes.error.message}`);
  }
  const feature = propRes.features?.[0];
  if (!feature) throw new Error('No property parcel found at this location. This tool covers Victorian addresses only.');
  const spiAttrs = parcelRes.features?.[0]?.attributes || {};
  const spi = spiAttrs.PARCEL_SPI || spiAttrs.parcel_spi || null;
  return { attributes: feature.attributes, geometry: feature.geometry || null, spi };
}

// ── Step 3: Planning controls ─────────────────────────────────────────────────

async function getPlanningControls(propPFI) {
  const submitParams = new URLSearchParams({ propertyPFIParam: String(propPFI), f: 'json' });
  const submitData   = await fetch(bustUrl(`${CONTROLS_BASE}/submitJob?${submitParams}`)).then(r => r.json());
  const jobId = submitData.jobId;
  if (!jobId) throw new Error('Failed to submit planning controls job.');
  for (let i = 0; i < 50; i++) {
    await new Promise(r => setTimeout(r, 700));
    const status = await fetch(bustUrl(`${CONTROLS_BASE}/jobs/${jobId}?f=json`)).then(r => r.json());
    if (status.jobStatus === 'esriJobSucceeded') {
      const raw = await (await fetch(bustUrl(`${CONTROLS_BASE}/jobs/${jobId}/results/ResultsParam?f=json`))).text();
      const parsed = parsePythonDict(raw);
      if (!parsed) throw new Error('Could not parse planning controls response.');
      return parsed;
    }
    if (status.jobStatus === 'esriJobFailed') throw new Error('Planning controls job failed.');
  }
  throw new Error('Planning controls request timed out. Please try again.');
}

// ── Zone cross-verification ───────────────────────────────────────────────────
// Strategy: query Vicplan_PlanningSchemeZones with the full PARCEL POLYGON to
// get every zone polygon that intersects it (with geometries). Then filter
// client-side using point-in-polygon (ray casting) against 6 interior test
// points: address, centroid, anti-address, and 3 ring-vertex offsets.
//
// Why polygon query + client-side PIP instead of point queries:
//   - A split-zoned 27-ha parcel (IN3Z + UFZ + PCRZ) may have 3 zones at
//     completely different parts of the parcel → a single point (or even 3
//     points) may not land inside every genuine zone.
//   - Adjacent-parcel zones (PPRZ, TRZ2) share only an EDGE with the subject
//     parcel. No interior test point lands inside them → correctly excluded.
//   - Genuine zones cover area inside the parcel → at least one of 6 distributed
//     interior points will land inside each → correctly included.
//
// Overlays are NOT filtered here — GetPlanningControls is accurate for overlays.
// Fails open: if the query errors, all zones are kept as-is.

// Ray casting point-in-polygon for a single ring (WGS84 coords).
function pointInRing(px, py, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

async function getVerifiedZoneData(lng, lat, parcelGeometry) {
  try {
    // ── Step 1: Point query at geocoded location → LGA (and fallback zone code) ─
    // LGA MUST come from a point query, not a polygon query.
    // A polygon spanning an LGA boundary returns zones from both LGAs; picking
    // the "first" result arbitrarily could set primaryLgaNorm to the wrong LGA
    // (e.g. HOBSONS BAY instead of WYNDHAM), causing the filter to drop IN3Z/UFZ.
    const pointParams = new URLSearchParams({
      geometry: JSON.stringify({ x: lng, y: lat }), geometryType: 'esriGeometryPoint',
      inSR: '4326', spatialRel: 'esriSpatialRelIntersects',
      outFields: 'ZONE_CODE,LGA', returnGeometry: 'false', f: 'json',
    });
    const pointData = await fetch(bustUrl(`${ZONE_VERIFY_URL}?${pointParams}`))
      .then(r => r.json()).catch(() => null);

    const lgaName = (pointData && !pointData.error && pointData.features?.length)
      ? (pointData.features[0]?.attributes?.LGA || '').toUpperCase() || null
      : null;
    const lgaNorm = normalizeLgaName(lgaName);

    // No parcel geometry → use point result for zone codes too
    if (!parcelGeometry) {
      const zoneCodes = (pointData && !pointData.error && pointData.features?.length)
        ? new Set(pointData.features.map(f => f.attributes?.ZONE_CODE).filter(Boolean))
        : null;
      return { zoneCodes, lgaName, adjacentTrzCodes: new Set() };
    }

    // ── Step 2: Polygon queries → zone codes via Intersects − Touches ──────────
    //
    // Why "Intersects minus Touches" instead of Overlaps/Within/Contains:
    //
    //   esriSpatialRelOverlaps returns TRZ2 even though TRZ2 only shares a
    //   boundary with the parcel. ArcGIS's implementation allows Overlaps to fire
    //   on thin boundary slivers when zone polygon precision differs slightly from
    //   the parcel polygon — a known server-side geometry artefact.
    //
    //   esriSpatialRelTouches is explicit: it returns zones whose interiors do NOT
    //   intersect the parcel interior (boundary contact only). So:
    //
    //     Genuinely overlapping zones  (IN3Z, UFZ):  Intersects=✓  Touches=✗  → kept
    //     Contained zone slivers       (PCRZ):       Intersects=✓  Touches=✗  → kept
    //     Boundary-only zones          (TRZ2, PPRZ): Intersects=✓  Touches=✓  → excluded
    //
    //   Additionally filter by primary LGA (from point query) to remove cross-LGA
    //   artefacts (e.g. NRZ5 from Hobsons Bay returned due to boundary proximity).

    const baseParams = {
      geometry: JSON.stringify(parcelGeometry), geometryType: 'esriGeometryPolygon',
      inSR: '4326', outFields: 'ZONE_CODE,LGA', returnGeometry: 'false', f: 'json',
    };
    const post = (spatialRel) =>
      fetch(bustUrl(ZONE_VERIFY_URL), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ ...baseParams, spatialRel }).toString(),
      })
      .then(r => r.json())
      .then(d => (d.error ? [] : (d.features || [])))
      .catch(() => []);

    const [intersectFeats, touchesFeats] = await Promise.all([
      post('esriSpatialRelIntersects'),
      post('esriSpatialRelTouches'),
    ]);

    // Zone codes that ONLY touch the parcel boundary (interiors do not overlap)
    const touchesCodes = new Set(
      touchesFeats.map(f => f.attributes?.ZONE_CODE || f.attributes?.zone_code).filter(Boolean)
    );

    // Adjacent TRZ zones: boundary-touching transport zones (TRZ1/TRZ2/TRZ3).
    // Kept as side information — relevant for Clause 52.29 access/subdivision triggers.
    const adjacentTrzCodes = new Set(
      [...touchesCodes].filter(code => /^TRZ\d*$/.test(code))
    );

    const byCode = new Map();
    for (const f of intersectFeats) {
      const code = f.attributes?.ZONE_CODE || f.attributes?.zone_code;
      if (!code || byCode.has(code)) continue;
      if (touchesCodes.has(code)) continue;           // boundary-only → exclude
      if (lgaNorm) {
        const fLga = normalizeLgaName(f.attributes?.LGA || '');
        if (fLga && fLga !== lgaNorm) continue;        // cross-LGA artefact → exclude
      }
      byCode.set(code, f);
    }

    if (!byCode.size) return { zoneCodes: null, lgaName, adjacentTrzCodes }; // fail-open

    return {
      zoneCodes: new Set(byCode.keys()),
      lgaName,           // always from the point query — never from polygon results
      adjacentTrzCodes,  // TRZ zones touching the boundary (not within it)
    };
  } catch (e) {
    console.warn('[VicPlan] Zone verify exception:', e?.message || e);
    return { zoneCodes: null, lgaName: null };
  }
}

// ── Main pipeline ─────────────────────────────────────────────────────────────

export async function fetchPropertyData(address) {
  const geo = await geocodeAddress(address);
  const { attributes: attrs, geometry: parcelGeometry, spi } = await getPropertyByCoords(geo.x, geo.y);
  // API returns lowercase field names (prop_pfi, not PROP_PFI)
  const propPFI = attrs.prop_pfi ?? attrs.PROP_PFI;
  if (propPFI == null) throw new Error(
    `PROP_PFI not found. Fields returned: ${Object.keys(attrs || {}).slice(0, 15).join(', ')}`
  );

  // Run planning controls + zone verification in parallel.
  // getVerifiedZoneData uses the full parcel polygon for the spatial query and
  // filters results client-side with 6 interior test points (see function above).
  const [controls, verifiedZoneData] = await Promise.all([
    getPlanningControls(propPFI),
    getVerifiedZoneData(geo.x, geo.y, parcelGeometry),
  ]);

  const { zoneCodes: verifiedZoneCodes, lgaName: zonelayerLgaName, adjacentTrzCodes } = verifiedZoneData;

  const rawZones    = controls?.ZONE    || [];
  const rawOverlays = controls?.OVERLAY || [];
  const allControlsLgas = controls?.LGA || [];

  // ── DIAGNOSTIC LOGGING ────────────────────────────────────────────────────────
  console.group('[VicPlan] LGA & Zone debug');
  console.log('zonelayerLgaName:', zonelayerLgaName, '| geo.subregion:', geo.subregion);
  console.log('verifiedZoneCodes:', verifiedZoneCodes ? [...verifiedZoneCodes] : null);
  console.log('controls.LGA:', allControlsLgas);
  console.log('rawZones LGA field:', rawZones.map(z => ({ ZONE_CODE: z.ZONE_CODE, LGA: z.LGA })));
  console.groupEnd();
  // ─────────────────────────────────────────────────────────────────────────────

  // ── Primary LGA determination ─────────────────────────────────────────────────
  // PROP_LGA_CODE from the property layer is unreliable at LGA boundaries —
  // it can point to the adjacent LGA. Instead, use two point-accurate sources:
  //   1. Vicplan_PlanningSchemeZones point query → LGA_NAME  (most authoritative)
  //   2. ArcGIS Geocoder Subregion field         → LGA name  (reliable fallback)
  // Both are based on a single coordinate, not a polygon, so no overlap issues.
  //
  // normalizeLgaName strips "CITY"/"SHIRE" etc. so "WYNDHAM CITY" === "WYNDHAM".

  // Zone entries use field name "LGA" (not "LGA_NAME") — confirmed from API response.
  // controls.LGA is an array of LGA name strings sorted alphabetically (not by relevance),
  // so controls.LGA[0] is unreliable as a primary LGA indicator. Do NOT use it as fallback.
  const primaryLgaNorm =
    normalizeLgaName(zonelayerLgaName) ||   // 1. Vicplan_PlanningSchemeZones point query (most authoritative)
    normalizeLgaName(geo.subregion)    ||   // 2. ArcGIS Geocoder Subregion field
    '';

  // ── LGA filter ───────────────────────────────────────────────────────────────
  // Filter zones/overlays to only those belonging to the primary LGA.
  // Zone entries have field "LGA" (string, e.g. "WYNDHAM") — confirmed from API.

  function matchesLga(entry) {
    // The actual field name returned by GetPlanningControls is "LGA"
    const name = entry.LGA || entry.LGA_NAME || entry.lga || entry.lga_name;
    if (name) return normalizeLgaName(name) === primaryLgaNorm;
    // No LGA field — keep (rely on ZONE_CODE point-verification)
    return true;
  }

  const lgaFilteredRawZones    = primaryLgaNorm ? rawZones.filter(matchesLga)    : rawZones;
  const lgaFilteredRawOverlays = primaryLgaNorm ? rawOverlays.filter(matchesLga) : rawOverlays;

  // Fail-open: if the filter removed everything, revert to unfiltered
  const lgaZones    = lgaFilteredRawZones.length    > 0 ? lgaFilteredRawZones    : rawZones;
  const lgaOverlays = lgaFilteredRawOverlays.length > 0 ? lgaFilteredRawOverlays : rawOverlays;

  // Detect multi-LGA situation (for warning banner in UI)
  const hasMultipleLgas = allControlsLgas.length > 1;

  // Deduplicate
  const uniqueZones    = lgaZones.filter((z, i, s)    => i === s.findIndex(z2 => z2.ZONE_CODE === z.ZONE_CODE));
  const uniqueOverlays = lgaOverlays.filter((o, i, s) => i === s.findIndex(o2 => o2.ZONE_CODE === o.ZONE_CODE));

  // ── Zone point-verification ──────────────────────────────────────────────────
  // verifiedZoneCodes is now the UNION of 3 interior point queries (address,
  // centroid, anti-address). This covers split-zoned properties while still
  // excluding adjacent-parcel zones (PPRZ, TRZ2, etc.) whose polygons lie
  // entirely outside the subject parcel.
  // Fail-open: if all 3 queries returned null (API unavailable), keep all zones.
  const filteredZones = verifiedZoneCodes
    ? uniqueZones.filter(z => verifiedZoneCodes.has(z.ZONE_CODE))
    : uniqueZones;
  const verifiedZones = filteredZones.length > 0 ? filteredZones : uniqueZones;

  // ── Infrastructure zone separation ───────────────────────────────────────────
  // "Infrastructure" zones (TRZ, PPRZ) are public-land zones for roads, rail,
  // and parks. Their polygons frequently overlap adjacent private parcel boundaries
  // in VicPlan data due to coordinate precision — even though the actual land is
  // not legally zoned as those zones.
  //
  // Rule: if verifiedZones has BOTH infrastructure and non-infrastructure zones,
  // move infrastructure zones to the adjacent display.
  // Exception: if infrastructure is the ONLY zone (e.g. a road reserve or parks-
  // authority parcel), keep it as the main zone — it IS the zone for that land.
  //
  // PCRZ is intentionally NOT in this list — it can legitimately apply to private
  // land (creek corridors, conservation slivers within a larger parcel).
  const isInfraCode = code => /^TRZ/.test(code) || code === 'PPRZ';

  const infraInVerified    = verifiedZones.filter(z => isInfraCode(z.ZONE_CODE || ''));
  const nonInfraInVerified = verifiedZones.filter(z => !isInfraCode(z.ZONE_CODE || ''));
  const splitInfra         = infraInVerified.length > 0 && nonInfraInVerified.length > 0;
  const mainZones          = splitInfra ? nonInfraInVerified : verifiedZones;

  // ── LGA name for council / scheme naming ─────────────────────────────────────
  const lgaRaw   = primaryLgaNorm || allControlsLgas[0]?.toUpperCase() || '';
  const lgaUpper = lgaRaw;
  const lgaCode  = String(mainZones[0]?.LGA_CODE || attrs.prop_lga_code || '');

  const zoneCodes    = mainZones.map(z => z.ZONE_CODE || '');
  const overlayCodes = uniqueOverlays.map(o => o.ZONE_CODE || '');
  const allCodes     = [...zoneCodes, ...overlayCodes];

  const [allUrls, parking] = await Promise.all([
    Promise.all(allCodes.map(code => getPlanOrdinanceUrls(code, lgaCode))),
    getPTALParking(geo.y, geo.x),
  ]);
  const zoneUrlsArr    = allUrls.slice(0, zoneCodes.length);
  const overlayUrlsArr = allUrls.slice(zoneCodes.length);

  const formattedZones = mainZones.map((z, i) => {
    const code = z.ZONE_CODE || '';
    const base = zoneBaseCode(code);
    const desc = getPlanningControlDescription(code);
    return {
      code, name: buildZoneName(code, z.ZONE_DESCRIPTION),
      purpose: desc?.summary || ZONE_PURPOSES[base] || `Refer to Clause ${ZONE_CLAUSES[base] || '—'} of the Victoria Planning Provisions.`,
      clauseRef: ZONE_CLAUSE_REFS[base] || `Refer to Clause ${ZONE_CLAUSES[base] || '—'} of the Victoria Planning Provisions and the relevant Planning Scheme.`,
      clause: ZONE_CLAUSES[base] || desc?.clause || '—',
      schedule: code.match(/\d+$/)?.[0] || null,
      tag: desc?.tag || null, tagColor: desc?.tagColor || null,
      vpUrl: zoneUrlsArr[i]?.vppUrl || null,
      url:   zoneUrlsArr[i]?.lppUrl || null,
    };
  });

  const formattedOverlays = uniqueOverlays.map((o, i) => {
    const code = o.ZONE_CODE || '';
    const base = zoneBaseCode(code);
    return {
      code, name: buildOverlayName(code, o.ZONE_DESCRIPTION),
      clause: OVERLAY_CLAUSES[base] || getPlanningControlDescription(code)?.clause || '—',
      description: getPlanningControlDescription(code)?.summary || OVERLAY_DESCRIPTIONS[base] || `Refer to Clause ${OVERLAY_CLAUSES[base] || '—'} of the Victoria Planning Provisions.`,
      tag: getPlanningControlDescription(code)?.tag || null,
      tagColor: getPlanningControlDescription(code)?.tagColor || null,
      schedule: code.match(/\d+$/)?.[0] || null,
      vpUrl: overlayUrlsArr[i]?.vppUrl || null,
      url:   overlayUrlsArr[i]?.lppUrl || null,
    };
  });

  // ── Adjacent infrastructure zones ────────────────────────────────────────────
  // Two sources:
  //   1. adjacentTrzCodes: TRZ codes from zone layer Touches query (boundary-only)
  //   2. infraInVerified: TRZ/PPRZ zones split out above from verifiedZones
  const adjacentInfraCodeSet = new Set([
    ...(adjacentTrzCodes || []),
    ...infraInVerified.map(z => z.ZONE_CODE).filter(Boolean),
  ]);
  // Build adjacent zone list.
  // Primary source: rawZones (GetPlanningControls) — has full ZONE_DESCRIPTION.
  // Fallback: zone code alone — for zones captured by the zone layer Touches query
  //   but not returned by GetPlanningControls (e.g. TRZ2 beside a Farming Zone parcel
  //   where GetPlanningControls only returns FZ, not the adjacent road zone).
  //   Name is inferred from the code ("TRZ2" → "Transport Zone — Schedule 2").
  const rawZonesByCode = new Map(rawZones.map(z => [z.ZONE_CODE, z]));

  const INFRA_BASE_NAMES = { TRZ: 'TRANSPORT ZONE', PPRZ: 'PUBLIC PARK AND RECREATION ZONE' };
  function inferZoneDescription(code) {
    const base = zoneBaseCode(code);
    const schedule = code.match(/\d+$/)?.[0];
    const baseName = INFRA_BASE_NAMES[base];
    if (!baseName) return null;
    return schedule ? `${baseName} - SCHEDULE ${schedule}` : baseName;
  }

  const formattedAdjacentZones = [...adjacentInfraCodeSet].map(code => {
    const raw = rawZonesByCode.get(code);           // present if GetPlanningControls included it
    const base = zoneBaseCode(code);
    const desc = getPlanningControlDescription(code);
    const zoneDesc = raw?.ZONE_DESCRIPTION || inferZoneDescription(code);
    return {
      code,
      name: buildZoneName(code, zoneDesc),
      clause: ZONE_CLAUSES[base] || desc?.clause || '36.02',
      relationship: 'adjacent',
    };
  });

  const councilName = LGA_COUNCIL_MAP[lgaUpper] || (lgaRaw ? toTitleCase(lgaRaw) + ' City Council' : '—');
  const schemeName  = lgaRaw ? toTitleCase(lgaRaw) + ' Planning Scheme' : '—';
  // Field names are lowercase in production API responses
  const suburb      = toTitleCase(attrs.add_locality_name  || attrs.ADD_LOCALITY_NAME  || '');
  const postcode    = String(attrs.add_postcode             ?? attrs.ADD_POSTCODE        ?? '');
  const houseNum    = attrs.add_house_number_1              || attrs.ADD_HOUSE_NUMBER_1  || '';
  const roadName    = toTitleCase(attrs.add_road_name       || attrs.ADD_ROAD_NAME       || '');
  const roadType    = toTitleCase(attrs.add_road_type       || attrs.ADD_ROAD_TYPE       || '');
  const formattedAddress = [houseNum, roadName, roadType].filter(Boolean).join(' ')
    + (suburb ? `, ${suburb}` : '') + (postcode ? ` VIC ${postcode}` : '');

  return {
    address: formattedAddress || geo.address,
    lot: spi || '—', parcel: String(propPFI),
    council: councilName, scheme: schemeName,
    lga: lgaUpper, ward: '—', suburb, postcode,
    coords: { lat: geo.y, lng: geo.x },
    landSize: Math.round(controls?.AREA || 0),
    frontage: null, depth: null,
    zone:     formattedZones[0] || null,
    zones:    formattedZones,
    overlays: formattedOverlays,
    parking,
    heritage: uniqueOverlays.some(o => zoneBaseCode(o.ZONE_CODE || '') === 'HO'),
    bushfire: uniqueOverlays.some(o => ['BMO','BMOZ'].includes(zoneBaseCode(o.ZONE_CODE || ''))),
    parcelGeometry,
    adjacentZones: formattedAdjacentZones,
    // Multi-LGA warning — set when GetPlanningControls returned data for more than one LGA
    multiLgaWarning: hasMultipleLgas,
    allLgaNames: allControlsLgas,
  };
}
