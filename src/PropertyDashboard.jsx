function PropertyDashboard({ property, onActivity, onReport }) {
  const [mapMode, setMapMode] = React.useState('zoning');

  // Derive parking category label from the category string
  const parkingCatShort = (property.parking?.category || '').match(/Category\s+(\d)/)?.[1]
    ? 'Cat. ' + (property.parking.category.match(/Category\s+(\d)/)?.[1])
    : property.parking?.category || '—';

  // Build overlay legend label
  const firstOverlay = property.overlays?.[0];

  // Parcel rows — hide unavailable fields
  const parcelRows = [
    ['Address', property.address],
    property.lot && property.lot !== '—' ? ['Lot / Plan', property.lot] : null,
    ['Property PFI', property.parcel],
    ['Responsible Authority', property.council],
    ['Planning Scheme', property.scheme],
    property.ward && property.ward !== '—' ? ['Ward', property.ward] : null,
    ['Suburb / Postcode', `${property.suburb}, ${property.postcode}`],
    property.landSize ? ['Land Size', `${property.landSize.toLocaleString()} m²`] : null,
    property.frontage ? ['Frontage', `${property.frontage} m`] : null,
    property.depth ? ['Depth', `${property.depth} m`] : null,
    ['Heritage', property.heritage ? 'Yes — Heritage Overlay applies' : 'Not listed'],
    ['Bushfire', property.bushfire ? 'Yes — BMO applies' : 'Not in BMO'],
  ].filter(Boolean);

  return (
    <main style={{ paddingTop: 40, paddingBottom: 96 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>

        {/* Address header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          gap: 32, paddingBottom: 32, borderBottom: '1px solid #E5E5E5', marginBottom: 48,
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Label>Property Report</Label>
              <Tag tone="green">Live</Tag>
              <span style={{ fontSize: 12, color: '#6B6B6B' }}>
                {property._fetchedAt ? `Fetched ${property._fetchedAt}` : 'Live data · VicPlan API'}
              </span>
            </div>
            <h1 style={{
              fontSize: 44, fontWeight: 400, letterSpacing: '-0.02em',
              lineHeight: 1.05, margin: 0, maxWidth: '22ch',
            }}>{property.address}</h1>
            <div style={{ display: 'flex', gap: 16, marginTop: 16, color: '#6B6B6B', fontSize: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              {property.lot && property.lot !== '—' && <span>{property.lot}</span>}
              {property.lot && property.lot !== '—' && <span>·</span>}
              <span>{property.council}</span>
              <span>·</span>
              <span className="mono">{property.coords.lat.toFixed(4)}, {property.coords.lng.toFixed(4)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="ghost" size="md" icon={<IconBookmark size={16}/>}>Save</Button>
            <Button variant="secondary" size="md" icon={<IconSparkle size={16}/>}
              onClick={onActivity}>Ask about activity</Button>
            <Button size="md" icon={<IconDownload size={16}/>} onClick={onReport}>Download report</Button>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
          border: '1px solid #E5E5E5', borderRadius: 8, marginBottom: 32,
        }}>
          {[
            {
              icon: <IconRuler size={14}/>, label: 'Land Size',
              value: property.landSize ? property.landSize.toLocaleString() + ' m²' : '—',
              sub: property.frontage && property.depth
                ? `${property.frontage}m frontage · ${property.depth}m depth`
                : 'Area from VicPlan parcel data',
            },
            {
              icon: <IconMap size={14}/>, label: 'Zone',
              value: property.zone.code || '—',
              sub: property.zone.name,
            },
            {
              icon: <IconLayers size={14}/>, label: 'Overlays',
              value: property.overlays.length,
              sub: property.overlays.length > 0
                ? property.overlays.map(o => o.name).join(' · ')
                : 'No overlays',
            },
            {
              icon: <IconCar size={14}/>, label: 'Parking Cat.',
              value: parkingCatShort,
              sub: 'Clause 52.06',
            },
          ].map((s, i) => (
            <div key={i} style={{ padding: 24, borderRight: i < 3 ? '1px solid #E5E5E5' : 'none' }}>
              <Stat {...s} />
            </div>
          ))}
        </div>

        {/* Two-column: map + parcel details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 16,
            }}>
              <Label>Cadastral View</Label>
              <div style={{ display: 'flex', gap: 4 }}>
                {[['zoning', 'Zoning'], ['overlay', 'Overlay'], ['aerial', 'Aerial']].map(([v, l]) => (
                  <button key={v} onClick={() => setMapMode(v)} style={{
                    padding: '6px 10px', fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: mapMode === v ? '#FFF' : '#000',
                    background: mapMode === v ? '#000' : '#FFF',
                    border: '1px solid ' + (mapMode === v ? '#000' : '#E5E5E5'),
                    borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit',
                  }}>{l}</button>
                ))}
              </div>
            </div>
            <PropertyMap property={property} mode={mapMode} />
            <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 12, color: '#6B6B6B', flexWrap: 'wrap' }}>
              {mapMode === 'zoning' && <>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, background: '#0066FF', opacity: 0.3, border: '1px solid #0066FF', display: 'inline-block' }}/>
                  {property.zone.code} — {property.zone.name.split(' —')[0]}
                </span>
              </>}
              {mapMode === 'overlay' && firstOverlay && <>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, background: '#F5A623', opacity: 0.5, display: 'inline-block' }}/>
                  {firstOverlay.code} — {firstOverlay.name.split(' —')[0]}
                </span>
              </>}
              {mapMode === 'overlay' && !firstOverlay && <span>No overlays on this parcel</span>}
              {mapMode === 'aerial' && <span>Schematic view — connect to a tile provider for aerial imagery</span>}
            </div>
          </div>

          <div>
            <Label style={{ marginBottom: 16 }}>Parcel Details</Label>
            <Card hoverable={false} style={{ padding: 0 }}>
              <table className="data-table">
                <tbody>
                  {parcelRows.map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ width: '40%', color: '#6B6B6B', fontSize: 13 }}>{k}</td>
                      <td style={{ fontSize: 14 }} className="mono">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>

        {/* Zoning deep dive */}
        <div style={{ marginBottom: 48 }}>
          <SectionHeader
            eyebrow="Planning Control — 01"
            title="Zoning"
            sub={`This parcel sits within the ${property.zone.name}. The purpose and permit triggers are set out under Clause ${property.zone.clause} of the Victoria Planning Provisions.`}
          />
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 0,
            border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden',
          }}>
            <div style={{ padding: 32, borderRight: '1px solid #E5E5E5', background: '#FFF' }}>
              <div style={{ fontSize: 52, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12 }}>
                {property.zone.code}
              </div>
              <div style={{ fontSize: 14, color: '#000', marginBottom: 20, maxWidth: '24ch' }}>{property.zone.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {property.zone.clause !== '—' && (
                  property.zone.vpUrl
                    ? <a href={property.zone.vpUrl} target="_blank" rel="noopener noreferrer" className="clause-ref">Clause {property.zone.clause}</a>
                    : <span className="clause-ref">Clause {property.zone.clause}</span>
                )}
                {property.zone.schedule && (
                  property.zone.url
                    ? <a href={property.zone.url} target="_blank" rel="noopener noreferrer" className="clause-ref">Schedule {property.zone.schedule}</a>
                    : <span className="clause-ref">Schedule {property.zone.schedule}</span>
                )}
              </div>
            </div>
            <div style={{ padding: 32 }}>
              <Label style={{ marginBottom: 12 }}>Purpose</Label>
              <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 20, maxWidth: '58ch' }}>{property.zone.purpose}</p>
              <Label style={{ marginBottom: 12 }}>Clause reference</Label>
              <p style={{ fontSize: 14, color: '#6B6B6B' }}>
                {property.zone.clauseRef || `Refer to Clause ${property.zone.clause} of the Victoria Planning Provisions and the ${property.scheme} for the full purpose statement and permit requirements.`}
              </p>
            </div>
          </div>
        </div>

        {/* Overlays */}
        {property.overlays.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <SectionHeader
              eyebrow="Planning Control — 02"
              title="Overlays"
              sub="Additional controls layered over the base zone. Each overlay may trigger a separate permit requirement."
            />
            <div style={{ display: 'grid', gap: 16 }}>
              {property.overlays.map((o, i) => (
                <Card key={o.code + i} hoverable={false}>
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: 32, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>{o.code}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                        {o.clause !== '—' && (
                          o.vpUrl
                            ? <a href={o.vpUrl} target="_blank" rel="noopener noreferrer" className="clause-ref">Cl. {o.clause}</a>
                            : <span className="clause-ref">Cl. {o.clause}</span>
                        )}
                        {o.schedule && (
                          o.url
                            ? <a href={o.url} target="_blank" rel="noopener noreferrer" className="clause-ref">Schedule {o.schedule}</a>
                            : <span className="clause-ref">Schedule {o.schedule}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{o.name}</div>
                      <div style={{ fontSize: 14, color: '#6B6B6B', maxWidth: '52ch' }}>{o.description}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Tag tone={o.code.startsWith('HO') ? 'amber' : o.code.startsWith('DCPO') ? 'blue' : 'default'}>
                        {o.code.startsWith('HO') ? 'Heritage' : o.code.startsWith('DCPO') || o.code.startsWith('DCO') ? 'Financial' : 'Permit may apply'}
                      </Tag>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {property.overlays.length === 0 && (
          <div style={{ marginBottom: 48 }}>
            <SectionHeader eyebrow="Planning Control — 02" title="Overlays" />
            <Card hoverable={false} style={{ padding: 32, textAlign: 'center', color: '#6B6B6B' }}>
              No overlays recorded on this parcel in the VicPlan database.
            </Card>
          </div>
        )}

        {/* Parking */}
        {(() => {
          const lgaSlug = encodeURIComponent(
            (property.scheme || '').replace(/\s*Planning Scheme\s*$/i, '').trim().toUpperCase()
          );
          const clause5206Url = lgaSlug
            ? `https://planning-schemes.app.planning.vic.gov.au/${lgaSlug}/ordinance#52-06`
            : null;
          const categoryNum = (property.parking?.category || '').match(/Category\s+(\d)/)?.[1];
          const PTAL_DESC = {
            '1': 'Highest public transport accessibility — lowest parking requirement. Typically inner-city areas within 400m of frequent train or tram services.',
            '2': 'Good public transport access — reduced parking requirement. Typically established suburbs with regular bus and train services.',
            '3': 'Moderate public transport access — standard parking requirement. Typically middle suburbs with some public transport options.',
            '4': 'Low public transport accessibility — highest parking requirement. Typically outer suburbs and regional areas with limited public transport.',
          };
          const categoryDesc = categoryNum ? PTAL_DESC[categoryNum] : null;

          return (
            <div style={{ marginBottom: 48 }}>
              <SectionHeader
                eyebrow="Planning Control — 03"
                title="Car Parking"
                sub="Clause 52.06 — Car Parking sets the minimum number of car parking spaces required for different land uses across Victoria. The number of spaces required depends on the Car Parking Requirement Category (1–4) determined by the property's location and public transport accessibility level (PTAL). A planning permit is required to reduce, vary, or waive the car parking requirement."
              />
              {clause5206Url && (
                <div style={{ marginBottom: 16 }}>
                  <a href={clause5206Url} target="_blank" rel="noopener noreferrer" className="clause-ref">
                    Clause 52.06
                  </a>
                </div>
              )}
              <Card hoverable={false} style={{ padding: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
                  {[
                    { label: 'Category', value: property.parking.category, sub: 'Source: PTAL (VicMap open data)' },
                    { label: 'Dwelling Rate', value: property.parking.dwellingRate, sub: 'Clause 52.06-5, Table 1' },
                    { label: 'Visitor Spaces', value: property.parking.visitor, sub: 'Applicable for 5+ dwellings' },
                  ].map((p, i) => (
                    <div key={i} style={{ padding: 28, borderRight: i < 2 ? '1px solid #E5E5E5' : 'none' }}>
                      <Label style={{ marginBottom: 12 }}>{p.label}</Label>
                      <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.4, marginBottom: 10 }}>{p.value}</div>
                      <div style={{ fontSize: 12, color: '#6B6B6B' }}>{p.sub}</div>
                    </div>
                  ))}
                </div>
                {categoryDesc && (
                  <div style={{
                    padding: '20px 28px',
                    borderTop: '1px solid #E5E5E5',
                    background: '#FAFAFA',
                    fontSize: 14,
                    color: '#444',
                    lineHeight: 1.6,
                  }}>
                    {categoryDesc}
                  </div>
                )}
              </Card>
            </div>
          );
        })()}

        {/* Planning Scheme reference */}
        <div>
          <SectionHeader
            eyebrow="Local Policy"
            title={property.scheme}
            sub="Standard clauses likely to apply to development on this parcel. Verify current amendments with the responsible authority."
          />
          <Card hoverable={false} style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 120 }}>Clause</th>
                  <th>Title</th>
                  <th style={{ width: 220 }}>Topic</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [property.zone.clause, `${property.zone.code} — Zone provisions`, 'Zoning'],
                  ['52.06', 'Car Parking', 'Transport'],
                  ['55.00', 'ResCode — Two or more dwellings', 'Residential standards'],
                  ['65.00', 'Decision guidelines', 'Permit process'],
                  ...property.overlays.map(o => [o.clause, `${o.code} — ${o.name.split(' —')[0]}`, 'Overlay']),
                ].filter(([c]) => c && c !== '—').map(([c, t, topic]) => (
                  <tr key={c + t} style={{ cursor: 'pointer' }}>
                    <td><a href="#" className="clause-ref">{c}</a></td>
                    <td style={{ fontWeight: 500 }}>{t}</td>
                    <td style={{ color: '#6B6B6B', fontSize: 13 }}>{topic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <DotSeparator />

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '32px 0', gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ maxWidth: '48ch' }}>
            <h3 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 8 }}>
              Next: describe what you want to build.
            </h3>
            <p style={{ color: '#6B6B6B', fontSize: 15 }}>
              The Activity Assessment reads the planning scheme against your intent and returns
              a plain-English permit reading with cited clauses.
            </p>
          </div>
          <Button size="lg" iconRight={<IconArrowRight size={18}/>} onClick={onActivity}>
            Start activity assessment
          </Button>
        </div>
      </div>
    </main>
  );
}
window.PropertyDashboard = PropertyDashboard;
