// VicPlan API — three-step pipeline
// 1. Geocode address → coordinates
// 2. Property layer (coords) → PROP_PFI + parcel attributes
// 3. Planning Controls job (PROP_PFI) → Zone / Overlay / Area

import { getPlanningControlDescription } from './data/zone-overlay-descriptions.js';

const GEOCODE_URL    = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
const PROPERTY_URL   = 'https://plan-geo.mapshare.vic.gov.au/arcgis/rest/services/Planning/PlanningReport/MapServer/0/query';
const PARCEL_URL     = 'https://plan-geo.mapshare.vic.gov.au/arcgis/rest/services/Planning/PlanningReport/MapServer/1/query';
const CONTROLS_BASE  = 'https://plan-geo.mapshare.vic.gov.au/arcgis/rest/services/Planning/GetPlanningControls/GPServer/VicSmartApp';
const PLAN_ORDINANCE_BASE = 'https://plan-gis.mapshare.vic.gov.au/arcgis/rest/services/Planning/PlanOrdinance/MapServer';

// ── Lookup tables ─────────────────────────────────────────────────────────────

const ZONE_CLAUSES = {
  GRZ:'32.08', NRZ:'32.09', RGZ:'32.07', MUZ:'32.04', TZ:'32.05', LDZ:'32.03', LDRZ:'32.03',
  ACZ:'34.01', C1Z:'34.01', C2Z:'34.02', CDZ:'37.08', IN1Z:'33.01', IN2Z:'33.02', IN3Z:'33.03',
  PUZ:'36.04', PPRZ:'36.01', RCZ:'35.01', FZ:'35.07', SUZ:'37.01', CCZ:'37.03',
  BACZ:'30.01', CA:'37.08', UAZ:'37.07',
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
  return { x: c.location.x, y: c.location.y, address: c.address };
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
  const feature = propRes.features?.[0];
  if (!feature) throw new Error('No property parcel found at this location. This tool covers Victorian addresses only.');
  const spi = parcelRes.features?.[0]?.attributes?.PARCEL_SPI || null;
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

// ── Main pipeline ─────────────────────────────────────────────────────────────

export async function fetchPropertyData(address) {
  const geo = await geocodeAddress(address);
  const { attributes: attrs, geometry: parcelGeometry, spi } = await getPropertyByCoords(geo.x, geo.y);
  const propPFI = attrs.PROP_PFI;
  if (!propPFI) throw new Error('Could not resolve property parcel identifier (PROP_PFI).');

  const controls = await getPlanningControls(propPFI);

  const rawZones    = controls?.ZONE    || [];
  const rawOverlays = controls?.OVERLAY || [];
  const uniqueZones    = rawZones.filter((z, i, s) => i === s.findIndex(z2 => z2.ZONE_CODE === z.ZONE_CODE));
  const uniqueOverlays = rawOverlays.filter((o, i, s) => i === s.findIndex(o2 => o2.ZONE_CODE === o.ZONE_CODE));

  const lgaRaw   = controls?.LGA?.[0] || '';
  const lgaUpper = lgaRaw.toUpperCase();
  const lgaCode  = String(uniqueZones[0]?.LGA_CODE || attrs.PROP_LGA_CODE || '');

  const zoneCodes    = uniqueZones.map(z => z.ZONE_CODE || '');
  const overlayCodes = uniqueOverlays.map(o => o.ZONE_CODE || '');
  const allCodes     = [...zoneCodes, ...overlayCodes];

  const [allUrls, parking] = await Promise.all([
    Promise.all(allCodes.map(code => getPlanOrdinanceUrls(code, lgaCode))),
    getPTALParking(geo.y, geo.x),
  ]);
  const zoneUrlsArr    = allUrls.slice(0, zoneCodes.length);
  const overlayUrlsArr = allUrls.slice(zoneCodes.length);

  const formattedZones = uniqueZones.map((z, i) => {
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

  const councilName = LGA_COUNCIL_MAP[lgaUpper] || (lgaRaw ? toTitleCase(lgaRaw) + ' City Council' : '—');
  const schemeName  = lgaRaw ? toTitleCase(lgaRaw) + ' Planning Scheme' : '—';
  const suburb      = toTitleCase(attrs.ADD_LOCALITY_NAME || '');
  const postcode    = String(attrs.ADD_POSTCODE || '');
  const houseNum    = attrs.ADD_HOUSE_NUMBER_1 || '';
  const roadName    = toTitleCase(attrs.ADD_ROAD_NAME || '');
  const roadType    = toTitleCase(attrs.ADD_ROAD_TYPE || '');
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
  };
}
