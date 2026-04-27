import React from 'react';
import { Button, Label, Tag } from './primitives';
import { IconArrowLeft, IconCopy, IconPrint, IconDownload } from './icons';
import { detectAssessment } from './ActivityAssessment';
import PropertyMap from './PropertyMap';

export default function ReportPreview({ property, assessment, onBack }) {
  const a = assessment || detectAssessment('Construct two or more dwellings');

  const handlePrint = () => window.print();

  return (
    <main style={{ paddingTop: 40, paddingBottom: 96, background: '#F7F7F7', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }} className="px-5 md:px-12">

        {/* Top toolbar */}
        <div className="no-print" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 32, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Label>Consolidated Report</Label>
              <Tag tone="blue">Preview</Tag>
            </div>
            <div style={{ fontSize: 15, color: '#6B6B6B' }}>
              Ready to export · 4 pages · {property.address}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="ghost" icon={<IconArrowLeft size={16}/>} onClick={onBack}>Back</Button>
            <Button variant="ghost" icon={<IconCopy size={16}/>}>Copy link</Button>
            <Button variant="secondary" icon={<IconPrint size={16}/>} onClick={handlePrint}>Print</Button>
            <Button icon={<IconDownload size={16}/>}>Download PDF</Button>
          </div>
        </div>

        {/* A4-style report pages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>

          {/* Page 1: Cover */}
          <ReportPage>
            <div style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              height: '100%',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 96 }}>
                  <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em' }}>vicplan</div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B6B6B' }}>
                    Property Planning Report
                  </div>
                </div>

                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 32 }}>
                  Report prepared for
                </div>
                <h1 style={{
                  fontSize: 48, fontWeight: 400, letterSpacing: '-0.02em',
                  lineHeight: 1.05, margin: 0, maxWidth: '16ch',
                }}>{property.address}</h1>

                <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 500 }}>
                  <div>
                    <Label style={{ marginBottom: 8 }}>Responsible Authority</Label>
                    <div style={{ fontSize: 15 }}>{property.council}</div>
                  </div>
                  <div>
                    <Label style={{ marginBottom: 8 }}>Planning Scheme</Label>
                    <div style={{ fontSize: 15 }}>{property.scheme}</div>
                  </div>
                  <div>
                    <Label style={{ marginBottom: 8 }}>Lot / Plan</Label>
                    <div style={{ fontSize: 15 }} className="mono">{property.lot}</div>
                  </div>
                  <div>
                    <Label style={{ marginBottom: 8 }}>Land Size</Label>
                    <div style={{ fontSize: 15 }} className="mono">{property.landSize} m²</div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ height: 1, background: '#E5E5E5', marginBottom: 16 }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B6B6B' }}>
                  <span>Generated {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>Page 1 of 4</span>
                </div>
                <div style={{ marginTop: 32, fontSize: 11, lineHeight: 1.6, color: '#6B6B6B', maxWidth: '65ch' }}>
                  <strong style={{ color: '#000' }}>Disclaimer.</strong> This report is an unofficial
                  interpretation of data drawn from VicPlan and the {property.scheme}. It does not
                  constitute legal or planning advice. Always verify with the responsible authority
                  before lodging any permit application.
                </div>
              </div>
            </div>
          </ReportPage>

          {/* Page 2: Property summary */}
          <ReportPage pageNum={2}>
            <ReportHeader title="01 · Property Summary" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
              <div>
                <PropertyMap property={property} mode="zoning" />
                <div style={{ marginTop: 8, fontSize: 10, color: '#6B6B6B' }}>Figure 1 — Cadastral view with GRZ1 extent.</div>
              </div>
              <div>
                <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }} className="mono">
                  <tbody>
                    {[
                      ['Address', property.address],
                      ['Lot / Plan', property.lot],
                      ['SPI', property.parcel],
                      ['Council', property.council],
                      ['Ward', property.ward],
                      ['Land Size', `${property.landSize} m²`],
                      ['Frontage', `${property.frontage} m`],
                      ['Depth', `${property.depth} m`],
                      ['Coordinates', `${property.coords.lat.toFixed(4)}, ${property.coords.lng.toFixed(4)}`],
                      ['Heritage', property.heritage ? 'Yes' : 'Not listed'],
                      ['Bushfire', property.bushfire ? 'Yes' : 'Not in BMO'],
                    ].map(([k, v]) => (
                      <tr key={k} style={{ borderBottom: '1px solid #E5E5E5' }}>
                        <td style={{ padding: '10px 0', color: '#6B6B6B', width: '42%', fontFamily: 'Inter Tight' }}>{k}</td>
                        <td style={{ padding: '10px 0' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <ReportSubhead>Planning Controls</ReportSubhead>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', marginBottom: 32 }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #000' }}>
                  <th style={{ ...thStyle, width: 90 }}>Control</th>
                  <th style={{ ...thStyle, width: 80 }}>Code</th>
                  <th style={thStyle}>Title</th>
                  <th style={{ ...thStyle, width: 80 }}>Clause</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <td style={tdStyle}>Zone</td>
                  <td style={tdStyle} className="mono">{property.zone.code}</td>
                  <td style={tdStyle}>{property.zone.name}</td>
                  <td style={tdStyle} className="mono">{property.zone.clause}</td>
                </tr>
                {property.overlays.map(o => (
                  <tr key={o.code} style={{ borderBottom: '1px solid #E5E5E5' }}>
                    <td style={tdStyle}>Overlay</td>
                    <td style={tdStyle} className="mono">{o.code}</td>
                    <td style={tdStyle}>{o.name}</td>
                    <td style={tdStyle} className="mono">{o.clause}</td>
                  </tr>
                ))}
                <tr>
                  <td style={tdStyle}>Parking</td>
                  <td style={tdStyle} className="mono">52.06</td>
                  <td style={tdStyle}>{property.parking.category}</td>
                  <td style={tdStyle} className="mono">{property.parking.clause}</td>
                </tr>
              </tbody>
            </table>

            <ReportFooter pageNum={2} total={4} address={property.address}/>
          </ReportPage>

          {/* Page 3: Assessment */}
          {a && (
            <ReportPage pageNum={3}>
              <ReportHeader title="02 · Activity Assessment" />

              <ReportSubhead>Verdict</ReportSubhead>
              <div style={{
                padding: 20, background: '#000', color: '#FFF', borderRadius: 6,
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.7, marginBottom: 8 }}>
                  Planning Outcome
                </div>
                <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                  {a.headline}
                </div>
                <div style={{ marginTop: 12, fontSize: 12, lineHeight: 1.55, color: '#AAAAAA' }}>
                  {a.summary}
                </div>
              </div>

              <ReportSubhead>Permit Triggers</ReportSubhead>
              <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse', marginBottom: 24 }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #000' }}>
                    <th style={{ ...thStyle, width: 70 }}>Clause</th>
                    <th style={thStyle}>Provision</th>
                    <th style={{ ...thStyle, width: 140 }}>Outcome</th>
                    <th style={thStyle}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {a.triggers.map(t => (
                    <tr key={t.clause} style={{ borderBottom: '1px solid #E5E5E5' }}>
                      <td style={tdStyle} className="mono">{t.clause}</td>
                      <td style={tdStyle}>{t.title}</td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 500 }}>{t.verdict}</span>
                      </td>
                      <td style={{ ...tdStyle, color: '#6B6B6B' }}>{t.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ReportFooter pageNum={3} total={4} address={property.address}/>
            </ReportPage>
          )}

          {/* Page 4: Clauses + next steps */}
          {a && (
            <ReportPage pageNum={4}>
              <ReportHeader title="03 · Relevant Clauses & Next Steps" />

              <ReportSubhead>Cited Clauses — Victoria Planning Provisions</ReportSubhead>
              <div style={{ marginBottom: 32 }}>
                {a.clauses.map((c, i) => (
                  <div key={i} style={{
                    paddingBottom: 16, marginBottom: 16,
                    borderBottom: i < a.clauses.length - 1 ? '1px solid #E5E5E5' : 'none',
                  }}>
                    <div className="mono" style={{ fontSize: 11, color: '#0066FF', marginBottom: 6 }}>Clause {c.ref}</div>
                    <blockquote style={{
                      margin: 0, fontSize: 12, lineHeight: 1.6, fontStyle: 'italic',
                      borderLeft: '2px solid #000', paddingLeft: 14, maxWidth: '70ch',
                    }}>"{c.text}"</blockquote>
                  </div>
                ))}
              </div>

              <ReportSubhead>Recommended Next Steps</ReportSubhead>
              <ol style={{ padding: 0, margin: 0, listStyle: 'none', marginBottom: 32 }}>
                {a.next.map((n, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: 16, padding: '12px 0',
                    borderBottom: '1px solid #E5E5E5',
                  }}>
                    <span className="mono" style={{ fontSize: 11, color: '#6B6B6B', minWidth: 28 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: 12, lineHeight: 1.5 }}>{n}</span>
                  </li>
                ))}
              </ol>

              {a.referrals.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <ReportSubhead>Referral Authorities</ReportSubhead>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {a.referrals.map(r => (
                      <span key={r} style={{
                        padding: '4px 10px', fontSize: 11, border: '1px solid #000',
                        borderRadius: 4,
                      }}>{r}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{
                marginTop: 48, padding: 20, background: '#F7F7F7', borderRadius: 6,
                fontSize: 11, lineHeight: 1.6, color: '#6B6B6B',
              }}>
                <strong style={{ color: '#000' }}>Final disclaimer.</strong> Generated by VicPlan.
                Source: VicPlan API (v2.3), {property.scheme} (consolidated
                to Amendment C245). This automated assessment does not replace a formal planning
                certificate. Responsible Authority: {property.council}.
              </div>

              <ReportFooter pageNum={4} total={4} address={property.address}/>
            </ReportPage>
          )}
        </div>
      </div>
    </main>
  );
}

function ReportPage({ children, pageNum }) {
  return (
    <div style={{
      width: '100%', maxWidth: 794, minHeight: 1123,
      background: '#FFF', border: '1px solid #E5E5E5',
      padding: 56, position: 'relative',
      pageBreakAfter: 'always',
      fontFamily: 'Inter Tight',
      boxSizing: 'border-box',
    }}>
      {children}
    </div>
  );
}

function ReportHeader({ title }) {
  return (
    <div style={{ marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B6B6B', fontWeight: 600 }}>vicplan</div>
    </div>
  );
}

function ReportSubhead({ children }) {
  return <div style={{
    fontSize: 10, fontWeight: 600, letterSpacing: '0.15em',
    textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 14,
  }}>{children}</div>;
}

function ReportFooter({ pageNum, total, address }) {
  return (
    <div style={{
      position: 'absolute', bottom: 32, left: 56, right: 56,
      display: 'flex', justifyContent: 'space-between',
      paddingTop: 14, borderTop: '1px solid #E5E5E5',
      fontSize: 10, color: '#6B6B6B',
    }}>
      <span>{address}</span>
      <span>Page {pageNum} of {total}</span>
    </div>
  );
}

const thStyle = { textAlign: 'left', padding: '10px 0 10px 0', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B' };
const tdStyle = { padding: '10px 8px 10px 0', verticalAlign: 'top' };
