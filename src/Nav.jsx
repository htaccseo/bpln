import React, { useState } from 'react';
import { Button } from './primitives';
import { IconMenu, IconClose } from './icons';

export default function Nav({ view, setView, hasProperty }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    { id: 'search', label: 'Search', enabled: true },
    { id: 'property', label: 'Property', enabled: hasProperty },
    { id: 'activity', label: 'Activity', enabled: hasProperty },
    { id: 'report', label: 'Report', enabled: hasProperty },
  ];

  const handleTab = (t) => {
    if (t.enabled) { setView(t.id); setMobileOpen(false); }
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: '#FFFFFF', borderBottom: '1px solid #E5E5E5',
    }}>
      {/* Desktop nav */}
      <div style={{
        height: 60, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 48px',
      }} className="hidden md:flex">
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <a href="#" onClick={e => { e.preventDefault(); setView('search'); }} style={{
            display: 'flex', alignItems: 'baseline', gap: 10,
            textDecoration: 'none', color: '#000',
          }}>
            <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>bPLN</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#6B6B6B' }}>Beta</span>
          </a>
          <div style={{ display: 'flex', gap: 28 }}>
            {tabs.map(t => (
              <a key={t.id} href="#"
                onClick={e => { e.preventDefault(); handleTab(t); }}
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
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden" style={{
        height: 56, alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        <a href="#" onClick={e => { e.preventDefault(); setView('search'); setMobileOpen(false); }} style={{
          display: 'flex', alignItems: 'baseline', gap: 8,
          textDecoration: 'none', color: '#000',
        }}>
          <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em' }}>bPLN</span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#6B6B6B' }}>Beta</span>
        </a>
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#000' }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="flex md:hidden" style={{
          flexDirection: 'column',
          background: '#FFF', borderTop: '1px solid #E5E5E5',
          padding: '16px 0',
        }}>
          {tabs.map(t => (
            <a key={t.id} href="#"
              onClick={e => { e.preventDefault(); handleTab(t); }}
              style={{
                display: 'block', padding: '14px 20px',
                fontSize: 15, color: '#000', textDecoration: 'none',
                opacity: !t.enabled ? 0.25 : (view === t.id ? 1 : 0.7),
                fontWeight: view === t.id ? 600 : 400,
                borderBottom: '1px solid #F0F0F0',
              }}>{t.label}</a>
          ))}
          <div style={{ padding: '16px 20px' }}>
            <Button size="sm" variant="secondary" style={{ width: '100%' }}>Sign in</Button>
          </div>
        </div>
      )}
    </nav>
  );
}
