import React, { useState } from 'react';
import Nav from './Nav';
import Landing from './Landing';
import PropertyDashboard from './PropertyDashboard';
import ActivityAssessment, { detectAssessment } from './ActivityAssessment';
import ReportPreview from './ReportPreview';
import { fetchPropertyData } from './api';
import { MOCK_RECENT_SEARCHES } from './mockData';
import { IconAlert } from './icons';

const TODAY_SHORT = new Date().toLocaleString('en-AU', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
});

export default function App() {
  const [view, setView] = useState('search');
  const [property, setProperty] = useState(null);
  const [loadingProperty, setLoadingProperty] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [activityQuery, setActivityQuery] = useState('');
  const [assessment, setAssessment] = useState(null);

  const handleSearch = async (addr) => {
    setLoadingProperty(true);
    setLoadError(null);
    setProperty(null);
    setAssessment(null);
    setView('property');
    try {
      await new Promise(r => setTimeout(r, 100));
      const data = await fetchPropertyData(addr);
      setProperty({ ...data, _fetchedAt: TODAY_SHORT });
      setLoadingProperty(false);
    } catch (err) {
      setLoadError(err.message || 'Failed to fetch property data.');
      setLoadingProperty(false);
    }
  };

  const goToActivity = () => setView('activity');
  const goToReport = () => {
    if (!assessment) {
      setAssessment(detectAssessment(activityQuery || 'Construct two or more dwellings'));
    }
    setView('report');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav view={view} setView={setView} hasProperty={!!property} />

      {view === 'search' && (
        <Landing
          onSearch={handleSearch}
          recent={MOCK_RECENT_SEARCHES}
        />
      )}

      {view === 'property' && loadingProperty && (
        <div style={{ padding: 96, textAlign: 'center', color: '#6B6B6B' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>
            Fetching VicPlan data
          </div>
          <div className="dot-pulse"><span/><span/><span/></div>
          <div style={{ marginTop: 24, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            {[
              '1. Geocoding address via ArcGIS World Geocoder',
              '2. Querying VicPlan property layer → PROP_PFI',
              '3. Submitting GetPlanningControls job → Zone / Overlay',
            ].map((step, i) => (
              <div key={i} style={{ color: '#AAAAAA' }}>{step}</div>
            ))}
          </div>
        </div>
      )}

      {view === 'property' && loadError && !loadingProperty && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 48px' }}>
          <div style={{
            padding: 32, border: '1.5px solid #E02020', borderRadius: 8,
            background: '#FFF8F8', maxWidth: 640,
          }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <IconAlert size={20} style={{ color: '#E02020', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Could not load property data</div>
                <div style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.6 }}>{loadError}</div>
                <button
                  onClick={() => { setView('search'); setLoadError(null); }}
                  style={{ marginTop: 20, padding: '10px 20px', background: '#000', color: '#FFF',
                    border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                  Back to search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'property' && property && !loadingProperty && (
        <PropertyDashboard
          property={property}
          onActivity={goToActivity}
          onReport={goToReport}
        />
      )}

      {view === 'activity' && property && (
        <ActivityAssessment
          property={property}
          initialQuery={activityQuery}
          onReport={() => {
            setAssessment(detectAssessment(activityQuery || 'Construct two or more dwellings'));
            setView('report');
          }}
        />
      )}

      {view === 'report' && property && (
        <ReportPreview
          property={property}
          assessment={assessment || detectAssessment('Construct two or more dwellings')}
          onBack={() => setView('activity')}
        />
      )}

      {/* Footer */}
      {view === 'search' && (
        <footer style={{ background: '#000', color: '#FFF', padding: '64px 48px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 48, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 16 }}>vicplan</div>
                <p style={{ color: '#AAA', fontSize: 14, maxWidth: '40ch' }}>
                  An independent research tool built on public Victorian planning data.
                  Not affiliated with the State Government of Victoria.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 64, fontSize: 14, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 16 }}>Product</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <a style={{ color: '#FFF', opacity: 0.7, textDecoration: 'none' }} href="#">Property search</a>
                    <a style={{ color: '#FFF', opacity: 0.7, textDecoration: 'none' }} href="#">Activity assessment</a>
                    <a style={{ color: '#FFF', opacity: 0.7, textDecoration: 'none' }} href="#">Reports</a>
                    <a style={{ color: '#FFF', opacity: 0.7, textDecoration: 'none' }} href="#">API</a>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 16 }}>Data sources</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <a style={{ color: '#FFF', opacity: 0.7, textDecoration: 'none' }} href="#">VicPlan</a>
                    <a style={{ color: '#FFF', opacity: 0.7, textDecoration: 'none' }} href="#">Planning Schemes Online</a>
                    <a style={{ color: '#FFF', opacity: 0.7, textDecoration: 'none' }} href="#">DTP Victoria</a>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B6B6B', flexWrap: 'wrap', gap: 8 }}>
              <span>© 2026 VicPlan</span>
              <span>Data licensed under CC-BY 4.0 where applicable</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
