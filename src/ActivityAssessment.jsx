import React, { useState } from 'react';
import { Button, Label, Card, Tag, SectionHeader, DotSeparator } from './primitives';
import {
  IconSparkle, IconArrowRight, IconPlus, IconDownload, IconInfo,
} from './icons';

const ACTIVITY_CHIPS = [
  "Construct a single dwelling",
  "Construct two or more dwellings",
  "Demolish an existing dwelling",
  "Use a building as a restaurant",
  "Subdivide the land into two lots",
  "Build a front fence over 1.5m",
  "Remove a tree on the property",
  "Use for home-based business",
];

// Canned assessment library
const ASSESSMENTS = {
  default: {
    verdict: 'permit-required',
    headline: 'A planning permit is likely required.',
    summary: "The General Residential Zone – Schedule 1 permits a single dwelling on a lot ≥ 300 m² without a planning permit, but the Special Building Overlay independently triggers a permit for buildings and works. Your proposal will need council assessment against ResCode (Clause 55) and drainage requirements before approval.",
    triggers: [
      { clause: '32.08-6', title: 'GRZ1 — Buildings and works for a dwelling', verdict: 'No permit', note: 'Lot is 612 m² (above 300 m² threshold). A permit is NOT required under the zone for a single dwelling.' },
      { clause: '44.05-2', title: 'SBO — Buildings and works', verdict: 'Permit required', note: 'Construction of a building requires a permit. Council must consider flood-free floor levels and overland flow paths.' },
      { clause: '52.06-5', title: 'Car Parking — Dwelling', verdict: 'Must provide', note: '2 on-site spaces required for a 3+ bedroom dwelling. 1 space must be covered.' },
      { clause: '54.00', title: 'ResCode — One dwelling on a lot', verdict: 'Must meet', note: 'Proposal must satisfy all Clause 54 standards (site layout, amenity impacts, on-site amenity).' },
    ],
    clauses: [
      { ref: '44.05-2', text: 'A permit is required to construct a building or construct or carry out works. This does not apply if the schedule to this overlay specifies otherwise.' },
      { ref: '32.08-6', text: 'A permit is required to construct or extend one dwelling on a lot less than 300 square metres, including a lot with an existing dwelling.' },
      { ref: '55.03-5', text: 'Buildings should be sited and designed to minimise the loss of sunlight to the secluded private open space of adjoining lots.' },
    ],
    next: [
      'Engage a drainage engineer to certify flood-free finished floor levels.',
      'Prepare neighbourhood character response per Clause 22.01.',
      'Lodge permit application with Wyndham City Council (SPEAR) with ResCode assessment.',
      'Estimated council decision time: 60 business days statutory.',
    ],
    referrals: ['Melbourne Water (SBO drainage)', 'Wyndham City — Engineering'],
  },
  demolish: {
    verdict: 'no-permit',
    headline: 'No planning permit required to demolish — but conditions apply.',
    summary: "Demolition of a single dwelling is not triggered by the GRZ1 or any overlay on this parcel. However, a building permit (Building Regulations 2018) is required, and asbestos management obligations apply. If the dwelling is pre-1945 in a character overlay area, always re-check.",
    triggers: [
      { clause: '32.08', title: 'GRZ1 — Demolition', verdict: 'No permit', note: 'Zone does not trigger a demolition permit for a single dwelling.' },
      { clause: '44.05', title: 'SBO — Demolition', verdict: 'No permit', note: 'SBO triggers buildings and works, not demolition of an existing building.' },
    ],
    clauses: [
      { ref: '43.01', text: 'Under the Heritage Overlay, a permit is required to demolish or remove a building. This parcel is NOT within a Heritage Overlay.' },
    ],
    next: [
      'Apply for a building permit via a registered Building Surveyor.',
      'Commission an asbestos report if building is pre-1990.',
      'Notify Wyndham City at least 5 business days prior to commencement.',
    ],
    referrals: [],
  },
  restaurant: {
    verdict: 'permit-required',
    headline: 'Planning permit required — Section 2 use in the GRZ1.',
    summary: "Restaurant is a Section 2 use in the General Residential Zone, which means a permit is required and council has discretion to refuse. A change-of-use permit plus buildings-and-works permit would be needed, and car parking, waste, amenity and hours of operation will all be scrutinised.",
    triggers: [
      { clause: '32.08-2', title: 'GRZ1 — Use of land', verdict: 'Permit required (Section 2)', note: 'Restaurant is a Section 2 use. Permit required with discretion.' },
      { clause: '52.06-5', title: 'Car Parking — Restaurant', verdict: 'Must provide', note: '0.4 spaces per patron permitted, OR 0.3 spaces per patron for takeaway component.' },
      { clause: '52.27', title: 'Liquor Licence', verdict: 'Separate permit', note: 'If on-premises liquor is proposed, a separate permit is required.' },
      { clause: '22.05', title: 'Werribee Central Activity Area Policy', verdict: 'Policy consideration', note: 'Council will consider whether the site supports activity-centre outcomes.' },
    ],
    clauses: [
      { ref: '32.08-2', text: 'Section 2 — Permit required. The use must meet the requirements of Clause 52.06 (car parking) and any condition opposite the use in the table to Clause 32.08-2.' },
      { ref: '52.06-5', text: 'Before a new use commences or the floor area or site area of an existing use is increased, the car parking spaces required under Column B of Table 1 must be provided.' },
    ],
    next: [
      'Prepare a use and development application with economic and traffic impact assessments.',
      'Notify adjoining owners under Section 52 of the Planning & Environment Act.',
      'Expect formal objections — non-residential uses in residential zones are heavily scrutinised.',
      'Alternative: investigate sites within the Werribee CAA (Commercial 1 Zone) where restaurant is Section 1.',
    ],
    referrals: ['VicRoads (if on arterial)', 'EPA Victoria (if liquor/noise)'],
  },
  subdivide: {
    verdict: 'permit-required',
    headline: 'Planning permit required to subdivide.',
    summary: "All subdivision requires a planning permit under Clause 32.08-3 in the GRZ1. The 612 m² lot is theoretically sub-dividable into two 306 m² lots, but Clause 56 (ResCode for subdivision) standards must be met and council will assess against neighbourhood character policy.",
    triggers: [
      { clause: '32.08-3', title: 'GRZ1 — Subdivision', verdict: 'Permit required', note: 'A permit is required to subdivide land.' },
      { clause: '56.00', title: 'ResCode — Residential subdivision', verdict: 'Must meet', note: 'All standards including lot size, access, density and neighbourhood character apply.' },
      { clause: '45.06', title: 'DCPO1 — Developer contributions', verdict: 'Levy applies', note: 'Growth Area infrastructure contribution will be calculated at permit stage.' },
    ],
    clauses: [
      { ref: '32.08-3', text: 'A permit is required to subdivide land. An application to subdivide land, other than an application to subdivide land into lots each containing an existing dwelling or car parking space, must meet the requirements of Clause 56.' },
    ],
    next: [
      'Engage a licensed land surveyor for the Plan of Subdivision.',
      'Prepare Clause 56 response covering servicing, access and character.',
      'Lodge permit application and, once permit is issued, certify plan with Wyndham City.',
      'Register plan with Land Use Victoria.',
    ],
    referrals: ['Wyndham City — Subdivision', 'Yarra Valley Water', 'Powercor'],
  },
};

