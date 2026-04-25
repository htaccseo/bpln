// VicPlan API — three-step pipeline
// 1. Geocode address → coordinates
// 2. Property layer (coords) → PROP_PFI + parcel attributes
// 3. Planning Controls job (PROP_PFI) → Zone / Overlay / Area

const GEOCODE_URL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
const PROPERTY_URL = 'https://plan-geo.mapshare.vic.gov.au/arcgis/rest/services/Planning/PlanningReport/MapServer/0/query';
const PARCEL_URL   = 'https://plan-geo.mapshare.vic.gov.au/arcgis/rest/services/Planning/PlanningReport/MapServer/1/query';
const CONTROLS_BASE      = 'https://plan-geo.mapshare.vic.gov.au/arcgis/rest/services/Planning/GetPlanningControls/GPServer/VicSmartApp';
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
  'ALPINE':'Alpine Shire Council','ARARAT':'Ararat Rural City Council',
  'BALLARAT':'City of Ballarat','BANYULE':'Banyule City Council',
  'BASS COAST':'Bass Coast Shire Council','BAW BAW':'Baw Baw Shire Council',
  'BAYSIDE':'Bayside City Council','BENALLA':'Benalla Rural City Council',
  'BOROONDARA':'Boroondara City Council','BRIMBANK':'Brimbank City Council',
  'CARDINIA':'Cardinia Shire Council','CASEY':'Casey City Council',
  'COLAC-OTWAY':'Colac Otway Shire Council','DAREBIN':'Darebin City Council',
  'EAST GIPPSLAND':'East Gippsland Shire Council','FRANKSTON':'Frankston City Council',
  'GLEN EIRA':'Glen Eira City Council','GLENELG':'Glenelg Shire Council',
  'GREATER BENDIGO':'City of Greater Bendigo','GREATER DANDENONG':'Greater Dandenong City Council',
  'GREATER GEELONG':'City of Greater Geelong','GREATER SHEPPARTON':'Greater Shepparton City Council',
  'HOBSONS BAY':'Hobsons Bay City Council','HORSHAM':'Horsham Rural City Council',
  'HUME':'Hume City Council','KINGSTON':'Kingston City Council',
  'KNOX':'Knox City Council','LATROBE':'Latrobe City Council',
  'MACEDON RANGES':'Macedon Ranges Shire Council','MANNINGHAM':'Manningham City Council',
  'MARIBYRNONG':'Maribyrnong City Council','MAROONDAH':'Maroondah City Council',
  'MELBOURNE':'City of Melbourne','MELTON':'Melton City Council',
  'MILDURA':'Mildura Rural City Council','MITCHELL':'Mitchell Shire Council',
  'MONASH':'Monash City Council','MOONEE VALLEY':'Moonee Valley City Council',
  'MOORABOOL':'Moorabool Shire Council','MORELAND':'Moreland City Council',
  'MORNINGTON PENINSULA':'Mornington Peninsula Shire Council',
  'MOUNT ALEXANDER':'Mount Alexander Shire Council',
  'NILLUMBIK':'Nillumbik Shire Council','PORT PHILLIP':'Port Phillip City Council',
  'QUEENSCLIFFE':'Borough of Queenscliffe','SOUTH GIPPSLAND':'South Gippsland Shire Council',
  'STONNINGTON':'Stonnington City Council','SURF COAST':'Surf Coast Shire Council',
  'SWAN HILL':'Swan Hill Rural City Council','WARRNAMBOOL':'Warrnambool City Council',
  'WELLINGTON':'Wellington Shire Council','WHITEHORSE':'Whitehorse City Council',
  'WHITTLESEA':'Whittlesea City Council','WODONGA':'Wodonga City Council',
  'WYNDHAM':'Wyndham City Council','YARRA':'City of Yarra',
  'YARRA RANGES':'Yarra Ranges Council',
};

