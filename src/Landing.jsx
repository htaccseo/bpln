function Landing({ onSearch, recent }) {
  const [query, setQuery] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [suggestions, setSuggestions] = React.useState([]);
  const [suggesting, setSuggesting] = React.useState(false);
  const debounceRef = React.useRef(null);

  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 3) { setSuggestions([]); setSuggesting(false); return; }
    setSuggesting(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await window.vicplanApi.suggestAddresses(query);
        setSuggestions(results);
        setActiveIdx(0);
      } catch (_) {
        setSuggestions([]);
      } finally {
        setSuggesting(false);
      }
    }, 280);
  }, [query]);

  const pick = (addr) => { setSuggestions([]); onSearch(addr); };
  const submit = () => {
    const target = suggestions[activeIdx]?.addr || query;
    if (target.trim()) pick(target.trim());
  };

  const showDropdown = focus && suggestions.length > 0;

  return (
    <main style={{ paddingTop: 80, paddingBottom: 96 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>

        {/* Hero */}
        <section style={{ paddingTop: 80, paddingBottom: 48 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 24,
          }}>Built on VicPlan · data.vic.gov.au</div>

          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 400,
            lineHeight: 1.0, letterSpacing: '-0.02em', margin: 0,
            maxWidth: '18ch',
          }}>
            Know what you can build,<br/>before you apply.
          </h1>

          <p style={{
            marginTop: 32, fontSize: 18, lineHeight: 1.6,
            color: '#6B6B6B', maxWidth: '52ch',
          }}>
            Search any Victorian address to pull live zoning, overlays, land metrics
            and car parking requirements from the VicPlan API.
          </p>
        </section>

        {/* Search */}
        <section style={{ paddingBottom: 48 }}>
          <div style={{ position: 'relative', maxWidth: 760 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '0 20px', height: 72,
              border: `1.5px solid ${focus ? '#000' : '#E5E5E5'}`,
              borderRadius: 8, background: '#FFF',
              transition: 'border-color 150ms ease',
            }}>
              <IconSearch size={22} />
              <input
                autoFocus
                value={query}
                onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
                onFocus={() => setFocus(true)}
                onBlur={() => setTimeout(() => setFocus(false), 180)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); submit(); }
                  if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
                  if (e.key === 'Escape') { setSuggestions([]); }
                }}
                placeholder="Start typing a Victorian address…"
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 18, fontFamily: 'inherit', color: '#000',
                }}
              />
              {suggesting && (
                <div className="dot-pulse" style={{ color: '#AAAAAA' }}><span/><span/><span/></div>
              )}
              <span className="kbd" style={{ fontSize: 11 }}>⏎</span>
              <Button onClick={submit} disabled={!query.trim()}>Search</Button>
            </div>

            {showDropdown && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                background: '#FFF', border: '1px solid #E5E5E5', borderRadius: 8,
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)', overflow: 'hidden',
                zIndex: 10,
              }}>
                {suggestions.map((s, i) => {
                  const parts = s.addr.split(',');
                  const street = parts[0]?.trim() || s.addr;
                  const rest = parts.slice(1).join(',').trim();
                  return (
                    <div key={s.addr + i}
                      onMouseDown={() => pick(s.addr)}
                      onMouseEnter={() => setActiveIdx(i)}
                      style={{
                        padding: '14px 20px', display: 'flex', gap: 14, alignItems: 'center',
                        background: activeIdx === i ? '#F7F7F7' : '#FFF',
                        borderBottom: i < suggestions.length - 1 ? '1px solid #E5E5E5' : 'none',
                        cursor: 'pointer',
                      }}>
                      <IconPin size={16} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15 }}>{street}</div>
                        {rest && <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>{rest}</div>}
                      </div>
                      <div style={{ fontSize: 11, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        VIC
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap', color: '#6B6B6B', fontSize: 13 }}>
            <span>Try:</span>
            {[
              '12 Watton Street, Werribee VIC 3030',
              '501 Swanston Street, Melbourne VIC 3000',
              '1 Spring Street, Melbourne VIC 3000',
            ].map(addr => (
              <a key={addr} href="#" onClick={e => { e.preventDefault(); pick(addr); }}
                style={{ color: '#000', textDecoration: 'underline', textUnderlineOffset: 3, opacity: 0.7 }}
                onMouseEnter={e => e.target.style.opacity = 1}
                onMouseLeave={e => e.target.style.opacity = 0.7}
              >{addr.split(',')[0]}</a>
            ))}
          </div>
        </section>

        <DotSeparator />

        {/* Value props */}
        <section style={{ paddingTop: 32, paddingBottom: 64 }}>
          <Label style={{ marginBottom: 40 }}>What you get</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
            borderTop: '1px solid #E5E5E5' }}>
            {[
              { n: '01', t: 'Live property data',
                d: 'Zoning, overlays, land area and car parking category pulled in real time from the VicPlan API and Victorian planning database.' },
              { n: '02', t: 'Activity assessment',
                d: 'Describe what you want to do — build, demolish, subdivide, open a restaurant — and receive a plain-English reading of the permit triggers.' },
              { n: '03', t: 'Exportable report',
                d: 'A consolidated PDF you can take to council, lenders or your planner. Planning scheme citations included.' },
            ].map(f => (
              <div key={f.n} style={{
                padding: '48px 0', paddingRight: 32,
                borderBottom: '1px solid #E5E5E5',
              }}>
                <div style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20, fontFamily: 'ui-monospace, monospace' }}>{f.n}</div>
                <h3 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 16 }}>{f.t}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: '#6B6B6B', maxWidth: '36ch' }}>{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent searches */}
        {recent && recent.length > 0 && (
          <section style={{ paddingTop: 16, paddingBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <Label>Recent searches</Label>
              <a href="#" style={{ fontSize: 13, color: '#000', textDecoration: 'underline', textUnderlineOffset: 3, opacity: 0.7 }}>Clear all</a>
            </div>
            <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden', maxWidth: 760 }}>
              {recent.map((r, i) => (
                <div key={i}
                  onClick={() => pick(r.address)}
                  style={{
                    padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14,
                    borderBottom: i < recent.length - 1 ? '1px solid #E5E5E5' : 'none',
                    cursor: 'pointer', transition: 'background 150ms ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F7F7F7'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <IconHistory size={16} />
                  <div style={{ flex: 1, fontSize: 15 }}>{r.address}</div>
                  <div style={{ fontSize: 12, color: '#6B6B6B' }}>{r.when}</div>
                  <IconArrowRight size={16} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section style={{ paddingTop: 64, paddingBottom: 32, borderTop: '1px solid #E5E5E5', marginTop: 64 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64 }}>
            <Label>Disclaimer</Label>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#6B6B6B', maxWidth: '60ch' }}>
              VicPlan is an unofficial research tool. Planning data is drawn from the VicPlan
              API and individual council planning schemes but may not reflect the latest
              amendments. Always verify with the responsible authority before lodging
              a permit application.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
window.Landing = Landing;
