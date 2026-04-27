export const MOCK_PROPERTY = {
  address: '12 Watton Street, Werribee VIC 3030',
  lot: 'Lot 24 on PS 412098',
  parcel: '2\\PS412098',
  council: 'Wyndham City Council',
  scheme: 'Wyndham Planning Scheme',
  lga: 'WYNDHAM',
  ward: 'Iramoo Ward',
  suburb: 'Werribee',
  postcode: '3030',
  coords: { lat: -37.9017, lng: 144.6628 },
  landSize: 612,
  frontage: 15.24,
  depth: 40.16,
  zone: {
    code: 'GRZ1',
    name: 'General Residential Zone — Schedule 1',
    purpose: 'To encourage development that respects the neighbourhood character. To implement neighbourhood character policy and adopted neighbourhood character guidelines.',
    clause: '32.08',
  },
  zones: [
    {
      code: 'GRZ1',
      name: 'General Residential Zone — Schedule 1',
      purpose: 'To encourage development that respects the neighbourhood character. To implement neighbourhood character policy and adopted neighbourhood character guidelines.',
      clause: '32.08',
      schedule: '1',
    },
  ],
  overlays: [
    { code: 'DCPO1', name: 'Development Contributions Plan Overlay — Schedule 1', clause: '45.06', description: 'Contributions toward Werribee Growth Area infrastructure.' },
    { code: 'SBO',   name: 'Special Building Overlay', clause: '44.05', description: 'Land affected by overland flow paths. Permit may be required for buildings and works.' },
  ],
  parking: {
    category: 'Category 2 — Suburban residential',
    clause: '52.06',
    dwellingRate: '1 space per 1-bedroom, 2 spaces per 3+ bedroom dwelling',
    visitor: '1 visitor space per 5 dwellings for 5+ dwellings',
  },
  heritage: false,
  bushfire: false,
};

export const MOCK_RECENT_SEARCHES = [
  { address: '45 Synnot Street, Werribee VIC 3030',        when: 'Today, 9:42am' },
  { address: '8 Duncans Road, Werribee South VIC 3030',    when: 'Yesterday' },
  { address: '120 Greaves Street North, Werribee VIC 3030', when: '2 days ago' },
];