const ZONE_PURPOSES = {
  GRZ: 'To encourage development that respects the neighbourhood character of the area. To implement neighbourhood character policy and adopted neighbourhood character guidelines.',
  NRZ: 'To recognise areas of predominantly single and double storey residential development. To limit opportunities for increased residential development.',
  RGZ: 'To encourage a diversity of housing types in locations offering good access to services and transport.',
  ACZ: 'To create vibrant mixed use activity centres for retail, office, business, entertainment and community uses. To provide a range of existing and new uses and to build a network of activity centres.',
  C1Z: 'To create vibrant mixed use commercial centres for retail, office, business, entertainment and community uses.',
  C2Z: 'To encourage commercial and industrial uses that are not suitable for the Commercial 1 Zone.',
  IN1Z:'To provide for manufacturing industry, the storage and distribution of goods, and associated uses.',
  IN2Z:'To provide for industries and warehouses in an industrial area.',
  MUZ: 'To provide for a range of residential, commercial, industrial and other uses as well as allowing for a mix of uses and development.',
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

const METRO_LGAS = new Set([
  'MELBOURNE','YARRA','PORT PHILLIP','STONNINGTON','BOROONDARA','WHITEHORSE',
  'MANNINGHAM','MONASH','KNOX','MAROONDAH','BANYULE','DAREBIN','MORELAND',
  'MOONEE VALLEY','MARIBYRNONG','HOBSONS BAY','KINGSTON','BAYSIDE','GLEN EIRA',
  'GREATER DANDENONG','CASEY','FRANKSTON','CARDINIA','MORNINGTON PENINSULA',
  'BRIMBANK','HUME','WHITTLESEA','NILLUMBIK','MELTON','WYNDHAM',
]);

// ── Utilities ─────────────────────────────────────────────────────────────────

function toTitleCase(str) {
  if (!str) return '';
  return str.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

function zoneBaseCode(code) {
  return code.replace(/\d+$/, '');
}

function buildZoneName(code, desc) {
  if (!desc) return code;
  return desc.split(' - ').map(p => toTitleCase(p.trim())).join(' — ');
}

function buildOverlayName(code, desc) {
  const scheduleNum = code.match(/\d+$/)?.[0] || null;
  // Strip parenthetical code refs like "(HO58)" and trailing code suffixes
  const cleaned = desc
    ? toTitleCase(desc.replace(/\s*\([^)]*\)/g, '').trim())
    : '';
  const name = cleaned || code;
  if (scheduleNum && !/schedule/i.test(name)) {
    return `${name} — Schedule ${scheduleNum}`;
  }
  return name;
}

function parsePythonDict(raw) {
  // The API wraps a Python dict (single-quoted) in a JSON envelope:
  // {"paramName":"...","dataType":"GPString","value":{...python dict...}}
  // Extract the Python dict portion and convert to valid JSON.
  const match = raw.match(/"value":\s*(\{[\s\S]*\})\s*\}$/);
  if (!match) return null;
  const json = match[1]
    .replace(/'/g, '"')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null');
  return JSON.parse(json);
}

// ── PTAL: fetch real parking category from VicMap open data ──────────────────

const PTAL_WFS = 'https://opendata.maps.vic.gov.au/geoserver/wfs';

const PTAL_RATES = {
  'Category 1': { dwellingRate: '1 space per dwelling (no minimum in some CADs)', visitor: 'As per council discretion' },
  'Category 2': { dwellingRate: '1 space per 1-bedroom, 2 spaces per 2+ bedroom dwelling', visitor: '1 visitor space per 5 dwellings (for 5+ dwellings)' },
  'Category 3': { dwellingRate: '1 space per dwelling (all sizes)', visitor: 'Assessed individually by council' },
  'Category 4': { dwellingRate: '1 space per dwelling (all sizes)', visitor: 'Assessed individually by council' },
};

async function getPTALParking(lat, lng) {
  // Note: CQL_FILTER POINT uses (latitude longitude) order
  const baseParams = {
    service: 'WFS', version: '2.0.0', request: 'GetFeature',
    outputFormat: 'application/json', count: '1',
    CQL_FILTER: `INTERSECTS(geom,POINT(${lat} ${lng}))`,
  };
  try {
    // Try metro first, then regional
    for (const typeName of ['open-data-platform:ptal_metro', 'open-data-platform:ptal_regional']) {
      const data = await fetch(`${PTAL_WFS}?${new URLSearchParams({ ...baseParams, typeName })}`).then(r => r.json());
      const cat = data.features?.[0]?.properties?.category_8_9;
      if (cat) {
        return { category: cat, clause: '52.06', ...(PTAL_RATES[cat] || { dwellingRate: 'Refer to Clause 52.06', visitor: 'Assessed by council' }) };
      }
    }
  } catch { /* fall through */ }
  return { category: 'Not available', clause: '52.06', dwellingRate: 'Refer to Clause 52.06', visitor: 'Assessed by council' };
}

// ── PlanOrdinance: fetch VPP (Layer 1) + LPP/Schedule (Layer 2) URLs ──────────

async function getPlanOrdinanceUrls(zoneCode, lgaCode) {
  if (!zoneCode || !lgaCode) return { vppUrl: null, lppUrl: null };
  try {
    const baseCode = zoneCode.replace(/\d+$/, ''); // e.g. GRZ1→GRZ, HO123→HO
    const base = { returnGeometry: 'false', f: 'json' };
    const [vppData, lppData] = await Promise.all([
      // Layer 1 (VPP) — uses BASE code (no schedule number)
      fetch(`${PLAN_ORDINANCE_BASE}/1/query?${new URLSearchParams({ ...base, where: `ZONE_CODE='${baseCode}' AND LGA_CODE='${lgaCode}'`, outFields: 'ZONE_CODE,URL' })}`).then(r => r.json()),
      // Layer 2 (LPP) — uses FULL code (with schedule number)
      fetch(`${PLAN_ORDINANCE_BASE}/2/query?${new URLSearchParams({ ...base, where: `ZONE_CODE='${zoneCode}' AND LGA_CODE='${lgaCode}'`, outFields: 'ZONE_CODE,LGA_CODE,URL' })}`).then(r => r.json()),
    ]);
    return {
      vppUrl: vppData.features?.[0]?.attributes?.URL || null,
      lppUrl: lppData.features?.[0]?.attributes?.URL || null,
    };
  } catch {
    return { vppUrl: null, lppUrl: null };
  }
}

// ── Step 1: Geocode ───────────────────────────────────────────────────────────

async function suggestAddresses(text) {
  if (!text || text.trim().length < 3) return [];
  const params = new URLSearchParams({
    SingleLine: text.trim() + ', Victoria',
    sourceCountry: 'AUS',
    maxLocations: 6,
    outFields: 'City,Region,Postal',
    f: 'json',
  });
  const res = await fetch(`${GEOCODE_URL}?${params}`);
  const data = await res.json();
  return (data.candidates || [])
    .filter(c => c.score >= 50)
    .map(c => ({ addr: c.address, x: c.location.x, y: c.location.y, score: c.score }));
}

async function geocodeAddress(address) {
  const params = new URLSearchParams({
    SingleLine: address,
    sourceCountry: 'AUS',
    maxLocations: 1,
    outFields: '*',
    f: 'json',
  });
  const res = await fetch(`${GEOCODE_URL}?${params}`);
  const data = await res.json();
  const c = data.candidates?.[0];
  if (!c || c.score < 50) throw new Error('Address not found. Please try a more specific Victorian address.');
  return { x: c.location.x, y: c.location.y, address: c.address };
}

// ── Step 2: Property layer ────────────────────────────────────────────────────

async function getPropertyByCoords(x, y) {
  const commonParams = {
    geometry: JSON.stringify({ x, y }),
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    f: 'json',
  };

  const [propRes, parcelRes] = await Promise.all([
    fetch(`${PROPERTY_URL}?${new URLSearchParams({ ...commonParams, outFields: '*', returnGeometry: 'true', outSR: '4326' })}`).then(r => r.json()),
    fetch(`${PARCEL_URL}?${new URLSearchParams({ ...commonParams, outFields: 'PARCEL_SPI,PARCEL_LOT_NUMBER,PARCEL_PLAN_NUMBER', returnGeometry: 'false' })}`).then(r => r.json()),
  ]);

  const feature = propRes.features?.[0];
  if (!feature) throw new Error('No property parcel found at this location. This tool covers Victorian addresses only.');

  const spi = parcelRes.features?.[0]?.attributes?.PARCEL_SPI || null;

  return { attributes: feature.attributes, geometry: feature.geometry || null, spi };
}

// ── Step 3: Planning controls (async GP job) ──────────────────────────────────

async function getPlanningControls(propPFI) {
  const submitParams = new URLSearchParams({ propertyPFIParam: String(propPFI), f: 'json' });
  const submitRes = await fetch(`${CONTROLS_BASE}/submitJob?${submitParams}`);
  const submitData = await submitRes.json();
  const jobId = submitData.jobId;
  if (!jobId) throw new Error('Failed to submit planning controls job.');

  for (let i = 0; i < 50; i++) {
    await new Promise(r => setTimeout(r, 700));
    const statusRes = await fetch(`${CONTROLS_BASE}/jobs/${jobId}?f=json`);
    const status = await statusRes.json();
    if (status.jobStatus === 'esriJobSucceeded') {
      const raw = await (await fetch(`${CONTROLS_BASE}/jobs/${jobId}/results/ResultsParam?f=json`)).text();
      const parsed = parsePythonDict(raw);
      if (!parsed) throw new Error('Could not parse planning controls response.');
      return parsed;
    }
    if (status.jobStatus === 'esriJobFailed') throw new Error('Planning controls job failed.');
  }
  throw new Error('Planning controls request timed out. Please try again.');
}

// ── Main: combined pipeline ───────────────────────────────────────────────────

async function fetchPropertyData(address) {
  // 1. Geocode
  const geo = await geocodeAddress(address);

  // 2. Property PFI + geometry
  const { attributes: attrs, geometry: parcelGeometry, spi } = await getPropertyByCoords(geo.x, geo.y);
  const propPFI = attrs.PROP_PFI;
  if (!propPFI) throw new Error('Could not resolve property parcel identifier (PROP_PFI).');
  // 3. Planning controls
  const controls = await getPlanningControls(propPFI);

  // Build structured property object
  const zone = controls?.ZONE?.[0];
  const overlays = controls?.OVERLAY || [];
  const lgaRaw = controls?.LGA?.[0] || '';
  const lgaUpper = lgaRaw.toUpperCase();

  // LGA_CODE: prefer value from planning controls ZONE object, fallback to property layer
  const lgaCode = String(zone?.LGA_CODE || attrs.PROP_LGA_CODE || '');

  const zoneCode = zone?.ZONE_CODE || '';
  const zoneBase = zoneBaseCode(zoneCode);

  // 4. Fetch VPP + LPP URLs (PlanOrdinance) + PTAL parking category in parallel
  const allCodes = [zoneCode, ...overlays.map(o => o.ZONE_CODE || '')];
  const [allUrls, parking] = await Promise.all([
    Promise.all(allCodes.map(code => getPlanOrdinanceUrls(code, lgaCode))),
    getPTALParking(geo.y, geo.x),
  ]);
  const [zoneUrls, ...overlayUrlsArr] = allUrls;

  const formattedZone = {
    code: zoneCode,
    name: buildZoneName(zoneCode, zone?.ZONE_DESCRIPTION),
    purpose: ZONE_PURPOSES[zoneBase] || `Refer to Clause ${ZONE_CLAUSES[zoneBase] || '—'} of the Victoria Planning Provisions.`,
    clauseRef: ZONE_CLAUSE_REFS[zoneBase] || `Refer to Clause ${ZONE_CLAUSES[zoneBase] || '—'} of the Victoria Planning Provisions and the relevant Planning Scheme for the full purpose statement and permit requirements.`,
    clause: ZONE_CLAUSES[zoneBase] || '—',
    schedule: zoneCode.match(/\d+$/)?.[0] || null,
    vpUrl: zoneUrls.vppUrl,   // Clause link → VPP (Layer 1)
    url:   zoneUrls.lppUrl,   // Schedule link → local scheme (Layer 2)
  };

  const formattedOverlays = overlays.map((o, i) => {
    const code = o.ZONE_CODE || '';
    const base = zoneBaseCode(code);
    return {
      code,
      name: buildOverlayName(code, o.ZONE_DESCRIPTION),
      clause: OVERLAY_CLAUSES[base] || '—',
      description: OVERLAY_DESCRIPTIONS[base] || `Refer to Clause ${OVERLAY_CLAUSES[base] || '—'} of the Victoria Planning Provisions.`,
      schedule: code.match(/\d+$/)?.[0] || null,
      vpUrl: overlayUrlsArr[i]?.vppUrl || null,
      url:   overlayUrlsArr[i]?.lppUrl || null,
    };
  });

  const councilName = LGA_COUNCIL_MAP[lgaUpper] || (lgaRaw ? toTitleCase(lgaRaw) + ' City Council' : '—');
  const schemeName = lgaRaw ? toTitleCase(lgaRaw) + ' Planning Scheme' : '—';

  const suburb = toTitleCase(attrs.ADD_LOCALITY_NAME || '');
  const postcode = String(attrs.ADD_POSTCODE || '');
  const houseNum = attrs.ADD_HOUSE_NUMBER_1 || '';
  const roadName = toTitleCase(attrs.ADD_ROAD_NAME || '');
  const roadType = toTitleCase(attrs.ADD_ROAD_TYPE || '');
  const formattedAddress = [houseNum, roadName, roadType].filter(Boolean).join(' ')
    + (suburb ? `, ${suburb}` : '') + (postcode ? ` VIC ${postcode}` : '');

  return {
    address: formattedAddress || geo.address,
    lot: spi || '—',
    parcel: String(propPFI),
    council: councilName,
    scheme: schemeName,
    ward: '—',
    suburb,
    postcode,
    coords: { lat: geo.y, lng: geo.x },
    landSize: Math.round(controls?.AREA || 0),
    frontage: null,
    depth: null,
    zone: formattedZone,
    overlays: formattedOverlays,
    parking,
    heritage: overlays.some(o => zoneBaseCode(o.ZONE_CODE || '') === 'HO'),
    bushfire: overlays.some(o => ['BMO','BMOZ'].includes(zoneBaseCode(o.ZONE_CODE || ''))),
    parcelGeometry,
  };
}

window.vicplanApi = { suggestAddresses, fetchPropertyData };
