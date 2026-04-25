// ============================================================================
// Victorian Planning Provisions (VPP) — Complete Zone & Overlay Descriptions
// Plain English summaries for planners, developers, architects & general public
// ============================================================================

const zoneDescriptions = {

  // ── RESIDENTIAL ZONES (Clause 32) ─────────────────────────────────────────

  'RGZ': {
    clause: '32.07',
    summary: `Clause 32.07 — Residential Growth Zone (RGZ) encourages higher-density housing in locations well-served by public transport and services. It supports apartments, townhouses, and medium-density development with no mandatory maximum density. Typically applied along activity corridors and near train stations. A planning permit is required for most development, and ResCode (Clause 54/55) applies.`,
    tag: 'RESIDENTIAL', tagColor: '#E8A0A0'
  },

  'GRZ': {
    clause: '32.08',
    summary: `Clause 32.08 — General Residential Zone (GRZ) supports moderate housing growth while respecting existing neighbourhood character. It allows single dwellings, dual occupancies, and multi-unit developments, with ResCode applying to all residential buildings. A planning permit is required for most development, and the schedule may set additional requirements such as minimum lot sizes or garden area ratios.`,
    tag: 'RESIDENTIAL', tagColor: '#E8A0A0'
  },

  'NRZ': {
    clause: '32.09',
    summary: `Clause 32.09 — Neighbourhood Residential Zone (NRZ) is designed for areas where low-scale housing is preferred and neighbourhood character is to be protected. It limits subdivision and development more strictly than GRZ, with a maximum of two dwellings per lot in most circumstances. A planning permit is required for most development, and the schedule sets minimum lot sizes and other local requirements.`,
    tag: 'RESIDENTIAL', tagColor: '#E8A0A0'
  },

  'LDRZ': {
    clause: '32.03',
    summary: `Clause 32.03 — Low Density Residential Zone (LDRZ) applies to urban fringe areas where large residential lots without reticulated sewerage are common. Minimum lot sizes are typically 0.4 hectares or larger, and standard suburban subdivision is not intended. The zone allows for rural lifestyle living while limiting the fragmentation of land. A planning permit is required for most buildings and works.`,
    tag: 'RESIDENTIAL', tagColor: '#E8A0A0'
  },

  'MUZ': {
    clause: '32.04',
    summary: `Clause 32.04 — Mixed Use Zone (MUZ) accommodates a range of residential and commercial uses in areas where activity and housing co-exist. It commonly supports ground-floor retail or office with dwellings above, and is applied in urban renewal and activity corridor precincts. The zone provides flexibility for a mix of uses, with permit requirements depending on the specific activity and development proposed.`,
    tag: 'MIXED USE', tagColor: '#C4A0E8'
  },

  'TZ': {
    clause: '32.05',
    summary: `Clause 32.05 — Township Zone (TZ) applies to small towns and rural settlements where a range of residential, commercial, and community uses are appropriate. It supports the consolidation of existing towns while allowing for modest growth. A planning permit is required for most development, and the zone is commonly applied in regional Victoria.`,
    tag: 'RESIDENTIAL', tagColor: '#E8A0A0'
  },

  'RCZ': {
    clause: '32.06',
    summary: `Clause 32.06 — Rural Conservation Zone (RCZ) applies to areas where the conservation of natural resources, biodiversity, and landscape values is the primary objective. It significantly restricts development, particularly subdivision and dwellings, to protect sensitive rural environments. A planning permit is required for most uses and development, and subdivision is generally limited to existing lot sizes.`,
    tag: 'RURAL', tagColor: '#C8E8A0'
  },

  'HCTZ': {
    clause: '32.10',
    summary: `Clause 32.10 — Housing Choice and Transport Zone (HCTZ) encourages diverse and affordable housing in well-connected locations. It supports medium to higher density development near public transport, with a focus on housing affordability and choice. The zone reflects the Victorian Government's agenda to increase housing supply in established suburbs close to jobs and services.`,
    tag: 'RESIDENTIAL', tagColor: '#E8A0A0'
  },

  // ── COMMERCIAL ZONES (Clause 34) ──────────────────────────────────────────

  'ACZ': {
    clause: '37.08',
    summary: `Clause 37.08 — Activity Centre Zone (ACZ) applies to major metropolitan activity centres and uses a structure plan to guide development across different precincts. It supports high-density mixed use development including retail, office, residential, and community uses. The zone provides more tailored controls than C1Z and is applied to Fishermans Bend and similar large-scale urban renewal areas.`,
    tag: 'COMMERCIAL', tagColor: '#A0C4E8'
  },

  'C1Z': {
    clause: '34.01',
    summary: `Clause 34.01 — Commercial 1 Zone (C1Z) is the primary zone for activity centres, main streets, and strip shopping areas across Victoria. It supports retail, office, food and drink, entertainment, and residential uses, creating vibrant mixed-use environments. Most uses are either permit-required or as-of-right depending on the specific activity. The zone replaced the former Business 1, 2, and 5 zones.`,
    tag: 'COMMERCIAL', tagColor: '#A0C4E8'
  },

  'C2Z': {
    clause: '34.02',
    summary: `Clause 34.02 — Commercial 2 Zone (C2Z) supports office, service industry, and commercial uses not suited to major activity centres. It is typically applied to bulky goods retailing, trade services, and car-dependent commercial precincts. Residential use is generally not permitted, and the zone is designed to protect commercial land from residential encroachment. A planning permit is required for most uses.`,
    tag: 'COMMERCIAL', tagColor: '#A0C4E8'
  },

  // ── INDUSTRIAL ZONES (Clause 33) ──────────────────────────────────────────

  'IN1Z': {
    clause: '33.01',
    summary: `Clause 33.01 — Industrial 1 Zone (IN1Z) is for manufacturing, storage, distribution, and a wide range of industrial activities. It is the most permissive industrial zone and is applied to established industrial precincts across Victoria. Sensitive uses such as dwellings and childcare centres are generally not permitted, protecting industrial land from incompatible encroachment. A planning permit is required for most uses not specifically listed.`,
    tag: 'INDUSTRIAL', tagColor: '#E8D4A0'
  },

  'IN2Z': {
    clause: '33.02',
    summary: `Clause 33.02 — Industrial 2 Zone (IN2Z) is a transitional zone between industrial and residential or commercial uses. It accommodates light industrial activities and commercial uses that are not suited to IN1Z, while providing a buffer between heavy industry and sensitive uses. Some retail and office uses are permitted, giving the zone more flexibility than IN1Z.`,
    tag: 'INDUSTRIAL', tagColor: '#E8D4A0'
  },

  'IN3Z': {
    clause: '33.03',
    summary: `Clause 33.03 — Industrial 3 Zone (IN3Z) is designed for industries that may generate significant off-site impacts such as noise, odour, or heavy vehicle traffic. It provides a buffer between IN1Z areas and sensitive uses. The zone accommodates larger-scale industrial operations and is applied to areas where separation from residential land is a priority.`,
    tag: 'INDUSTRIAL', tagColor: '#E8D4A0'
  },

  // ── SPECIAL PURPOSE ZONES (Clause 37) ────────────────────────────────────

  'SUZ': {
    clause: '37.01',
    summary: `Clause 37.01 — Special Use Zone (SUZ) is applied to land with a unique or site-specific use that does not fit within standard zones. It is used sparingly and only where no other zone is appropriate, such as for airports, universities, or large integrated developments. The schedule to the zone sets out the specific uses and development controls for the site.`,
    tag: 'SPECIAL PURPOSE', tagColor: '#D4A0E8'
  },

  'CA': {
    clause: 'N/A',
    summary: `Commonwealth land — This land is owned or controlled by the Australian Government and is not subject to the Victorian planning scheme. State planning controls, including zones and overlays, do not apply to Commonwealth land. Development on Commonwealth land is governed by the Environment Protection and Biodiversity Conservation Act 1999 and Commonwealth environmental laws.`,
    tag: 'COMMONWEALTH', tagColor: '#D0D0D0'
  },

  'UGZ': {
    clause: '37.07',
    summary: `Clause 37.07 — Urban Growth Zone (UGZ) applies to land in Melbourne's growth corridors that has not yet been developed for urban purposes. Development within the zone is guided by Precinct Structure Plans (PSPs) approved by the Victorian Planning Authority. Until a PSP is approved, land uses are generally limited to existing rural activities. Once a PSP is approved, the zone enables urban development in accordance with the plan.`,
    tag: 'GROWTH AREA', tagColor: '#E8E8A0'
  },

  'CDZ': {
    clause: '37.03',
    summary: `Clause 37.03 — Comprehensive Development Zone (CDZ) enables the integrated and coordinated development of large or complex sites according to an approved development plan. It is applied to major urban renewal precincts or large development sites where a tailored planning framework is needed. The schedule and development plan set out the specific land use and development requirements for the site.`,
    tag: 'SPECIAL PURPOSE', tagColor: '#D4A0E8'
  },

  'CCZ': {
    clause: '37.04',
    summary: `Clause 37.04 — Capital City Zone (CCZ) applies to land in Melbourne's central city and Southbank. It supports the role of Melbourne's CBD as a global city by enabling high-density mixed use development, including major retail, commercial, residential, and entertainment uses. The zone is designed to maintain the vitality and diversity of Melbourne's central city area.`,
    tag: 'COMMERCIAL', tagColor: '#A0C4E8'
  },

  'DZ': {
    clause: '37.05',
    summary: `Clause 37.05 — Docklands Zone (DZ) applies specifically to the Docklands precinct and supports its transformation into a mixed-use urban district. It accommodates residential, commercial, retail, and entertainment uses in a waterfront setting. The zone is managed in conjunction with Development Plans and Precinct Plans for the various sub-precincts within Docklands.`,
    tag: 'SPECIAL PURPOSE', tagColor: '#D4A0E8'
  },

  'PDZ': {
    clause: '37.06',
    summary: `Clause 37.06 — Priority Development Zone (PDZ) is applied to land identified for significant development or urban renewal that requires a tailored planning framework. It enables development that may not be appropriately accommodated within standard zones. The schedule to the zone specifies the particular uses and development standards that apply to the site.`,
    tag: 'SPECIAL PURPOSE', tagColor: '#D4A0E8'
  },

  // ── PUBLIC LAND ZONES (Clause 36) ─────────────────────────────────────────

  'PPRZ': {
    clause: '36.02',
    summary: `Clause 36.02 — Public Park and Recreation Zone (PPRZ) applies to land used for public open space, parks, gardens, sports grounds, and recreational facilities. Buildings and works require a planning permit in most cases, with development limited to activities compatible with open space. The zone protects public land from development that would reduce its amenity or recreation value.`,
    tag: 'PUBLIC', tagColor: '#A0E8A8'
  },

  'PCRZ': {
    clause: '36.03',
    summary: `Clause 36.03 — Public Conservation and Resource Zone (PCRZ) applies to public land managed for conservation, including national parks, state forests, and nature reserves. Development is significantly restricted to protect environmental values, biodiversity, and landscape character. A planning permit is required for most buildings and works, and the zone prioritises conservation over development.`,
    tag: 'PUBLIC', tagColor: '#A0E8A8'
  },

  'RDZ1': {
    clause: '36.04',
    summary: `Clause 36.04 — Road Zone Category 1 (RDZ1) applies to declared arterial roads and freeways managed by DEECA. It recognises the transport function of major roads and limits development that could compromise road safety or capacity. Most development requires a planning permit, and DEECA is a referral authority for applications within or adjacent to this zone.`,
    tag: 'TRANSPORT', tagColor: '#D0D0D0'
  },

  'RDZ2': {
    clause: '36.04',
    summary: `Clause 36.04 — Road Zone Category 2 (RDZ2) applies to roads managed by councils that are not declared arterial roads. It serves a similar function to RDZ1 but for local road reserves. Development within the zone is limited to road-related uses and infrastructure. A planning permit is required for most development within the zone.`,
    tag: 'TRANSPORT', tagColor: '#D0D0D0'
  },

  'PUZ': {
    clause: '36.01',
    summary: `Clause 36.01 — Public Use Zone (PUZ) applies to land owned or managed by public authorities for a range of community purposes. The schedule identifies the specific public use type (e.g., PUZ1 Service & Utility, PUZ2 Education, PUZ3 Health, PUZ4 Transport). Uses and development aligned with the zone's purpose may not require a permit; others will.`,
    tag: 'PUBLIC', tagColor: '#A0E8A8'
  },

  'UFZ': {
    clause: '36.05',
    summary: `Clause 36.05 — Urban Floodway Zone (UFZ) applies to land in major urban floodways where development would obstruct flood flows or put people and property at significant risk. Development is severely restricted, and most buildings and works are not permitted. The zone is the most restrictive flood-related zone and is applied to the active channels of major waterways in urban areas.`,
    tag: 'FLOOD', tagColor: '#A0C8E8'
  },

  // ── RURAL ZONES (Clause 35) ────────────────────────────────────────────────

  'FZ': {
    clause: '35.07',
    summary: `Clause 35.07 — Farming Zone (FZ) protects productive agricultural land from fragmentation and incompatible development across Victoria. Subdivision is generally limited to a minimum of 40 hectares, and dwellings are only permitted in limited circumstances tied to agricultural use. The zone is applied to Victoria's most productive farming areas and is designed to keep agricultural land in productive use for future generations.`,
    tag: 'RURAL', tagColor: '#C8E8A0'
  },

  'RLZ': {
    clause: '35.03',
    summary: `Clause 35.03 — Rural Living Zone (RLZ) applies to the rural-urban fringe where low-density residential living on large lots is appropriate. Minimum lot sizes are typically 2–8 hectares, and the zone is not intended for farming or standard suburban development. It allows for hobby farms and rural lifestyle living while maintaining a semi-rural character. A planning permit is required for most buildings, works, and subdivision.`,
    tag: 'RURAL', tagColor: '#C8E8A0'
  },

  'GWZ': {
    clause: '35.04',
    summary: `Clause 35.04 — Green Wedge Zone (GWZ) protects non-urban land in Melbourne's green wedges from inappropriate development. It supports low-impact rural uses, conservation, and outdoor recreation while protecting landscape character and biodiversity. Subdivision and residential development are significantly restricted to contain Melbourne's urban sprawl. A planning permit is required for most development.`,
    tag: 'RURAL', tagColor: '#C8E8A0'
  },

  'GWAZ': {
    clause: '35.05',
    summary: `Clause 35.05 — Green Wedge A Zone (GWAZ) applies to non-urban land in Melbourne's green wedges where a range of rural and recreational uses are appropriate, including some retail and service uses that support rural activities. It is slightly more permissive than GWZ while still protecting the non-urban character of the green wedge. A planning permit is required for most uses and development.`,
    tag: 'RURAL', tagColor: '#C8E8A0'
  },

  'RAZ': {
    clause: '35.06',
    summary: `Clause 35.06 — Rural Activity Zone (RAZ) supports a range of rural land uses including farming, tourism, and rural industry in areas where a diversity of activities is appropriate. It is more flexible than FZ and allows for uses that complement and support agricultural activity, such as farm-based tourism and rural stores. A planning permit is required for most uses and development.`,
    tag: 'RURAL', tagColor: '#C8E8A0'
  },

  // ── TRANSPORT ZONES (Clause 36A) ──────────────────────────────────────────

  'TRZ1': { clause: '36A.01', summary: `Clause 36A.01 — Transport Zone 1 (TRZ1) applies to State Transport Infrastructure such as rail corridors, ports, and airports managed by State Government agencies. It protects strategic transport infrastructure from encroachment. Development within the zone is limited to transport-related uses and infrastructure.`, tag: 'TRANSPORT', tagColor: '#D0D0D0' },
  'TRZ2': { clause: '36A.02', summary: `Clause 36A.02 — Transport Zone 2 (TRZ2) applies to the Principal Road Network, including major highways and arterial roads managed by the State Government. It protects the road reserve from incompatible development. Development within the zone is limited to road-related uses.`, tag: 'TRANSPORT', tagColor: '#D0D0D0' },
  'TRZ3': { clause: '36A.03', summary: `Clause 36A.03 — Transport Zone 3 (TRZ3) applies to Significant Municipal Roads managed by local councils. It protects the road reserve and limits development that would compromise road function or safety.`, tag: 'TRANSPORT', tagColor: '#D0D0D0' },
  'TRZ4': { clause: '36A.04', summary: `Clause 36A.04 — Transport Zone 4 (TRZ4) applies to Other Transport Use land including local roads and minor transport infrastructure.`, tag: 'TRANSPORT', tagColor: '#D0D0D0' },

};


