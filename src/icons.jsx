import React from 'react';

const Icon = ({ d, size = 20, stroke = 1.5, fill = 'none', children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);

export const IconSearch     = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></Icon>;
export const IconArrowRight = (p) => <Icon {...p} d="M5 12h14M13 5l7 7-7 7"/>;
export const IconArrowLeft  = (p) => <Icon {...p} d="M19 12H5M11 19l-7-7 7-7"/>;
export const IconArrowUpRight = (p) => <Icon {...p} d="M7 17 17 7M8 7h9v9"/>;
export const IconDownload   = (p) => <Icon {...p} d="M12 3v13m-5-5 5 5 5-5M5 21h14"/>;
export const IconClose      = (p) => <Icon {...p} d="M18 6 6 18M6 6l12 12"/>;
export const IconCheck      = (p) => <Icon {...p} d="M20 6 9 17l-5-5"/>;
export const IconAlert      = (p) => <Icon {...p}><path d="M12 8v5M12 17h.01"/><circle cx="12" cy="12" r="9"/></Icon>;
export const IconInfo       = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></Icon>;
export const IconMap        = (p) => <Icon {...p} d="M3 6v15l6-3 6 3 6-3V3l-6 3-6-3-6 3ZM9 3v15M15 6v15"/>;
export const IconPin        = (p) => <Icon {...p}><path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></Icon>;
export const IconFile       = (p) => <Icon {...p} d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9ZM14 3v6h6M9 13h6M9 17h4"/>;
export const IconSend       = (p) => <Icon {...p} d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/>;
export const IconClock      = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
export const IconBuilding   = (p) => <Icon {...p}><path d="M4 21h16M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01"/></Icon>;
export const IconRuler      = (p) => <Icon {...p} d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0L2.7 16.7a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4ZM7 17l-3-3M10 14l-2-2M13 11l-2-2M16 8l-2-2"/>;
export const IconLayers     = (p) => <Icon {...p} d="m12 2 10 6-10 6L2 8l10-6ZM2 14l10 6 10-6M2 11l10 6 10-6"/>;
export const IconCar        = (p) => <Icon {...p} d="M5 17h14M7 17v2M17 17v2M3 13l2-6a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 6v4H3v-4Z"/>;
export const IconSparkle    = (p) => <Icon {...p} d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/>;
export const IconPlus       = (p) => <Icon {...p} d="M12 5v14M5 12h14"/>;
export const IconHistory    = (p) => <Icon {...p} d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/>;
export const IconExternal   = (p) => <Icon {...p} d="M15 3h6v6M10 14 21 3M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>;
export const IconBookmark   = (p) => <Icon {...p} d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>;
export const IconPrint      = (p) => <Icon {...p} d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6Z"/>;
export const IconCopy       = (p) => <Icon {...p} d="M8 4h10a2 2 0 0 1 2 2v10M16 8H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z"/>;
export const IconMenu       = (p) => <Icon {...p} d="M3 12h18M3 6h18M3 18h18"/>;

export default Icon;