export function detectAssessment(q) {
  const low = q.toLowerCase();
  if (low.includes('demolish') || low.includes('remove dwelling') || low.includes('tear down')) return ASSESSMENTS.demolish;
  if (low.includes('restaurant') || low.includes('cafe') || low.includes('food')) return ASSESSMENTS.restaurant;
  if (low.includes('subdivide') || low.includes('subdivision') || low.includes('two lots') || low.includes('split')) return ASSESSMENTS.subdivide;
  return ASSESSMENTS.default;
}

function VerdictBadge({ verdict }) {
  const cfg = {
    'permit-required': { label: 'Permit Required', dot: '#F5A623' },
    'no-permit': { label: 'No Permit Required', dot: '#00C781' },
    'prohibited': { label: 'Prohibited', dot: '#E02020' },
  }[verdict] || { label: verdict, dot: '#000' };
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '8px 14px', background: '#000', color: '#FFF',
      borderRadius: 4, fontSize: 12, fontWeight: 600,
      letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot }}/>
      {cfg.label}
    </div>
  );
}

export default function ActivityAssessment({ property, onReport, initialQuery }) {
  const [query, setQuery] = useState(initialQuery || '');
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = (q) => {
    const qq = q || query;
    if (!qq.trim()) return;
    setSubmitted(qq);
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(detectAssessment(qq));
      setLoading(false);
    }, 1200);
  };

  const reset = () => { setSubmitted(null); setResult(null); setQuery(''); };

  return (
    <main style={{ paddingTop: 40, paddingBottom: 96 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }} className="px-5 md:px-12">

        {/* Header */}
        <div style={{ paddingBottom: 32, borderBottom: '1px solid #E5E5E5', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <Label>Activity Assessment</Label>
            <span style={{ fontSize: 12, color: '#6B6B6B' }}>For</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{property.address}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0, maxWidth: '24ch' }}>
            What do you want to do with this land?
          </h1>
          <p style={{ marginTop: 16, color: '#6B6B6B', maxWidth: '60ch', fontSize: 16 }}>
            Describe your proposed activity. The assessment reads your intent against
            {' '}{property.scheme} and returns the relevant permit triggers, clauses and next steps.
          </p>
        </div>

        {/* Input */}
        {!submitted && (
          <div style={{ marginBottom: 48 }}>
            <div style={{
              border: '1.5px solid #E5E5E5', borderRadius: 8, padding: 20,
              transition: 'border-color 150ms ease',
            }}>
              <textarea
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) run(); }}
                placeholder="e.g. I want to demolish the existing house and build two townhouses on the lot…"
                style={{
                  width: '100%', minHeight: 120, border: 'none', outline: 'none',
                  resize: 'vertical', fontSize: 17, fontFamily: 'inherit',
                  lineHeight: 1.5, color: '#000', background: 'transparent',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, gap: 12, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 12, color: '#6B6B6B' }}>
                  <span className="kbd">⌘</span>&nbsp;<span className="kbd">⏎</span>&nbsp;to assess
                </div>
                <Button icon={<IconSparkle size={16}/>} iconRight={<IconArrowRight size={16}/>}
                  onClick={() => run()} disabled={!query.trim()}>
                  Run assessment
                </Button>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <Label style={{ marginBottom: 16 }}>Or start from a common activity</Label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {ACTIVITY_CHIPS.map(c => (
                  <button key={c} onClick={() => { setQuery(c); setTimeout(() => run(c), 100); }}
                    style={{
                      padding: '10px 16px', fontSize: 14,
                      border: '1px solid #E5E5E5', borderRadius: 6,
                      background: '#FFF', color: '#000', cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all 150ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#000'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E5E5'; }}
                  >{c}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submitted question bubble */}
        {submitted && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Label style={{ marginBottom: 12 }}>Your question</Label>
                <div style={{
                  padding: 24, border: '1.5px solid #000', borderRadius: 8,
                  fontSize: 18, lineHeight: 1.5, fontWeight: 400,
                  maxWidth: '70ch',
                }}>"{submitted}"</div>
              </div>
              <Button variant="ghost" size="sm" icon={<IconPlus size={14}/>} onClick={reset}>
                New question
              </Button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            padding: 48, textAlign: 'center', border: '1px solid #E5E5E5',
            borderRadius: 8, color: '#6B6B6B',
          }}>
            <div style={{ fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
              Reading {property.scheme}
            </div>
            <div className="dot-pulse"><span/><span/><span/></div>
            <div style={{ marginTop: 16, fontSize: 13 }}>
              Matching clauses · Evaluating triggers · Drafting response
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="fade-up">
            {/* Verdict */}
            <div style={{
              padding: 40, background: '#000', color: '#FFF', borderRadius: 8, marginBottom: 32,
            }}>
              <div style={{ marginBottom: 20 }}>
                <VerdictBadge verdict={result.verdict}/>
              </div>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 400, letterSpacing: '-0.02em',
                lineHeight: 1.15, margin: 0, color: '#FFF', maxWidth: '28ch',
              }}>{result.headline}</h2>
              <p style={{
                marginTop: 20, fontSize: 16, lineHeight: 1.6,
                color: '#AAAAAA', maxWidth: '64ch',
              }}>{result.summary}</p>
            </div>

            {/* Triggers table */}
            <div style={{ marginBottom: 40 }}>
              <SectionHeader
                eyebrow="Section 01"
                title="Permit triggers"
                sub="Each provision assessed against your proposal."
              />
              <Card hoverable={false} style={{ padding: 0, overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 110 }}>Clause</th>
                      <th>Provision</th>
                      <th style={{ width: 200 }}>Outcome</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.triggers.map(t => (
                      <tr key={t.clause}>
                        <td><a href="#" className="clause-ref">{t.clause}</a></td>
                        <td style={{ fontWeight: 500 }}>{t.title}</td>
                        <td>
                          <Tag tone={t.verdict.includes('No') ? 'green' : (t.verdict.includes('required') ? 'amber' : 'blue')}>
                            {t.verdict}
                          </Tag>
                        </td>
                        <td style={{ color: '#6B6B6B', fontSize: 13 }}>{t.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

            {/* Quoted clauses */}
            <div style={{ marginBottom: 40 }}>
              <SectionHeader
                eyebrow="Section 02"
                title="Relevant clauses"
                sub="Source text from the Victoria Planning Provisions."
              />
              <div style={{ display: 'grid', gap: 16 }}>
                {result.clauses.map((c, i) => (
                  <Card key={i} hoverable={false} style={{ padding: 24, background: '#F7F7F7', border: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                      <div style={{ minWidth: 80 }}>
                        <a href="#" className="clause-ref" style={{ fontSize: 13 }}>{c.ref}</a>
                      </div>
                      <blockquote style={{
                        margin: 0, fontSize: 16, lineHeight: 1.6,
                        fontFamily: 'Inter Tight', borderLeft: '2px solid #000',
                        paddingLeft: 20, maxWidth: '56ch',
                      }}>"{c.text}"</blockquote>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Next steps */}
            <div style={{ marginBottom: 40 }}>
              <SectionHeader eyebrow="Section 03" title="Recommended next steps" />
              <div style={{ borderTop: '1px solid #E5E5E5' }}>
                {result.next.map((n, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 24, padding: '20px 0',
                    borderBottom: '1px solid #E5E5E5',
                  }}>
                    <div style={{
                      fontFamily: 'ui-monospace, monospace', fontSize: 13,
                      color: '#6B6B6B', minWidth: 40,
                    }}>{String(i + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: 15, lineHeight: 1.5, flex: 1 }}>{n}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referrals */}
            {result.referrals.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <Label style={{ marginBottom: 16 }}>Likely referral authorities</Label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {result.referrals.map(r => <Tag key={r} tone="blue">{r}</Tag>)}
                </div>
              </div>
            )}

            {/* CTA */}
            <DotSeparator />
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              gap: 24, flexWrap: 'wrap', paddingTop: 16,
            }}>
              <div style={{ maxWidth: '48ch' }}>
                <h3 style={{ fontSize: 22, fontWeight: 500, marginBottom: 8, letterSpacing: '-0.01em' }}>
                  Export this reading.
                </h3>
                <p style={{ color: '#6B6B6B', fontSize: 15 }}>
                  Combines your property report, this assessment and cited clauses into a shareable PDF.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button variant="ghost" size="md" icon={<IconPlus size={16}/>} onClick={reset}>
                  Ask another
                </Button>
                <Button size="md" icon={<IconDownload size={16}/>} onClick={onReport}>
                  Download full report
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Caveat */}
        {!loading && (
          <div style={{
            marginTop: 64, padding: 24, background: '#F7F7F7', borderRadius: 8,
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <IconInfo size={18} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#6B6B6B', maxWidth: '80ch' }}>
              This assessment is a first-pass interpretation. It does not constitute legal advice
              or replace a statement of compliance. Always verify with the Wyndham City Council
              Statutory Planning team before lodging an application.
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
