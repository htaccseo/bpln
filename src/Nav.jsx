function Nav({ view, setView, hasProperty }) {
  const tabs = [
    { id: 'search', label: 'Search', enabled: true },
    { id: 'property', label: 'Property', enabled: hasProperty },
    { id: 'activity', label: 'Activity Assessment', enabled: hasProperty },
    { id: 'report', label: 'Report', enabled: hasProperty },
  ];
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50, height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', background: '#FFFFFF',
      borderBottom: '1px solid #E5E5E5',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <a href="#" onClick={e => { e.preventDefault(); setView('search'); }} style={{
          display: 'flex', alignItems: 'baseline', gap: 10,
          textDecoration: 'none', color: '#000',
        }}>
          <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>vicplan</span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#6B6B6B' }}>Beta</span>
        </a>
        <div style={{ display: 'flex', gap: 28 }}>
          {tabs.map(t => (
            <a key={t.id} href="#"
              onClick={e => { e.preventDefault(); if (t.enabled) setView(t.id); }}
              style={{
                fontSize: 14, color: '#000', textDecoration: 'none',
                letterSpacing: '0.01em',
                opacity: !t.enabled ? 0.25 : (view === t.id ? 1 : 0.7),
                pointerEvents: t.enabled ? 'auto' : 'none',
                borderBottom: view === t.id ? '1.5px solid #000' : '1.5px solid transparent',
                paddingBottom: 18, marginBottom: -19,
                transition: 'opacity 150ms ease, border-color 150ms ease',
              }}>{t.label}</a>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        <a href="#" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#000', textDecoration: 'none' }}>API Docs</a>
        <a href="#" style={{ fontSize: 14, color: '#000', textDecoration: 'none', opacity: 0.7 }}>About</a>
        <a href="#" style={{ fontSize: 14, color: '#000', textDecoration: 'none', opacity: 0.7 }}>Help</a>
        <Button size="sm" variant="secondary">Sign in</Button>
      </div>
    </nav>
  );
}
window.Nav = Nav;
