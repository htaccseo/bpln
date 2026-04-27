import React, { useState } from 'react';
import { Button, Label, Card, Tag, Stat, SectionHeader, DotSeparator } from './primitives';
import {
  IconRuler, IconMap, IconLayers, IconCar, IconBookmark,
  IconSparkle, IconDownload, IconArrowRight, IconAlert,
} from './icons';
import PropertyMap from './PropertyMap';

export default function PropertyDashboard({ property, onActivity, onReport }) {
  const [mapMode, setMapMode] = useState('zoning');

  const parkingCatShort = (property.parking?.category || '').match(/Category\s+(\d)/)?.[1]
    ? 'Cat. ' + (property.parking.category.match(/Category\s+(\d)/)?.[1])
    : property.parking?.category || '—';

  const firstOverlay = property.overlays?.[0];

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
      <div style={{ maxWidth: 1280, margin: '0 auto' }} className="px-5 md:px-12">

        {/* Address header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          gap: 32, paddingBottom: 32, borderBottom: '1px solid #E5E5E5', marginBottom: 48,
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <Label>Property Report</Label>
              <Tag tone="green">Live</Tag>
              <span style={{ fontSize: 12, color: '#6B6B6B' }}>
                {property._fetchedAt ? `Fetched ${property._fetchedAt}` : 'Live data · VicPlan API'}
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 400, letterSpacing: '-0.02em',
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
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="ghost" size="md" icon={<IconBookmark size={16}/>}>Save</Button>
            <Button variant="secondary" size="md" icon={<IconSparkle size={16}/>}
              onClick={onActivity}>Activity</Button>
            <Button size="md" icon={<IconDownload size={16}/>} onClick={onReport}>Report</Button>
          </div>
        </div>

        {/* Multi-LGA warning banner */}
        {property.multiLgaWarning && (
          <div style={{
            display: 'flex', gap: 16, alignItems: 'flex-start',
            padding: '16px 20px', marginBottom: 24,
            background: '#FFFBEB', border: '1px solid #F5A623',
            borderRadius: 8,
          }}>
            <IconAlert size={18} style={{ color: '#F5A623', flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 14, lineHeight: 1.6, color: '#000' }}>
              <strong>⚠️ This property may span multiple LGA boundaries.</strong>
              {' '}Controls shown are for the primary LGA ({property.council}) only.
              {property.allLgaNames?.length > 1 && (
                <> Other LGA{property.allLgaNames.length > 2 ? 's' : ''} detected:{' '}
                  {property.allLgaNames
                    .filter(n => n.toUpperCase() !== property.lga)
                    .map(n => n.charAt(0) + n.slice(1).toLowerCase())
                    .join(', ')}.
                </>
              )}
              {' '}Please verify with{' '}
              <a
                href="https://mapshare.vic.gov.au/vicplan/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#000', fontWeight: 600, textUnderlineOffset: 3 }}
              >
                VicPlan
              </a>
              {' '}for complete information.
            </div>
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{
          border: '1px solid #E5E5E5', borderRadius: 8, marginBottom: 32,
        }}>
          {[
            {
              icon: <IconRuler size={14}/>, label: 'Land Size',
              value: property.landSize ? property.landSize.toLocaleString() + ' m²' : '—',
              sub: property.frontage && property.depth
                ? `${property.frontage}m × ${property.depth}m`
                : 'Area from VicPlan',
            },
            {
              icon: <IconMap size={14}/>, label: 'Zone',
              value: property.zones && property.zones.length > 1
                ? property.zones.map(z => z.code).join(' · ')
                : (property.zone?.code || '—'),
              sub: property.zones && property.zones.length > 1
                ? `${property.zones.length} zones`
                : (property.zone?.name || '—'),
            },
            {
              icon: <IconLayers size={14}/>, label: 'Overlays',
              value: property.overlays.length,
              sub: property.overlays.length > 0
                ? property.overlays.map(o => o.code).join(' · ')
                : 'No overlays',
            },
            {
              icon: <IconCar size={14}/>, label: 'Parking',
              value: parkingCatShort,
              sub: 'Clause 52.06',
            },
          ].map((s, i) => (
            <div key={i} style={{
              padding: 24,
              borderRight: 'none',
              borderBottom: '1px solid #E5E5E5',
            }}
            className={i % 2 === 0 ? 'border-r border-[#E5E5E5] lg:border-r lg:border-b-0' : 'lg:border-r lg:border-b-0'}
            >
              <Stat {...s} />
            </div>
          ))}
        </div>

        {/* Two-column: map + parcel details */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 24, marginBottom: 48 }}>
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 16, flexWrap: 'wrap', gap: 8,
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
              {mapMode === 'zoning' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, background: '#0066FF', opacity: 0.3, border: '1px solid #0066FF', display: 'inline-block' }}/>
                  {property.zone.code} — {property.zone.name.split(' —')[0]}
                </span>
              )}
              {mapMode === 'overlay' && firstOverlay && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, background: '#F5A623', opacity: 0.5, display: 'inline-block' }}/>
                  {firstOverlay.code} — {firstOverlay.name.split(' —')[0]}
                </span>
              )}
              {mapMode === 'overlay' && !firstOverlay && <span>No overlays on this parcel</span>}
              {mapMode === 'aerial' && <span>Satellite imagery — ESRI World Imagery</span>}
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
        {(() => {
          const zones = property.zones && property.zones.length > 0 ? property.zones : (property.zone ? [property.zone] : []);
          const subText = zones.length === 1
            ? `This parcel sits within the ${zones[0].name}. The purpose and permit triggers are set out under Clause ${zones[0].clause} of the Victoria Planning Provisions.`
            : `This parcel has ${zones.length} zones. Each zone sets out different use and development permissions under the Victoria Planning Provisions.`;
          return (
            <div style={{ marginBottom: 48 }}>
              <SectionHeader eyebrow="Planning Control — 01" title="Zoning" sub={subText} />
              <div style={{ display: 'grid', gap: 16 }}>
                {zones.map((z, idx) => (
                  <div key={z.code + idx} className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr]" style={{
                    border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden',
                  }}>
                    <div style={{ padding: 32, borderBottom: '1px solid #E5E5E5', background: '#FFF' }}
                      className="sm:border-b-0 sm:border-r sm:border-[#E5E5E5]">
                      <div style={{ fontSize: 52, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12 }}>
                        {z.code}
                      </div>
                      <div style={{ fontSize: 14, color: '#000', marginBottom: 20, maxWidth: '24ch' }}>{z.name}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                        {z.clause !== '—' && (
                          z.vpUrl
                            ? <a href={z.vpUrl} target="_blank" rel="noopener noreferrer" className="clause-ref">Clause {z.clause}</a>
                            : <span className="clause-ref">Clause {z.clause}</span>
                        )}
                        {z.schedule && (
                          z.url
                            ? <a href={z.url} target="_blank" rel="noopener noreferrer" className="clause-ref">Schedule {z.schedule}</a>
                            : <span className="clause-ref">Schedule {z.schedule}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ padding: 32 }}>
                      <Label style={{ marginBottom: 12 }}>Purpose</Label>
                      <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 20, maxWidth: '58ch' }}>{z.purpose}</p>
                      <Label style={{ marginBottom: 12 }}>Clause reference</Label>
                      <p style={{ fontSize: 14, color: '#6B6B6B' }}>
                        {z.clauseRef || `Refer to Clause ${z.clause} of the Victoria Planning Provisions and the ${property.scheme} for the full purpose statement and permit requirements.`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

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
                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_auto]" style={{ gap: 24, alignItems: 'center' }}>
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
          const lgaRaw = property.lga
            || (property.scheme || '').replace(/\s*Planning Scheme\s*$/i, '').trim().toUpperCase();
          const lgaTitle = lgaRaw
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
          const clause5206Url = lgaTitle
            ? `https://planning-schemes.app.planning.vic.gov.au/${encodeURIComponent(lgaTitle)}/ordinance/52.06`
            : null;
          const categoryNum = (property.parking?.category || '').match(/Category\s+(\d)/)?.[1];
          const PTAL_DESC = {
            '1': 'Limited public transport access — minimum parking rates apply with no maximum. Typically covers rural, regional, and outer suburban areas where car travel is the primary mode of transport.',
            '2': 'Moderate public transport access — minimum parking rates apply. Suitable for suburban areas and some regional centres with reasonable but not high-frequency public transport options.',
            '3': 'Good public transport access — both minimum and maximum parking rates apply. Typically covers key transport corridors and major suburban or regional centres with frequent services.',
            '4': 'Very good public transport access — generally no minimum parking required, but maximum rates apply to reduce congestion. Covers inner Melbourne and areas with high-quality, high-frequency public transport.',
          };
          const categoryDesc = categoryNum ? PTAL_DESC[categoryNum] : null;

          return (
            <div style={{ marginBottom: 48 }}>
              <SectionHeader
                eyebrow="Planning Control — 03"
                title="Particular Provisions"
                sub="Particular provisions are specific, issue-based controls that apply consistently statewide. They set standards for particular uses or developments."
              />

              <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden' }}>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr]">
                  <div style={{ padding: 32, background: '#FFF' }}
                    className="border-b border-[#E5E5E5] sm:border-b-0 sm:border-r sm:border-[#E5E5E5]">
                    <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 12 }}>
                      Car Parking
                    </div>
                    {clause5206Url
                      ? <a href={clause5206Url} target="_blank" rel="noopener noreferrer" className="clause-ref">Clause 52.06</a>
                      : <span className="clause-ref">Clause 52.06</span>
                    }
                  </div>
                  <div style={{ padding: 32, background: '#FFF' }}>
                    <Label style={{ marginBottom: 12 }}>Overview</Label>
                    <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 0, maxWidth: '58ch', color: '#333' }}>
                      Clause 52.06 sets the minimum number of car parking spaces required for land uses across Victoria. The number of spaces depends on the Car Parking Requirement Category (1–4) based on the property's location and public transport accessibility level (PTAL).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr]" style={{
                  borderTop: '1px solid #E5E5E5', background: '#FAFAFA',
                }}>
                  <div style={{ padding: 32 }}
                    className="border-b border-[#E5E5E5] sm:border-b-0 sm:border-r sm:border-[#E5E5E5]">
                    <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 8 }}>
                      {property.parking.category || 'Not available'}
                    </div>
                    <div style={{ fontSize: 12, color: '#6B6B6B' }}>Source: PTAL (VicMap open data)</div>
                  </div>
                  <div style={{ padding: 32 }}>
                    <Label style={{ marginBottom: 12 }}>Category Description</Label>
                    <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 0, maxWidth: '58ch', color: '#333' }}>
                      {categoryDesc || 'Refer to Clause 52.06 of the Victoria Planning Provisions for applicable car parking rates.'}
                    </p>
                  </div>
                </div>
              </div>
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
          <Card hoverable={false} style={{ padding: 0, overflowX: 'auto' }}>
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
                  ...(property.zones || (property.zone ? [property.zone] : [])).map(z => [z.clause, `${z.code} — Zone provisions`, 'Zoning']),
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
