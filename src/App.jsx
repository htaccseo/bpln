const { useState, useEffect } = React;

const MOCK = JSON.parse(document.getElementById('mock-data').textContent);

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "comfortable",
  "accent": "#0066FF",
  "headlineScale": 1,
  "showRecentSearches": true,
  "heroVariant": "editorial",
  "exampleActivity": "Construct two or more dwellings on the lot"
}/*EDITMODE-END*/;

// Today's date string for display
const TODAY = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
const TODAY_SHORT = new Date().toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

function App() {
  const [view, setView] = useState('search');
  const [property, setProperty] = useState(null);
  const [loadingProperty, setLoadingProperty] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [loadError, setLoadError] = useState(null);
  const [activityQuery, setActivityQuery] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [tweaks, setTweaks] = window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];

  // Apply accent color
  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent-blue', tweaks.accent);
  }, [tweaks.accent]);

  // Apply theme
  useEffect(() => {
    if (tweaks.theme === 'dark') {
      document.body.style.background = '#000';
      document.body.style.color = '#FFF';
    } else {
      document.body.style.background = '#FFF';
      document.body.style.color = '#000';
    }
  }, [tweaks.theme]);

  const handleSearch = async (addr) => {
    setLoadingProperty(true);
    setLoadError(null);
    setProperty(null);
    setAssessment(null);
    setView('property');
    try {
      setLoadingStep('Geocoding address…');
      // Small artificial delay so loading screen is visible before first fetch
      await new Promise(r => setTimeout(r, 100));
      const data = await window.vicplanApi.fetchPropertyData(addr);
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
      setAssessment(window.detectAssessment(activityQuery || tweaks.exampleActivity));
    }
    setView('report');
  };

  return (
    <div style={{
      minHeight: '100vh',
      fontSize: tweaks.density === 'compact' ? 14 : 16,
    }}>
      <Nav view={view} setView={setView} hasProperty={!!property} />

      {view === 'search' && (
        <Landing
          onSearch={handleSearch}
          recent={tweaks.showRecentSearches ? MOCK.recentSearches : []}
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
          initialQuery=""
          onReport={() => {
            setAssessment(window.detectAssessment(activityQuery || tweaks.exampleActivity));
            setView('report');
          }}
        />
      )}

      {view === 'report' && property && (
        <ReportPreview
          property={property}
          assessment={assessment || window.detectAssessment(tweaks.exampleActivity)}
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
              <div style={{ display: 'flex', gap: 64, fontSize: 14 }}>
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
            <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B6B6B' }}>
              <span>© 2026 VicPlan</span>
              <span>Data licensed under CC-BY 4.0 where applicable</span>
            </div>
          </div>
        </footer>
      )}

      {/* Tweaks panel */}
      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Theme">
            <window.TweakRadio label="Mode" options={[{value:'light',label:'Light'},{value:'dark',label:'Dark'}]}
              value={tweaks.theme} onChange={v => setTweaks('theme', v)}/>
            <window.TweakColor label="Accent" value={tweaks.accent}
              onChange={v => setTweaks('accent', v)}/>
          </window.TweakSection>
          <window.TweakSection label="Layout">
            <window.TweakRadio label="Density" options={[{value:'comfortable',label:'Comfortable'},{value:'compact',label:'Compact'}]}
              value={tweaks.density} onChange={v => setTweaks('density', v)}/>
            <window.TweakSlider label="Headline scale" min={0.8} max={1.3} step={0.05}
              value={tweaks.headlineScale} onChange={v => setTweaks('headlineScale', v)}/>
          </window.TweakSection>
          <window.TweakSection label="Content">
            <window.TweakToggle label="Show recent searches"
              value={tweaks.showRecentSearches} onChange={v => setTweaks('showRecentSearches', v)}/>
            <window.TweakSelect label="Example activity"
              options={[
                'Construct two or more dwellings on the lot',
                'Demolish the existing dwelling',
                'Use the building as a restaurant',
                'Subdivide the land into two lots',
              ]}
              value={tweaks.exampleActivity} onChange={v => setTweaks('exampleActivity', v)}/>
          </window.TweakSection>
          <window.TweakSection label="Jump to screen">
            <window.TweakButton label="Landing" onClick={() => setView('search')}/>
            <window.TweakButton label="Property Dashboard" onClick={() => { if (!property) handleSearch(MOCK.property.address); else setView('property'); }}/>
            <window.TweakButton label="Activity Assessment" onClick={() => { if (!property) handleSearch(MOCK.property.address); setTimeout(() => setView('activity'), 50); }}/>
            <window.TweakButton label="Report Preview" onClick={() => { if (!property) handleSearch(MOCK.property.address); setTimeout(() => { setAssessment(window.detectAssessment(tweaks.exampleActivity)); setView('report'); }, 50); }}/>
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

// Apply headline scale via CSS var
const style = document.createElement('style');
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