// ============================================================================
// OVERLAY DESCRIPTIONS
// ============================================================================

const overlayDescriptions = {

  // ── HERITAGE OVERLAYS (Clause 43) ─────────────────────────────────────────

  'HO': {
    clause: '43.01',
    summary: `Clause 43.01 — Heritage Overlay (HO) applies to land, buildings, or precincts with cultural heritage significance identified in the planning scheme. It requires a planning permit to demolish, alter, subdivide, or develop heritage-listed places. The schedule to the overlay identifies individual heritage properties and precincts, and may include specific controls such as tree protection. Works visible from the street typically require a permit, even minor changes.`,
    tag: 'HERITAGE', tagColor: '#E8C4A0'
  },

  // ── ENVIRONMENTAL & VEGETATION OVERLAYS (Clause 42) ──────────────────────

  'ESO': {
    clause: '42.01',
    summary: `Clause 42.01 — Environmental Significance Overlay (ESO) protects areas with environmental or ecological value, such as waterways, wetlands, and habitat corridors. A planning permit is required for most buildings, works, and vegetation removal within the overlay. The schedule identifies the specific environmental values to be protected and sets out applicable permit requirements and conditions.`,
    tag: 'ENVIRONMENT', tagColor: '#A0E8A0'
  },

  'VPO': {
    clause: '42.02',
    summary: `Clause 42.02 — Vegetation Protection Overlay (VPO) protects significant trees and vegetation on private land from removal or lopping. A planning permit is required to remove, destroy, or lop vegetation specified in the schedule. Commonly applied in areas with significant tree canopy, creek corridors, or biodiversity value. The schedule sets out which vegetation types are protected and the conditions that apply.`,
    tag: 'VEGETATION', tagColor: '#A0E8A0'
  },

  'SLO': {
    clause: '42.03',
    summary: `Clause 42.03 — Significant Landscape Overlay (SLO) protects areas with significant landscape character, including vegetation, landform, views, and scenic qualities. A planning permit is required for buildings, works, and vegetation removal within the overlay. Commonly applied in coastal areas, hillside settings, and areas with high landscape value. The schedule identifies the landscape values to be protected.`,
    tag: 'LANDSCAPE', tagColor: '#A0E8A0'
  },

  'LSIO': {
    clause: '44.04',
    summary: `Clause 44.04 — Land Subject to Inundation Overlay (LSIO) applies to land that may be affected by flooding from rivers, creeks, or drainage systems. A planning permit is required for most buildings and works, with floor levels typically required to be above the 1-in-100-year flood level. Melbourne Water or the relevant catchment management authority is usually a referral authority for applications within this overlay.`,
    tag: 'FLOOD', tagColor: '#A0C8E8'
  },

  'SBO': {
    clause: '44.03',
    summary: `Clause 44.03 — Special Building Overlay (SBO) applies to urban land where overland stormwater flows may cause localised flooding. A planning permit is required for most buildings and works, with floor levels required to be above the defined flood level. Melbourne Water is typically a referral authority. The overlay is commonly applied in established urban areas with existing drainage constraints.`,
    tag: 'FLOOD', tagColor: '#A0C8E8'
  },

  'FO': {
    clause: '44.05',
    summary: `Clause 44.05 — Floodway Overlay (FO) applies to land in the active floodway of a waterway where flood flows are most significant and dangerous. Development is severely restricted, and most buildings and works are not permitted. The overlay is more restrictive than LSIO and is applied to land where development would obstruct flood flows or put people and property at significant risk.`,
    tag: 'FLOOD', tagColor: '#A0C8E8'
  },

  // ── DESIGN AND DEVELOPMENT OVERLAYS (Clause 43) ──────────────────────────

  'DDO': {
    clause: '43.02',
    summary: `Clause 43.02 — Design and Development Overlay (DDO) sets specific design and built form requirements for an area, such as building height limits, setbacks, facade treatments, or landscaping. Commonly applied in activity centres, growth corridors, and urban renewal areas to guide the form and quality of development. A planning permit is required for buildings and works that do not comply with the schedule requirements.`,
    tag: 'DESIGN', tagColor: '#A0C4E8'
  },

  'DPO': {
    clause: '43.03',
    summary: `Clause 43.03 — Development Plan Overlay (DPO) requires an approved development plan before subdivision or development can proceed. Commonly applied to greenfield growth areas and urban renewal precincts to coordinate land use, infrastructure, and design outcomes. Once a development plan is approved, development generally in accordance with the plan may proceed without a further permit.`,
    tag: 'DEVELOPMENT PLAN', tagColor: '#A0C4E8'
  },

  'DCPO': {
    clause: '45.06',
    summary: `Clause 45.06 — Development Contributions Plan Overlay (DCPO) requires developers to contribute to the cost of infrastructure needed to support development, such as roads, drainage, and open space. The schedule sets out the levy amounts and the infrastructure to be funded. Commonly applied in growth areas where new development generates demand for community infrastructure.`,
    tag: 'CONTRIBUTIONS', tagColor: '#A0C4E8'
  },

  'ICO': {
    clause: '45.10',
    summary: `Clause 45.10 — Infrastructure Contributions Overlay (ICO) is the newer framework replacing DCPO for collecting developer contributions in growth areas. It is administered under the Infrastructure Contributions Plan (ICP) system and sets standard levies for roads, parks, and community facilities. The schedule and approved ICP set out the contribution rates and infrastructure projects to be funded.`,
    tag: 'CONTRIBUTIONS', tagColor: '#A0C4E8'
  },

  // ── LAND MANAGEMENT OVERLAYS (Clause 44) ─────────────────────────────────

  'BMO': {
    clause: '44.06',
    summary: `Clause 44.06 — Bushfire Management Overlay (BMO) applies to land in designated bushfire-prone areas where development could be at risk from bushfire. A planning permit is required for most buildings and works, with a Bushfire Attack Level (BAL) assessment required to determine construction standards. The overlay aims to protect life and property by ensuring development is appropriately located and designed.`,
    tag: 'BUSHFIRE', tagColor: '#E8A080'
  },

  'BMOZ': {
    clause: '44.06',
    summary: `Clause 44.06 — Bushfire Management Overlay (BMO) applies to land in significant bushfire-prone areas. A mandatory CFA referral is required for all permit applications. Construction must meet elevated bushfire standards, and the siting and design of buildings is strictly controlled to minimise risk to life and property.`,
    tag: 'BUSHFIRE', tagColor: '#E8A080'
  },

  'EMO': {
    clause: '44.01',
    summary: `Clause 44.01 — Erosion Management Overlay (EMO) applies to land susceptible to erosion, including coastal cliffs, steep slopes, and areas with unstable soils. A planning permit is required for most buildings, works, and vegetation removal. The overlay aims to prevent development that would exacerbate erosion or put people and property at risk from land instability.`,
    tag: 'LAND MANAGEMENT', tagColor: '#D4C4A0'
  },

  'SMO': {
    clause: '44.07',
    summary: `Clause 44.07 — Salinity Management Overlay (SMO) applies to land affected by or at risk from dryland salinity, which can damage buildings, infrastructure, and vegetation. A planning permit is required for most buildings and works. The overlay ensures development is designed to manage salinity risk and avoid exacerbating existing salinity problems in the landscape.`,
    tag: 'LAND MANAGEMENT', tagColor: '#D4C4A0'
  },

  'BAO': {
    clause: '44.08',
    summary: `Clause 44.08 — Buffer Area Overlay (BAO) applies to land near sensitive land uses or industrial activities where buffer distances are required to manage amenity or safety impacts. It ensures that sensitive uses such as dwellings are not established too close to sources of noise, odour, or other impacts. A planning permit is required for sensitive uses within the overlay area.`,
    tag: 'LAND MANAGEMENT', tagColor: '#D4C4A0'
  },

  // ── PARTICULAR PROVISIONS OVERLAYS (Clause 45) ────────────────────────────

  'PAO': {
    clause: '45.01',
    summary: `Clause 45.01 — Public Acquisition Overlay (PAO) identifies land that a public authority intends to acquire for a public purpose such as roads, schools, or community facilities. It restricts development to avoid increased compensation costs. The schedule identifies the acquiring authority and the intended public purpose. Landowners can request the acquiring authority to purchase the land in some circumstances.`,
    tag: 'PUBLIC ACQUISITION', tagColor: '#E8D0A0'
  },

  'AEO': {
    clause: '45.07',
    summary: `Clause 45.07 — Airport Environs Overlay (AEO) applies to land near airports where aircraft noise and operational safety constraints affect development. It limits sensitive uses in high-noise areas and requires development to meet noise attenuation standards. The schedule identifies the specific airport and the applicable noise contours and safety restrictions.`,
    tag: 'AIRPORT', tagColor: '#D0D0D0'
  },

  'MAEO': {
    clause: '45.08',
    summary: `Clause 45.08 — Melbourne Airport Environs Overlay (MAEO) applies to land affected by noise from Melbourne Airport. It restricts sensitive uses including dwellings in high-noise areas (ANEF 30+) and requires acoustic treatment for development in lower-noise areas. The overlay works in conjunction with the Airport Environs Overlay to manage development around Victoria's busiest airport.`,
    tag: 'AIRPORT', tagColor: '#D0D0D0'
  },

  'RO': {
    clause: '45.03',
    summary: `Clause 45.03 — Restructure Overlay (RO) applies to areas with outdated subdivision patterns, such as old bush allotments, where restructuring of lots is required before development can proceed. It controls further subdivision and development until a restructure plan is approved. The overlay encourages the consolidation of fragmented land into more rational and sustainable lot layouts.`,
    tag: 'SPECIAL', tagColor: '#E8E8A0'
  },

  'TOO': {
    clause: '45.04',
    summary: `Clause 45.04 — Timber Production Overlay (TOO) applies to private land used for commercial timber production in Victoria. It protects timber production land from incompatible development and recognises the economic importance of forestry. A planning permit is required for development that could interfere with timber production activities.`,
    tag: 'LAND MANAGEMENT', tagColor: '#D4C4A0'
  },

  'SCO': {
    clause: '45.12',
    summary: `Clause 45.12 — Specific Controls Overlay (SCO) incorporates site-specific planning provisions that cannot be accommodated within standard zones or overlays. It is applied where unique site circumstances require tailored controls, such as for specific industrial sites, large institutions, or complex developments. The schedule sets out the specific uses and development standards that apply.`,
    tag: 'SPECIAL', tagColor: '#E8E8A0'
  },

  'IPO': {
    clause: '43.09',
    summary: `Clause 43.09 — Incorporated Plan Overlay (IPO) requires development to be in accordance with an incorporated plan before a planning permit can be granted. It is applied to ensure coordinated development of areas with complex planning requirements. The incorporated plan sets out the land use framework, infrastructure requirements, and design standards for the area.`,
    tag: 'DEVELOPMENT PLAN', tagColor: '#A0C4E8'
  },

  'LPO': {
    clause: '43.10',
    summary: `Clause 43.10 — Local Policy Overlay (LPO) enables local planning policies to be applied with statutory effect to specific areas. It is used where a council wishes to give greater weight to a local policy than is achievable through standard planning scheme provisions. The schedule sets out the specific policy requirements that apply.`,
    tag: 'SPECIAL', tagColor: '#E8E8A0'
  },

  'NCO': {
    clause: '43.11',
    summary: `Clause 43.11 — Neighbourhood Character Overlay (NCO) identifies and protects areas with a valued and distinctive neighbourhood character. It requires that development respect and respond to the established character of the area, including architectural style, setbacks, landscaping, and scale. A planning permit may be required for buildings and works, with design requirements specified in the schedule.`,
    tag: 'DESIGN', tagColor: '#A0C4E8'
  },

  'ERO': {
    clause: '42.06',
    summary: `Clause 42.06 — Environmental Rural Overlay (ERO) applies to land with significant environmental values in rural areas. It restricts development and vegetation removal to protect biodiversity and ecological functions. A planning permit is required for most buildings, works, and land use changes within the overlay area.`,
    tag: 'ENVIRONMENT', tagColor: '#A0E8A0'
  },

  'EEO': {
    clause: '42.03',
    summary: `Clause 42.03 — Environmental Audit Overlay (EEO) requires an environmental audit before sensitive uses such as dwellings, childcare centres, or food premises can commence on potentially contaminated land. The audit must confirm the land is suitable for the proposed use or identify remediation works required. Commonly applied to former industrial or commercial sites.`,
    tag: 'ENVIRONMENT', tagColor: '#A0E8A0'
  },

  'DCO': {
    clause: '44.08',
    summary: `Clause 44.08 — Development Contributions Overlay (DCO) applies where developer contributions are required for infrastructure provision. It operates similarly to the DCPO and sets out the contributions payable by developers toward roads, drainage, open space, and community facilities. The schedule specifies the applicable levies and infrastructure projects.`,
    tag: 'CONTRIBUTIONS', tagColor: '#A0C4E8'
  },

};


// ── HELPER FUNCTIONS ──────────────────────────────────────────────────────────

function getZoneDescription(zoneCode) {
  if (!zoneCode) return null;
  const baseCode = zoneCode.replace(/\d+$/, '');
  return zoneDescriptions[baseCode] || null;
}

function getOverlayDescription(overlayCode) {
  if (!overlayCode) return null;
  const baseCode = overlayCode.replace(/\d+$/, '');
  return overlayDescriptions[baseCode] || null;
}

function getPlanningControlDescription(code) {
  if (!code) return null;
  const baseCode = code.replace(/\d+$/, '');
  return zoneDescriptions[baseCode] || overlayDescriptions[baseCode] || null;
}
