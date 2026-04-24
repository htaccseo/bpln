// Shared primitives — Block.xyz styled

function Label({ children, style, ...rest }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: '#6B6B6B',
      ...style,
    }} {...rest}>{children}</div>
  );
}

function Tag({ children, dot, tone = 'default' }) {
  const colors = {
    default: { border: '#E5E5E5', bg: '#FFF', fg: '#000', dot: '#000' },
    blue: { border: '#E5E5E5', bg: '#FFF', fg: '#000', dot: '#0066FF' },
    green: { border: '#E5E5E5', bg: '#FFF', fg: '#000', dot: '#00C781' },
    amber: { border: '#E5E5E5', bg: '#FFF', fg: '#000', dot: '#F5A623' },
  }[tone] || {};
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', fontSize: 11, fontWeight: 500,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      border: `1px solid ${colors.border}`, borderRadius: 4,
      color: colors.fg, background: colors.bg, whiteSpace: 'nowrap',
    }}>
      {dot !== false && <span style={{
        width: 6, height: 6, borderRadius: '50%', background: colors.dot,
      }}/>}
      {children}
    </span>
  );
}

function Button({ variant = 'primary', children, icon, iconRight, onClick, disabled, style, type, size = 'md', ...rest }) {
  const [hover, setHover] = React.useState(false);
  const heights = { sm: 36, md: 44, lg: 52 };
  const pads = { sm: 16, md: 24, lg: 28 };
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: heights[size], padding: `0 ${pads[size]}px`,
    fontFamily: 'inherit', fontSize: size === 'sm' ? 13 : 15, fontWeight: 500,
    letterSpacing: '0.01em', borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'opacity 150ms ease, background-color 150ms ease, color 150ms ease, border-color 150ms ease',
    opacity: disabled ? 0.4 : 1, whiteSpace: 'nowrap',
  };
  const variants = {
    primary: { background: '#000', color: '#FFF', border: 'none', opacity: hover && !disabled ? 0.8 : (disabled ? 0.4 : 1) },
    secondary: {
      background: hover && !disabled ? '#000' : 'transparent',
      color: hover && !disabled ? '#FFF' : '#000',
      border: '1.5px solid #000', padding: `0 ${pads[size] - 1.5}px`,
    },
    ghost: { background: 'transparent', color: '#000', border: '1.5px solid #E5E5E5',
      ...(hover && !disabled ? { borderColor: '#000' } : {}) },
    text: { background: 'none', color: '#000', border: 'none', textDecoration: 'underline',
      textUnderlineOffset: 3, padding: 0, height: 'auto',
      opacity: hover && !disabled ? 0.7 : 1 },
  };
  return (
    <button type={type || 'button'} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {icon}{children}{iconRight}
    </button>
  );
}

function Card({ children, style, hoverable = true, onClick, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hoverable && setHover(true)}
      onMouseLeave={() => hoverable && setHover(false)}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${hover && hoverable ? '#000' : '#E5E5E5'}`,
        borderRadius: 8, padding: 24,
        transition: 'border-color 200ms ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }} {...rest}>
      {children}
    </div>
  );
}

function Stat({ label, value, sub, icon }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#6B6B6B' }}>
        {icon}
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.1 }} className="mono">{value}</div>
      {sub && <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function DotSeparator() {
  return <div style={{
    textAlign: 'center', fontSize: 24, color: '#000',
    padding: '32px 0', userSelect: 'none', lineHeight: 1,
  }}>.</div>;
}

function Divider({ style }) {
  return <div style={{ height: 1, background: '#E5E5E5', ...style }} />;
}

function SectionHeader({ eyebrow, title, sub, actions }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 24, marginBottom: 32, flexWrap: 'wrap',
    }}>
      <div>
        {eyebrow && <Label style={{ marginBottom: 12 }}>{eyebrow}</Label>}
        <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.15, margin: 0 }}>{title}</h2>
        {sub && <p style={{ marginTop: 10, color: '#6B6B6B', maxWidth: '60ch' }}>{sub}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 12 }}>{actions}</div>}
    </div>
  );
}

Object.assign(window, { Label, Tag, Button, Card, Stat, DotSeparator, Divider, SectionHeader });
